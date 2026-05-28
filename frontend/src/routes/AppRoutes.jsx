import { Navigate, Route, Routes } from "react-router-dom";
import Admin from "../pages/Admin";
import Checkout from "../pages/Checkout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Orders from "../pages/Orders";
import ProductDetails from "../pages/ProductDetails";
import Success from "../pages/Success";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/success" element={<Success />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
