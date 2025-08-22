from rest_framework import viewsets
from .models import UserProfile, Complaint
from .serializers import UserProfileSerializer, ComplaintSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
class ComplaintViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self, request):
        user = request.user
        try:
            user_profile = UserProfile.objects.get(user=user)
            district_number = user_profile.district
            
            if district_number:
                district_code = f"NYCC{district_number.zfill(2)}"
                
                return Complaint.objects.filter(account=district_code)
        except UserProfile.DoesNotExist:
            pass
        
        return Complaint.objects.none()
    
    def list(self, request):
        """Get all complaints from the user's district"""
        queryset = self.get_queryset(request)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class OpenCasesViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]
        
    def get_queryset(self):

        user = self.request.user
        try:
            user_profile = UserProfile.objects.get(user=user)
            district_number = user_profile.district
                
            if district_number:
                district_code = f"NYCC{district_number.zfill(2)}"
                    
                return Complaint.objects.filter(account=district_code, closedate__isnull=True)
        except UserProfile.DoesNotExist:
            pass
            
        return Complaint.objects.none()
    def list(self, request):
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
            user_profile = UserProfile.objects.get(user=user)
            district_number = user_profile.district
                
            if district_number:
                district_code = f"NYCC{district_number.zfill(2)}"
                    
                return Complaint.objects.filter(account=district_code, closedate__isnull=False)
        except UserProfile.DoesNotExist:
            pass
            
        return Complaint.objects.none()
    def list(self, request):
        
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
            user_profile = UserProfile.objects.get(user=user)
            district_number = user_profile.district
            
            if district_number:
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
                
                top_types = [item['complaint_type'] for item in top_complaints]
                return Complaint.objects.filter(
                    account=district_code,
                    complaint_type__in=top_types
                )
        except UserProfile.DoesNotExist:
            pass
        
        return Complaint.objects.none()
    
    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
class MyDistrictComplaintViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self, request):
        user = request.user
        try:
            user_profile = UserProfile.objects.get(user=user)
            district_number = user_profile.district
            
            if district_number:
                district_code = f"NYCC{district_number.zfill(2)}"
                
                return Complaint.objects.filter(council_dist=district_code)
        except UserProfile.DoesNotExist:
            pass
        
        return Complaint.objects.none()
    
    def list(self, request):
        """Get all complaints to the user's district"""
        queryset = self.get_queryset(request)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)