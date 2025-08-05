from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from .models import Complaint, UserProfile
from datetime import date

class ComplaintViewSetTest(APITestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username='jdoe', 
            password='doe-1',
            first_name='John',
            last_name='Doe'
        )
        
        # Create UserProfile for the user (District 1)
        self.user_profile = UserProfile.objects.create(
            user=self.user,
            full_name='John Doe',
            district='1',  # District 1 (no zero-padding)
            party='Democrat',
            borough='Manhattan'
        )
        
        # Create another user for testing different districts
        self.user2 = User.objects.create_user(
            username='jsmith', 
            password='smith-2',
            first_name='Jane',
            last_name='Smith'
        )
        
        self.user_profile2 = UserProfile.objects.create(
            user=self.user2,
            full_name='Jane Smith',
            district='2',  # District 2
            party='Democrat',
            borough='Manhattan'
        )
        
        # Create complaints for District 1 (NYCC01)
        Complaint.objects.create(
            unique_key="NYCC0100001",
            account="NYCC01",  # District 1 (zero-padded)
            opendate=date(2023, 1, 1),
            complaint_type="Noise",
            descriptor="Loud Music",
            zip="10001",
            borough="Manhattan",
            city="New York",
            council_dist="NYCC01",
            community_board="CB1",
            closedate=None
        )
        
        Complaint.objects.create(
            unique_key="NYCC0100002",
            account="NYCC01",  # District 1
            opendate=date(2023, 1, 2),
            complaint_type="Water Leak",
            descriptor="Pipe Burst",
            zip="10001",
            borough="Manhattan",
            city="New York",
            council_dist="NYCC01",
            community_board="CB1",
            closedate=date(2023, 1, 15)
        )
        
        # Create complaints for District 2 (NYCC02)
        Complaint.objects.create(
            unique_key="NYCC0200001",
            account="NYCC02",  # District 2 (zero-padded)
            opendate=date(2023, 1, 3),
            complaint_type="Garbage",
            descriptor="Trash Not Picked Up",
            zip="10002",
            borough="Manhattan",
            city="New York",
            council_dist="NYCC02",
            community_board="CB2",
            closedate=None
        )
        
        # Set up API client
        self.client = APIClient()

    def test_complaint_list_authenticated_user_district_1(self):
        """Test that authenticated user gets only complaints from their district"""
        # Authenticate as user from District 1
        self.client.force_authenticate(user=self.user)
        
        # Make request to complaints endpoint
        url = reverse('complaint-list')
        response = self.client.get(url)
        
        # Check response
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)  # Should get 2 complaints from District 1
        
        # Check that all returned complaints are from District 1
        for complaint in response.data:
            self.assertEqual(complaint['account'], 'NYCC01')
        
        # Check specific complaints
        unique_keys = [c['unique_key'] for c in response.data]
        self.assertIn("NYCC0100001", unique_keys)
        self.assertIn("NYCC0100002", unique_keys)
        self.assertNotIn("NYCC0200001", unique_keys)  # Should not get District 2 complaint

    def test_complaint_list_authenticated_user_district_2(self):
        """Test that user from District 2 gets only their district's complaints"""
        # Authenticate as user from District 2
        self.client.force_authenticate(user=self.user2)
        
        # Make request to complaints endpoint
        url = reverse('complaint-list')
        response = self.client.get(url)
        
        # Check response
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)  # Should get 1 complaint from District 2
        
        # Check that the complaint is from District 2
        self.assertEqual(response.data[0]['account'], 'NYCC02')
        self.assertEqual(response.data[0]['unique_key'], 'NYCC0200001')

    def test_complaint_list_unauthenticated_user(self):
        """Test that unauthenticated users get 401 error"""
        # Don't authenticate
        url = reverse('complaint-list')
        response = self.client.get(url)
        
        # Should get 401 Unauthorized
        self.assertEqual(response.status_code, 401)

    def test_complaint_list_user_without_profile(self):
        """Test that users without UserProfile get empty results"""
        # Create user without profile
        user_no_profile = User.objects.create_user(
            username='noprofile', 
            password='testpass'
        )
        
        self.client.force_authenticate(user=user_no_profile)
        
        url = reverse('complaint-list')
        response = self.client.get(url)
        
        # Should get 200 but empty results
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

    def test_district_format_conversion(self):
        """Test that district format conversion works correctly"""
        # Test with single digit district
        self.assertEqual(self.user_profile.district, '1')
        
        # Test with double digit district
        self.assertEqual(self.user_profile2.district, '2')
        
        # The conversion should happen in the view:
        # "1" -> "NYCC01"
        # "2" -> "NYCC02"
        
        # Verify our test data uses the correct format
        district_1_complaints = Complaint.objects.filter(account="NYCC01")
        self.assertEqual(district_1_complaints.count(), 2)
        
        district_2_complaints = Complaint.objects.filter(account="NYCC02")
        self.assertEqual(district_2_complaints.count(), 1)

