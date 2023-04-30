import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SearchBox from 'components/SearchBox/SearchBox';
import { GoUp, Message } from './Movies.styled';
import { HiArrowUp } from 'react-icons/hi';
import { getSearchByKeyWord } from 'serviceAPI/fetch';
import MovieList from 'components/MovieList/MovieList';
import InfiniteScroll from 'react-infinite-scroll-component';
import { scrollPos, scrollTop, infiniteHeight, boxScroll } from 'utils/scroll';

const Movies = () => {
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const movieName = searchParams.get('query') ?? '';
  const [search, setSearch] = useState(searchParams.get('query') ?? '');
  const [hasMore, setHasMore] = useState(true);
  const [movie, setMovie] = useState([]);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    localStorage.setItem('scrollPos', 0);
  }, []);

  useEffect(() => {
    if (search === '') {
      return;
    }
    if (pages === 1) {
      async function fetchData() {
        try {
          getSearchByKeyWord(search, pages).then(info => {
            setMovie(info.results);
          });
        } catch (error) {
          setError(error);
        }
      }
      fetchData();
    }
    if (pages > 1) {
      async function fetchData() {
        try {
          getSearchByKeyWord(search, pages).then(info => {
            setMovie(i => [...i, ...info.results]);
          });
        } catch (error) {
          setError(error);
        }
      }
      fetchData();
    }
  }, [pages, search]);

  const handleSubmit = event => {
    event.preventDefault();
    setSearch(movieName);
    setPages(1);
  };

  const updateQueryString = query => {
    const nextParams = query !== '' ? { query } : {};
    setSearchParams(nextParams);
  };

  const fetchMoreData = () => {
    setPages(i => i + 1);
  };

  const reachTheEnd = () => {
    if (movie.length !== 0) {
      getSearchByKeyWord(search, pages).then(info => {
        if (movie.length === info.total_results) {
          setHasMore(false);
        }
      });
    }
  };
  reachTheEnd();

  const firstRender = movie.length === 0 && search === '' && movieName === '';
  const noResults =
    movie.length === 0 && pages === 1 && search !== '' && movieName !== '';
  const goodResponse = movie.length > 1 && movieName !== '';

  return (
    <>
      <SearchBox
        value={movieName}
        onChange={updateQueryString}
        onSubmit={handleSubmit}
      />
      {firstRender && (
        <Message>Find movie that you want to watch above...</Message>
      )}

      {goodResponse && (
        <InfiniteScroll
          dataLength={movie.length}
          next={fetchMoreData}
          style={{ overflow: 'auto' }}
          initialScrollY={JSON.parse(window.localStorage.getItem('scrollPos'))}
          height={infiniteHeight()}
          hasMore={hasMore}
          loader={<h4 style={{ textAlign: 'center' }}>Loading... </h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all ;D</b>
            </p>
          }
        >
          <MovieList movies={movie} onClick={() => scrollPos(boxScroll())} />
          {boxScroll() > 1000 && (
            <GoUp onClick={() => scrollTop()}>
              UP <HiArrowUp size={24} />
            </GoUp>
          )}
        </InfiniteScroll>
      )}

      {noResults && (
        <Message>Sorry, there are no movies with that name...</Message>
      )}

      {error !== null && (
        <Message>
          Something went wrong on API... The messege error `{error}`
        </Message>
      )}
    </>
  );
};

export default Movies;
