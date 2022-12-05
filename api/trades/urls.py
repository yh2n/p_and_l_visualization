from django.urls import path
from trades import views

urlpatterns = [
    path("", views.fillApi)
]