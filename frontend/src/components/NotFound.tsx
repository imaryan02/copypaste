import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => (
  <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
    <h1 className="text-4xl font-bold text-red-600 mb-4">404 — Page Not Found</h1>
    <p className="text-lg text-gray-600 mb-6">
      Oops! The page or room you are looking for does not exist.
    </p>
    <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
