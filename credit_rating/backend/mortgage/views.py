from django.shortcuts import render
from . models import Mortgage
from . serializers import MortgageSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
import logging
from django.utils.timezone import now
# Create your views here.

# create log 
logger = logging.getLogger("mortgage")


def cal_credit_rating(mortgage):
    risk_score = 0
    # loan to value 
    ltv = (mortgage.loan_amount / mortgage.property_value) * 100
    if ltv > 90:
        risk_score += 2
    elif ltv > 80:
        risk_score += 1
    
    # debt to income
    dti = (mortgage.debt_amount / mortgage.annual_income) * 100
    if dti > 50:
        risk_score += 2
    elif dti > 40:
        risk_score += 1

    # credit Score
    if mortgage.credit_score >= 700:
        risk_score -= 1
    elif mortgage.credit_score < 650:
        risk_score += 1

    # loan Type
    if mortgage.loan_type == "fixed":
        risk_score -= 1
    elif mortgage.loan_type == "adjustable":
        risk_score += 1
    
    # property Type
    if mortgage.property_type == "condo":
        risk_score += 1

    all_mortgages = Mortgage.objects.all()
    if all_mortgages.exists():
        avg_credit_score = sum(m.credit_score for m in all_mortgages) / all_mortgages.count()
        if avg_credit_score >= 700:
            risk_score -= 1
        elif avg_credit_score < 650:
            risk_score += 1

    # final score 
    if risk_score <= 2:
        return "AAA"
    elif 3 <= risk_score <= 5:
        return "BBB"
    else:
        return "C"
    



# Add Martgage Data to Databse with Credit Rating Algorithm
@api_view(["POST"])
def add_mortgage(request):
    logger.info("Received a data to add in table")
    serializers = MortgageSerializer(data=request.data)
    if serializers.is_valid():
        mortgage = serializers.save()
        mortgage.credit_rating = cal_credit_rating(mortgage)
        mortgage.created_at = now()
        mortgage.save()
        logger.info(f"mortgages Data Added Succussfully :  {mortgage.id}")
        return Response(serializers.data,status=201)
    logger.info(f"Failed to add Data :  {serializers.errors}")
    return Response(serializers.errors,status=400)



# get all the Mortgage list form Database and Display it
@api_view(["GET"])
def list_mortgage(request):
    mortgage = Mortgage.objects.all()
    serializer = MortgageSerializer(mortgage,many=True)
    logger.info(f"Fetch all mortgages.")
    return Response(serializer.data)


# get all the data based on id and Update the data   
@api_view(["GET", "PUT"])
def edit_mortgage(request, id):
    logger.info(f"fetch mortgage with ID: {id}")
    mortgage = get_object_or_404(Mortgage, id=id)

    if request.method == "GET":
        serializer = MortgageSerializer(mortgage)
        return Response(serializer.data, status=200)

    elif request.method == "PUT":
        serializer = MortgageSerializer(mortgage, data=request.data, partial=True)
        if serializer.is_valid():
            mortgage = serializer.save()
            mortgage.credit_rating = cal_credit_rating(mortgage)
            mortgage.save()
            logger.info(f"updated Mortgage with ID : {id}")
            return Response(serializer.data, status=200)
        
        logger.info(f"Failed to add Data :  {serializer.errors}")
        return Response(serializer.errors, status=400)


# delete the data based on id
@api_view(["DELETE"])
def delete_mortgage(request,id):
    mortgage = get_object_or_404(Mortgage,id = id)
    mortgage.delete()
    logger.info(f"Deleting mortgage with ID: {id}")
    return Response({"message": "Mortgage Deleted"},status=200)
