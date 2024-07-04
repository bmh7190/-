import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

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

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    const googleLoginUrl = 'http://solver.r-e.kr/users/google/login';
    const newWindow = window.open(googleLoginUrl, '_blank', 'width=500,height=600');
  
    const interval = setInterval(() => {
      if (newWindow.closed) {
        clearInterval(interval);
        // 부모 창에서 데이터를 가져올 수 있다면 처리
        if (window.handleGoogleLoginResponse) {
          window.handleGoogleLoginResponse();
        }
      }
    }, 1000);
  };

  // 메인 페이지에서 응답 데이터를 받아 쿠키를 설정하는 함수
  window.handleGoogleLoginResponse = async () => {
    try {
      const response = await fetch('http://solver.r-e.kr/users/google/callback/');
      const data = await response.json();
      if (data.token) {
        document.cookie = `accessToken=${data.token.access}; path=/; secure; samesite=None`;
        document.cookie = `refreshToken=${data.token.refresh}; path=/; secure; samesite=None`;
        // 필요한 추가 처리 (예: 사용자 정보 저장, 페이지 리프레시 등)
        console.log('로그인 성공:', data);
      } else {
        console.error('로그인 실패:', data);
      }
    } catch (error) {
      console.error('로그인 처리 중 오류 발생:', error);
    }
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
      <Button className="kakao-login-btn">
        <img src="/kakao-logo.png" alt="Kakao" />
        카카오로 시작하기
      </Button>
      <Button className="naver-login-btn">
        <img src="/naver-logo.png" alt="Naver" />
        네이버로 시작하기
      </Button>
      <RegisterLink to="/registerform">회원가입하기</RegisterLink>
    </Container>
  );
};

export default Login;
