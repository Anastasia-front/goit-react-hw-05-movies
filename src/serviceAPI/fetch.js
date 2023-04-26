const BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = '78844696e6f21da4f5b43c08b71ce0bd';

export async function getTrending() {
  const response = await fetch(
    `${BASE_URL}trending/movie/day?api_key=${API_KEY}`
  );

  return response.json();
}
export const getMovieById = async movieId => {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
  );

  return response.json();
};

export const getMovieCastById = async movieId => {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
  );

  return response.json();
};

export const getMovieReviewsById = async movieId => {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/reviews?api_key=${API_KEY}`
  );

  return response.json();
};

export async function getSearchByKeyWord(query) {
  const response = await fetch(
    `${BASE_URL}search/movie?api_key=${API_KEY}&query=${query}`
  );

  return response.json();
}
