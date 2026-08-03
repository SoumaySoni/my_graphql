# Cinematheque — Movie GraphQL Database

A premium, responsive movie database application designed with a minimalist black-and-white (monochromatic) aesthetic. Built with a **React (Vite) frontend** and an **Apollo Server 4 + Express backend**.

## 📂 Project Structure

```
my_graphql/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── App.jsx         # Movie Explorer UI & Query logic
│   │   ├── index.css       # Premium monochromatic styles
│   │   └── graphql.js      # GraphQL POST query utilities
│   ├── index.html
│   └── package.json
│
└── server/                 # Apollo Server + Express Backend
    ├── data.js             # Local database storage
    ├── schema.js           # GraphQL type definitions
    ├── resolvers.js        # Query & Mutation resolvers
    ├── index.js            # Express app serving Apollo & React client
    └── package.json
```

---

## 🚀 Getting Started

### 1. Install Dependencies

Install all dependencies for both frontend and backend in one command from the root folder:

```bash
npm run install:all
```
*(This installs root devDependencies as well as nested client and server dependencies)*

### 2. Start the App

You can run the project in two ways from the root directory:

#### Option A: Development Mode (Concurrently runs server & client with auto-reload)
```bash
npm run dev
```
- GraphQL Server: `http://localhost:4000/graphql`
- React Client App: `http://localhost:5173/`

#### Option B: Unified Production Mode (Builds client & hosts it on the same server port)
```bash
npm start
```
- Both Client and GraphQL API: `http://localhost:4000/`

---

## 🎨 Monochromatic UI Design System

- **Minimalist Aesthetic**: Slate black and off-white palette inspired by modern dark themes.
- **Micro-Animations**: Hover scale transitions on cards, custom slider controls, focus rings, and modal animations.
- **Rich Interaction**: Live typing search, genre filter tags, rating filter slider, newest release sorter, and a modal drawer for adding new movies.
- **Full CRUD Capabilities**: Connects directly to our GraphQL queries (`moviesByTitle`, `moviesByGenre`, `topRatedMovies`, `moviesSortedByYear`) and mutations (`addMovie`, `deleteMovie`).
