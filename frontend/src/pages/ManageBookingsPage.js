import React, {useEffect} from "react";
import BookingList from "../components/BookingList";
import { useNavigate } from "react-router-dom";

const ManageBookingsPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
      }
    }, [navigate]);
  return (
    <div>
      <BookingList />
    </div>
  );
};

export default ManageBookingsPage;
