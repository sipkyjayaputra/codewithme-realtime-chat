// src/pages/Login.js
import React from "react";
import { auth, database } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { ref, set } from "firebase/database";
import CodeWithMeLogo from "../assets/CodeWithMe.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Register user in Firebase Realtime Database if not already registered
      const userRef = ref(database, "users/" + user.uid);
      set(userRef, {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="bg-danger">
      <div
        className="container d-flex flex-column align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <div className="card">
          <div className="card-body text-center px-4">
            <div className="mb-5 mt-4">
              <img
                src={CodeWithMeLogo}
                className="img-fluid rounded mx-auto shadow"
                style={{width: "18%"}}
                alt="Code With Me"
              />
            </div>
            <div>
              <h5 className="display-6">Welcome Back</h5>
            </div>
            <div className="mb-4">
              <p className="lead">
                Don't have an account yet? <strong> Sign up</strong>
              </p>
            </div>
            <div className="lead">
              <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">
                  <i className="fas fa-envelope" />
                </span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Email Address"
                  aria-label="Email Address"
                  aria-describedby="basic-addon1"
                  disabled
                />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">
                  <i className="fas fa-lock" />
                </span>
                <input
                  type="password"
                  class="form-control"
                  placeholder="Password"
                  aria-label="Password"
                  aria-describedby="basic-addon1"
                  disabled
                />
              </div>
              <div className="form-group mb-3">
                <button
                  className="btn btn-primary form-control"
                  type="submit"
                  name="submit"
                  disabled
                >
                  Login
                </button>
              </div>
            </div>
            <div className="my-3 lead">OR</div>
            <div className="row mb-4">
              <div className="col">
                <button className="btn btn-danger w-100" disabled>
                  <i className="fab fa-apple" />
                </button>
              </div>
              <div className="col">
                <button
                  className="btn btn-danger w-100"
                  onClick={handleGoogleSignIn}
                >
                  <i className="fab fa-google" />
                </button>
              </div>
              <div className="col">
                <button className="btn btn-danger w-100" disabled>
                  <i className="fab fa-twitter" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
