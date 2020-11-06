import React, { Component } from "react";
const { default: MovieCard } = require("./MovieCard");
const all_movies = require("./data/movies.json");

class MovieList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allMovies: [],
      genreMovies: [],
      currentMovies: [],
      currentPage: null,
      totalPages: null,
    };
  }

  componentDidMount() {
    const allMovies = all_movies;
    this.setGenreMovies(allMovies, this.props.genres);
    this.setState({ allMovies });
  }
  setGenreMovies = (movies, genres) => {
    let genreMovies = [];
    for (let movie of Object.entries(movies)) {
      for (let genre of genres) {
        if (movie[1]["genres"].includes(genre)) {
          genreMovies.push(movie);
        }
      }
    }
    this.setState({ genreMovies: genreMovies });
    console.log(genreMovies[0][1]["imdbId"]);
    return null;
  };
  render() {
    return (
      <ul>
        <li>
          <MovieCard imdbId="tt0083511" />
        </li>
      </ul>
    );
  }
}
export default MovieList;
