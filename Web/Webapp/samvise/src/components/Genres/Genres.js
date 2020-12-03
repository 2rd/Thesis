import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Genres = () => {
  const genres = [
    "Action",
    "Adventure",
    "Comedy",
    "Crime",
    "Children's",
    "Documentary",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Musical",
    "Romance",
    "Sci-fi",
    "Thriller",
    "War",
  ];

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
      setSelectedGenres(updatedGenres);
    } else {
      const updatedGenres = getUpdatedSelectedGenres(
        selectedGenres,
        genre,
        true
      );
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
        className={isSelected(genre) ? "selected" : ""}
        onClick={() => onGenreClicked(genre)}
      >
        {genre}
      </button>
    </li>
  ));

  return (
    <div>
      <h2>Genre Preferences</h2>
      <div>
        <ul className="grid-container">{genreButtons}</ul>
      </div>
      <div>
        {selectedGenres.length >= 1 ? (
          <p>
            <Link to={`/movies/${selectedGenres}`}>Continue</Link>
          </p>
        ) : (
          /* <a>Select {3 - selectedGenres.length} more genres</a> */
          <a>Select at least 1 of your favorite genres</a>
        )}
      </div>
    </div>
  );
};

export default Genres;
