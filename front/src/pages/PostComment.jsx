import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';

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

const comments = [
  { id: 1, author: '아무개왈', content: '안녕하세요~', date: '24.00.00(업로드일)' },
  { id: 2, author: '아무개왈2', content: '글 잘보고 갑니다 뭐 어쩌고 저쩌고 내용은 이해가 잘 안가요', date: '24.00.00(업로드일)' },
  { id: 3, author: '아무개왈3', content: '브2!', date: '24.00.00(업로드일)' },
  { id: 4, author: '아무개왈4', content: '좋은 글 감사합니다!', date: '24.00.00(업로드일)' },
];

const PostComment = () => {
  const { postId } = useParams();
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);

  const handleWriteCommentClick = () => {
    setIsCommentFormOpen(!isCommentFormOpen);
  };

  return (
    <Container>
      <Header>
        <BackButton to={`/post/${postId}`}>←</BackButton>
        <CommentCount>댓글 <span>12</span></CommentCount>
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
        <TextArea placeholder="댓글을 입력하세요..." />
        <SubmitButton>등록</SubmitButton>
      </CommentForm>
    </Container>
  );
};

export default PostComment;