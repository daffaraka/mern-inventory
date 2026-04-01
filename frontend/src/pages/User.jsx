import React, { useState, useEffect } from "react";
import userService from "../services/userService";

const Users = () => {
  const [users, setUsers] = useState([]);
  setLoading(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // In a real app, we would pass search params here
      const data = await userService.getAll();
      setUsers(data.users);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
};
