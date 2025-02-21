import React, { useRef, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";
import Cart from "./components/Cart";
import ProductDetail from "./components/ProductDetail";
import ProductList from "./components/ProductList";
import Sidebar from "./components/Admin/PageAdmin/Sidebar";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import HomePage from "./components/Home/HomePage";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import Payment from "./components/Payment";
import UserManagementForm from "./components/UserManagementForm";
import Order from "./components/Order";
import Address from "./components/Address";
import Success from "./components/Success";
import OrderDetail from "./components/OrderDetail";
import Unauthorized from "./components/Unauthorized";
import "boxicons/css/boxicons.min.css";
import VerifySuccess from "./components/VerifySuccess";
import PageManager from "./components/Manager";

const App = () => {
  const loadingBarRef = useRef<LoadingBarRef | null>(null);
  const location = useLocation();
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    if (loadingBarRef.current) {
      loadingBarRef.current.continuousStart();
    }
    setLoadingComplete(false);

    const timer = setTimeout(() => {
      if (loadingBarRef.current) {
        loadingBarRef.current.complete();
      }
      setLoadingComplete(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <LoadingBar color="#0d6efd" ref={loadingBarRef} />
      {loadingComplete && (
        <Routes>
          <Route
            path="/admin/rocker-shop"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <Sidebar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/rocker-shop"
            element={
              <ProtectedRoute roles={["MANAGER"]}>
                <PageManager />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/:categoryName" element={<ProductList />} />
          <Route path="/gio-hang" element={<Cart />} />
          <Route path="/dang-ky" element={<SignUp />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/tai-khoan"
            element={
              <ProtectedRoute roles={["USER"]}>
                <UserManagementForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tai-khoan/tai-don-hang-cua-toi"
            element={
              <ProtectedRoute roles={["USER"]}>
                <Order />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tai-khoan/tai-don-hang-cua-toi/:id"
            element={
              <ProtectedRoute roles={["USER"]}>
                <OrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tai-khoan/quan-ly-so-dia-chi"
            element={
              <ProtectedRoute roles={["USER"]}>
                <Address />
              </ProtectedRoute>
            }
          />
          <Route path="/dang-nhap" element={<SignIn />} />
          <Route
            path="/xac-nhan-don-hang"
            element={
              <ProtectedRoute roles={["USER"]}>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dat-hang/thanh-cong"
            element={
              <ProtectedRoute roles={["USER"]}>
                <Success />
              </ProtectedRoute>
            }
          />
          <Route path="/xac-thuc-thanh-cong" element={<VerifySuccess />} />
        </Routes>
      )}
      <ToastContainer />
    </>
  );
};

const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
