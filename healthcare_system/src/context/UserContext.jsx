import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 🔄 Fetch user again if only email is available
  useEffect(() => {
    if (!user) {
      const storedEmail = localStorage.getItem("userEmail");
      if (storedEmail) fetchUserDetails(storedEmail);
    }
  }, []);

  // 💾 Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userEmail", user.email); // optional helper
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const fetchUserDetails = async (email) => {
    try {
      const res = await axios.get(`http://localhost:9090/api/staff/email/${email}`);
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};
