import React, { useState, useEffect } from "react";
import { auth, database } from "../firebase";
import { updateProfile } from "firebase/auth";
import { ref, update } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    displayName: "",
    email: "",
    photoURL: "",
  });
  const [newName, setNewName] = useState("");
  const [newPhotoURL, setNewPhotoURL] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Load the current user's details from Firebase Auth and Firebase Database
    if (auth.currentUser) {
      setUserDetails({
        displayName: auth.currentUser.displayName || "",
        email: auth.currentUser.email,
        photoURL: auth.currentUser.photoURL || "",
      });
    }
  }, []);

  const handleProfileUpdate = async () => {
    if (newName.trim() === "") {
      alert("Display name is required!");
      return;
    }

    try {
      // Update the profile name in Firebase Authentication
      await updateProfile(auth.currentUser, {
        displayName: newName,
        // Only update photoURL if it's not empty
        photoURL: newPhotoURL || auth.currentUser.photoURL, // Use the existing photoURL if new one is empty
      });

      // Update the user's name and photoURL in the Firebase Realtime Database
      const userRef = ref(database, "users/" + auth.currentUser.uid);
      await update(userRef, {
        name: newName,
        // Only update photoURL in the database if it's not empty
        photoURL: newPhotoURL || auth.currentUser.photoURL,
      });

      // Update local state with new values
      setUserDetails({
        displayName: newName,
        email: auth.currentUser.email,
        photoURL: newPhotoURL || auth.currentUser.photoURL,
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again later.");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login"); // Redirect to the login page after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="container w-100">
      <h3 className="my-5">Profile</h3>
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <div className="text-center">
                <img
                  src={
                    userDetails.photoURL || "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="img-fluid rounded-circle mb-3"
                  style={{ width: "150px", height: "150px" }}
                />
                <h4>{userDetails.displayName || "No Name Set"}</h4>
                <p className="text-muted">{userDetails.email}</p>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter new name"
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="photoURL">Profile Photo URL</label>
                <input
                  type="text"
                  className="form-control"
                  id="photoURL"
                  value={newPhotoURL}
                  onChange={(e) => setNewPhotoURL(e.target.value)}
                  placeholder="Enter new photo URL (optional)"
                />
              </div>

              <div className="d-flex justify-content-between">
                <button
                  onClick={handleProfileUpdate}
                  className="btn btn-primary"
                >
                  Update Profile
                </button>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
