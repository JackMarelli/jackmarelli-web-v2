import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GridLayout from "../../layouts/GridLayout/GridLayout";

import logo from "../../assets/media/logo/logo_black.svg";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`w-full fixed top-0 py-4 font-600 uppercase z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? "bg-white" : "bg-transparent"
      }`}
    >
      <GridLayout>
        <div className="col-span-3">
          <Link to="/">JACK MARELLI</Link>
        </div>
        <div className="col-span-3 w-8 flex items-center">
          <img onClick={() => navigate("/")} src={logo} alt="Logo" className="cursor-pointer"/>
        </div>
        <div className="col-span-3 flex gap-6">
          <div>
            <Link to="/work">
              Works <sup>13</sup>
            </Link>
          </div>

          <div>
            <Link to="/about">About</Link>
          </div>
          <div>
            <Link to="/playground">Playground</Link>
          </div>
        </div>
        <div className="col-span-3 flex justify-end">
          <Link>Contact</Link>
        </div>
      </GridLayout>
    </div>
  );
}
