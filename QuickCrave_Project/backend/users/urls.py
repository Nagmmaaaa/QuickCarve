from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    register_user,
    restaurant_register,
    restaurant_login,
    user_profile,
    current_user_detail,
    UserViewSet,
    GroupViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='users')
router.register(r'groups', GroupViewSet, basename='groups')

urlpatterns = [
    path('register/', register_user),
    path('restaurant/register/', restaurant_register),
    path('restaurant/login/', restaurant_login),
    path('profile/', user_profile),
    path('me/', current_user_detail),
    path('users/me/', current_user_detail),
    path('users/users/', include(router.urls)),
    path('', include(router.urls)),
]