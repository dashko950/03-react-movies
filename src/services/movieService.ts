import axios from "axios";
import type { Movie } from "../types/movie";

const API_URL = "https://api.themoviedb.org/3";
const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

if (!API_TOKEN) {
  console.error("VITE_TMDB_TOKEN is not defined in environment variables");
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface FetchMoviesParams {
  query: string;
  page?: number;
}

export const fetchMovies = async ({
  query,
  page = 1,
}: FetchMoviesParams): Promise<MoviesResponse> => {
  if (!query.trim()) {
    throw new Error("Search query is required");
  }

  try {
    const response = await axiosInstance.get<MoviesResponse>("/search/movie", {
      params: {
        query: query.trim(),
        page,
        include_adult: false,
        language: "en-US",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.status_message || "Failed to fetch movies",
      );
    }
    throw new Error("An unexpected error occurred");
  }
};
