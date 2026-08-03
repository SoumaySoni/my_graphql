export const typeDefs = `#graphql

  enum Genre {
    ACTION
    COMEDY
    DRAMA
    HORROR
    SCI_FI
    THRILLER
  }

  type Movie {
    id: ID!
    title: String!
    director: String!
    releaseYear: Int!
    genre: Genre!
    rating: Float!
  }

  input MovieInput {
    title: String!
    director: String!
    releaseYear: Int!
    genre: Genre!
    rating: Float!
  }

  type Query {
    movies: [Movie!]!
    movie(id: ID!): Movie
    moviesByGenre(genre: Genre!): [Movie!]!
    moviesByTitle(title: String!): [Movie!]!
    topRatedMovies(minRating: Float!): [Movie!]!
    moviesSortedByYear: [Movie!]!
  }

  type Mutation {
    addMovie(movie: MovieInput!): Movie!
    updateMovie(id: ID!, movie: MovieInput!): Movie
    deleteMovie(id: ID!): Boolean
  }

`;
