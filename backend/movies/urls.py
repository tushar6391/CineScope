from django.urls import path
from . import views

urlpatterns = [
    path('', views.movie_list),
    path('add/', views.add_movie),        # ← must be BEFORE <str:movie_id>/
    path('<str:movie_id>/', views.movie_detail),
    path('<str:movie_id>/update/', views.update_movie),
    path('<str:movie_id>/delete/', views.delete_movie),
]