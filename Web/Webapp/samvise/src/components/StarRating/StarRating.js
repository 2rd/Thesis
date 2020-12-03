import { useState } from "react";

const StarRating = (props) => {
  const [selected, setSelected] = useState({ value: "1" });

  const handleChange = (event) => {
    props.ratingCallback(event.target.value);
    setSelected({ value: event.target.value });
  };

  return (
    <div className="grid-container fifths">
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        return (
          <div key={`rate${ratingValue}`}>
            <input
              type="radio"
              id={`rate${ratingValue}`}
              name="rating"
              value={ratingValue}
              onChange={handleChange}
            />
            <label htmlFor={`rate${ratingValue}`}>{ratingValue}</label>
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
