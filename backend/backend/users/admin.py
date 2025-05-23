from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.db.models import Count

from .models import Subscription, User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'last_name',
                    'is_staff', 'recipe_count', 'subscriber_count')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Персональная информация', {'fields': ('first_name', 'last_name',
                                                'email', 'image')}),
        ('Права доступа', {'fields': ('is_active', 'is_staff',
                                      'is_superuser', 'groups',
                                      'user_permissions')}),
        ('Важные даты', {'fields': ('last_login', 'date_joined')}),
    )
    readonly_fields = ('last_login', 'date_joined')
    filter_horizontal = ('groups', 'user_permissions',)

    def recipe_count(self, obj):
        return obj.recipes_count
    recipe_count.short_description = 'Рецептов'
    recipe_count.admin_order_field = 'recipes_count'

    def subscriber_count(self, obj):
        return obj.subscribers_count
    subscriber_count.short_description = 'Подписчиков'
    subscriber_count.admin_order_field = 'subscribers_count'

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.annotate(
            recipes_count=Count('recipes'),
            subscribers_count=Count('subscribers')
        )
        return queryset


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    """ Админка для модели Subscription. """
    list_display = ('id', 'user', 'author')
    search_fields = ('user__username', 'user__email',
                     'author__username', 'author__email')
    list_filter = ('user', 'author')
    autocomplete_fields = ('user', 'author')
