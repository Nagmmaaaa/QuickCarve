import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'qc_backend.settings')
django.setup()

from django.contrib.auth.models import User
from restaurants.models import Restaurant

users = User.objects.all()
print(f"Total Users: {users.count()}")

if users.count() > 0:
    print("\nUsers with restaurants:")
    for user in users[:10]:
        has_restaurant = hasattr(user, 'restaurant')
        print(f"  - {user.username}: {'Has restaurant' if has_restaurant else 'No restaurant'}")

restaurants = Restaurant.objects.all()
print(f"\nTotal Restaurants: {restaurants.count()}")

if restaurants.count() > 0:
    print("\nFirst 5 restaurants:")
    for rest in restaurants[:5]:
        print(f"  - {rest.name} (Owner: {rest.owner.username if rest.owner else 'None'})")
