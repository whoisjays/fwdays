import { useEffect, useState } from "react";
import "./App.css";

type Movie = {
  id: string;
  title: string;
  year: number;
  createdAt: string;
};

type MoviePayload = {
  title: string;
  year: number;
};

const API_URL =
  "https://rcixoyx3rb.execute-api.eu-north-1.amazonaws.com/prod/movies";

const initialMovies: Movie[] = [];

async function fetchMoviesRequest(): Promise<Movie[]> {
  const response = await fetch(API_URL, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = (await response.json()) as Movie[];
  return data;
}

async function createMovieRequest(payload: MoviePayload): Promise<Movie> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create movie");
  }

  const data = (await response.json()) as Movie;
  return data;
}

async function updateMovieRequest(
  id: string,
  createdAt: string,
  payload: MoviePayload,
): Promise<Movie> {
  const url =
    `${API_URL}?id=${encodeURIComponent(id)}` +
    `&createdAt=${encodeURIComponent(createdAt)}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update movie");
  }

  const data = (await response.json()) as Movie;
  return data;
}

async function deleteMovieRequest(id: string, createdAt: string): Promise<void> {
  const url =
    `${API_URL}?id=${encodeURIComponent(id)}` +
    `&createdAt=${encodeURIComponent(createdAt)}`;

  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete movie");
  }
}

function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = selectedId !== null;

  console.log(movies);

  const selectedMovie = movies.find((m) => m.id === selectedId) ?? null;

  function resetForm() {
    setSelectedId(null);
    setTitle("");
    setYear("");
  }

  async function handleRefresh() {
    try {
      setIsLoading(true);
      const data = await fetchMoviesRequest();
      console.log("Fetched movies from API", data);
      setMovies(data);
      setSelectedId(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void (async () => {
      await handleRefresh();
    })();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const parsedYear = Number(year);

    if (!trimmedTitle || Number.isNaN(parsedYear) || parsedYear < 1878) {
      return;
    }

    const payload: MoviePayload = {
      title: trimmedTitle,
      year: parsedYear,
    };

    if (isEditMode && selectedMovie) {
      try {
        const updated = await updateMovieRequest(
          selectedMovie.id,
          selectedMovie.createdAt,
          payload,
        );
        setMovies((current) =>
          current.map((m) => (m.id === updated.id ? updated : m))
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const created = await createMovieRequest(payload);
        setMovies((current) => [...current, created]);
      } catch (error) {
        console.error(error);
      }
    }

    resetForm();
  }

  async function handleEdit(movie: Movie) {
    setSelectedId(movie.id);
    setTitle(movie.title);
    setYear(String(movie.year));
  }

  async function handleDelete(id: string) {
    const movie = movies.find((m) => m.id === id);
    if (!movie) {
      return;
    }

    setMovies((current) => current.filter((m) => m.id !== id));
    await deleteMovieRequest(movie.id, movie.createdAt);
    if (selectedId === id) {
      resetForm();
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo-text">Movies CRUD</div>
          <button
            type="button"
            className="nav-btn"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Refresh from API"}
          </button>
        </div>
      </header>

      <main className="content">
        <section className="movies-layout">
          <div className="movies-header">
            <p className="tagline">Movie list with CRUD</p>
            <h1>Movie list with CRUD</h1>
            <p>
              Add a movie title and release year, edit existing ones or delete
              them.
            </p>
          </div>

          <div className="movies-grid">
            <div className="movies-panel">
              <h2>Movies</h2>
              {isLoading ? (
                <div className="movies-loader">Loading movies...</div>
              ) : (
                <ul className="movies-list">
                  {movies.map((movie) => (
                    <li key={movie.id} className="movie-item">
                      <div className="movie-main">
                        <span className="movie-title">{movie.title}</span>
                        <div className="movie-meta">
                          <span className="movie-year">{movie.year}</span>
                          <span className="movie-created">
                            Created:{" "}
                            {new Date(Number(movie.createdAt)).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="movie-actions">
                        <button
                          type="button"
                          className="movie-btn secondary"
                          onClick={() => handleEdit(movie)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="movie-btn danger"
                          onClick={() => handleDelete(movie.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                  {movies.length === 0 && (
                    <li className="movie-empty">
                      No movies yet. Add the first one.
                    </li>
                  )}
                </ul>
              )}
            </div>

            <div className="movies-panel">
              <h2>{isEditMode ? "Edit movie" : "Add new movie"}</h2>
              <form className="movie-form" onSubmit={handleSubmit}>
                <label className="field">
                  <span className="field-label">Title</span>
                  <input
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Interstellar"
                  />
                </label>

                <label className="field">
                  <span className="field-label">Year</span>
                  <input
                    type="number"
                    value={year}
                    onChange={(event) => setYear(event.target.value)}
                    placeholder="2014"
                    min={1878}
                    max={2100}
                  />
                </label>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="primary-btn"
                    disabled={!title.trim() || !year.trim()}
                  >
                    {isEditMode ? "Save changes" : "Add movie"}
                  </button>
                  {isEditMode && (
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <small>Movies CRUD demo, {new Date().getFullYear()}</small>
      </footer>
    </div>
  );
}

export default App;
