import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Genres = () => {
  const genres = [
    "Action",
    "Adventure",
    "Comedy",
    "Crime",
    "Children",
    "Documentary",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Musical",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "War",
  ];
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {}, []);

  const [selectedGenres, setSelectedGenres] = useState([]);

  const getUpdatedSelectedGenres = (selectedGenres = [], genre, selected) => {
    const genres = [...selectedGenres];
    if (!selected) {
      genres.push(genre);
    } else {
      let index = genres.indexOf(genre);
      if (index !== -1) {
        genres.splice(index, 1);
      }
    }
    return genres;
  };

  const onGenreClicked = (genre) => {
    if (!selectedGenres.includes(genre)) {
      const updatedGenres = getUpdatedSelectedGenres(
        selectedGenres,
        genre,
        false
      );
      if (updatedGenres.length > 0) {
        setErrorMessage(null);
      }
      setSelectedGenres(updatedGenres);
    } else {
      const updatedGenres = getUpdatedSelectedGenres(
        selectedGenres,
        genre,
        true
      );
      if (updatedGenres.length > 0) {
        setErrorMessage(null);
      }
      setSelectedGenres(updatedGenres);
    }
  };

  const isSelected = (genre) => {
    if (selectedGenres.length === 0) {
      return false;
    } else {
      for (let g of selectedGenres) {
        if (g === genre) {
          return true;
        }
      }
      return false;
    }
  };

  const genreButtons = genres.map((genre) => (
    <li key={genre}>
      <button
        className={isSelected(genre) ? "genreBtn selectedGenreBtn" : "genreBtn"}
        onClick={() => onGenreClicked(genre)}
      >
        {genre}
      </button>
    </li>
  ));

  return (
    <div>
      <h4>Pick your favorite genres</h4>
      <p className="errorMessage">{errorMessage}</p>
      <div>
        <ul className="grid-container thirds narrow">{genreButtons}</ul>
      </div>

      <div className="space-bottom50"></div>
      <div className="bottom-container">
        <div className="nextBtnContainer">
          {selectedGenres.length >= 1 ? (
            <Link to={`/movies/${selectedGenres}`}>
              <button>Next</button>
            </Link>
          ) : (
            <button
              className="disabledBtn"
              onClick={() => setErrorMessage("Pick at least 1 genre")}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Genres;
