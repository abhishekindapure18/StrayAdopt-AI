import { Outlet } from "react-router-dom";
import Navbar from "../home/components/Navbar";
import Footer from "../footer/Footer";
import AIFloatingButton from "./AIFloatingButton";

export default function Layout() {
  return (
    <div>
      <Navbar />

      <Outlet />

      <AIFloatingButton />

      <Footer />
    </div>
  );
}