import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

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
    justify-content: center;
    box-shadow: 0px 5px 15px 0px #888;
    border-radius: 30px;
    background-color: #FBFDFF;
    margin-top: 20px;
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
    border-radius: 50%;
`;

const ImgButtonBox = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ImgButton = styled.button`
    width: 70px;
    height: 20px;
    margin-top: 15px;
    border-radius: 50px;
    border-style: none;
    font-size: 10px;
    background-color: #B8C5D4;
    color: #000000;
    cursor: pointer;
    box-shadow: 0px 1px 5px 0px #888;
`;

const LogOutButton = styled.button`
    width: 70px;
    height: 20px;
    margin-top: 15px;
    border-radius: 50px;
    border-style: none;
    font-size: 10px;
    background-color: #ffffff;
    color: #000000;
    cursor: pointer;
    box-shadow: 0px 1px 5px 0px #888;
    position: absolute;
    bottom: 0;
    right: 0;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const TextBox = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    padding-bottom: 40px;
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
    width: 150px;
`;

const UserState = styled.p`
    margin: 0;
    width: 150px;
`;

const BookMarkBox = styled.div`
    display: flex;
    flex-direction: column;
    margin: 30px;
    height: 200px;
    overflow-y: auto;
`;

const ContentsList = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 15px;
`;

const ButtonBox2 = styled.div`
    display: flex;
    align-items: flex-start;
    margin-left: 30px;
    margin-top: 20px;
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

const ListPostBox = styled.div`
    margin: 0;
    padding: 0;
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
    font-size: 15px;
`;

const PostCardBox = styled.div`
    margin: 20px;
    margin-left: 0;
`;

const PostCardTitle = styled.h2`
    font-weight: bold;
    margin: 0;
    cursor: pointer;
    color: #525252;
`;

const PostDate = styled.p`
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
    const [MyPosts, setMyPosts] = useState([]);
    const [MyBookMark, setMyBookMark] = useState([]);
    const [MyComment, setMyComment] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [userName, setUserName] = useState('닉네임');
    const [newUserName, setNewUserName] = useState(userName);
    const [selectedImage, setSelectedImage] = useState('/defaultImage.png');

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            navigate('/login');
        } else {
            axios
                .get(`${API_BASE_URL}/blog/posts?isMine=true`, {
                    params: {
                        isMine: true,
                        SortBy: 'latest',
                        PerPages: 10,
                    }
                })
                .then(res => {
                    setMyPosts(res.data.posts);
                })
                .catch(e => {
                    console.log(e);
                });

            axios
                .get(`${API_BASE_URL}/bookmarks`)
                .then(res => {
                    setMyBookMark(res.data);
                })
                .catch(e => {
                    console.log(e);
                });

            axios
                .get(`${API_BASE_URL}/comments`)
                .then(res => {
                    setMyComment(res.data);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }, [navigate]);

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
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const handleButtonClick = () => {
        document.getElementById('file').click();
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleLogoutClick = async () => {
        try {
            await axios.get(`${API_BASE_URL}/users/logout`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/login');
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    return (
        <ProfileContainer>
            <ProfileCardContainer>
                <ProfileBox>
                    <ImgBox>
                        <ProfileImg src={selectedImage} alt=" " />
                        <ImgButtonBox>
                            <ImgButton onClick={handleButtonClick}>사진 수정</ImgButton>
                            <HiddenFileInput
                                type="file"
                                id="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </ImgButtonBox>
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
                        <LogOutButton onClick={handleLogoutClick}>로그아웃 </LogOutButton>
                    </TextBox>
                </ProfileBox>
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
                <BookMarkBox>
                    {activeTab === 'bookmarks' && (
                        <ContentsList>
                            {MyBookMark.length > 0 ? (
                            MyBookMark.map((post) => (
                                <ListPostBox key={post.id} onClick={() => handlePostClick(post.id)}>
                                    <p>{post.title}</p>
                                    <PostDate>{post.date}</PostDate>
                                </ListPostBox>
                            ))): (
                                <div>No posts found</div> // 조건을 만족하지 않을 때 렌더링할 내용
                            )
                            }
                        </ContentsList>
                    )}
                    {activeTab === 'comments' && (
                        <ContentsList>
                            {MyComment.length > 0 ? (
                            MyComment.map((comment) => (
                                <ListPostBox key={comment.id} onClick={() => handlePostClick(comment.id)}>
                                    <p>{comment.title}</p>
                                    <p>{comment.comments}</p>
                                    <PostDate>{comment.date}</PostDate>
                                </ListPostBox>
                            ))): (
                                <div>No comments found</div> // 조건을 만족하지 않을 때 렌더링할 내용
                            )
                            }
                        </ContentsList>
                    )}
                </BookMarkBox>
            </ProfileCardContainer>
            <PostContainer>
                <PostContainerTitle>내가 쓴 글 살펴보기</PostContainerTitle>
                {MyPosts.length > 0 ? (
                MyPosts.map(post => (
                    <PostCardBox 
                    key={post.id} onClick={() => handlePostClick(post.id)}>
                        <PostCardTitle>{post.title}</PostCardTitle> 
                        <PostDate>{post.date}</PostDate>
                    </PostCardBox>
                ))): (
                    <div>No posts found</div> // 조건을 만족하지 않을 때 렌더링할 내용
                )
                }
            </PostContainer>
        </ProfileContainer>
    );
};

export default MyPage;