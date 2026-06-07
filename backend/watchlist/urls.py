from django.urls import path
from . import views

urlpatterns = [
    path('', views.my_watchlist),
    path('add/', views.add_to_watchlist),
    path('remove/<str:movie_id>/', views.remove_from_watchlist),
    path('all/', views.all_watchlists),
]