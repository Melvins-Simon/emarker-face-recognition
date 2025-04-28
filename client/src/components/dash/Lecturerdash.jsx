import { BookCheck, Download, LogOut, User, Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthstore } from "../../store/Authstore";

const Lecturerdash = () => {
  const { user, signout } = useAuthstore();
  const navigate = useNavigate();

  // Get units assigned to lecturer or use sample data
  const units = user?.units || [
    "CS101",
    "ENG202",
    "PHY103",
    "MATH205",
    "CHEM110",
  ];
  const [selectedUnit, setSelectedUnit] = useState(units[0] || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUnits, setFilteredUnits] = useState(units);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUnits(units);
    } else {
      setFilteredUnits(
        units.filter((unit) =>
          unit.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, units]);

  const handleLogout = async () => {
    try {
      await signout();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-indigo-800">Lecturer Portal</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-800 hidden sm:block">
            Welcome {localStorage.getItem("user") || "Lecturer"}!
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
      <main className="container mx-auto p-4 md:p-6 max-w-4xl">
        {/* Unit Selection */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 relative">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Select Unit
          </h2>
          <div className="relative">
            <div className="flex items-center border border-indigo-600 rounded-md overflow-hidden">
              <Search className="size-5 text-gray-500 ml-3" />
              <input
                type="text"
                placeholder="Search for a course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full p-2 focus:outline-none text-gray-800"
              />
            </div>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full text-indigo-800 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredUnits.length > 0 ? (
                  filteredUnits.map((unit) => (
                    <div
                      key={unit}
                      className={`p-2 text-indigo-800 hover:bg-indigo-50 cursor-pointer ${
                        selectedUnit === unit ? "bg-indigo-100" : ""
                      }`}
                      onClick={() => {
                        setSelectedUnit(unit);
                        setIsDropdownOpen(false);
                        setSearchTerm("");
                      }}
                    >
                      {unit}
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-indigo-800 ">No courses found</div>
                )}
              </div>
            )}
          </div>

          {/* Selected unit display (optional) */}
          {selectedUnit && (
            <div className="mt-3 p-2 text-green-800 bg-gray-200 rounded-md">
              <span className="text-indigo-800 font-medium">Selected:</span>{" "}
              {selectedUnit}
            </div>
          )}
        </div>

        {/* Rest of your existing content remains the same */}
        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Session Card */}
          <Link
            to={`/face-recognition/session/${selectedUnit}`}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition flex flex-col items-center text-center"
          >
            <div className="bg-indigo-100 p-3 rounded-full mb-4">
              <BookCheck className="size-8 text-indigo-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Start Attendance Session
            </h3>
            <p className="text-gray-700 text-sm mb-4">for {selectedUnit}</p>
            <Link
              to={`/face-recognition/session/${user?.id}`}
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-2 rounded-md font-medium transition"
            >
              Begin Session
            </Link>
          </Link>

          {/* Download Reports Card */}
          <Link
            to={`/attendance/download/${selectedUnit}`}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition flex flex-col items-center text-center"
          >
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <Download className="size-8 text-green-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Download Attendance Report
            </h3>
            <p className="text-gray-700 text-sm mb-4">for {selectedUnit}</p>
            <button className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-md font-medium transition">
              Download Report
            </button>
          </Link>
        </div>

        {/* Quick Stats (Optional) */}
        <div className="bg-white rounded-lg shadow p-4 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Recent Sessions
          </h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              No recent sessions found for {selectedUnit}
            </p>
            {/* Would display actual session history here */}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t text-black flex justify-around py-3 md:hidden">
        <Link
          to={`/face-recognition/session/${user?.id}`}
          className="flex flex-col items-center text-indigo-700"
          title="Start Session"
        >
          <BookCheck className="size-6" />
          <span className="text-xs mt-1">Session</span>
        </Link>
        <Link
          to={`/attendance/download/${selectedUnit}`}
          className="flex flex-col items-center text-green-700"
          title="Download Reports"
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

export default Lecturerdash;
