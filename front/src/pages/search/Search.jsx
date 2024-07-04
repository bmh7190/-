import React, { useState, useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import SinglePost from '../SinglePost';
import PostComment from '../PostComment';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  margin-top: 40px;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 60px;
`;

const MainContent = styled.div`
  display: flex;
  padding: 0 20px;
  flex-direction: column;
  align-items: center;
  flex: 1;
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const SearchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;
`;

const SearchBox = styled.div`
  display: flex;
  flex: 1;
  margin-right: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px 0 0 5px;
  height: 40px;
  box-sizing: border-box;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 0 5px 5px 0;
  background-color: #f5f5f5;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const FilterButton = styled.div`
  position: relative;
`;

const FilterButtonStyled = styled.button`
  width: 100px;
  height: 40px;
  border: 1px solid #C4C4C4;
  border-radius: 5px;
  padding: 12px 14px;
  font-size: 12px;
  background-size: 12px 8px;
  cursor: pointer;
  background-color: #fff;
  &.click {
    background-color: #e0e0e0;
  }
`;

const FilterList = styled.ul`
  margin-top: 10px;
  background-color: #fff;
  position: absolute;
  top: 40px;
  left: 0;
  width: 100px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  list-style: none;
  margin: 0;
  padding: 0;
  margin-top: 10px;
  box-sizing: border-box;
`;

const FilterListItem = styled.li`
  width: 100%;
`;

const FilterListItemButton = styled.button`
  display: block;
  width: 100%;
  background-color: unset;
  border: none;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: var(--preset--color--accent-2);
  }
`;

const SearchResultList = styled.ul`
  width: 100%;
  max-width: 1200px;
  list-style: none;
  padding: 0;
  margin: 0;

  & a {
    text-decoration: unset;
  }
`;

const SearchResultItem = styled.li`
  display: flex;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
  background-color: #fff;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f9f9f9;
  }

  & a {
    flex: 1;
  }
`;

const BookMarkIcon = styled.img`
  cursor: pointer;

  &.on {
    background-image: url("/bookmark-on.png");
  }
`;

const PostTitle = styled.h2`
  font-size: 18px;
  color: #333;
  margin: 0 0 10px 0;
`;

const PostMeta = styled.div`
  font-size: 14px;
  color: #777;
  text-decoration: none;
`;

const SearchResults = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('관련도순');
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, [selectedFilter]); // selectedFilter가 변경될 때마다 fetchPosts를 호출

  const fetchPosts = async () => {
    try {
      const filterMap = {
        '관련도순': 'relevance',
        '최신순': 'latest',
        '오래된순': 'older'
      };
      const filterValue = filterMap[selectedFilter];
      const response = await axios.get(`${API_BASE_URL}/blog/posts`, {
        params: {
          SearchTerm: searchTerm,
          SortBy: filterValue,
        },
      });
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const selectFilter = (filter) => {
    setSelectedFilter(filter);
    setIsFilterOpen(false);
  };

  return (
  <SearchContainer>
    <Sidebar />
    <MainContent>
      <SearchWrapper>
        <SearchHeader>
          <SearchBox>
            <Input
                type="text"
                placeholder="검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button onClick={handleSearch}>검색</Button>
          </SearchBox>
          <FilterButton>
            <FilterButtonStyled
              className={`btn-select ${isFilterOpen ? 'click' : ''}`}
              onClick={toggleFilter}
            >
              {selectedFilter}
            </FilterButtonStyled>
            <FilterList $isOpen={isFilterOpen} className="list-member">
            <FilterListItem>
                <FilterListItemButton onClick={() => selectFilter('관련도순')}>관련도순</FilterListItemButton>
              </FilterListItem>
              <FilterListItem>
                <FilterListItemButton onClick={() => selectFilter('최신순')}>최신순</FilterListItemButton>
              </FilterListItem>
              <FilterListItem>
                <FilterListItemButton onClick={() => selectFilter('오래된순')}>오래된순</FilterListItemButton>
              </FilterListItem>
            </FilterList>
          </FilterButton>
        </SearchHeader>
        <SearchResultList>
            {
              posts.length > 0 ? (
              posts.map((post) => (
                <SearchResultItem key={post.id}>
                  <Link to={`/post/${post.id}`}>
                    <PostTitle>{post.title}</PostTitle>
                    <PostMeta>{new Date(post.created_at).toLocaleDateString()}</PostMeta>
                  </Link>
                  <BookMarkIcon width="40px" height="40px" src="/bookmark.png" />
                </SearchResultItem>
              ))
              ): (
                <div>No posts found</div> // 조건을 만족하지 않을 때 렌더링할 내용
              )
            }
          </SearchResultList>
      </SearchWrapper>
    </MainContent>
  </SearchContainer>
  );
};

const Search = () => {
  return (
    <Container>
      <Routes>
        <Route path="/" element={<SearchResults />} />
        <Route path="/post/:postId" element={<SinglePost />} />
        <Route path="/post/:postId/comments" element={<PostComment />} />
      </Routes>
    </Container>
  );
};

export default Search;