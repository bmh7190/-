import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axiosInstance from '../utils/axiosInstance';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const Container = styled.div`
  max-width: 800px;
  margin: auto;
  margin-top: 40px;
  padding: 20px;
  background-color: var(--preset--color--base-2);
  border-radius: 5px;
  width: 100%;
  box-shadow: 0px 12px 16px 0 #888;
  box-sizing: border-box;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--preset--color--contrast);
  margin-bottom: 20px;
  margin-top: 20px;
`;

const BackButton = styled(Link)`
  font-size: 24px;
  text-decoration: none;
  color: black;
`;

const AuthorProfileImg = styled.img`
  width: 80px;
  height: 80px;
  background-color: #D9D9D9;
  border-radius: 50%;
`;

const PostTitleWrap = styled.div`
  flex: 1;
  & h1 {
    margin: unset;
    margin-bottom: 10px;
    font-size: 27px;
  }
`;

const PostInfoWrap = styled.div`
  display: flex;
  gap: 30px;
  & p {
    margin: unset;
    font-size: 14px;
    color: var(--preset--color--contrast);
  }
`;

const BookMarkIcon = styled.img`
  cursor: pointer;

  &.on {
    background-image: url("/bookmark-on.png");
  }
`;

const PostContent = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 20px;
  min-height: 300px;
  box-sizing: border-box;
`;

const Attachment = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;

  & img {
    width: 20px;
  }

  & p {
    margin: unset;
    font-size: 15px;
  }
`;

const PostControlBox = styled.div`
  margin-top: 20px;
  background-color: #F5FDFF;
  width: 100%;
  box-shadow: 0px 12px 16px 0 #888;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  bottom: 0;
  border-top: 1px solid var(--preset--color--contrast-2);
  text-align: -webkit-center;
`;

const PostcontrolBoxInner = styled.div`
  display: flex;
  max-width: 1200px;
  padding: 10px 20px;
  gap: 40px;
`;

const LikeWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  & img {
    width: 20px;
    height: 20px;
  }
`;

const CommentButtonWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  & img {
    width: 25px;
    height: 25px;
  }
`;

const SinglePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/blog/posts/${postId}/`);
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosInstance.get(`/blog/comments?postId=${postId}`);
        setCommentCount(response.data.length);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    fetchComments();
  }, [postId]);

  useEffect(() => {
    if (post) {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
      });
    }
  }, [post]);

  const handleCommentClick = () => {
    navigate(`/post/${postId}/comments`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading post</div>;
  }

  return (
    <>
      <Container>
        <BackButton onClick={() => navigate(-1)}>←</BackButton>
        <PostHeader>
          <AuthorProfileImg />
          <PostTitleWrap>
            <h1>{post.title}</h1>
            <PostInfoWrap>
              <p>{post.author}</p>
              <p>{new Date(post.created_at).toLocaleDateString()}</p>
            </PostInfoWrap>
          </PostTitleWrap>
          <BookMarkIcon width="40px" height="40px" src="/bookmark.png" />
        </PostHeader>
        <PostContent dangerouslySetInnerHTML={{ __html: post.content }} />
        {post.attachment && (
          <Attachment>
            <img alt='attachment icon' src='/attach.png'/>
            <p>{post.attachment}</p>
          </Attachment>
        )}
      </Container>
      <PostControlBox>
        <PostcontrolBoxInner>
          <LikeWrap>
            <img alt='like btn icon' src='/like-empty.png'/>
            <span>1,000</span>
          </LikeWrap>
          <CommentButtonWrap onClick={handleCommentClick}>
            <img alt='comment btn icon' src='/comment.png'/>
            <span>{commentCount}</span>
          </CommentButtonWrap>
        </PostcontrolBoxInner>
      </PostControlBox>
    </>
  );
};

export default SinglePost;