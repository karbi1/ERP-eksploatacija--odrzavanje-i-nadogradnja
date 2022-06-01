import "./App.css";
import React from "react";
import { Route, Routes, Navigate } from "react-router";
import Header from "./Navigation/Header";
import Login from "./user/pages/Login";
import ProductList from "./ProductList";
import Sellers from "./user/seller/pages/Sellers";
import SignUp from "./user/pages/SignUp";
import ProductDetail from "./ProductDetail";
import SellerCollections from "./user/seller/pages/SellerCollections";
import { AuthContext } from "./shared/context/auth-context";

import { useAuth } from "./shared/hooks/auth-hook";

const App = () => {
  const { userId, role, token, login, logout } = useAuth();
  let routes;

  if (token) {
    routes = (
      <React.Fragment>
        <Route path="/" exact element={<ProductList />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="sellers" element={<Sellers />} />
        <Route
          path="sellers/:id/collections"
          exact
          element={<SellerCollections />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </React.Fragment>
    );
  } else {
    routes = (
      <React.Fragment>
        <Route path="/" exact element={<ProductList />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="sellers" element={<Sellers />} />
        <Route
          path="sellers/:id/collections"
          exact
          element={<SellerCollections />}
        />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </React.Fragment>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        role: role,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <React.Fragment>
        <Header />
        <Routes>{routes}</Routes>
      </React.Fragment>
    </AuthContext.Provider>
  );
};

export default App;
