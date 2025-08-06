from django.urls import path
from rest_framework import routers
from .views import ComplaintViewSet, OpenCasesViewSet, ClosedCasesViewSet, TopComplaintTypeViewSet, MyDistrictComplaintViewSet
from rest_framework.authtoken.views import obtain_auth_token

router = routers.SimpleRouter()
router.register(r'allComplaints', ComplaintViewSet, basename='complaint')
router.register(r'openCases', OpenCasesViewSet, basename='openCases')
router.register(r'closedCases', ClosedCasesViewSet, basename='closedCases')
router.register(r'topComplaints', TopComplaintTypeViewSet, basename='topComplaints')
router.register(r'myDistrict',MyDistrictComplaintViewSet,basename='myDistrict')
urlpatterns = [
     path("login/", obtain_auth_token),  # <--- This enables /login/
]
urlpatterns += router.urls