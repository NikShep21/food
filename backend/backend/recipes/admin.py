from django.contrib import admin
from django.db.models import Count

from .models import (Favorite, Ingredient, Recipe, RecipeIngredient,
                     ShoppingCart, Tag)


class RecipeIngredientInline(admin.TabularInline):
    model = RecipeIngredient
    extra = 1
    min_num = 1
    autocomplete_fields = ('ingredient',)


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'author',
                    'pub_date', 'favorite_count_display')
    list_display_links = ('id', 'name')
    search_fields = ('name', 'author__username', 'tags__name')
    list_filter = ('author', 'tags', 'pub_date')
    filter_horizontal = ('tags',)
    inlines = (RecipeIngredientInline,)
    readonly_fields = ('favorite_count_display', 'pub_date')

    def favorite_count_display(self, obj):
        return obj.favorites_count
    favorite_count_display.short_description = 'В избранном (кол-во)'
    favorite_count_display.admin_order_field = 'favorites_count'

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.prefetch_related('tags').select_related('author')
        queryset = queryset.annotate(favorites_count=Count('favorites'))
        return queryset


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug', 'color')
    search_fields = ('name', 'slug')
    list_filter = ('color',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'measurement_unit')
    search_fields = ('name',)
    list_filter = ('measurement_unit',)


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'recipe', 'get_recipe_author')
    search_fields = ('user__username', 'recipe__name',
                     'recipe__author__username')
    list_filter = ('user', 'recipe__tags')
    autocomplete_fields = ('user', 'recipe')

    def get_recipe_author(self, obj):
        return obj.recipe.author
    get_recipe_author.short_description = 'Автор рецепта'


@admin.register(ShoppingCart)
class ShoppingCartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'recipe', 'get_recipe_author')
    search_fields = ('user__username', 'recipe__name',
                     'recipe__author__username')
    list_filter = ('user',)
    autocomplete_fields = ('user', 'recipe')

    def get_recipe_author(self, obj):
        return obj.recipe.author
    get_recipe_author.short_description = 'Автор рецепта'
