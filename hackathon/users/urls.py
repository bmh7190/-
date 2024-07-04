from django.urls import include, path
from . import views

urlpatterns = [
    path('signup', views.signup),
    path('login', views.login),
    path('profiles/', views.ProfileList.as_view(), name='profile-list'),
    path('profiles/<int:pk>/', views.ProfileDetail.as_view(), name='profile-detail'),
]