// src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase"; // Importing auth from firebase.js
import { onAuthStateChanged } from "firebase/auth";
import Login from "./pages/Login"; // Updated import
import Contact from "./pages/Contact"; // Updated import
import Chat from "./pages/Chat"; // Updated import
import Profile from "./pages/Profile"; // Import Profile page
import Navbar from "./components/Navbar"; // Import Navbar

const App = () => {
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Set loading to false once user state is updated
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while auth state is being checked
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/contacts" />}
        />
        <Route
          path="/contacts"
          element={
            user ? (
              <Contact onSelectUser={setSelectedUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/chat"
          element={
            user && selectedUser ? (
              <Chat user={user} contactUser={selectedUser} />
            ) : (
              <Navigate to="/contacts" />
            )
          }
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/contacts" : "/login"} />}
        />
      </Routes>

      {/* Add the Navbar component at the bottom of all pages */}
      {user && <Navbar />}
    </Router>
  );
};

export default App;
