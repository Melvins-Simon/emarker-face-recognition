import { Download, LogOut, BookOpenCheck, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthstore } from "../../store/Authstore";

const StudentDash = () => {
  const { user, signout } = useAuthstore();
  const navigate = useNavigate();

  // Get courses enrolled or use sample data
  const courses = user?.courses || [
    "CS101",
    "MTH202",
    "ENG103",
    "PHY105",
    "CHEM110",
  ];
  const [selectedCourse, setSelectedCourse] = useState(courses[0] || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(
        courses.filter((course) =>
          course.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, courses]);

  const handleLogout = async () => {
    try {
      await signout();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-container")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-700">Student Portal</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-800 hidden sm:block">
            {localStorage.getItem("user") || "Student"}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-600 hover:text-red-800"
            title="Logout"
          >
            <LogOut className="size-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6 max-w-2xl flex-1">
        {/* Welcome Message */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, {localStorage.getItem("user") || "Student"}!
          </h2>
          <p className="text-gray-600">
            Track your attendance and academic progress
          </p>
        </div>

        {/* Course Selection */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 relative search-container">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Select Course
          </h2>
          <div className="relative">
            <div className="flex items-center border border-blue-500 rounded-md overflow-hidden">
              <Search className="size-5 text-gray-500 ml-3" />
              <input
                type="text"
                placeholder="Search your courses..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full p-2 focus:outline-none text-gray-800"
              />
            </div>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <div
                      key={course}
                      className={`p-3 hover:bg-blue-50 cursor-pointer transition ${
                        selectedCourse === course ? "bg-blue-100" : ""
                      }`}
                      onClick={() => {
                        setSelectedCourse(course);
                        setIsDropdownOpen(false);
                        setSearchTerm("");
                      }}
                    >
                      <span className="text-gray-800 font-medium">
                        {course}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-500">No courses found</div>
                )}
              </div>
            )}
          </div>

          {/* Selected course display */}
          {selectedCourse && (
            <div className="mt-3 p-3 bg-blue-50 rounded-md">
              <p className="text-gray-800">
                <span className="font-semibold text-blue-700">Selected:</span>{" "}
                <span className="font-medium">{selectedCourse}</span>
              </p>
            </div>
          )}
        </div>

        {/* Action Card */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition mb-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Download className="size-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Download Attendance Report
            </h3>
            <p className="text-gray-600 mb-4">For {selectedCourse}</p>
            <Link
              to={`/attendance/student-report/${selectedCourse}`}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition flex items-center justify-center gap-2"
            >
              <Download className="size-5" />
              Download Report
            </Link>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Your Attendance Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <span className="text-gray-800 font-medium">
                {selectedCourse}
              </span>
              <span className={`font-semibold  text-blue-600`}>85%</span>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="sticky bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 md:hidden">
        <Link
          to="/courses"
          className="flex flex-col items-center text-blue-600"
          title="My Courses"
        >
          <BookOpenCheck className="size-6" />
          <span className="text-xs mt-1">Courses</span>
        </Link>
        <Link
          to={`/attendance/student-report/${selectedCourse}`}
          className="flex flex-col items-center text-blue-600"
          title="Reports"
        >
          <Download className="size-6" />
          <span className="text-xs mt-1">Reports</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex flex-col items-center text-red-600"
          title="Logout"
        >
          <LogOut className="size-6" />
          <span className="text-xs mt-1">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default StudentDash;
