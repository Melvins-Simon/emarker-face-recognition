import { BookCheck, Download, LogOut, Search } from "lucide-react";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthstore } from "../../store/Authstore";
import { useGlobalstore } from "../../store/Globalstore";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Lecturerdash = () => {
  const { user, signout } = useAuthstore();
  const { get_all_users, lecs, get_courses, all_users } = useGlobalstore();
  const navigate = useNavigate();

  // State management
  const [selectedUnit, setSelectedUnit] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Memoized data
  const units = useMemo(() => lecs.map((unit) => unit.name), [lecs]);
  const filteredUnits = useMemo(
    () =>
      searchTerm === ""
        ? units
        : units.filter((unit) =>
            unit.toLowerCase().includes(searchTerm.toLowerCase())
          ),
    [searchTerm, units]
  );

  useEffect(() => {
    if (selectedUnit) {
      const foundCourse = lecs.find((course) => course.name === selectedUnit);

      if (foundCourse) {
        localStorage.setItem("courseuid", foundCourse._id);
      } else {
      }
    } else {
    }
  }, [selectedUnit]);
  useEffect(() => {
    if (units.length > 0 && !selectedUnit) {
      setSelectedUnit(units[0]);
      localStorage.setItem("courseuidc", units[0]);
    }
  }, [units]);

  // Fetch data
  useEffect(() => {
    (async () => {
      await get_all_users();
      await get_courses();
    })();
  }, []);

  // Handlers
  const handleLogout = async () => {
    try {
      await signout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Current course ID
  const currentCourseId = useMemo(
    () => lecs.find((lec) => lec.name === selectedUnit)?._id,
    [lecs, selectedUnit]
  );

  const handleDownloadReport = (courseId) => {
    let targetCourse = null;
    let lecturerName = "";
    for (const user of all_users) {
      if (user.courses) {
        const foundCourse = user.courses.find((c) => c._id === courseId);
        if (foundCourse) {
          targetCourse = foundCourse;
          lecturerName = user.username;
          break;
        }
      }
    }

    if (!targetCourse) {
      console.error("Course not found");
      return;
    }

    // Creating PDF document
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.setTextColor(0, 0, 0);
    const pageWidth = doc.internal.pageSize.width;
    const systemTitle = "EMARKER FACE RECOGNITION SYSTEM";
    const systemTitleWidth =
      (doc.getStringUnitWidth(systemTitle) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    doc.text(systemTitle, (pageWidth - systemTitleWidth) / 2, 20);
    doc.line(14, 22, pageWidth - 14, 22);

    doc.setFontSize(16);
    const reportTitle = `Attendance Report - ${targetCourse.name} (${targetCourse.code})`;
    const reportTitleWidth =
      (doc.getStringUnitWidth(reportTitle) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    doc.text(reportTitle, (pageWidth - reportTitleWidth) / 2, 35);

    doc.setFont(undefined, "normal");

    doc.setFontSize(12);
    doc.text(`Lecturer: Prof. ${lecturerName}`, 14, 45);
    doc.text(
      `Total Students Enrolled: ${targetCourse.studentsEnrolled}`,
      14,
      53
    );
    doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 14, 61);

    if (targetCourse.attendance && targetCourse.attendance.length > 0) {
      const headers = [
        ["No.", "Student Name", "Student Email", "Attendance Time", "Status"],
      ];

      // Preparing table data
      const tableData = targetCourse.attendance.map((record, index) => [
        index + 1,
        record.studentName,
        record.studentEmail,
        new Date(record.date).toLocaleString(),
        record.status.charAt(0).toUpperCase() + record.status.slice(1),
      ]);

      autoTable(doc, {
        startY: 70,
        head: headers,
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 35 },
          2: { cellWidth: 50 },
          3: { cellWidth: 40 },
          4: { cellWidth: 25 },
        },
      });

      const presentCount = targetCourse.attendance.filter(
        (a) => a.status === "present"
      ).length;
      const absentCount = targetCourse.attendance.length - presentCount;
      const lastY = doc.lastAutoTable.finalY || 75;

      doc.setFontSize(12);
      doc.text(`Attendance Summary:`, 14, lastY + 15);
      doc.text(`- Present: ${presentCount}`, 20, lastY + 25);
      doc.text(`- Absent: ${absentCount}`, 20, lastY + 35);
    } else {
      doc.setFontSize(12);
      doc.text("No attendance records found for this course", 14, 70);
    }

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.setFont(undefined, "italic");
    doc.text(
      `Developed in Unity`,
      pageWidth / 2,
      doc.internal.pageSize.height - 20,
      { align: "center" }
    );
    doc.setFont(undefined, "normal");
    doc.text(
      `System generated report`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );

    doc.save(
      `Attendance_Report_${targetCourse.code}_${targetCourse.name.replace(
        /\s+/g,
        "_"
      )}.pdf`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <h1 className="text-xl font-bold text-indigo-800">Lecturer Portal</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-800 hidden sm:block">
            Welcome {user?.username || "Lecturer"}!
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 cursor-pointer"
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
          <h2 className="text-lg font-semibold text-gray-800 mb-3 cursor-default">
            Select Unit
          </h2>
          <div className="relative">
            <div className="flex items-center border border-indigo-600 rounded-md overflow-hidden cursor-text">
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
              <div
                className="absolute z-10 mt-1 w-full text-neutral-950 bg-white border rounded-md shadow-lg max-h-60 overflow-auto cursor-pointer"
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                {filteredUnits.map((unit) => (
                  <div
                    key={unit}
                    className={`p-2 hover:bg-indigo-50 ${
                      selectedUnit === unit ? "bg-indigo-100" : ""
                    }`}
                    onClick={() => {
                      setSelectedUnit(unit);
                      localStorage.setItem("courseuidc", unit);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {unit}
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedUnit && (
            <div className="mt-3 p-2 text-neutral-950 bg-gray-200 rounded-md cursor-default">
              <span className="font-medium">Selected:</span> {selectedUnit}
            </div>
          )}
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Session Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition flex flex-col items-center text-center cursor-default">
            <div className="bg-indigo-100 p-3 rounded-full mb-4">
              <BookCheck className="size-8 text-indigo-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Start Attendance Session
            </h3>
            <p className="text-gray-700 text-sm mb-4">for {selectedUnit}</p>
            <Link
              to={`/face-recognition/session/${user?._id}`}
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-2 rounded-md font-medium transition cursor-pointer"
            >
              Begin Session
            </Link>
          </div>

          {/* Download Reports Card */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition flex flex-col items-center text-center cursor-default">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <Download className="size-8 text-green-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Download Attendance Report
            </h3>
            <p className="text-gray-700 text-sm mb-4">for {selectedUnit}</p>
            <button
              onClick={() => handleDownloadReport(currentCourseId)}
              disabled={isGenerating || !selectedUnit}
              className={`w-full ${
                isGenerating
                  ? "bg-green-600"
                  : "bg-green-700 hover:bg-green-800"
              } text-white py-2 rounded-md font-medium transition flex items-center justify-center gap-2 cursor-pointer`}
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin">↻</span>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="size-5" />
                  Download Report
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 md:hidden">
        <Link
          to={`/face-recognition/session/${user?._id}`}
          className="flex flex-col items-center text-indigo-700 cursor-pointer"
        >
          <BookCheck className="size-6" />
          <span className="text-xs mt-1">Session</span>
        </Link>
        <button
          onClick={() => handleDownloadReport(currentCourseId)}
          className="flex flex-col items-center text-green-700 cursor-pointer"
          disabled={isGenerating}
        >
          <Download className="size-6" />
          <span className="text-xs mt-1">Reports</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex flex-col items-center text-red-600 cursor-pointer"
        >
          <LogOut className="size-6" />
          <span className="text-xs mt-1">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Lecturerdash;
