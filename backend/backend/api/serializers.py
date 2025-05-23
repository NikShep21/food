from django.contrib.auth import get_user_model
from django.db import transaction
from djoser.serializers import \
    UserCreateSerializer as DjoserUserCreateSerializer
from djoser.serializers import UserSerializer as DjoserBaseUserSerializer
from rest_framework import serializers

from core.fields import Base64ImageField
from recipes.constants import (MAX_COOKING_TIME, MAX_INGREDIENT_AMOUNT,
                               MIN_COOKING_TIME, MIN_INGREDIENT_AMOUNT)
from recipes.models import (Favorite, Ingredient, Recipe, RecipeIngredient,
                            ShoppingCart, Tag)

User = get_user_model()


class UserCreateSerializer(DjoserUserCreateSerializer):
    class Meta(DjoserUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'username', 'first_name',
                  'last_name', 'password')
        extra_kwargs = {'password': {'write_only': True}}


class UserSerializer(DjoserBaseUserSerializer):
    avatar = Base64ImageField(required=False,
                              allow_null=True, source='image')

    is_subscribed = serializers.SerializerMethodField(read_only=True)

    class Meta(DjoserBaseUserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name',
                  'avatar', 'is_subscribed')

    def get_is_subscribed(self, obj_user_profile):
        request = self.context.get('request')
        if request is None or not request.user.is_authenticated:
            return False
        exists = (obj_user_profile.subscribers
                  .filter(user=request.user)
                  .exists())
        return exists


class SubscriptionAuthorSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(read_only=True, source='image')

    is_subscribed = serializers.SerializerMethodField()
    recipes = serializers.SerializerMethodField()
    recipes_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name',
                  'avatar',
                  'is_subscribed', 'recipes', 'recipes_count')

    def get_is_subscribed(self, obj):
        return True

    def get_recipes(self, obj):
        request = self.context.get('request')
        limit_param = (request.query_params.get('recipes_limit')
                       if request else None)
        recipes = obj.recipes.all()

        if limit_param:
            try:
                limit = int(limit_param)
                if limit > 0:
                    recipes = recipes[:limit]
            except (ValueError, TypeError):
                pass

        serializer = RecipeShortSerializer(recipes, many=True, read_only=True,
                                           context=self.context)
        return serializer.data

    def get_recipes_count(self, obj):
        return obj.recipes.count()


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name', 'slug', 'color')


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ('id', 'name', 'measurement_unit')


class RecipeIngredientReadSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(source='ingredient.id')
    name = serializers.ReadOnlyField(source='ingredient.name')
    measurement_unit = serializers.ReadOnlyField(
        source='ingredient.measurement_unit'
    )
    amount = serializers.IntegerField(read_only=True)

    class Meta:
        model = RecipeIngredient
        fields = ('id', 'name', 'measurement_unit', 'amount')


class RecipeIngredientWriteSerializer(serializers.Serializer):
    id = serializers.PrimaryKeyRelatedField(queryset=Ingredient.objects.all())
    amount = serializers.IntegerField(
        min_value=MIN_INGREDIENT_AMOUNT,
        max_value=MAX_INGREDIENT_AMOUNT,
        error_messages={
            'min_value': f'Количество ингредиента должно'
                         f'быть не меньше {MIN_INGREDIENT_AMOUNT}.',
            'max_value': f'Количество ингредиента должно'
                         f'быть не больше {MAX_INGREDIENT_AMOUNT}.',
        }
    )

    def validate(self, data):
        return data


class RecipeReadSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    ingredients = RecipeIngredientReadSerializer(
        many=True, read_only=True, source='recipe_ingredients'
    )
    is_favorited = serializers.SerializerMethodField(read_only=True)
    is_in_shopping_cart = serializers.SerializerMethodField(read_only=True)
    image = Base64ImageField(read_only=True)

    class Meta:
        model = Recipe
        fields = (
            'id', 'name', 'text', 'image', 'cooking_time',
            'author', 'tags', 'ingredients',
            'is_favorited', 'is_in_shopping_cart'
        )
        read_only_fields = fields

    def _get_user_relation(self, obj, relation_model):
        request = self.context.get('request')
        if request is None or not request.user.is_authenticated:
            return False
        if relation_model == Favorite:
            return obj.favorites.filter(user=request.user).exists()
        elif relation_model == ShoppingCart:
            return obj.shopping_cart_items.filter(user=request.user).exists()
        return False

    def get_is_favorited(self, obj):
        return self._get_user_relation(obj, Favorite)

    def get_is_in_shopping_cart(self, obj):
        return self._get_user_relation(obj, ShoppingCart)


class RecipeWriteSerializer(serializers.ModelSerializer):
    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
    )
    ingredients = RecipeIngredientWriteSerializer(
        many=True,
    )
    image = Base64ImageField(required=True, allow_null=False)
    cooking_time = serializers.IntegerField(
        min_value=MIN_COOKING_TIME,
        max_value=MAX_COOKING_TIME,
        error_messages={
            'min_value': f'Время приготовления должно'
                         f'быть не меньше {MIN_COOKING_TIME} минуты.',
            'max_value': f'Время приготовления должно'
                         f'быть не больше {MAX_COOKING_TIME} минут.',
        }
    )

    class Meta:
        model = Recipe
        fields = (
            'name', 'text', 'image', 'cooking_time',
            'tags', 'ingredients'
        )

    def validate_tags(self, data):
        if not data:
            raise serializers.ValidationError(
                'Нужно выбрать хотя бы один тег.'
            )
        return data

    def validate_ingredients(self, data):
        if not data:
            raise serializers.ValidationError(
                'Нужно добавить хотя бы один ингредиент.'
            )
        ingredient_ids = set()
        for item_data in data:
            ingredient_obj = item_data.get('id')
            if not ingredient_obj:
                raise serializers.ValidationError(
                    "Неверный ID ингредиента в списке."
                )
            if ingredient_obj.id in ingredient_ids:
                raise serializers.ValidationError(
                    f'Ингредиент "{ingredient_obj.name}" '
                    f'не должен повторяться.'
                )
            ingredient_ids.add(ingredient_obj.id)
        return data

    def _set_ingredients(self, recipe, ingredients_data):
        RecipeIngredient.objects.filter(recipe=recipe).delete()
        if ingredients_data:
            recipe_ingredients_to_create = []
            for ing_data in ingredients_data:
                recipe_ingredients_to_create.append(
                    RecipeIngredient(
                        recipe=recipe,
                        ingredient=ing_data['id'],
                        amount=ing_data['amount']
                    )
                )
            RecipeIngredient.objects.bulk_create(recipe_ingredients_to_create)

    @transaction.atomic
    def create(self, validated_data):
        tags_list_objs = validated_data.pop('tags')
        ingredients_list_payload = validated_data.pop('ingredients')
        recipe = Recipe.objects.create(**validated_data)
        if tags_list_objs:
            recipe.tags.set(tags_list_objs)

        self._set_ingredients(recipe, ingredients_list_payload)
        return recipe

    @transaction.atomic
    def update(self, instance, validated_data):
        tags_list_objs = validated_data.pop('tags', None)
        ingredients_list_payload = validated_data.pop('ingredients', None)
        instance = super().update(instance, validated_data)
        if tags_list_objs is not None:
            instance.tags.set(tags_list_objs)
        if ingredients_list_payload is not None:
            self._set_ingredients(instance, ingredients_list_payload)
        return instance


class RecipeShortSerializer(serializers.ModelSerializer):
    image = Base64ImageField(read_only=True)

    class Meta:
        model = Recipe
        fields = ('id', 'name', 'image', 'cooking_time')
        read_only_fields = fields


class SubscribeSerializer(serializers.Serializer):
    def validate(self, data):
        user = self.context.get('request').user
        author = self.context.get('author')
        if user == author:
            raise serializers.ValidationError(
                {'errors': 'Нельзя подписаться на самого себя.'}
            )

        return data
