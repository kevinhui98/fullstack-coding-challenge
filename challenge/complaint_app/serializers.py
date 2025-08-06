from django.contrib.auth.models import User
from .models import UserProfile, Complaint
from rest_framework import serializers

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id','username', 'first_name','last_name')

class UserProfileSerializer(serializers.ModelSerializer):
    # BONUS Task: Flatten out the User object inside of UserProfile.
    username = serializers.CharField(source='user.username', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    full_name = serializers.SerializerMethodField()

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    class Meta:
        model = UserProfile
        fields = ('id','user','username', 'first_name', 'last_name', 'full_name', 'district', 'party', 'borough')

class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ('unique_key','account','opendate','complaint_type','descriptor','zip','borough','city','council_dist','community_board','closedate')