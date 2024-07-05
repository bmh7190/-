import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/github.css';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import xml from 'highlight.js/lib/languages/xml';
import axiosInstance from '../utils/axiosInstance';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('xml', xml);

const GlobalStyle = createGlobalStyle`
  body {
    overflow: ${({ isDimmed }) => (isDimmed ? 'hidden' : 'auto')};
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  margin-top: 40px;
`;

const SubContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const Content = styled.div`
  flex: 2;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const PostContainer = styled.div`
  flex: 1;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const QuillWrapper = styled.div`
  .ql-editor {
    min-height: 300px;
  }
`;

const FileInput = styled.input`
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #ccc;
  color: #000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: #bbb;
  }
`;

const ToggleButton = styled(Button)`
  background-color: ${({ active }) => (active ? '#007BFF' : '#ff9999')};
  color: #fff;

  &:hover {
    background-color: ${({ active }) => (active ? '#0056b3' : '#ff6666')};
  }
`;

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dialog = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const DialogTitle = styled.h2`
  margin-top: 0;
`;

const DialogButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const DialogButton = styled(Button)`
  background-color: #007BFF;
  color: #fff;

  &:hover {
    background-color: #0056b3;
  }
`;

const modules = {
  syntax: {
    highlight: (text) => hljs.highlightAuto(text).value,
  },
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean'],
    ['code-block'],
  ],
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video', 'code-block'
];

const Posting = () => {
  const userID = Number(localStorage.getItem('userID'));

  console.log("user id : " + userID);

  const [Public, setPublic] = useState(true);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [solutionNumber, setSolutionNumber] = useState('');
  const [link, setLink] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDialogVisible(true);
  };

  const handleDialogConfirm = async () => {
    setIsDialogVisible(false);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('tag_id', category);
      formData.append('number', solutionNumber);
      formData.append('link', link);
      formData.append('public', Public ? "True" : "False");
      formData.append('user_id', userID);

      if (file) {
        formData.append('file', file);
      }

      const response = await axiosInstance.post('/blog/posts/', formData);

      if (response.status === 201) {
        const postId = response.data; // assuming the response contains the post ID
        navigate(`/post/${postId}`); // redirect to the post details page
      } else {
        console.error('포스트 등록 실패');
      }
    } catch (error) {
      console.error('포스트 등록 에러:', error);
    }
  };

  const handleDialogCancel = () => {
    setIsDialogVisible(false);
  };

  return (
    <>
      <GlobalStyle isDimmed={isDialogVisible} />
      <Container>
        <SubContainer>
          <Sidebar />
          <Content>
            <PostContainer>
              <h2>글쓰기</h2>
              <Form onSubmit={handleSubmit}>
                <Label htmlFor="title">제목</Label>
                <Input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력해주세요."
                  required
                />
                <Label htmlFor="category">카테고리 선택</Label>
                <Input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="문제 유형 카테고리를 입력해 주세요."
                  required
                />
                <Label htmlFor="solutionNumber">번호 입력</Label>
                <Input
                  type="text"
                  id="solutionNumber"
                  value={solutionNumber}
                  onChange={(e) => setSolutionNumber(e.target.value)}
                  placeholder="작성하는 문제의 번호만 입력해주세요."
                  required
                />
                <Label htmlFor="link">링크 입력</Label>
                <Input
                  type="text"
                  id="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="문제 링크를 입력해 주세요."
                  required
                />
                <Label htmlFor="content">내용을 입력해 주세요.</Label>
                <QuillWrapper>
                  <ReactQuill
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                  />
                </QuillWrapper>
                <FileInput type="file" onChange={handleFileChange} />
                <ButtonContainer>
                  <ToggleButton
                    type="button"
                    active={Public}
                    onClick={() => setPublic(!Public)}
                  >
                    {Public ? '공개' : '비공개'}
                  </ToggleButton>
                  <Button type="submit">등록</Button>
                </ButtonContainer>
              </Form>
            </PostContainer>
          </Content>
        </SubContainer>
      </Container>

      {isDialogVisible && (
        <DialogOverlay>
          <Dialog>
            <DialogTitle>상세정보</DialogTitle>
            <p>글을 등록하시겠습니까?</p>
            <DialogButtonContainer>
              <DialogButton onClick={handleDialogConfirm}>확인</DialogButton>
              <Button onClick={handleDialogCancel}>취소</Button>
            </DialogButtonContainer>
          </Dialog>
        </DialogOverlay>
      )}
    </>
  );
};

export default Posting;