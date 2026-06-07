from django.urls import path
from . import views

urlpatterns = [
    path('content/<str:movie_id>/', views.content_based),
    path('collaborative/', views.collaborative),
    path('hybrid/', views.hybrid),
]