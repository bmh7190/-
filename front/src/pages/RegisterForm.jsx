import React, { useState } from 'react';
import styled from 'styled-components';
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

const FileInput = styled.input`
  margin-bottom: 20px;
`;

const Label = styled.label`
  width: 100%;
  text-align: left;
  margin-bottom: 10px;
  font-size: 14px;
  color: #555;
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

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordcheck, setPasswordCheck] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      if (img.width === img.height) {
        setProfileImage(file);
      } else {
        alert('정방형 이미지만 업로드 가능합니다.');
        setProfileImage(null);
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordcheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const data = {
      name: name,
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://solver.r-e.kr/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response status:', response.status);
        console.error('Response text:', errorText);
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      alert('회원가입이 완료되었습니다!');
      navigate('/login');  // Redirect to login page after successful registration
    } catch (error) {
      console.error('There was a problem with the registration request:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Container>
      <TitleWrap>
        <BackButton onClick={() => navigate(-1)}>←</BackButton>
        <Title>회원가입</Title>
      </TitleWrap>
      <Form onSubmit={handleSubmit}>
        <Input
          type="name"
          placeholder="닉네임"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <Input
          type="passwordcheck"
          placeholder="비밀번호 확인"
          value={passwordcheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
          required
        />
        <Label htmlFor="profileImage">프로필 이미지</Label>
        <FileInput
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <Button type="submit">회원가입</Button>
      </Form>
    </Container>
  );
};

export default RegisterForm;