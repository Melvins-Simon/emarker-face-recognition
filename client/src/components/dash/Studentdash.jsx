import { Download, LogOut, BookOpenCheck, Search } from "lucide-react";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthstore } from "../../store/Authstore";
import { useGlobalstore } from "../../store/Globalstore";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

const StudentDash = () => {
  const { signout } = useAuthstore();
  const { get_all_users, get_courses, lecs, all_users } = useGlobalstore();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await get_all_users();

      await get_courses();
    })();
  }, []);
  // Memoize courses to prevent recreation on every render
  const courses = lecs && useMemo(() => lecs?.map((unit) => unit.name), [lecs]); // Only recreate if user.courses changes

  const [selectedCourse, setSelectedCourse] = useState(courses[0] || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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

  // Calculate filtered courses directly without separate state
  const filteredCourses = useMemo(() => {
    return searchTerm === ""
      ? courses
      : courses.filter((course) =>
          course.toLowerCase().includes(searchTerm.toLowerCase())
        );
  }, [searchTerm, courses]);

  // Handle initial selection when courses change
  useEffect(() => {
    if (courses.length > 0 && !courses.includes(selectedCourse)) {
      setSelectedCourse(courses[0]);
    }
  }, [courses, selectedCourse]);

  const handleLogout = async () => {
    try {
      await signout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
            className="flex items-center gap-1 text-red-600 hover:text-red-800 cursor-pointer"
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
            <button
              onClick={() =>
                handleDownloadReport(localStorage.getItem("courseuid"))
              }
              disabled={isGenerating || !selectedCourse}
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
