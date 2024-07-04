import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import MainPage from './pages/Main';
import Posting from './pages/Posting';
import Search from './pages/search/Search';
import MyPage from './pages/Mypage';
import SinglePost from './pages/SinglePost';
import PostComment from './pages/PostComment';
import Login from './pages/Login';
import EmailLogin from './pages/EmailLogin';
import RegisterForm from './pages/RegisterForm';


const App = () => {
  return (
    <Router>
      <Header></Header>
      <main>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/posting" element={<Posting />}  />
          <Route path="/search/*" element={<Search />} />
          <Route path="/post/:postId" element={<SinglePost />} />
          <Route path="/post/:postId/comments" element={<PostComment />} />
          <Route path="/posting" />
          <Route path="/mypage" element={<MyPage/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/email-login" element={<EmailLogin />} />
          <Route path="/registerform" element={<RegisterForm />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;