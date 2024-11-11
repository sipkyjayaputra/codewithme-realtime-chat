// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom"; // For highlighting the active link
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand navbar-light fixed-bottom bg-light">
      <div className="container">
        <div className="d-flex text-center w-100">
          <div className={`flex-fill py-2 rounded ${
                location.pathname === "/contacts" ? "bg-danger text-light" : ""
              }`}>
            {/* Contacts link with FontAwesome icon */}
            <Link
              to="/contacts"
              className={`nav-link ${
                location.pathname === "/contacts" ? "active" : ""
              }`}
            >
              <i className="fas fa-address-book me-2"></i>{" "}
              {/* FontAwesome icon */}
              Contacts
            </Link>
          </div>
          <div className={`flex-fill py-2 rounded ${
                location.pathname === "/profile" ? "bg-danger text-light" : ""
              }`}>
            {/* Profile link with FontAwesome icon */}
            <Link
              to="/profile"
              className={`nav-link ${
                location.pathname === "/profile" ? "active" : ""
              }`}
            >
              <i className="fas fa-user me-2"></i> {/* FontAwesome icon */}
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
