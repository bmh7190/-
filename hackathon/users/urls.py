from django.urls import include, path
from . import views

urlpatterns = [
    path('signup', views.signup),
    path('login', views.login),
    path('logout',views.logout),
    path('profiles/', views.ProfileList.as_view(), name='profile-list'),
    path('profiles/<int:pk>/', views.ProfileDetail.as_view(), name='profile-detail'),

    #구글 로그인
    path('google/login', views.google_login, name='google_login'),
    path('google/callback/', views.google_callback,name='google_callback'),  
    #path('google/login/finish/', views.GoogleLogin.as_view(), name='google_login_todjango'),

    #카카오 로그인
    path('kakao/login/', views.kakao_login, name='kakao_login'),
    path('kakao/callback/', views.kakao_callback, name='kakao_callback'),
    #path('kakao/login/finish/', views.KakaoLogin.as_view(), name='kakao_login_todjango'),

]