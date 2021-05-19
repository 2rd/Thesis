import { useEffect, useState } from "react";

const Progressbar = (props) => {
  return (
    <div className="progress-outer">
      <div
        className="progress-inner"
        style={{
          width: props.progress + "%",
          // fontSize: "8px",
          // color: "black",
          // textAlign: "left",
          // paddingLeft: "1%",
        }}
      >
        {/* Progress: {Math.round(props.progress)}% */}
      </div>
    </div>
  );
};

export default Progressbar;
