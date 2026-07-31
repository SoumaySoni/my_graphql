# Movie GraphQL API

A premium, lightweight GraphQL API built using **Apollo Server 4** and **Node.js** for managing a movie database. The project supports robust queries like search, filtering by genre, filtering by rating, sorting by release year, and full CRUD operations via mutations.

## 🚀 Features

- **Full CRUD Operations**: Create, Read, Update, and Delete movies.
- **Search**: Search movies by title (case-insensitive substring matching).
- **Filtering**: 
  - Filter movies by Genre (`ACTION`, `COMEDY`, `DRAMA`, `HORROR`, `SCI_FI`, `THRILLER`).
  - Filter movies by minimum rating.
- **Sorting**: Fetch movies sorted by release year (newest first).

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **GraphQL Engine**: Apollo Server (`@apollo/server`)
- **Server**: Standalone Apollo Server

---

## 🏃 Quick Start

### 1. Install Dependencies

Clone this repository or navigate to the project directory, then run:

```bash
npm install
```

### 2. Start the Server

Start the development server with auto-reload (using `nodemon` if installed):

```bash
npm run dev
# or if you don't have a dev script configured:
npx nodemon index.js
# or simply:
node index.js
```

The server will spin up and be available at:
👉 **`http://localhost:4000/`** (opens the Apollo Sandbox)

---

## 📊 GraphQL Schema

### Types & Enums

```graphql
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
```

### Queries

| Query | Return Type | Description |
| :--- | :--- | :--- |
| `movies` | `[Movie!]!` | Retrieve all movies in the database |
| `movie(id: ID!)` | `Movie` | Retrieve a single movie by its ID |
| `moviesByGenre(genre: Genre!)` | `[Movie!]!` | Get movies belonging to a specific genre |
| `moviesByTitle(title: String!)` | `[Movie!]!` | Search movies by title (case-insensitive) |
| `topRatedMovies(minRating: Float!)` | `[Movie!]!` | Retrieve movies with rating $\ge$ `minRating` |
| `moviesSortedByYear` | `[Movie!]!` | Retrieve movies sorted from newest to oldest |

### Mutations

| Mutation | Return Type | Description |
| :--- | :--- | :--- |
| `addMovie(movie: MovieInput!)` | `Movie!` | Add a new movie to the database |
| `updateMovie(id: ID!, movie: MovieInput!)` | `Movie` | Update details of an existing movie |
| `deleteMovie(id: ID!)` | `Boolean` | Delete a movie by its ID |

---

## 📝 Query & Mutation Examples

### 🔍 Search Movies by Title
```graphql
query SearchMovies {
  moviesByTitle(title: "knight") {
    id
    title
    director
    genre
    rating
  }
}
```

### 📈 Get Top Rated Movies
```graphql
query TopMovies {
  topRatedMovies(minRating: 8.5) {
    title
    rating
    releaseYear
  }
}
```

### 📅 Get Movies Sorted by Year (Newest First)
```graphql
query SortedMovies {
  moviesSortedByYear {
    title
    releaseYear
    director
  }
}
```

### ➕ Add a New Movie
```graphql
mutation CreateMovie {
  addMovie(movie: {
    title: "Oppenheimer"
    director: "Christopher Nolan"
    releaseYear: 2023
    genre: DRAMA
    rating: 8.9
  }) {
    id
    title
    genre
  }
}
```

### ✏️ Update a Movie
```graphql
mutation EditMovie {
  updateMovie(id: "1", movie: {
    title: "Inception (Special Edition)"
    director: "Christopher Nolan"
    releaseYear: 2010
    genre: SCI_FI
    rating: 8.9
  }) {
    id
    title
    rating
  }
}
```

### ❌ Delete a Movie
```graphql
mutation RemoveMovie {
  deleteMovie(id: "5")
}
```
