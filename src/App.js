import React, { useState } from "react";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const searchMovies = (e) => {
    e.preventDefault();
    const url = `https://www.omdbapi.com/?s=${search}&apikey=4a3b711b`;

    fetch(url)
      .then((response) => response.json())
      .then(async (data) => {
        if (data.Search) {
          const moviesWithPosters = await Promise.all(
            data.Search.map(async (movie) => {
              const moviessUrl = `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=4a3b711b`;
              const moviesResponse = await fetch(moviessUrl);
              const moviesData = await moviesResponse.json();
              return {
                ...movie,
                Poster: moviesData.Poster,
              };
            })
          );
          setMovies(moviesWithPosters);
          setErrorMessage("");
        } else {
          setMovies([]);
          setErrorMessage("No movies found.");
        }
      })
      .catch((error) => {
        console.error("Error :", error);
        setMovies([]);
        setErrorMessage("Error fetching . Please try again.");
      });
  };

  return (
    <div className="App">
      <h1>Movie Finder</h1>

      <form onSubmit={searchMovies}>
        <input
          type="text"
          placeholder="Search for a movie"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="submit">Search</button>
      </form>

      <div>
        {errorMessage && <p>{errorMessage}</p>}
        {movies.length > 0 && (
          <ul>
            {movies.map((movie) => (
              <li key={movie.imdbID}>
                <img
                  src={
                    movie.Poster !== "N/A" ? movie.Poster : "placeholder.png"
                  }
                  alt={movie.Title}
                />
                <div>
                  <h2>{movie.Title}</h2>
                  <p>{movie.Year}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
