import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'qc_backend.settings')
django.setup()

from django.contrib.auth.models import User
from restaurants.models import Restaurant

# Create or get test user
username = 'testrestaurant'
password = 'testpass123'
email = 'test@restaurant.com'

user, created = User.objects.get_or_create(
    username=username,
    defaults={
        'email': email,
        'first_name': 'Test',
        'last_name': 'Restaurant',
    }
)

if created:
    user.set_password(password)
    user.save()
    print(f"Created user: {username}")
else:
    user.set_password(password)
    user.save()
    print(f"User {username} already exists, password updated")

# Check if restaurant exists
restaurants = user.restaurants.all()
if restaurants.exists():
    restaurant = restaurants.first()
    print(f"Restaurant already exists: {restaurant.name}")
else:
    # Create a restaurant for this user
    restaurant = Restaurant.objects.create(
        owner=user,
        name='Test Restaurant',
        cuisine='Multi-Cuisine',
        phone='9999999999',
        email=email,
        city='Test City',
        state='Test State',
        status='open'
    )
    print(f"Created restaurant: {restaurant.name}")

print(f"\nTest Credentials:")
print(f"Username: {username}")
print(f"Password: {password}")
