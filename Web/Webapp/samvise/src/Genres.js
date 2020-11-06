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
  const getUpdatedSelectedGenres = (selectedGenres = [], genre) => {
    const genres = [...selectedGenres];
    genres.push(genre);
    return genres;
  };
  const onGenreClicked = (genre) => {
    if (!selectedGenres.includes(genre)) {
      const updatedGenres = getUpdatedSelectedGenres(selectedGenres, genre);
      setSelectedGenres(updatedGenres);
    }
  };
  const genreButtons = genres.map((genre) => (
    <li key={genre}>
      <button onClick={() => onGenreClicked(genre)}>{genre}</button>
    </li>
  ));

  return (
    <div>
      <h2>Genre Preferences</h2>
      <div>
        <ul className="grid-container">{genreButtons}</ul>
      </div>
      <div>
        {selectedGenres.length >= 3 ? (
          <p>
            <Link to={`/movies/${selectedGenres}`}>Continue</Link>
          </p>
        ) : (
          <a>Select {3 - selectedGenres.length} more genres</a>
        )}
      </div>
    </div>
  );
};

export default Genres;
