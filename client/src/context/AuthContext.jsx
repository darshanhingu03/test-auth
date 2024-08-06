import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const response = await axios.get("/api/me"); // Adjust the endpoint as needed
  //       setUser(response.data);
  //     } catch (error) {
  //       setUser(null);
  //     }
  //   };
  //   checkAuth();
  // }, []);

  const login = async (email, password, token) => {
    try {
      const response = await axios.post("/login", { email, password, token });
      localStorage.setItem("token", response.data.token);
      setUser({ email });
      navigate("/welcome");
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email, password, twoFactorEnabled) => {
    try {
      const response = await axios.post("/signup", {
        email,
        password,
        twoFactorEnabled,
      });
      if (!response.data.twoFactorEnabled) {
        navigate("/login");
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
