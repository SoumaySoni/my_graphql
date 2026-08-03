export async function fetchGraphQL(query, variables = {}) {
    const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    const result = await response.json();
    if (result.errors) {
        throw new Error(result.errors[0].message);
    }
    return result.data;
}

export const GET_MOVIES = `
  query GetMovies {
    movies {
      id
      title
      director
      releaseYear
      genre
      rating
    }
  }
`;

export const GET_MOVIES_SORTED = `
  query GetMoviesSorted {
    moviesSortedByYear {
      id
      title
      director
      releaseYear
      genre
      rating
    }
  }
`;

export const GET_MOVIES_BY_TITLE = `
  query GetMoviesByTitle($title: String!) {
    moviesByTitle(title: $title) {
      id
      title
      director
      releaseYear
      genre
      rating
    }
  }
`;

export const GET_MOVIES_BY_GENRE = `
  query GetMoviesByGenre($genre: Genre!) {
    moviesByGenre(genre: $genre) {
      id
      title
      director
      releaseYear
      genre
      rating
    }
  }
`;

export const GET_TOP_RATED_MOVIES = `
  query GetTopRatedMovies($minRating: Float!) {
    topRatedMovies(minRating: $minRating) {
      id
      title
      director
      releaseYear
      genre
      rating
    }
  }
`;

export const ADD_MOVIE = `
  mutation AddMovie($movie: MovieInput!) {
    addMovie(movie: $movie) {
      id
      title
      director
      releaseYear
      genre
      rating
    }
  }
`;

export const DELETE_MOVIE = `
  mutation DeleteMovie($id: ID!) {
    deleteMovie(id: $id)
  }
`;
