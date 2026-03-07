

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, restaurant_orders, update_order_status

router = DefaultRouter()
router.register(r'', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('restaurant/', restaurant_orders, name='restaurant-orders'),
    path('<int:pk>/status/', update_order_status, name='update-order-status'),
]