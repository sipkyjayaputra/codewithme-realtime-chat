// src/pages/Contact.js
import React, { useState, useEffect } from "react";
import { auth, database } from "../firebase";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Contact = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // For error handling
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = ref(database, "users");
        const snapshot = await get(usersRef);
        const usersData = snapshot.val();

        if (usersData) {
          const userList = [];
          for (let uid in usersData) {
            if (uid !== auth.currentUser.uid) {
              userList.push({ uid, ...usersData[uid] });
            }
          }
          setUsers(userList);
        } else {
          setError("No users found.");
        }
      } catch (error) {
        setError("Error fetching users.");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    onSelectUser(user); // Update selected user in parent component
    navigate("/chat"); // Navigate to chat page
  };

  return (
    <div className="container w-100">
      <h3 className="my-5">Contacts</h3>
      {loading && !error ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div> // Show error message
      ) : (
        <div className="d-flex align-items-center flex-column">
          {users.map((user, index) => (
            <div className="card mb-3 shadow w-100" key={index}>
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-center" onClick={e => handleUserClick(user)} style={{cursor: "pointer"}}>
                  <div className="">
                    <img
                      src={user.photoURL || "https://via.placeholder.com/50"}
                      alt={user.name}
                      className="rounded-circle me-2"
                      style={{ width: "60px", height: "60px" }}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex flex-column">
                      <div className=" mt-3 mt-md-4 mt-lg-5">
                        <h5 className="">{user.name}</h5>
                      </div>
                      <div className="">
                        <p>{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contact;
