import React from "react";
import styled from "styled-components";
import { useLocation, Link } from "react-router-dom";
import '../style.css';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: var(--preset--color--base);
  border-bottom: 1px solid var(--preset--color--contrast-2);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;

  img {
    height: 70px;
    margin-left: 150px;
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
  return (
    <HeaderContainer className={path || "main"}>
      <Logo>
        <Link to="/">
          <img src="/logo.png" alt="Logo" />
        </Link>
      </Logo>
      <Navigation>
        <ul>
          <li>
            <a href="/" className={path === "/" ? "active" : ""}>
              홈
            </a>
          </li>
          <li>
            <a href="/search" className={location.pathname.startsWith('/search') ? "active" : ""}>
              <img alt="search icon" src="/search_icon.png" />찾기
            </a>
          </li>
          <li>
            <a href="/posting" className={path === "/posting" ? "active" : ""}>
              포스팅
            </a>
          </li>
          <li>
            <a href="/mypage" className={path === "/mypage" ? "active" : ""}>
              마이페이지
            </a>
          </li>
        </ul>
      </Navigation>
    </HeaderContainer>
  );
};

export default Header;
