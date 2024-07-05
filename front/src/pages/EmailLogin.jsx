import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #3c66ba;
  color: white;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #3457a1;
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

const EmailLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/users/login`, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const { access_token, refresh_token, user, name } = response.data;
      const decodedToken = decodeJWT(access_token);

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('userID', user);  // Assuming 'uid' is the key in the token payload
      localStorage.setItem('userName', name);
      alert('로그인이 완료되었습니다!');
      navigate('/');  // Redirect to root after successful login
    } catch (error) {
      console.error('There was a problem with the login request:', error);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Container>
      <TitleWrap>
        <BackButton onClick={() => navigate(-1)}>←</BackButton>
        <Title>로그인하기</Title>
      </TitleWrap>
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">로그인</Button>
      </Form>
    </Container>
  );
};

export default EmailLogin;