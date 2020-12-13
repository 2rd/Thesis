import { useState } from "react";
import { Icon, InlineIcon } from "@iconify/react";
import starIcon from "@iconify/icons-mdi/star";

const StarRating = (props) => {
  const [selected, setSelected] = useState({ value: "0" });
  const [hover, setHover] = useState(null);

  const handleChange = (event) => {
    props.ratingCallback(event.target.value);
    setSelected({ value: event.target.value });
  };

  return (
    <div className="grid-container fifths noPadding">
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;
        return (
          <label
            htmlFor={`rate${ratingValue}`}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
          >
            <InlineIcon
              icon={starIcon}
              className="star"
              color={
                ratingValue <= (hover || selected.value) ? "#ffc107" : "#e4e5e9"
              }
              width="40px"
            />
            <input
              type="radio"
              key={`rate${ratingValue}`}
              id={`rate${ratingValue}`}
              name={`rate${ratingValue}`}
              value={ratingValue}
              onChange={handleChange}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRating;
