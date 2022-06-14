import "./App.css";
import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router";

import Header from "./Navigation/Header";
import SellerAccount from "./seller/pages/SellerAccount";
import Login from "./user/pages/Login";
import CreateOrder from "./order/pages/CreateOrder";
import Cart from "./cart/pages/Cart";
import ProductList from "./product/pages/ProductList";
import BuyerAccount from "./buyer/pages/BuyerAccount";
import Sellers from "./seller/pages/Sellers";
import SignUp from "./user/pages/SignUp";
import ProductDetail from "./product/pages/ProductDetail";
import SellerCollections from "./seller/components/SellerCollections";
import { AuthContext } from "./shared/context/auth-context";
import EditSeller from "./seller/pages/EditSeller";
import { useAuth } from "./shared/hooks/auth-hook";
import CollectionDetail from "./collection/pages/CollectionDetail";
import NewCollection from "./collection/pages/NewCollection";
import NewProduct from "./product/pages/NewProduct";
import EditProduct from "./product/pages/EditProduct";
import EditCollection from "./collection/pages/EditCollection";
import EditBuyer from "./buyer/pages/EditBuyer";
import OrderHistory from "./order/pages/OrderHistory";

const App = () => {
  const { userId, role, token, login, logout } = useAuth();
  let routes;

  if (role === "Buyer") {
    routes = (
      <React.Fragment>
        <Route path="/" exact element={<ProductList />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="products/search/:searchTerm" element={<ProductList />} />
        <Route path="sellers" element={<Sellers />} />
        <Route path="cart" element={<Cart />} />
        <Route path="account" element={<BuyerAccount />} />
        <Route path="account/edit" element={<EditBuyer />} />
        <Route path="order-history" element={<OrderHistory />} />
        <Route path="logout" element={<Navigate to="/" replace />} />
        <Route
          path="sellers/:id/collections"
          exact
          element={<SellerCollections />}
        />
        <Route
          path="sellers/:sellerId/collections/:collectionId"
          element={<CollectionDetail />}
        />
        <Route path="order" element={<CreateOrder />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </React.Fragment>
    );
  } else if (role === "Seller") {
    routes = (
      <React.Fragment>
        <Route path="/" exact element={<ProductList />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="products/search/:searchTerm" element={<ProductList />} />
        <Route path="edit/product/:id" element={<EditProduct />} />
        <Route path="edit/collection/:id" element={<EditCollection />} />
        <Route path="sellers" element={<Sellers />} />
        <Route path="account" element={<SellerAccount />} />
        <Route
          path="sellers/:id/collections"
          exact
          element={<SellerCollections />}
        />
        <Route path="create-collection" exact element={<NewCollection />} />
        <Route path="create-product" exact element={<NewProduct />} />
        <Route
          path="sellers/:sellerId/collections/:collectionId"
          element={<CollectionDetail />}
        />
        <Route path="account/edit" element={<EditSeller />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </React.Fragment>
    );
  } else {
    routes = (
      <React.Fragment>
        <Route path="/" exact element={<ProductList />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/search/:searchTerm" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="sellers" element={<Sellers />} />
        <Route
          path="sellers/:id/collections"
          exact
          element={<SellerCollections />}
        />
        <Route
          path="sellers/:sellerId/collections/:collectionId"
          element={<CollectionDetail />}
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
