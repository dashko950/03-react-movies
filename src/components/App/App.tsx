import { useState, useCallback, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import styles from "./App.module.css";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>("");

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      toast.error("Please enter your search query.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setMovies([]);
    setCurrentQuery(query);

    try {
      const data = await fetchMovies({ query });

      if (data.results.length === 0) {
        toast.error("No movies found for your request.");
        setMovies([]);
      } else {
        setMovies(data.results);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch movies";
      setError(errorMessage);
      toast.error("There was an error, please try again...");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMovieSelect = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectedMovie) {
        handleCloseModal();
      }
    };

    if (selectedMovie) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMovie, handleCloseModal]);

  return (
    <div className={styles.app}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
      <SearchBar onSubmit={handleSearch} />
      <main className={styles.main}>
        {error && <ErrorMessage message={error} />}
        {isLoading && <Loader />}
        {!isLoading && !error && movies.length > 0 && (
          <MovieGrid movies={movies} onSelect={handleMovieSelect} />
        )}
      </main>
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
