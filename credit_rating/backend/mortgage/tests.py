from django.test import TestCase
from django.test import TestCase
from mortgage.models import Mortgage
from mortgage.views import cal_credit_rating
from django.core.exceptions import ValidationError


# Create your tests here.

class CreditRatingTest(TestCase):

    def setUp(self):
        # Mortgage with high credit score
        self.mortgage1 = Mortgage.objects.create(
            credit_score=800,  
            loan_amount=200000,
            property_value=300000,
            annual_income=90000,
            debt_amount=5000,
            loan_type="fixed",
            property_type="single_family"
        )

        # Mortgage with a medium credit score
        self.mortgage2 = Mortgage.objects.create(
            credit_score=650,  
            loan_amount=150000,
            property_value=200000,
            annual_income=60000,
            debt_amount=20000,
            loan_type="adjustable",
            property_type="condo"
        )

    def test_credit_rating_high_score(self):
        rating = cal_credit_rating(self.mortgage1)  
        self.assertEqual(rating, "AAA")  

    def test_credit_rating_medium_score(self):
        rating = cal_credit_rating(self.mortgage2)  
        self.assertEqual(rating, "BBB")  

    def test_credit_rating_low_score(self):
        mortgage3 = Mortgage.objects.create(
            credit_score=300,  
            loan_amount=50000,
            property_value=80000,
            annual_income=30000,
            debt_amount=10000,
            loan_type="fixed",
            property_type="single_family"
        )
        rating = cal_credit_rating(mortgage3)  
        self.assertEqual(rating, "C")  

    def test_negative_loan_amount(self):
        with self.assertRaises(ValidationError):  
            Mortgage.objects.create(
                credit_score=750,
                loan_amount=-100000, 
                property_value=250000,
                annual_income=70000,
                debt_amount=10000,
                loan_type="fixed",
                property_type="single_family"
            ).full_clean()  

    def test_invalid_credit_score(self):
        with self.assertRaises(ValidationError): 
            Mortgage.objects.create(
                credit_score=900,  
                loan_amount=150000,
                property_value=250000,
                annual_income=80000,
                debt_amount=20000,
                loan_type="fixed",
                property_type="single_family"
            ).full_clean()  
