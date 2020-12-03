import * as axios from "axios";
//import { getCookie } from "./utils";

const all_movies = require("../data/movies.json");

export default class TmdbApi {
  constructor(movieId, wasFetchedCallback) {
    this.api_token =
      "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWNmNzFjNGRlNWMxMTBkMjdjMWE0NThhY2YzYjJlMyIsInN1YiI6IjVmYTAwMWMwMTYwZTczMDAzODQ0YzNlMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kjoHCR-rXlUDZFZCo2S-TM8C5pe-h9q2teoLAEpShl0";
    this.api_key = "f1cf71c4de5c110d27c1a458acf3b2e3";
    this.client = null;
    this.api_url = process.env.REACT_APP_API_ENDPOINT;
    this.toFetch = this.setToFetch(movieId);
    this.data = { movieData: [], isFetching: false, wasFetched: false };
    this.onFetchedCallback = wasFetchedCallback;
  }

  setData = (data) => {
    this.data = data;
  };

  setToFetch = (movieId) => {
    const allMovies = all_movies;
    let toFetch = null;

    for (let movie of Object.entries(allMovies)) {
      if (movie[1].movieId === movieId) {
        toFetch = movie[1];
        break;
      }
    }
    let idFix = "";
    if (toFetch.imdbId.length < 7) {
      idFix = "0";
      if (toFetch.imdbId.length < 6) {
        idFix = "00";
        if (toFetch.imdbId.length < 5) {
          idFix = "000";
          if (toFetch.imdbId.length < 4) {
            idFix = "0000";
          }
        }
      }
    }
    toFetch.imdbId = idFix + toFetch.imdbId;

    this.fetchMovie(toFetch);
    return toFetch;
  };

  init = () => {
    //this.api_token = getCookie("ACCESS_TOKEN")
    //this.api_token = token;

    let headers = {
      Accept: "application/json",
    };
    if (this.api_token) {
      headers.Authorization = `Bearer ${this.api_token}`;
    } else if (this.api_key) {
      headers.Authorization = `api_key=${this.api_key}`;
    }

    this.client = axios.create({
      baseURL: "https://api.themoviedb.org/3/",
      timeout: 31000,
      headers: headers,
    });

    return this.client;
  };

  fetchMovie = async (toFetch) => {
    if (toFetch !== null) {
      try {
        this.setData({ ...this.data, isFetching: true, wasFetched: false });
        const response = await axios.get(
          `https://api.themoviedb.org/3/find/tt${toFetch.imdbId}?api_key=${this.api_key}&language=en-US&external_source=imdb_id`
        );
        const movie = response.data.movie_results[0];

        movie.release_date = movie.release_date.substr(0, 4);
        movie.movieId = toFetch.movieId;
        movie.genres = toFetch.genres;

        this.setData({
          ...this.data,
          movieData: movie,
          isFetching: false,
          wasFetched: true,
        });
        this.onFetchedCallback(true);
      } catch (e) {
        console.log(toFetch);
        console.log(e);
        this.setData({ ...this.data, isFetching: false, wasFetched: false });
      }
    }
  };

  getMovieTrailer = () => {
    return this.init().get(`movie/${this.data.movieData.id}/videos`);
  };

  getCredits = () => {
    return this.init().get(`movie/${this.data.movieData.id}/credits`);
  };

  getTmdbConfig = () => {
    return this.init().get("/configuration");
  };

  setTmdbConfiguration = () => {
    const config = this.getTmdbConfig();
    this.tmdb_base_url = config["images"]["secure_base_url"];
  };

  getPoster = (size, imgUrl) => {
    let headers = { Accept: "application/json" };
    const client = axios.create({
      baseURL: this.tmdb_base_url,
      timeout: 31000,
      headers: headers,
    });
    return client.get(`/${size}${imgUrl}`);
  };

  getMovie = (id, params) => {
    return this.init().get(`/find/${id}`, { params: params });
  };

  getSomething = (params) => {
    return this.init().get("/something", { params: params });
  };

  postSomething = (data) => {
    return this.init().post("/something", data);
  };
}
