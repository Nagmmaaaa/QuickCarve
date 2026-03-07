from django.db import models
from users.models import User
from restaurants.models import MenuItem

class Cart(models.Model):
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.customer.username} - {self.menu_item.name} x {self.quantity}"

    @property
    def total_price(self):
        return self.menu_item.price * self.quantity
from django.db import models
from django.contrib.auth.models import User
from restaurants.models import Restaurant  

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart_items')
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='cart_restaurant')
    item_name = models.CharField(max_length=100)
    item_price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def total_price(self):
        return self.item_price * self.quantity

    def __str__(self):
        return f"{self.item_name} ({self.quantity}) - {self.user.username}"
