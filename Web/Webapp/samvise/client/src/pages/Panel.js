import { useContext } from "react";
import { authContext } from "../contexts/AuthContext";

const Panel = () => {
  const { setAuthData, auth } = useContext(authContext);

  const onLogout = () => {
    setAuthData(null);
  };
  return (
    <div className="grid-container full">
      <button type="button" onClick={onLogout}>
        Sign out
      </button>
    </div>
  );
};

export default Panel;
