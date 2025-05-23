from django.urls import include, path, re_path
from rest_framework.routers import DefaultRouter

from .views import (CustomUserViewSet, IngredientViewSet, RecipeViewSet,
                    TagViewSet)

app_name = 'api'
router = DefaultRouter()

router.register(r'tags', TagViewSet, basename='tags')
router.register(r'ingredients', IngredientViewSet, basename='ingredients')
router.register(r'recipes', RecipeViewSet, basename='recipes')
router.register(r'users', CustomUserViewSet, basename='users')

urlpatterns = [
    re_path(
        r'^users/me/avatar/$',
        CustomUserViewSet.as_view({
            'put': 'avatar_set',
            'patch': 'avatar_set',
            'delete': 'avatar_delete'
        }),
        name='user-me-avatar'
    ),
    path('', include(router.urls)),
    path('', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
]
