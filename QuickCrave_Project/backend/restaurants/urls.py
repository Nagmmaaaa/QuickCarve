from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RestaurantViewSet, MenuItemViewSet, CategoryViewSet,
    restaurant_dashboard, restaurant_settings, restaurant_menu,
    restaurant_menu_create, restaurant_menu_detail, restaurant_menu_delete,
)
from .auth_views import (
    restaurant_register, restaurant_login, restaurant_profile,
    restaurant_logout, change_password
)




router = DefaultRouter()
router.register(r'restaurants', RestaurantViewSet, basename='restaurant')
router.register(r'menu-items', MenuItemViewSet, basename='menu-item')
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
    
    path('restaurant/auth/register/', restaurant_register, name='restaurant-register'),
    path('restaurant/auth/login/', restaurant_login, name='restaurant-login'),
    path('restaurant/auth/logout/', restaurant_logout, name='restaurant-logout'),
    path('restaurant/auth/profile/', restaurant_profile, name='restaurant-profile'),
    path('restaurant/auth/change-password/', change_password, name='restaurant-change-password'),
    
    path('restaurant/dashboard/', restaurant_dashboard, name='restaurant-dashboard'),
    path('restaurant/settings/', restaurant_settings, name='restaurant-settings'),
    path('restaurant/menu/', restaurant_menu, name='restaurant-menu'),
    path('restaurant/menu/create/', restaurant_menu_create, name='restaurant-menu-create'),
    path('restaurant/menu/<int:pk>/', restaurant_menu_detail, name='restaurant-menu-detail'),
    path('restaurant/menu/<int:pk>/delete/', restaurant_menu_delete, name='restaurant-menu-delete'),
]