import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./styles/theme.css";

export default function App() {
  const { pathname } = useLocation();

  return (
    <div className="site">
      <Navbar />
      <main
        id="content"
        className={`site-main ${pathname === "/" ? "is-home" : ""}`}
      >
        {/* Contenedor base: respeta tus páginas existentes */}
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />

      {/* Fondo decorativo (no interfiere con tus páginas) */}
      <div className="bg-chiles" aria-hidden />
    </div>
  );
}
