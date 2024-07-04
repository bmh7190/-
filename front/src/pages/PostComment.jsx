import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { API_BASE_URL } from '../config';
import axios from 'axios';

const Container = styled.div`
  max-width: 800px;
  margin: auto;
  margin-top: 40px;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  position: relative;
  justify-content: center;
`;

const BackButton = styled(Link)`
  font-size: 24px;
  text-decoration: none;
  color: black;
  position: absolute;
  left: 15px;
`;

const CommentCount = styled.h1`
  font-size: 24px;
  color: #444;

  & span {
    color: #3c66ba;
    cursor: pointer;
  }
`;

const CommentList = styled.div`
`;

const CommentItem = styled.div`
  display: flex;
  padding: 20px;
  border-bottom: 1px solid #ccc;

  &:last-child {
    border-bottom: none;
  }
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  background-color: #d9d9d9;
  border-radius: 50%;
  margin-right: 10px;
`;

const CommentContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Author = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const Date = styled.div`
  color: #888;
  font-size: 12px;
  margin-bottom: 10px;
`;

const Content = styled.div`
  font-size: 14px;
  color: #333;
`;

const WriteCommentButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #3c66ba;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #3457a1;
  }
`;

const CommentForm = styled.div`
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;
`;

const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #3c66ba;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #3457a1;
  }
`;

const PostComment = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    // 댓글 목록을 가져오는 함수
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/blog/comments?postId=${postId}`);
        setComments(response.data);
        setCommentCount(response.data.length);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleWriteCommentClick = () => {
    setIsCommentFormOpen(!isCommentFormOpen);
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post('http://solver.r-e.kr/blog/comments', {
        postId,
        content: newComment,
      });

      setComments([...comments, response.data]);
      setCommentCount(commentCount + 1);
      setNewComment('');
      setIsCommentFormOpen(false);
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton to={`/post/${postId}`}>←</BackButton>
        <CommentCount>댓글 <span>{commentCount}</span></CommentCount>
      </Header>
      <CommentList>
        {comments.map((comment) => (
          <CommentItem key={comment.id}>
            <Avatar />
            <CommentContent>
              <Author>{comment.author}</Author>
              <Date>{comment.date}</Date>
              <Content>{comment.content}</Content>
            </CommentContent>
          </CommentItem>
        ))}
      </CommentList>
      <WriteCommentButton onClick={handleWriteCommentClick}>댓글 쓰기</WriteCommentButton>
      <CommentForm isOpen={isCommentFormOpen}>
        <TextArea 
          value={newComment} 
          onChange={handleCommentChange} 
          placeholder="댓글을 입력하세요..." 
        />
        <SubmitButton onClick={handleCommentSubmit}>등록</SubmitButton>
      </CommentForm>
    </Container>
  );
};

export default PostComment;