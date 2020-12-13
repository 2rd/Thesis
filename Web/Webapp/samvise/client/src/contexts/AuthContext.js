import { createContext, useEffect, useState } from "react";

export const authContext = createContext({});

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ loading: true, data: null });

  useEffect(() => {
    setAuth({
      loading: false,
      data: JSON.parse(window.localStorage.getItem("authData")),
    });
  }, []);

  useEffect(() => {
    window.localStorage.setItem("authData", JSON.stringify(auth.data));
  }, [auth.data]);

  const setAuthData = (data) => {
    setAuth({ data: data });
  };

  return (
    <authContext.Provider value={{ auth, setAuthData }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
