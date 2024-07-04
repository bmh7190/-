import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import '../style.css';

const SidebarContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    border-radius: 10px;
`;

const WidgetWrap = styled.div`
    position: relative;
    margin-bottom: 20px;
    background-color: var(--preset--color--base-2);
    box-shadow: 0px 12px 16px 0 #888;
    border-radius: 30px;
    padding: 20px;
    width: 300px;

    &.my-profile-widget {
        height: 350px;
    }

    &.my-posts-widget {
        min-height: 450px;

        & h3 {
            font-size: 18px;
        }
    }
`;

const UserProfile = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
`;

const UserProfileImg = styled.img`
    background-color: #cdcdcd;
    width: 55px;
    height: 55px;
`;

const UserTitle = styled.div`
    
`;

const UserName = styled.h2`
    font-size: 18px;
    margin: unset;
`;

const UserEmail = styled.p`
    font-size: 14px;
    color: #777;
    margin: unset;
    margin-top: 5px;
`;

const UserStats = styled.p`
    font-size: 18px;
    margin: unset;
    margin-top: 30px;
`;

const PostButton = styled.button`
    padding: 10px 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f5f5f5;
    cursor: pointer;
    display: block;
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(-20px, -20px);
`;

const PostList = styled.div`
  margin-top: 20px;
`;

const PostItem = styled.div`
  margin-bottom: 10px;
  font-size: 15px;
  & span {
    font-size: 12px;
    color: #5B5858;
  }
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/posting')
  };

  const myPosts = [
    { id: 1, title: '작성한 글 제목 1', date: '24.00.00' },
    { id: 2, title: '작성한 글 제목 2', date: '24.00.00' },
    { id: 3, title: '작성한 글 제목 3', date: '24.00.00' },
  ];

  return (
    <SidebarContainer>
      <WidgetWrap className='my-profile-widget'>
        <UserProfile>
            <UserProfileImg />
            <UserTitle>
                <UserName>닉네임</UserName>
                <UserEmail>example@gmail.com</UserEmail>
            </UserTitle>
        </UserProfile>
        <UserStats>게시글 작성: 20회</UserStats>
        <UserStats>댓글 작성: 20회</UserStats>
        <PostButton onClick={handleClick}>글쓰기</PostButton>
      </WidgetWrap>
      <WidgetWrap className='my-posts-widget'>
        <h3>내가 작성한 글</h3>
        <PostList>
            {myPosts.map(post => (
            <PostItem key={post.id}>{post.title} <br /><span>{post.date}</span></PostItem>
            ))}
        </PostList>
      </WidgetWrap>
    </SidebarContainer>
  );
};

export default Sidebar;