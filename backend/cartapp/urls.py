from django.urls import path
from .views import CartListCreateView, CartItemDeleteView, ClearCartView, CartAdminListView

urlpatterns = [
    path('', CartListCreateView.as_view(), name='cart-list-create'),
    path('<int:pk>/', CartItemDeleteView.as_view(), name='cart-item-delete'),
    path('clear/', ClearCartView.as_view(), name='cart-clear'),

    path('admin/', CartAdminListView.as_view(), name='cart-admin-list'),
]
