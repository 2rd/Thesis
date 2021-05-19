// import { useContext } from "react";
// import { authContext } from "../contexts/AuthContext";

const Thankyou = () => {
  // const { setAuthData, auth } = useContext(authContext);

  // const onLogout = () => {
  //   setAuthData(null);
  // };
  return (
    <div>
      <div className="grid-container full narrow space-top">
        <h4>Thank you!</h4>
        <p>
          Your answers have been registered. <br />
          Thank you for your participation! <br />
          If you would like to know more about the research project, feel free
          to send an e-mail to: <br />
          <a href="mailto:Tord.Kvifte@student.uib.no">
            Tord.Kvifte@student.uib.no
          </a>
        </p>
        {/* <button type="button" onClick={onLogout}>
          Finish
        </button> */}
      </div>
    </div>
  );
};

export default Thankyou;
