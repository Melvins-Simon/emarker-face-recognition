import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiBook,
  FiCalendar,
  FiDownload,
  FiBarChart2,
  FiUserCheck,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiTrash2,
  FiRefreshCcw,
} from "react-icons/fi";
import { useGlobalstore } from "../../store/Globalstore";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { PageLoader } from "../Loader";

const Admindash = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [lecturers, setLecturers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [attendanceReports, setAttendanceReports] = useState([]);

  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    lecturer: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    add_course,
    get_courses,
    delete_course,
    get_all_users,
    stats,
    all_users,
  } = useGlobalstore();

  const handleAddCourse = () => {
    if (newCourse.code && newCourse.name && newCourse.lecturer) {
      setCourses([
        ...courses,
        {
          id: courses.length + 1,
          code: newCourse.code,
          name: newCourse.name,
          lecturer: newCourse.lecturer,
          studentsEnrolled: 0,
        },
      ]);
      setNewCourse({ code: "", name: "", lecturer: "" });
    }
    (async () => {
      try {
        await add_course(newCourse.code, newCourse.name, newCourse.lecturer);
        const resp = await get_courses();
        setCourses(resp);
      } catch (error) {
        console.log(error);
      }
    })();
  };

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

  const filteredCourses = courses?.filter(
    (course) =>
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.lecturer.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [isloading, setisloading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setisloading(true);
        const [users, _] = await get_all_users();
        getAttendanceData(users);
        setisloading(false);
      } catch (error) {
        console.log(error);
        setisloading(false);
      }
    })();
  }, []);

  function getAttendanceData(jsonData) {
    const result = [];
    const courseIds = new Set();

    jsonData.forEach((user) => {
      if (user.role === "lecturer" && user.courses) {
        user.courses.forEach((course) => {
          if (courseIds.has(course._id)) return;
          courseIds.add(course._id);
          let latestDate = null;
          if (course.attendance && course.attendance.length > 0) {
            const sorted = [...course.attendance].sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            );
            latestDate = sorted[0].date.split("T")[0];
          }

          result.push({
            id: course._id,
            course: course.name,
            date: latestDate,
            lecturer: `Prof. ${user.username}`,
            studentsEnrolled: course.studentsEnrolled,
          });
        });
      }
    });
    setAttendanceReports(result);
    return result;
  }

  const Handlerefresh = async () => {
    try {
      setisloading(true);
      const [users, _] = await get_all_users();
      getAttendanceData(users);
      const newLecturers = users.filter((user) => user.role === "lecturer");
      setLecturers(newLecturers);

      (async () => {
        try {
          const res = await get_courses();
          setCourses(res);
        } catch (error) {
          console.log(error);
        }
      })();

      setisloading(false);
    } catch (error) {
      console.error("Refresh error:", error);
      setisloading(false);
    }
  };

  useEffect(() => {
    newCourse.code &&
      newCourse.lecturer &&
      newCourse.name &&
      (async () => {
        try {
          const res = await add_course(
            newCourse.code,
            newCourse.name,
            newCourse.lecturer
          );
          setCourses(res);
        } catch (error) {
          console.log(error);
        }
      })();
    (async () => {
      try {
        const res = await get_courses();
        setCourses(res);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const Handledelete = async (id) => {
    try {
      const res = await delete_course(id);
      setCourses(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isloading ? (
        <PageLoader />
      ) : (
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar Toggle for Mobile */}
          <button
            className="md:hidden fixed top-4 right-4 z-50 bg-indigo-600 text-white p-2 rounded-lg shadow-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          {/* Sidebar */}
          <div
            className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 transform transition-transform duration-200 ease-in-out
          fixed md:static inset-y-0 left-0 z-40 w-64 bg-indigo-800 text-white p-4 overflow-y-auto`}
          >
            <div className="flex items-center space-x-2 p-4 border-b border-indigo-700">
              <FiUserCheck className="text-2xl text-indigo-200" />
              <h1 className="text-xl font-bold text-white">
                <div className="text-xl font-extrabold font-tektur textgr">
                  emarker
                </div>{" "}
                Admin
              </h1>
            </div>
            <nav className="mt-6">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-200 hover:bg-indigo-700 hover:text-white"
                }`}
              >
                <FiBarChart2 className="mr-3" />
                Dashboard Overview
              </button>

              <button
                onClick={() => setActiveTab("courses")}
                className={`flex items-center w-full p-3 rounded-lg mt-2 transition-colors ${
                  activeTab === "courses"
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-200 hover:bg-indigo-700 hover:text-white"
                }`}
              >
                <FiBook className="mr-3" />
                Manage Courses
              </button>
              <button
                onClick={() => setActiveTab("attendance")}
                className={`flex items-center w-full p-3 rounded-lg mt-2 transition-colors ${
                  activeTab === "attendance"
                    ? "bg-indigo-700 text-white"
                    : "text-indigo-200 hover:bg-indigo-700 hover:text-white"
                }`}
              >
                <FiCalendar className="mr-3" />
                Attendance Reports
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {/* Header */}
            <header className="bg-white shadow-sm p-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <h2 className="text-xl font-semibold text-gray-800 capitalize">
                {activeTab === "dashboard"
                  ? "Dashboard Overview"
                  : activeTab === "students"
                  ? "Student Management"
                  : activeTab === "lecturers"
                  ? "Lecturer Management"
                  : activeTab === "courses"
                  ? "Course Management"
                  : activeTab === "attendance"
                  ? "Attendance Reports"
                  : "System Settings"}
              </h2>
              <div
                onClick={Handlerefresh}
                className="text-white font-semibold flex text-sm justify-center items-center gap-3 cursor-pointer bg-gradient-to-br from-violet-600 to-blue-600 py-1 px-3 hover:opacity-80 active:opacity-50 trans rounded-md "
              >
                Refresh DB <FiRefreshCcw />
              </div>
              <div className="relative w-full md:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-indigo-600" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full md:w-64 pl-10 pr-4 py-2 text-indigo-600 placeholder:text-indigo-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </header>

            {/* Dashboard Content */}
            <main className="p-4">
              {activeTab === "dashboard" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Stats Cards */}
                  <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                        <FiUsers className="text-2xl" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">
                          Total Students
                        </h3>
                        <p className="text-2xl font-semibold text-gray-800">
                          {stats?.students}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-green-100 text-green-600">
                        <FiUsers className="text-2xl" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">
                          Total Lecturers
                        </h3>
                        <p className="text-2xl font-semibold text-gray-800">
                          {stats?.lecturers}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                        <FiBook className="text-2xl" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-500">
                          Active Courses
                        </h3>
                        <p className="text-2xl font-semibold text-gray-800">
                          {attendanceReports.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Attendance */}
                  <div className="md:col-span-2 bg-white rounded-lg shadow p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Recent Attendance Sessions
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Course
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Lecturer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {attendanceReports.slice(0, 5).map((report) => (
                            <tr key={report.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {report.course}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {report.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {report.lecturer}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button
                                  onClick={() =>
                                    handleDownloadReport(report.id)
                                  }
                                  className="text-indigo-600 hover:text-indigo-900 flex items-center cursor-pointer"
                                >
                                  <FiDownload className="mr-1 " /> Download
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* System Status */}
                  <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      System Status
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            Face Recognition Accuracy
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            98%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: "98%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            Storage Usage
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            65%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: "65%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "courses" && (
                <div className="space-y-6">
                  {/* Add Course Form */}
                  <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Add New Course
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="courseCode"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Course Code
                        </label>
                        <input
                          type="text"
                          id="courseCode"
                          className="w-full border border-gray-300 text-indigo-600 placeholder:text-indigo-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="e.g. CS101"
                          value={newCourse.code}
                          onChange={(e) =>
                            setNewCourse({ ...newCourse, code: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="courseName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Course Name
                        </label>
                        <input
                          type="text"
                          id="courseName"
                          className="w-full border text-indigo-600 placeholder:text-indigo-400 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="e.g. Introduction to Programming"
                          value={newCourse.name}
                          onChange={(e) =>
                            setNewCourse({ ...newCourse, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lecturer"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Lecturer
                        </label>
                        <select
                          id="lecturer"
                          className="w-full border text-indigo-600 placeholder:text-indigo-400 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          value={newCourse.lecturer}
                          onChange={(e) =>
                            setNewCourse({
                              ...newCourse,
                              lecturer: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Lecturer</option>
                          {lecturers.map((lecturer) => {
                            return (
                              <option key={lecturer._id} value={lecturer._id}>
                                Prof. {lecturer.username}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={handleAddCourse}
                        className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                      >
                        <FiPlus className="mr-1" /> Add Course
                      </button>
                    </div>
                  </div>

                  {/* Courses List */}
                  <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Course List
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Lecturer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Students
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredCourses
                            ?.slice((currentPage - 1) * 5, currentPage * 5)
                            .map((course) => (
                              <tr key={course.code}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {course.code}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {course.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {course.lecturer}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {course.studentsEnrolled}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <button
                                    onClick={() =>
                                      Handledelete(course._id || course.id)
                                    }
                                    className="cursor-pointer text-red-600 hover:text-red-900 flex items-center"
                                  >
                                    <FiTrash2 className="mr-1" /> Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    {filteredCourses?.length > 5 && (
                      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            disabled={
                              currentPage ===
                              Math.ceil(filteredCourses.length / 5)
                            }
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Next
                          </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-gray-700">
                              Showing{" "}
                              <span className="font-medium">
                                {(currentPage - 1) * 5 + 1}
                              </span>{" "}
                              to{" "}
                              <span className="font-medium">
                                {Math.min(
                                  currentPage * 5,
                                  filteredCourses.length
                                )}
                              </span>{" "}
                              of{" "}
                              <span className="font-medium">
                                {filteredCourses.length}
                              </span>{" "}
                              courses
                            </p>
                          </div>
                          <div>
                            <nav
                              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                              aria-label="Pagination"
                            >
                              <button
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.max(prev - 1, 1)
                                  )
                                }
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                              >
                                <span className="sr-only">Previous</span>
                                <FiChevronLeft className="h-5 w-5" />
                              </button>
                              {Array.from({
                                length: Math.ceil(filteredCourses.length / 5),
                              }).map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setCurrentPage(i + 1)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    currentPage === i + 1
                                      ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                  }`}
                                >
                                  {i + 1}
                                </button>
                              ))}
                              <button
                                onClick={() =>
                                  setCurrentPage((prev) => prev + 1)
                                }
                                disabled={
                                  currentPage ===
                                  Math.ceil(filteredCourses.length / 5)
                                }
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                              >
                                <span className="sr-only">Next</span>
                                <FiChevronRight className="h-5 w-5" />
                              </button>
                            </nav>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "attendance" && (
                <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
                  <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Attendance Reports
                    </h3>
                    <div className="flex flex-col text-indigo-600 placeholder:text-indigo-400 md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                      <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <option>Filter by Course</option>
                        {courses.map((course) => (
                          <option key={course.name}>{course.name}</option>
                        ))}
                      </select>
                      <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <option>Filter by Date</option>
                        <option>Today</option>
                        <option>This Week</option>
                        <option>This Month</option>
                      </select>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lecturer
                          </th>

                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {attendanceReports.map((report) => (
                          <tr key={report.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {report.course}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {report.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {report.lecturer}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => handleDownloadReport(report.id)}
                                className="text-indigo-600 hover:text-indigo-900 flex items-center cursor-pointer"
                              >
                                <FiDownload className="mr-1 " /> Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </>
  );
};
export default Admindash;
