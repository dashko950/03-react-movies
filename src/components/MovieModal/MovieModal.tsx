import { createPortal } from "react-dom";
import type { Movie } from "../../types/movie";
import styles from "./MovieModal.module.css";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Закрываем модалку только если кликнули именно по backdrop (тёмному фону), а не по самому модальному окну
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const getImageUrl = (path: string | null) => {
    if (!path) return "https://via.placeholder.com/1280x720?text=No+Image";
    return `https://image.tmdb.org/t/p/original${path}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return createPortal(
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>

        <img
          src={getImageUrl(movie.backdrop_path || movie.poster_path)}
          alt={movie.title}
          className={styles.image}
        />

        <div className={styles.content}>
          <h2 className={styles.title}>{movie.title}</h2>
          <p className={styles.overview}>
            {movie.overview || "No overview available."}
          </p>
          <p className={styles.detail}>
            <strong>Release Date:</strong> {formatDate(movie.release_date)}
          </p>
          <p className={styles.detail}>
            <strong>Rating:</strong> {movie.vote_average.toFixed(1)}/10
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default MovieModal;
