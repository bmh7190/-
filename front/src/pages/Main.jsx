import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const MContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin: 0 auto;
  align-items: center;
`;

const ContentContainer = styled.div`
  max-width: 800px;
  width: 100%;
  text-align: left;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const TitleText = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 2.2em;
  margin: 0;
  font-weight: bold;
`;

const Subtitle = styled.p`
  font-size: 1em;
  margin-bottom: 40px;
  color: #8A929B;
`;

const TitleImage = styled.img`
  width: 188px;
  height: 134px;
  margin-left: 10px;
`;

const PostsContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`;

const PostsContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 10px;
  background-color: #FBFDFF;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const Post = styled.h2`
  text-decoration: underline;
  font-size: 22px;
`;

const PostsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
`;

const PostList = styled.ul`
  padding: 0;
`;

const PostItem = styled.li`
  list-style-type: none;
  border: 1px solid #e9e9e9;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PostLink = styled(Link)`
  text-decoration: none;
  color: #000;
  &:hover {
    text-decoration: underline;
  }
`;

const PostTitle = styled.h3`
  margin: 0;
`;

const PostDescription = styled.p`
  margin: 5px 0 0 0;
  padding-right: 80px;
`;

const MoreButtonContainer = styled.div`
  margin-top: 20px;
  text-align: center;
  width: 100%;
`;

const MoreButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007BFF;
  color: #fff;
  border: none;
  border-radius: 5px;

  &:hover {
    background-color: #0056b3;
  }
`;

const SortButton = styled.button`
  padding: 6px 20px;
  font-size: 14px;
  cursor: pointer;
  background-color: #B5B5B4;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 5px;

  &:hover {
    background-color: #ddd;
  }
`;

const BookMarkIcon = styled.img`
  width: 40px;
  height: 40px;
  cursor: pointer;
  margin-left: 130px;
`;

const MainPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://solver.r-e.kr/blog/posts');
        setPosts(response.data.posts || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      }
    };

    const fetchBookmarks = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/bookmarks`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setBookmarks(response.data.bookmarks || []);
        } catch (error) {
          console.error('북마크 가져오기 실패', error);
        }
      }
    };

    fetchPosts();
    fetchBookmarks();
  }, []);

  const handleBookClick = async (index) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('로그인이 필요한 서비스입니다');
      navigate('/login');
      return;
    }

    const newBookmarks = bookmarks.map((bookmark, i) => (i === index ? !bookmark : bookmark));
    setBookmarks(newBookmarks);

    try {
      await axios.post('http://solver.r-e.kr/bookmarks', { bookmarks: newBookmarks }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('북마크 업데이트', error);
    }
  };

  const handleClick = () => {
    navigate('/search');
  };

  return (
    <MContainer>
      <ContentContainer>
        <TitleContainer>
          <TitleText>
            <Title>쉽고 편리한 코딩 공부,</Title>
            <Title style={{ marginTop: '10px' }}>함께 시작해보세요.</Title>
          </TitleText>
          <TitleImage src="mainpage.png" alt="/<>" />
        </TitleContainer>
        <Subtitle>
          백준 문제를 기록하고 함께 공유할 수 있어요!<br />
          내가 필요한 문제를 찾고 저장할 수도 있고 반응을 추가할 수도 있어요.
        </Subtitle>
        <PostsContainerWrapper>
          <PostsContainer>
            <PostsHeader>
              <Post>오늘의 글</Post>
              <SortButton>최신순 ▼</SortButton>
            </PostsHeader>
            <PostList>
              {posts.map((post, index) => (
                <PostItem key={post.id}>
                  <PostLink to={`/post/${post.id}`}>
                    <PostTitle>{post.title}</PostTitle>
                  </PostLink>
                  <PostDescription>{new Date(post.created_at).toLocaleDateString()}</PostDescription>
                  <BookMarkIcon
                    src={bookmarks[index] ? "/bookmark-on.png" : "/bookmark.png"}
                    onClick={() => handleBookClick(index)}
                  />
                </PostItem>
              ))}
            </PostList>
          </PostsContainer>
          <MoreButtonContainer>
            <MoreButton onClick={handleClick}>더 많은 글 찾으러가기</MoreButton>
          </MoreButtonContainer>
        </PostsContainerWrapper>
      </ContentContainer>
    </MContainer>
  );
};

export default MainPage;