import React from 'react';
import styled from 'styled-components';
import { useLocation, Link } from 'react-router-dom';
import '../style.css';

const HeaderContainer = styled.header`
  background-color: var(--preset--color--base);
  border-bottom: 1px solid var(--preset--color--contrast-2);
`;

const HeaderInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  max-width: 1200px;
  margin: auto;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;

  img {
    height: 70px;
    cursor: pointer;
  }
`;

const Navigation = styled.nav`
  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    width: 100px;
    text-align: center;
    border-right: 1px solid var(--preset--color--contrast);
    font-size: 14px;

    &:last-child {
      border-right: unset;
    }
  }

  a {
    text-decoration: none;
    color: var(--preset--color--contrast);
    display: flex;
    align-items: center;
    place-content: center;

    & img {
      display: none;
      width: 12px;
      height: 12px;
      margin-right: 3px;
    }

    &.active {
      color: #000;
      & img {
        display: block;
      }
    }
  }
`;

const Header = () => {
  const location = useLocation();
  const path = location.pathname;
  const token = localStorage.getItem('accessToken');

  return (
    <HeaderContainer className={path || "main"}>
      <HeaderInner>
        <Logo>
          <Link to="/">
            <img src="/logo.png" alt="Logo" />
          </Link>
        </Logo>
        <Navigation>
          <ul>
            <li>
              <Link to="/" className={path === "/" ? "active" : ""}>
                홈
              </Link>
            </li>
            <li>
              <Link to="/search" className={path.startsWith('/search') ? "active" : ""}>
                <img alt="search icon" src="/search_icon.png" />찾기
              </Link>
            </li>
            <li>
              <Link to="/posting" className={path === "/posting" || path.startsWith('/post') ? "active" : ""}>
                포스팅
              </Link>
            </li>
            <li>
              <Link to={token ? "/mypage" : "/login"} className={path === "/mypage" || path === "/login" ? "active" : ""}>
                {token ? "마이페이지" : "로그인"}
              </Link>
            </li>
          </ul>
        </Navigation>
      </HeaderInner>
    </HeaderContainer>
  );
};

export default Header;