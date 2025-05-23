from django_filters import rest_framework as filters

from recipes.models import Ingredient, Recipe, Tag


class IngredientFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Ingredient
        fields = ['name']


class RecipeFilter(filters.FilterSet):
    tags = filters.ModelMultipleChoiceFilter(
        queryset=Tag.objects.all(),
        field_name='tags__slug',
        to_field_name='slug',
        method='filter_tags',
        label='Теги (slug)'
    )
    author = filters.NumberFilter(field_name='author__id')
    is_favorited = filters.BooleanFilter(method='filter_is_favorited')
    is_in_shopping_cart = filters.BooleanFilter(
        method='filter_is_in_shopping_cart')
    is_subscribed = filters.BooleanFilter(method='filter_is_subscribed')

    class Meta:
        model = Recipe
        fields = ['tags', 'author']

    def filter_tags(self, queryset, name, value):

        if value:
            queryset = queryset.filter(tags__in=value)
        else:
            pass

        return queryset

    def _filter_user_relation(self, queryset, name, value, relation_name):
        user = self.request.user
        if value and user.is_authenticated:
            filtered_queryset = queryset.filter(
                **{f'{relation_name}__user': user})
            return filtered_queryset
        return queryset

    def filter_is_favorited(self, queryset, name, value):
        return self._filter_user_relation(queryset, name, value, 'favorites')

    def filter_is_in_shopping_cart(self, queryset, name, value):
        return self._filter_user_relation(queryset, name, value,
                                          'shopping_cart_items')

    def filter_is_subscribed(self, queryset, name, value):
        user = self.request.user
        if value and user.is_authenticated:
            subscribed_authors_ids = user.subscriptions.values_list(
                'author__id',
                flat=True)
            filtered_queryset = queryset.filter(
                author__id__in=subscribed_authors_ids)
            return filtered_queryset
        return queryset
