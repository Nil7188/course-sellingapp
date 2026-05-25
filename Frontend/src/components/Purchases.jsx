import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import { BACKEND_URL } from '../utils/utils';


function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // ✅ Check login
  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // ✅ Fetch purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const storedUser = localStorage.getItem("userInfo");
        const user = storedUser ? JSON.parse(storedUser) : null;
        const token = user?.token;

        if (!token) {
          setErrorMessage("Please log in first");
          return;
        }

        const response = await axios.get(
          `${BACKEND_URL}/user/purchases`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setPurchases(response.data.courseData);
      } catch (error) {
        console.log(error);
        setErrorMessage(
          error?.response?.data?.errors || "Failed to fetch purchases"
        );
      }
    };

    fetchPurchases();
  }, []);

  // ✅ Logout
  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/user/logout`,
        { withCredentials: true }
      );

      localStorage.removeItem("userInfo");
      setIsLoggedIn(false);

      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-100 p-5 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 w-64 z-50`}
      >
        <nav>
          <ul className="mt-16 md:mt-0">
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>

            <li className="mb-4">
              <Link to="/courses" className="flex items-center">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>

            <li className="mb-4 text-blue-500 flex items-center">
              <FaDownload className="mr-2" /> Purchases
            </li>

            <li className="mb-4">
              <Link to="/settings" className="flex items-center">
                <IoMdSettings className="mr-2" /> Settings
              </Link>
            </li>

            <li>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="flex items-center">
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <HiX className="text-2xl" />
        ) : (
          <HiMenu className="text-2xl" />
        )}
      </button>

      {/* Main Content */}
      <div
        className={`flex-1 p-8 bg-gray-50 transition-all ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64`}
      >
        <h2 className="text-xl font-semibold mb-6">My Purchases</h2>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">
            {errorMessage}
          </div>
        )}

        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchases.map((course, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4">
                <img
                  className="rounded-lg w-full h-40 object-cover"
                  src={course.image?.url || "https://via.placeholder.com/200"}
                  alt={course.title}
                />

                <h3 className="text-lg font-bold mt-2">{course.title}</h3>

                <p className="text-gray-500 text-sm">
                  {course.description?.slice(0, 80)}...
                </p>

                <span className="text-green-600 font-semibold text-sm">
                  ₹{course.price}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No purchases found</p>
        )}
      </div>
    </div>
  );
}

export default Purchases;