import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Progressbar from "../components/Progressbar/Progressbar";
import * as axios from "axios";
import { authContext } from "../contexts/AuthContext";
import { Icon, InlineIcon } from "@iconify/react";
import starIcon from "@iconify/icons-mdi/star";
import emoticonLolOutline from "@iconify/icons-mdi/emoticon-lol-outline";
import dramaMasks from "@iconify/icons-mdi/drama-masks";
import musicIcon from "@iconify/icons-mdi/music";
import alienOutline from "@iconify/icons-mdi/alien-outline";
import heartOutline from "@iconify/icons-mdi/heart-outline";
import babyFaceOutline from "@iconify/icons-mdi/baby-face-outline";
import ghostOutline from "@iconify/icons-mdi/ghost-outline";
import pistolIcon from "@iconify/icons-mdi/pistol";
import wizardHat from "@iconify/icons-mdi/wizard-hat";
import mapSearchOutline from "@iconify/icons-mdi/map-search-outline";
import incognitoIcon from "@iconify/icons-mdi/incognito";
import knifeIcon from "@iconify/icons-mdi/knife";
import swordCross from "@iconify/icons-mdi/sword-cross";
import drawIcon from "@iconify/icons-mdi/draw";
import lightbulbOnOutline from "@iconify/icons-mdi/lightbulb-on-outline";

const Genres = () => {
  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    // "Crime",
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
  const icons = {
    Action: pistolIcon,
    Adventure: mapSearchOutline,
    Animation: drawIcon,
    Comedy: emoticonLolOutline,
    // Crime: starIcon,
    Children: babyFaceOutline,
    Documentary: lightbulbOnOutline,
    Drama: dramaMasks,
    Fantasy: wizardHat,
    Horror: ghostOutline,
    Mystery: incognitoIcon,
    Musical: musicIcon,
    Romance: heartOutline,
    "Sci-Fi": alienOutline,
    Thriller: knifeIcon,
    War: swordCross,
  };
  const [errorMessage, setErrorMessage] = useState(null);
  const { auth } = useContext(authContext);
  // const [questionnaireStarted, setQuestionnaireStarted] = useState(false);

  useEffect(() => {}, []);

  const [selectedGenres, setSelectedGenres] = useState([]);

  const postGenres = async () => {
    const genres = {
      genres: selectedGenres,
    };

    try {
      const res = await axios.post("/genres/add", genres, {
        headers: { "auth-token": auth.data },
      });
    } catch (err) {
      console.log(err.response.data);
      // setErrorMessage(err.response.data);
    }
  };

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
        <InlineIcon
          icon={icons[genre]}
          className="star"
          // color=
          width="40px"
        />
        <br />
        {genre}
      </button>
    </li>
  ));

  return (
    <div>
      <Progressbar progress={28.33} />

      <div style={{ height: 15 + "px" }}></div>
      <h4>Please select your favorite movie genres</h4>
      <p className="errorMessage">{errorMessage}</p>
      <div>
        <ul className="grid-container thirds narrow">{genreButtons}</ul>
      </div>

      <div className="space-bottom50"></div>
      <div className="bottom-container">
        <div className="nextBtnContainer">
          {selectedGenres.length >= 1 ? (
            <Link to={`/movies/${selectedGenres}`}>
              <button onClick={postGenres}>Next</button>
            </Link>
          ) : (
            <button
              className="disabledBtn"
              onClick={() =>
                setErrorMessage("Please pick at least 1 genre to continue")
              }
            >
              Next
            </button>
          )}
        </div>
      </div>
      {/* Below: With explanation */}
      {/* {!questionnaireStarted ? (
        <div>
          <div
            className="grid-container full nextBtnContainer"
            style={{ marginTop: "25%" }}
          >
            <div>
              <p className="bottomDescription">
                In the following section, you will be asked to choose at least
                one genre and at least 5 movies, watch the trailers of these
                films, and give them a star rating from 1-5. Your ratings will
                be used to generate movie recommendations.
              </p>
              <button
                onClick={() => setQuestionnaireStarted(true)}
                style={{ marginTop: "5%" }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ height: 15 + "px" }}></div>
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
                  <button onClick={postGenres}>Next</button>
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
      )} */}
    </div>
  );
};

export default Genres;
