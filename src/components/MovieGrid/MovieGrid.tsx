// src/components/MovieGrid/MovieGrid.tsx
import type { Movie } from "../../types/movie";
import styles from "./MovieGrid.module.css";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, onSelect }) => {
  const getImageUrl = (path: string | null) => {
    if (!path) return "https://via.placeholder.com/500x750?text=No+Image";
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  return (
    <ul className={styles.grid}>
      {movies.map((movie) => (
        <li key={movie.id} className={styles.gridItem}>
          <div
            className={styles.card}
            onClick={() => onSelect(movie)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onSelect(movie);
              }
            }}
          >
            <img
              className={styles.image}
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              loading="lazy"
            />
            <h2 className={styles.title}>{movie.title}</h2>
            <div className={styles.rating}>
              ⭐ {movie.vote_average.toFixed(1)}/10
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MovieGrid;
