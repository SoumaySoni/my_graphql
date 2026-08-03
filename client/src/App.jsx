import React, { useState, useEffect } from 'react';
import {
  fetchGraphQL,
  GET_MOVIES,
  GET_MOVIES_SORTED,
  GET_MOVIES_BY_TITLE,
  GET_MOVIES_BY_GENRE,
  GET_TOP_RATED_MOVIES,
  ADD_MOVIE,
  DELETE_MOVIE
} from './graphql';

const GENRES = ['ALL', 'ACTION', 'COMEDY', 'DRAMA', 'HORROR', 'SCI_FI', 'THRILLER'];

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [minRating, setMinRating] = useState(0);
  const [sortByYear, setSortByYear] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newMovie, setNewMovie] = useState({
    title: '',
    director: '',
    releaseYear: new Date().getFullYear(),
    genre: 'ACTION',
    rating: 8.0
  });

  // Fetch Movies depending on active filters
  const loadMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (searchQuery.trim() !== '') {
        data = await fetchGraphQL(GET_MOVIES_BY_TITLE, { title: searchQuery });
        setMovies(data.moviesByTitle);
      } else if (selectedGenre !== 'ALL') {
        data = await fetchGraphQL(GET_MOVIES_BY_GENRE, { genre: selectedGenre });
        setMovies(data.moviesByGenre);
      } else if (minRating > 0) {
        data = await fetchGraphQL(GET_TOP_RATED_MOVIES, { minRating: parseFloat(minRating) });
        setMovies(data.topRatedMovies);
      } else if (sortByYear) {
        data = await fetchGraphQL(GET_MOVIES_SORTED);
        setMovies(data.moviesSortedByYear);
      } else {
        data = await fetchGraphQL(GET_MOVIES);
        setMovies(data.movies);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever filters change
  useEffect(() => {
    loadMovies();
  }, [searchQuery, selectedGenre, minRating, sortByYear]);

  // Handle Form Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie(prev => ({
      ...prev,
      [name]: name === 'releaseYear' ? parseInt(value) : name === 'rating' ? parseFloat(value) : value
    }));
  };

  // Handle Create Movie
  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      await fetchGraphQL(ADD_MOVIE, { movie: newMovie });
      setShowModal(false);
      // Reset form
      setNewMovie({
        title: '',
        director: '',
        releaseYear: new Date().getFullYear(),
        genre: 'ACTION',
        rating: 8.0
      });
      // Refresh list
      loadMovies();
    } catch (err) {
      alert(`Error creating movie: ${err.message}`);
    }
  };

  // Handle Delete Movie
  const handleDeleteMovie = async (id) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      try {
        const data = await fetchGraphQL(DELETE_MOVIE, { id });
        if (data.deleteMovie) {
          loadMovies();
        } else {
          alert('Failed to delete movie.');
        }
      } catch (err) {
        alert(`Error deleting movie: ${err.message}`);
      }
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('ALL');
    setMinRating(0);
    setSortByYear(false);
  };

  return (
    <>
      <header>
        <div className="header-container">
          <h1>CINEMA<span>THEQUE</span></h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Movie
          </button>
        </div>
      </header>

      <main>
        {/* Controls Sidebar */}
        <aside className="controls-sidebar">
          <div className="control-group">
            <label className="control-label">Search Movies</label>
            <input
              type="text"
              placeholder="Type to search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedGenre('ALL');
                setMinRating(0);
                setSortByYear(false);
              }}
            />
          </div>

          <div className="control-group">
            <label className="control-label">Filter by Genre</label>
            <div className="genre-filters">
              {GENRES.map(g => (
                <button
                  key={g}
                  className={`genre-tag ${selectedGenre === g ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedGenre(g);
                    setSearchQuery('');
                    setMinRating(0);
                    setSortByYear(false);
                  }}
                >
                  {g.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="control-label">Minimum Rating</label>
              {minRating > 0 && <span className="rating-value">{minRating.toFixed(1)} ★</span>}
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={minRating}
              onChange={(e) => {
                setMinRating(parseFloat(e.target.value));
                setSearchQuery('');
                setSelectedGenre('ALL');
                setSortByYear(false);
              }}
            />
          </div>

          <div className="control-group" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <label className="control-label" style={{ cursor: 'pointer' }} htmlFor="sortCheckbox">
              Sort by Newest
            </label>
            <input
              id="sortCheckbox"
              type="checkbox"
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#ffffff' }}
              checked={sortByYear}
              onChange={(e) => {
                setSortByYear(e.target.checked);
                setSearchQuery('');
                setSelectedGenre('ALL');
                setMinRating(0);
              }}
            />
          </div>

          {(searchQuery || selectedGenre !== 'ALL' || minRating > 0 || sortByYear) && (
            <button className="btn btn-secondary" style={{ marginTop: '0.5rem' }} onClick={handleClearFilters}>
              Reset Filters
            </button>
          )}
        </aside>

        {/* Movie Grid Section */}
        <section className="movie-section">
          <div className="section-header">
            <h2 className="section-title">
              {searchQuery ? 'Search Results' : selectedGenre !== 'ALL' ? `${selectedGenre.replace('_', ' ')} Movies` : minRating > 0 ? `Rating ≥ ${minRating.toFixed(1)}` : sortByYear ? 'Newest Releases' : 'All Movies'}
            </h2>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {movies.length} {movies.length === 1 ? 'movie' : 'movies'} found
            </span>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Fetching movies from database...</p>
            </div>
          ) : error ? (
            <div className="empty-state" style={{ borderColor: 'var(--danger-color)' }}>
              <p style={{ color: 'var(--danger-color)' }}>Error: {error}</p>
              <button className="btn btn-secondary" onClick={loadMovies}>Retry</button>
            </div>
          ) : movies.length === 0 ? (
            <div className="empty-state">
              <p>No movies match your search or filter criteria.</p>
              <button className="btn btn-secondary" onClick={handleClearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="movie-grid">
              {movies.map(movie => (
                <article key={movie.id} className="movie-card">
                  <div className="movie-card-header">
                    <h3 className="movie-title">{movie.title}</h3>
                    <span className="movie-rating">{movie.rating.toFixed(1)} ★</span>
                  </div>
                  <div className="movie-meta">
                    <span className="movie-director">Directed by {movie.director}</span>
                    <span>Released in {movie.releaseYear}</span>
                  </div>
                  <div className="movie-card-footer">
                    <span className="movie-genre-badge">{movie.genre.replace('_', ' ')}</span>
                    <button className="btn-danger" onClick={() => handleDeleteMovie(movie.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Add Movie Modal */}
      <div className={`modal-overlay ${showModal ? 'active' : ''}`} onClick={() => setShowModal(false)}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3 className="modal-title">Add New Movie</h3>
            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
          </div>
          <form className="modal-form" onSubmit={handleCreateMovie}>
            <div className="form-group">
              <label className="control-label">Movie Title</label>
              <input
                type="text"
                name="title"
                required
                value={newMovie.title}
                onChange={handleInputChange}
                placeholder="e.g. Oppenheimer"
              />
            </div>
            <div className="form-group">
              <label className="control-label">Director</label>
              <input
                type="text"
                name="director"
                required
                value={newMovie.director}
                onChange={handleInputChange}
                placeholder="e.g. Christopher Nolan"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="control-label">Release Year</label>
                <input
                  type="number"
                  name="releaseYear"
                  required
                  min="1880"
                  max="2100"
                  value={newMovie.releaseYear}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label className="control-label">Rating (0-10)</label>
                <input
                  type="number"
                  name="rating"
                  required
                  min="0"
                  max="10"
                  step="0.1"
                  value={newMovie.rating}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="control-label">Genre</label>
              <select name="genre" value={newMovie.genre} onChange={handleInputChange}>
                {GENRES.filter(g => g !== 'ALL').map(g => (
                  <option key={g} value={g}>{g.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Movie
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
