from django.contrib.auth import get_user_model
from django.db.models import Prefetch, Sum
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from djoser.views import UserViewSet as DjoserBaseUserViewSet
from rest_framework import filters, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import (AllowAny, IsAuthenticated,
                                        IsAuthenticatedOrReadOnly)
from rest_framework.response import Response

from recipes.models import (Favorite, Ingredient, Recipe, RecipeIngredient,
                            ShoppingCart, Tag)
from users.models import Subscription

from .filters import IngredientFilter, RecipeFilter
from .permissions import IsAuthorOrAdminOrReadOnly
from .serializers import (IngredientSerializer, RecipeReadSerializer,
                          RecipeShortSerializer, RecipeWriteSerializer,
                          SubscribeSerializer, SubscriptionAuthorSerializer,
                          TagSerializer, UserSerializer)

User = get_user_model()


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]
    pagination_class = None


class IngredientViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = IngredientFilter
    search_fields = ['^name']
    pagination_class = None


class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.select_related('author').prefetch_related(
        'tags',
        Prefetch(
            'recipe_ingredients',
            queryset=RecipeIngredient.objects.select_related('ingredient')
        ),
        Prefetch('favorites'),
        Prefetch('shopping_cart_items')
    ).all().distinct()

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = RecipeFilter
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return RecipeReadSerializer
        return RecipeWriteSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticatedOrReadOnly,
                                       IsAuthorOrAdminOrReadOnly]
        elif self.action in ['favorite',
                             'shopping_cart',
                             'download_shopping_cart']:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsAuthenticatedOrReadOnly]
        return [permission() for permission in self.permission_classes]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        instance = serializer.instance
        read_serializer = RecipeReadSerializer(instance,
                                               context={'request': request})
        headers = self.get_success_headers(read_serializer.data)
        return Response(read_serializer.data,
                        status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data,
                                         partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        read_serializer = RecipeReadSerializer(instance,
                                               context={'request': request})
        return Response(read_serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post', 'delete'])
    def favorite(self, request, pk=None):
        return self._add_or_remove_relation(request, pk, Favorite)

    @action(detail=True, methods=['post', 'delete'])
    def shopping_cart(self, request, pk=None):
        return self._add_or_remove_relation(request, pk, ShoppingCart)

    @action(detail=False, methods=['get'])
    def download_shopping_cart(self, request):
        user = request.user

        ingredients = RecipeIngredient.objects.filter(
            recipe__shopping_cart_items__user=user
        ).values(
            'ingredient__name',
            'ingredient__measurement_unit'
        ).annotate(
            total_amount=Sum('amount')
        ).order_by('ingredient__name')

        if not ingredients:
            return Response(
                {"errors": "Ваш список покупок пуст."},
                status=status.HTTP_400_BAD_REQUEST
            )

        shopping_list = []
        shopping_list.append("Ваш список покупок:\n")
        for item in ingredients:
            shopping_list.append(
                f"- {item['ingredient__name']} "
                f"({item['total_amount']} "
                f"{item['ingredient__measurement_unit']})"
            )

        content = '\n'.join(shopping_list)
        filename = 'shopping_cart.txt'
        content_type = 'text/plain; charset=utf-8'

        response = HttpResponse(content, content_type=content_type)
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response

    def _add_or_remove_relation(self, request, pk, relation_model):
        user = request.user
        recipe = get_object_or_404(Recipe, pk=pk)

        relation_exists = relation_model.objects.filter(user=user,
                                                        recipe=recipe).exists()

        if request.method == 'POST':
            if relation_exists:
                return Response(
                    {'errors': f'Рецепт уже добавлен в '
                               f'{relation_model._meta.verbose_name}.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            relation_model.objects.create(user=user, recipe=recipe)
            serializer = RecipeShortSerializer(recipe)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        elif request.method == 'DELETE':
            if not relation_exists:
                return Response(
                    {'errors': f'Рецепт не найден в '
                               f'{relation_model._meta.verbose_name}.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            try:
                relation_instance = relation_model.objects.get(user=user,
                                                               recipe=recipe)
                relation_instance.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            except relation_model.DoesNotExist:
                return Response(
                    {'errors': f'Рецепт не найден в '
                               f'{relation_model._meta.verbose_name}.'},
                    status=status.HTTP_404_NOT_FOUND
                )
            except Exception as e:
                return Response(
                    {'errors': f'Произошла внутренняя ошибка при удалении: '
                               f'{str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


class CustomUserViewSet(DjoserBaseUserViewSet):
    lookup_field = 'id'
    lookup_url_kwarg = 'id'

    def get_queryset(self):
        return User.objects.all()

    def get_permissions(self):
        if self.action == 'list':
            self.permission_classes = [permissions.IsAuthenticated]
        elif self.action == 'retrieve':
            self.permission_classes = [permissions.IsAuthenticated]
        elif self.action == 'me':
            self.permission_classes = [permissions.IsAuthenticated]
        elif self.action in ['avatar_set', 'avatar_delete']:
            self.permission_classes = [permissions.IsAuthenticated]
        elif self.action == 'subscribe':
            self.permission_classes = [permissions.IsAuthenticated]
        elif self.action == 'subscriptions':
            self.permission_classes = [permissions.IsAuthenticated]
        else:
            if self.action == 'create':
                self.permission_classes = [permissions.AllowAny]
            else:
                self.permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in self.permission_classes]

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['put', 'patch'],
            url_path='me/avatar')
    def avatar_set(self, request):
        user = request.user
        avatar_base64_data = request.data.get('avatar')
        if not avatar_base64_data:
            return Response({'detail': 'Данные для аватара не '
                                       'предоставлены или некорректны '
                                       'в ключе "avatar".'},
                            status=status.HTTP_400_BAD_REQUEST)
        serializer = UserSerializer(user, data=request.data, partial=True,
                                    context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user.refresh_from_db()
        output_serializer = UserSerializer(
            user, context={'request': request})
        return Response(output_serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'],
            url_path='me/avatar')
    def avatar_delete(self, request):
        user = request.user
        if hasattr(user, 'image') and user.image and user.image.name:
            user.image.delete(save=True)
            user.refresh_from_db()
            output_serializer = UserSerializer(
                user, context={'request': request})
            return Response(output_serializer.data,
                            status=status.HTTP_200_OK)
        else:
            output_serializer = UserSerializer(user,
                                               context={'request': request})
            return Response(output_serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post', 'delete'],
            )
    def subscribe(self, request, id=None):
        user = request.user
        author = get_object_or_404(User, id=id)
        serializer = SubscribeSerializer(
            data={},
            context={'request': request, 'author': author}
        )
        serializer.is_valid(raise_exception=True)
        subscription_exists = user.subscriptions.filter(author=author).exists()
        if request.method == 'POST':
            if subscription_exists:
                return Response(
                    {'errors': 'Вы уже подписаны на этого автора.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            Subscription.objects.create(user=user, author=author)
            serializer = SubscriptionAuthorSerializer(
                author, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        elif request.method == 'DELETE':
            if not subscription_exists:
                return Response(
                    {'errors': 'Вы не были подписаны на этого автора.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            try:
                subscription = user.subscriptions.get(author=author)
                subscription.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            except Subscription.DoesNotExist:
                return Response(
                    {'errors': 'Вы не были подписаны на этого автора.'},
                    status=status.HTTP_404_NOT_FOUND
                )
            except Exception as e:
                return Response(
                    {'errors': f'Произошла ошибка при отписке: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @action(detail=False, methods=['get'],
            )
    def subscriptions(self, request):
        user = request.user
        subscribed_authors = User.objects.filter(
            subscribers__user=user
        ).prefetch_related(
            'recipes'
        )

        page = self.paginate_queryset(subscribed_authors)
        serializer_class = SubscriptionAuthorSerializer

        if page is not None:
            serializer = serializer_class(page, many=True,
                                          context={'request': request})
            return self.get_paginated_response(serializer.data)

        serializer = serializer_class(subscribed_authors, many=True,
                                      context={'request': request})
        return Response(serializer.data)
