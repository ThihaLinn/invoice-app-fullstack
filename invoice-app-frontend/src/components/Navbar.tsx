import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="bg-gray-600">
      <div className=" w-[90%] py-3 px-4 flex justify-between items-center text-xl font-bold text-white container mx-auto ">
        <div>
          <Link to={"/"}>INVOICE</Link>
        </div>

        
        <button
          className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-800 text-gray-200 shadow-md shadow-gray-900/10 hover:shadow-none hover:shadow-gray-900/20 hover:opacity-[0.85]  active:opacity-[0.85] active:shadow-none hover:text-white"
          type="button"
        >
          <Link to={"/create-invoice"}>Create Invoice</Link>
          </button>
      </div>
    </div>
  );
};

export default Navbar;
