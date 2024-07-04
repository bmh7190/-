import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileContainer = styled.div`
    height:80vh;
    position: absolute;
    left: 60%;
    transform: translateX(-60%);
    display: flex;
    flex-direction: row;
`;
const ProfileCardContainer = styled.div`
    width: 470px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0px 5px 15px 0px #888;
    border-radius: 30px;
    background-color: #FBFDFF;
    margin-top: 30px;
`;
const ProfileBox = styled.div`
    display: flex;
    justify-content: center;
`;
const ImgBox = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    margin-right: 25px;
`;
const ProfileImg = styled.img`
    background-color: lightgrey;
    width: 200px;
    height: 200px;
    object-fit: cover;
`;
const ImgButton = styled.button`
    width: 70px;
    height: 20px;
    margin-top: 15px;
    border-radius: 50px;
    border-style: none;
    font-size: 10px;
    background-color: #B8C5D4;
    color: white;
    cursor: pointer;
    box-shadow: 0px 1px 5px 0px #888;
`;
const HiddenFileInput = styled.input`
  display: none;
`;
const TextBox = styled.div`
    display: flex;
    flex-direction: column;
`;
const NameBox = styled.div`
    display:flex;
    flex-direction: row;
`;
const UserName = styled.h2`
    display:flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    margin-bottom: 29px;
    width: 100px;
`;
const ButtonBox = styled.div`
    display: flex;
    align-items: baseline;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 0;
`;
const NameButton1 = styled.button`
    text-align: center;
    width: 40px;
    height: 15px;
    border-radius: 50px;
    border-style: none; 
    font-size: 10px;
    padding:0;
    background-color: #B8C5D4;
    cursor: pointer;
    box-shadow: 0px 1px 5px 0px #888;
`;
const NameBuuton2 = styled.button`
    text-align: center;
    width: 40px;
    height: 15px;
    border-radius: 50px;
    border-style: none;
    font-size: 10px;
    margin-left: 5px;
    background-color: #B8C5D4;
    cursor: pointer;
    box-shadow: 0px 1px 5px 0px #888;
`;
const UserEmail = styled.p`
    margin-top: 0;
    word-wrap: break-word;
`;
const UserState = styled.p`
    margin: 0;
`;
const BookMarkBox = styled.div`
    display: flex;
    flex-direction: column;
    margin: 30px;
    height: 300px;
    overflow-y: auto;
`;
const ContentsList = styled.div`
    
`
const ButtonBox2 = styled.div`
    display: flex;
    align-items: flex-start;
`;
const BookMarkButton = styled.button`
    width: 150px;
    height: 35px;
    margin-top: 15px;
    border-radius: 10px 0px 0px 10px;
    border-style: none;
    font-size: 15px;
    background-color: ${props => (props.isActive ? '#90A5CD' : '#C7CBD1')};
    color: white;
    cursor: pointer;
    box-shadow: 0px 1px 5px 0px #888;
    &:hover{
        background-color: #90A5CD;
    }
`;

const CommentButton = styled.button`
    width: 150px;
    height: 35px;
    margin-top: 15px;
    border-radius: 0px 10px 10px 0px;
    border-style: none;
    font-size: 15px;
    background-color: ${props => (props.isActive ? '#90A5CD' : '#C7CBD1')};
    color: white;
    cursor: pointer;
    box-shadow: 0px 1px 5px 0px #888;
    &:hover{
        background-color: #90A5CD;
    }
`;
const PostContainer = styled.div`
    width: 400px;
    margin: 30px;
    margin-left: 100px;
    margin-right: 0;
`;
const PostContainerTitle = styled.p`
    display :inline-block;
    background-color: #90A5CD;
    color:white;
    border-radius: 10px;
    padding: 5px;
    font-size: 17px;
`;
const PostCardBox = styled.div`
    margin: 20px;
    margin-left: 0;
`;
const PostCardTitle = styled.h2`
    font-weight: bold;
    margin: 0;
    cursor: pointer;
`;
const PostCardDate = styled.p`
    margin: 0;
    color: #5B5858;
    font-size: small;
`;
const UserNameInput = styled.input`
    font-size: 23px;
    margin-top: 20px;
    margin-bottom: 30px;
    border-radius: 5px;
    border: 1px solid #B8C5D4;
    width: 90px;
    word-wrap: break-word;
`;
const MyPage = () => {
    const [MyPosts, setMyPosts] = useState([
        { id: 1, title: '내가 작성한 게시물 제목1', date: '24.00.00' },
        { id: 2, title: '내가 작성한 게시물 제목2', date: '24.00.00' },
        { id: 3, title: '내가 작성한 게시물 제목3', date: '24.00.00' },  
    ]);

    const [MyBookMark, setMyBookMark] = useState([
        { id: 1, title: '북마크한 게시물1', date: '24.00.00' },
        { id: 2, title: '북마크한 게시물2', date: '24.00.00' },
        { id: 3, title: '북마크한 게시물3', date: '24.00.00' },
    ]);

    const [MyComment, setMyComment] = useState([
        { id: 1, title: '댓글 작성한 게시물1', text: '안녕하세요~', date: '24.00.00' },
        { id: 2, title: '댓글 작성한 게시물2', text: '글 잘보고 갑니다 뭐 어쩌고 저쩌고 내용은 이해가 잘 안가요', date: '24.00.00' },
        { id: 3, title: '댓글 작성한 게시물3', text: '브2!', date: '24.00.00' },
    ]);

    const [activeTab, setActiveTab] = useState('posts');

    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [userName, setUserName] = useState('닉네임');
    const [newUserName, setNewUserName] = useState(userName);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        axios
          .get('내가 작성한 게시물')
          .then(res => {
            setMyPosts(res.data);
          })
          .catch(e => {
            console.log(e);
          });
    }, []);  

    useEffect(() => {
        axios
          .get('북마크한 게시물')
          .then(res => {
            setMyBookMark(res.data);
          })
          .catch(e => {
            console.log(e);
          });
    }, []);  

    useEffect(() => {
        axios
          .get('작성한 댓글')
          .then(res => {
            setMyComment(res.data);
          })
          .catch(e => {
            console.log(e);
          });
    }, []);  

    const handlePostClick = (postId) => {
        navigate(`/Post/${postId}`);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setUserName(newUserName);
        setIsEditing(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(URL.createObjectURL(file));
    };

    const handleButtonClick = () => {
        document.getElementById('file').click();
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <ProfileContainer>
            <ProfileCardContainer>
                <ProfileBox>
                    <ImgBox>
                        <ProfileImg src={selectedImage} alt=" " />
                        <ImgButton onClick={handleButtonClick}>사진 수정</ImgButton>
                        <HiddenFileInput
                            type="file"
                            id="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </ImgBox>
                    <TextBox>
                        <NameBox>
                            <ButtonBox>
                                {isEditing ? (
                                    <UserNameInput 
                                    value={newUserName} onChange={(e) => setNewUserName(e.target.value)}/>
                                ) : ( <UserName>{userName}</UserName>)}
                                {isEditing ? (
                                    <NameBuuton2 onClick={handleSaveClick}>완료</NameBuuton2>
                                ) : ( <NameButton1 onClick={handleEditClick}>수정</NameButton1> )}
                            </ButtonBox>
                        </NameBox>
                        <UserEmail>example@gmail.com</UserEmail>
                        <UserState>글 작성 : 20회</UserState>
                        <UserState>댓글 작성 : 20회</UserState>
                    </TextBox>
                </ProfileBox>
                <BookMarkBox>
                    <ButtonBox2>
                        <BookMarkButton 
                            isActive={activeTab === 'bookmarks'} onClick={() => handleTabClick('bookmarks')}>
                            북마크한 글
                        </BookMarkButton>
                        <CommentButton 
                            isActive={activeTab === 'comments'} onClick={() => handleTabClick('comments')}>
                            내가 쓴 댓글
                        </CommentButton>
                    </ButtonBox2>
                    {activeTab === 'bookmarks' && (
                        <ContentsList>
                            {MyBookMark.map((post) => (
                                <PostCardBox key={post.id} onClick={() => handlePostClick(post.id)}>
                                    <p>{post.title}</p>
                                    <p>{post.date}</p>
                                </PostCardBox>
                            ))}
                        </ContentsList>
                    )}
                    {activeTab === 'comments' && (
                        <ContentsList>
                            {MyComment.map((comment) => (
                                <PostCardBox key={comment.id} onClick={() => handlePostClick(comment.id)}>
                                    <p>{comment.title}</p>
                                    <p>{comment.text}</p>
                                    <p>{comment.date}</p>
                                </PostCardBox>
                            ))}
                        </ContentsList>
                    )}
                </BookMarkBox>
            </ProfileCardContainer>
            <PostContainer>
                <PostContainerTitle>내가 쓴 글 살펴보기</PostContainerTitle>
                {MyPosts.map(post => (
                    <PostCardBox 
                    key={post.id} onClick={() => handlePostClick(post.id)}>
                        <PostCardTitle>{post.title}</PostCardTitle> 
                        <PostCardDate>{post.date}</PostCardDate>
                    </PostCardBox>
                ))}
            </PostContainer>
        </ProfileContainer>
    );
};

export default MyPage;
