import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: false,
  role: null,
  token: null,
  login: () => {},
  logout: () => {},
});
