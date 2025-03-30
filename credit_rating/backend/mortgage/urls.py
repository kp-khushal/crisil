from django.urls import path
from . views import add_mortgage, list_mortgage, edit_mortgage, delete_mortgage

urlpatterns = [
     path("add/", add_mortgage, name="add_mortgage"),
    path('list/', list_mortgage, name="List_mortgage"),
    path("edit/<int:id>/", edit_mortgage, name="edit_mortgage"),
    path("delete/<int:id>/", delete_mortgage, name="delete_mortgage"),
]


