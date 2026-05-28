import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";

export default function StoreLayout({ children }) {
  return (
    <div className="min-h-screen bg-pitch text-white">
      {children}
      <Footer />
      <CartDrawer />
    </div>
  );
}
