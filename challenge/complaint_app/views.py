from rest_framework import viewsets
from .models import UserProfile, Complaint
from .serializers import UserProfileSerializer, ComplaintSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
# Create your views here.

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    print("test auth")
    user = authenticate(username=username, password=password)
    print(user)
    if user is not None:
        return Response({"message": "Login successful!"})
    else:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class ComplaintViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self, request):
        user = request.user
        # user = self.UserProfile.objects.get(user=self.request.user)
        try:
            # Step 1: Get the user's profile to find their district
            user_profile = UserProfile.objects.get(user=user)
            district_number = user_profile.district
            
            if district_number:
                # Step 2: Convert district format from "1" to "NYCC01"
                # district_number is like "1", "2", "10", "42" (no zero-padding)
                # We need to convert to "NYCC01", "NYCC02", "NYCC10", "NYCC42"
                district_code = f"NYCC{district_number.zfill(2)}"
                
                # Step 3: Filter complaints where account matches user's district
                return Complaint.objects.filter(account=district_code)
        except UserProfile.DoesNotExist:
            pass
        
        return Complaint.objects.none()
    
    def list(self, request):
        """Get all complaints from the user's district"""
        queryset = self.get_queryset(request)
        serializer = self.get_serializer(queryset, many=True)
        # Get all complaints from the user's district
        return Response(serializer.data)

class OpenCasesViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]
        
    def get_queryset(self):

        user = self.request.user
        try:
            # Step 1: Get the user's profile to find their district
            user_profile = UserProfile.objects.get(user=user)
            district_number = user_profile.district
                
            if district_number:
                # Step 2: Convert district format from "1" to "NYCC01"
                # district_number is like "1", "2", "10", "42" (no zero-padding)
                # We need to convert to "NYCC01", "NYCC02", "NYCC10", "NYCC42"
                district_code = f"NYCC{district_number.zfill(2)}"
                    
                # Step 3: Filter complaints where account matches user's district
                return Complaint.objects.filter(account=district_code, closedate__isnull=True)
        except UserProfile.DoesNotExist:
            pass
            
        return Complaint.objects.none()
    def list(self, request):
        # Get only the open complaints from the user's district
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class ClosedCasesViewSet(viewsets.ModelViewSet):
    http_method_names = ['get'] 
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]
        
    def get_queryset(self):
        user = self.request.user
        try:
            # Step 1: Get the user's profile to find their district
            user_profile = UserProfile.objects.get(user=user)
            district_number = user_profile.district
                
            if district_number:
                # Step 2: Convert district format from "1" to "NYCC01"
                # district_number is like "1", "2", "10", "42" (no zero-padding)
                # We need to convert to "NYCC01", "NYCC02", "NYCC10", "NYCC42"
                district_code = f"NYCC{district_number.zfill(2)}"
                    
                # Step 3: Filter complaints where account matches user's district
                return Complaint.objects.filter(account=district_code, closedate__isnull=False)
        except UserProfile.DoesNotExist:
            pass
            
        return Complaint.objects.none()
    def list(self, request):
        
        # Get only complaints that are close from the user's district
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
class TopComplaintTypeViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        try:
            # Step 1: Get the user's profile to find their district
            user_profile = UserProfile.objects.get(user=user)
            district_number = user_profile.district
            
            if district_number:
                # Step 2: Convert district format from "1" to "NYCC01"
                district_code = f"NYCC{district_number.zfill(2)}"
                
                from django.db.models import Count
                top_complaints = Complaint.objects.filter(
                    account=district_code,
                    complaint_type__isnull=False
                ).exclude(
                    complaint_type=""
                ).values('complaint_type').annotate(
                    count=Count('complaint_type')
                ).order_by('-count')[:3]
                
                # Step 4: Get the actual complaint records for these top types
                top_types = [item['complaint_type'] for item in top_complaints]
                return Complaint.objects.filter(
                    account=district_code,
                    complaint_type__in=top_types
                )
        except UserProfile.DoesNotExist:
            pass
        
        return Complaint.objects.none()
    
    def list(self, request):
        # Get the top 3 complaint types from the user's district
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)