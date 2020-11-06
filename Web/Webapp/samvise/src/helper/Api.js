import * as axios from "axios";
//import { getCookie } from "./utils";

export default class Api {
  constructor() {
    this.api_token =
      "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMWNmNzFjNGRlNWMxMTBkMjdjMWE0NThhY2YzYjJlMyIsInN1YiI6IjVmYTAwMWMwMTYwZTczMDAzODQ0YzNlMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kjoHCR-rXlUDZFZCo2S-TM8C5pe-h9q2teoLAEpShl0";
    this.api_key = "f1cf71c4de5c110d27c1a458acf3b2e3";
    this.client = null;
    this.api_url = process.env.REACT_APP_API_ENDPOINT;
  }

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
  getMovieTrailer = (movieId) => {
    return this.init().get(`movie/${movieId}/videos`);
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
