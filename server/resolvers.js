import { movies } from "./data.js";

export const resolvers = {
    Query: {
        movies: () => movies,
        movie: (parent, args) => {
            return movies.find((movie) => movie.id === args.id);
        },
        moviesByGenre: (parent, args) => {
            return movies.filter((movie) => movie.genre === args.genre);
        },
        moviesByTitle: (parent, args) => {
            return movies.filter((movie) =>
                movie.title.toLowerCase().includes(args.title.toLowerCase())
            );
        },
        topRatedMovies: (parent, args) => {
            return movies.filter((movie) => movie.rating >= args.minRating);
        },
        moviesSortedByYear: () => {
            return [...movies].sort((a, b) => b.releaseYear - a.releaseYear);
        },
    },

    Mutation: {
        addMovie: (parent, args) => {
            const movie = {
                id: (movies.length + 1).toString(),
                ...args.movie,
            };
            movies.push(movie);
            return movie;
        },
        updateMovie: (parent, args) => {
            const index = movies.findIndex((movie) => movie.id === args.id);
            if (index !== -1) {
                movies[index] = { ...movies[index], ...args.movie };
                return movies[index];
            }
            return null;
        },
        deleteMovie: (parent, args) => {
            const index = movies.findIndex((movie) => movie.id === args.id);
            if (index !== -1) {
                movies.splice(index, 1);
                return true;
            }
            return false;
        },
    },
};
