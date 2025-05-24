import { Link } from "react-router-dom";
import GridLayout from "../../layouts/GridLayout/GridLayout";

import logo from "../../assets/media/logo/logo_black.svg";

export default function Navbar() {
  return (
    <div className="w-full fixed top-0 py-4 font-600 uppercase bg-white">
      <GridLayout>
        <div className="col-span-3">JACK MARELLI</div>
        <div className="col-span-3 w-8 flex items-center">
          <img src={logo} alt="Logo" />
        </div>
        <div className="col-span-3 flex gap-6">
          <div>
            <Link to="/works">
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
