from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView

from .models import Cart
from .serializers import CartSerializer, CartCreateSerializer


# USER CART LIST + ADD
class CartListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CartCreateSerializer
        return CartSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# USER CART DELETE SINGLE ITEM
class CartItemDeleteView(generics.DestroyAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)


# CLEAR USER CART
class ClearCartView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        Cart.objects.filter(user=request.user).delete()
        return Response({"message": "Cart cleared successfully!"}, status=status.HTTP_204_NO_CONTENT)


# 🔥 ADMIN PANEL — FETCH ALL CARTS
class CartAdminListView(generics.ListAPIView):
    queryset = Cart.objects.all().order_by('-created_at')
    serializer_class = CartSerializer
    permission_classes = [IsAdminUser]   # only admin user can access
