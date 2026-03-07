from rest_framework import serializers
from django.contrib.auth.models import User, Group
from .models import Profile


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['phone', 'address', 'gender', 'dob']


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'profile']

    def update(self, instance, validated_data):
        # ensure profile exists
        profile_obj, _ = Profile.objects.get_or_create(user=instance)

        profile_data = validated_data.pop('profile', {})

        # update user
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        # update profile
        for attr, value in profile_data.items():
            setattr(profile_obj, attr, value)
        profile_obj.save()

        return instance
