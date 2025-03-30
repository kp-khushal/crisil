from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.

class Mortgage(models.Model):
    CREDIT_RATING_Choice =  [('AAA', 'AAA'), ('BBB', 'BBB'), ('C', 'C')]
    credit_score = models.IntegerField(validators=[MinValueValidator(300), MaxValueValidator(850)])
    loan_amount = models.FloatField()
    property_value = models.FloatField()
    annual_income = models.FloatField()
    debt_amount = models.FloatField()
    loan_type = models.CharField(max_length=100,choices=[('fixed','Fixed'),('adjustable','Adjustable')])
    property_type = models.CharField(max_length=100,choices=[('single_family','Single Family'),('condo','Condo')])
    credit_rating = models.CharField(max_length=100,choices=CREDIT_RATING_Choice,blank=True)
    created_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Mortgage {self.id} - Credit Score : {self.credit_score}"