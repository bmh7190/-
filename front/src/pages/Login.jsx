import React, { useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate, useLocation } from "react-router-dom";
import queryString from 'query-string';
import { API_BASE_URL } from '../config';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
`;

const TitleWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 300px;
  justify-content: center;
`;

const Title = styled.h1`
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  margin-bottom: 40px;
  color: #666;
`;

const Button = styled.button`
  width: 300px;
  height: 55px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
  font-size: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    background-color: #f0f0f0;
  }

  img {
    width: 20px;
    height: 20px;
    position: absolute;
    left: 30px;
  }

  &.kakao-login-btn {
    background-color: #fedc3f;
  }

  &.naver-login-btn {
    background-color: #20c801;
    color: #fff;
  }
`;

const EmailLoginButton = styled(Link)`
  width: 300px;
  height: 55px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: white;
  cursor: pointer;
  font-size: 17px;
  text-decoration: none;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;

  &:hover {
    background-color: #f0f0f0;
  }

  img {
    width: 20px;
    height: 20px;
    position: absolute;
    left: 30px;
  }
`;

const RegisterLink = styled(Link)`
  margin-top: 20px;
  font-size: 14px;
  color: #000;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const BackButton = styled(Link)`
  font-size: 24px;
  text-decoration: none;
  color: black;
  position: absolute;
  left: 15px;
  cursor: pointer;
`;

// Function to decode JWT
const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = queryString.parse(location.search);
    const { access, refresh } = queryParams;

    if (access && refresh) {
      const decodedToken = decodeJWT(access);

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('userID', decodedToken.user_id);  // Assuming 'user_id' is the key in the token payload
      navigate('/');
    }
  }, [location, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/users/google/login`;
  };

  const handleKakaoLogin = () => {
    window.location.href = `${API_BASE_URL}/users/google/login`;
  };

  const handleNaverLogin = () => {
    window.location.href = `${API_BASE_URL}/users/google/login`;
  };

  return (
    <Container>
      <TitleWrap>
        <BackButton onClick={() => navigate(-1)}>←</BackButton>
        <Title>로그인하기</Title>
      </TitleWrap>
      <Subtitle>소셜 아이디 및 이메일로 로그인할 수 있어요.</Subtitle>
      <EmailLoginButton to="/login/email-login">
        이메일로 로그인하기
        <img src="/email.png" alt="Email" />
      </EmailLoginButton>
      <Button className="google-login-btn" onClick={handleGoogleLogin}>
        <img src="/google-logo.png" alt="Google" />
        Google로 시작하기
      </Button>
      <Button className="kakao-login-btn" onClick={handleKakaoLogin}>
        <img src="/kakao-logo.png" alt="Kakao" />
        카카오로 시작하기
      </Button>
      <Button className="naver-login-btn" onClick={handleNaverLogin}>
        <img src="/naver-logo.png" alt="Naver" />
        네이버로 시작하기
      </Button>
      <RegisterLink to="/registerform">회원가입하기</RegisterLink>
    </Container>
  );
};

export default Login;