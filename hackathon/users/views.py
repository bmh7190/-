import requests

from django.shortcuts import render,redirect
from django.conf import settings
from django.utils.translation import gettext_lazy 
from django.http import JsonResponse
from json.decoder import JSONDecodeError
from rest_framework import status
from rest_framework.response import Response
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.google import views as google_view
from allauth.socialaccount.providers.kakao import views as kakao_view

from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.models import SocialAccount

from .models import Profile,User

from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes,APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from users.serializers import UserSerializer,ProfileSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    print(request)
    email = request.data.get('email')
    password = request.data.get('password') 
    name = request.data.get('name')

    serializer = UserSerializer(data=request.data)
    serializer.email = email
    serializer.name = name

    if serializer.is_valid(raise_exception=True):
        user = serializer.save()
        user.set_password(password)
        user.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(email=email, password=password)
    if user is None:
        return Response({'message': '아이디 또는 비밀번호가 일치하지 않습니다.'}, status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    update_last_login(None, user)

    return Response({'refresh_token': str(refresh),
                     'access_token': str(refresh.access_token), }, status=status.HTTP_200_OK)
@api_view(['GET'])
def logout(request):
    response = Response({
        "message": "Logout success"
        }, status=status.HTTP_202_ACCEPTED)
    response.delete_cookie("accessToken")
    response.delete_cookie("refreshToken")
  
    return response

class ProfileList(APIView):
    def get(self, request):
        profiles = Profile.objects.all()
        serializer = ProfileSerializer(profiles, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileDetail(APIView):
    def get(self, request, pk):
        profile = get_object_or_404(Profile, pk=pk)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request, pk):
        profile = get_object_or_404(Profile, pk=pk)
        serializer = ProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk): 
        profile = get_object_or_404(Profile, pk=pk)
        profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    




state = getattr(settings, 'STATE')
BASE_URL = 'http://localhost:8000/'
GOOGLE_CALLBACK_URI = BASE_URL + 'users/google/callback/'

def google_login(request):
    """
    Code Request
    """
    scope = "openid email profile"
    client_id = getattr(settings, "SOCIAL_AUTH_GOOGLE_CLIENT_ID")
    return redirect(f"https://accounts.google.com/o/oauth2/v2/auth?client_id={client_id}&response_type=code&redirect_uri={GOOGLE_CALLBACK_URI}&scope={scope}")


def google_callback(request):

    client_id = getattr(settings, "SOCIAL_AUTH_GOOGLE_CLIENT_ID")
    client_secret = getattr(settings, "SOCIAL_AUTH_GOOGLE_SECRET")
    code = request.GET.get('code')
    
    token_req = requests.post(
        f"https://oauth2.googleapis.com/token?client_id={client_id}&client_secret={client_secret}&code={code}&grant_type=authorization_code&redirect_uri={GOOGLE_CALLBACK_URI}&state={state}")
    
    token_req_json = token_req.json()
    error = token_req_json.get("error")

    if error is not None:
        raise JSONDecodeError(error)
    
    access_token = token_req_json.get('access_token')
    
    email_req = requests.get(
        f"https://www.googleapis.com/oauth2/v1/userinfo?access_token={access_token}")
    
    email_req_status = email_req.status_code
    
    if email_req_status != 200:
        return JsonResponse({'err_msg': 'failed to get email'}, status=status.HTTP_400_BAD_REQUEST)
    
    email_req_json = email_req.json()
    email = email_req_json.get('email')
    name = email_req_json.get('name')
    
    try:
        user = User.objects.get(email=email)
        user_serializer = UserSerializer(user)
        token = TokenObtainPairSerializer.get_token(user)
        refresh_token = str(token)
        access_token = str(token.access_token)
        res = JsonResponse(
            {
                "user": user_serializer.data,
                "message": "login successs",
                "token": {
                    "access": access_token,
                    "refresh": refresh_token,
                },
            },
            status=status.HTTP_200_OK,
        )
        res.set_cookie("accessToken", value=access_token, max_age=None, expires=None, secure=True, samesite="None", httponly=True)

        res.set_cookie("refreshToken", value=refresh_token, max_age=None, expires=None, secure=True, samesite="None",httponly=True)
        return res
    
    except User.DoesNotExist:
        user = User.objects.create_user(email=email,name=name)
        user.name = name
        user.save()
        user_serializer = UserSerializer(user)
        token = TokenObtainPairSerializer.get_token(user)
        refresh_token = str(token)
        access_token = str(token.access_token)
        res = JsonResponse(
            {
                "user": user_serializer.data,
                "message": "register successs",
                "token": {
                    "access": access_token,
                    "refresh": refresh_token,
                },
            },
            status=status.HTTP_200_OK,
        )
        res.set_cookie("accessToken", value=access_token, max_age=None, expires=None, secure=True, samesite="None", httponly=True)

        res.set_cookie("refreshToken", value=refresh_token, max_age=None, expires=None, secure=True, samesite="None",httponly=True)

        return res

# class GoogleLogin(SocialLoginView):
#     adapter_class = google_view.GoogleOAuth2Adapter
#     callback_url = GOOGLE_CALLBACK_URI
#     client_class = OAuth2Client


# 카카오로그인
KAKAO_CALLBACK_URI = BASE_URL + 'users/kakao/callback/'

def kakao_login(request):
    client_id = getattr(settings, 'SOCIAL_AUTH_KAKAO_CLIENT_ID')
    return redirect(f"https://kauth.kakao.com/oauth/authorize?client_id={client_id}&redirect_uri={KAKAO_CALLBACK_URI}&response_type=code&scope=account_email")

@api_view(['GET'])
def kakao_callback(request):
    rest_api_key = getattr(settings, 'SOCIAL_AUTH_KAKAO_CLIENT_ID')
    code = request.GET.get("code")
    kakao_token_uri = "https://kauth.kakao.com/oauth/token"
  
    request_data = {
            'grant_type': 'authorization_code',
            'client_id': rest_api_key,
            'redirect_uri': KAKAO_CALLBACK_URI,
            'code': code,
        }

    token_headers = {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    token_req = requests.post(kakao_token_uri, data=request_data, headers=token_headers)
    token_req_json = token_req.json()
    error = token_req_json.get("error")

    if error is not None:
        raise ValueError(error)
    access_token = token_req_json["access_token"]
    
    profile_request = requests.get(
        "https://kapi.kakao.com/v2/user/me",
        headers={"Authorization": f"Bearer ${access_token}",})
    
    if profile_request.status_code == 200:
        profile_json = profile_request.json()
        error = profile_json.get("error")
        if error is not None:
            raise ValueError(error)
        print("profile_json : ",profile_json)
        user_name = profile_json['kakao_account']["profile"].get("nickname")
        user_email = profile_json["kakao_account"].get("email")
    else:
        raise ValueError(profile_request.status_code)
    try:
        user = User.objects.get(email=user_email)
        user_serializer = UserSerializer(user)
        token = TokenObtainPairSerializer.get_token(user)
        refresh_token = str(token)
        access_token = str(token.access_token)
        res = JsonResponse(
            {
                "user": user_serializer.data,
                "message": "login successs",
                "token": {
                    "access": access_token,
                    "refresh": refresh_token,
                },
            },
            status=status.HTTP_200_OK,
        )
        res.set_cookie("accessToken", value=access_token, max_age=None, expires=None, secure=True, samesite="None", httponly=True)

        res.set_cookie("refreshToken", value=refresh_token, max_age=None, expires=None, secure=True, samesite="None",httponly=True)
        return res
    except User.DoesNotExist:
        user = User.objects.create_user(email=user_email,name=user_name)
        user.name = user_name
        user.save()
        user_serializer = UserSerializer(user)
        token = TokenObtainPairSerializer.get_token(user)
        refresh_token = str(token)
        access_token = str(token.access_token)
        res = JsonResponse(
            {
                "user": user_serializer.data,
                "message": "register successs",
                "token": {
                    "access": access_token,
                    "refresh": refresh_token,
                },
            },
            status=status.HTTP_200_OK,
        )
        res.set_cookie("accessToken", value=access_token, max_age=None, expires=None, secure=True, samesite="None", httponly=True)

        res.set_cookie("refreshToken", value=refresh_token, max_age=None, expires=None, secure=True, samesite="None",httponly=True)

        return res



# def user_info(request):
#     try:
#         access = request.COOKIES['access']
#         payload = jwt.decode(access, settings.SECRET_KEY, algorithms=['HS256'])
#         username = payload.get('username')
#         user = get_object_or_404(User, username=username)
#         serializer = UserSerializer(instance=user)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     except(jwt.exceptions.ExpiredSignatureError):
#         data = {'refresh': request.COOKIES.get('refresh', None)}
#         serializer = TokenRefreshSerializer(data=data)
#         if serializer.is_valid(raise_exception=True):
#             access = serializer.data.get('access', None)
#             refresh = serializer.data.get('refresh', None)
#             payload = jwt.decode(access, settings.SECRET_KEY, algorithms=['HS256'])
#             username = payload.get('username')
#             user = get_object_or_404(User, username=username)
#             serializer = UserSerializer(instance=user)
#             res = Response(serializer.data, status=status.HTTP_200_OK)
#             res.set_cookie('access', access)
#             res.set_cookie('refresh', refresh)
#             return res


# @api_view(['GET'])
# def kakao_logout(self):
#     response = Response({
#         "message": "Logout success"
#         }, status=status.HTTP_202_ACCEPTED)
#     response.delete_cookie("accessToken")
#     response.delete_cookie("refreshToken")
  
#     return response

NAVER_CALLBACK_URI = BASE_URL + 'users/naver/callback/'

def naver_login(request):
    client_id = getattr(settings,"SOCIAL_AUTH_NAVER_CLIENT_ID")
    return redirect(f"https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id={client_id}&state=STATE_STRING&redirect_uri={NAVER_CALLBACK_URI}")

def naver_callback(request):
    
    client_id = getattr(settings,"SOCIAL_AUTH_NAVER_CLIENT_ID")
    client_secret =getattr(settings,"SOCIAL_AUTH_NAVER_SECRET")
    code = request.GET.get("code")
    state_string = request.GET.get("state")

    # code로 access token 요청
    token_request = requests.get(f"https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id={client_id}&client_secret={client_secret}&code={code}&state={state_string}")
    token_response_json = token_request.json()

    error = token_response_json.get("error", None)
    if error is not None:
        raise JSONDecodeError(error)

    access_token = token_response_json.get("access_token")

    # return JsonResponse({"access_token":access_token})

    # access token으로 네이버 프로필 요청
    profile_request = requests.post(
        "https://openapi.naver.com/v1/nid/me",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    if profile_request.status_code == 200:
        profile_json = profile_request.json()
        print(profile_json)
        error = profile_json.get("error")
        if error is not None:
            raise ValueError(error)
        print("profile_json : ",profile_json)
        user_name = profile_json['response'].get("name")
        user_email = profile_json["response"].get("email")
    else:
        raise ValueError(profile_request.status_code)

    
    try:
        user = User.objects.get(email=user_email)
        user_serializer = UserSerializer(user)
        token = TokenObtainPairSerializer.get_token(user)
        refresh_token = str(token)
        access_token = str(token.access_token)
        res = JsonResponse(
            {
                "user": user_serializer.data,
                "message": "login successs",
                "token": {
                    "access": access_token,
                    "refresh": refresh_token,
                },
            },
            status=status.HTTP_200_OK,
        )
        res.set_cookie("accessToken", value=access_token, max_age=None, expires=None, secure=True, samesite="None", httponly=True)

        res.set_cookie("refreshToken", value=refresh_token, max_age=None, expires=None, secure=True, samesite="None",httponly=True)
        return res
    except User.DoesNotExist:
        user = User.objects.create_user(email=user_email,name=user_name)
        user.name = user_name
        user.save()
        user_serializer = UserSerializer(user)
        token = TokenObtainPairSerializer.get_token(user)
        refresh_token = str(token)
        access_token = str(token.access_token)
        res = JsonResponse(
            {
                "user": user_serializer.data,
                "message": "register successs",
                "token": {
                    "access": access_token,
                    "refresh": refresh_token,
                },
            },
            status=status.HTTP_200_OK,
        )
        res.set_cookie("accessToken", value=access_token, max_age=None, expires=None, secure=True, samesite="None", httponly=True)

        res.set_cookie("refreshToken", value=refresh_token, max_age=None, expires=None, secure=True, samesite="None",httponly=True)

        return res

# class NaverLogin(SocialLoginView):
#     adapter_class = naver_view.NaverOAuth2Adapter
#     callback_url = NAVER_CALLBACK_URI
#     client_class = OAuth2Client


#되냐?