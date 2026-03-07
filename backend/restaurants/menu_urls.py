# restaurants/menu_urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MenuItemViewSet

router = DefaultRouter()
router.register(r'', MenuItemViewSet, basename='menuitem')  # /api/menu-items/

urlpatterns = [
    path('', include(router.urls)),
]