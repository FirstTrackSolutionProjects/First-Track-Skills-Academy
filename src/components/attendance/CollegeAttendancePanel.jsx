import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import {
  FaCalendarCheck,
  FaCalendarAlt,
  FaSearch,
  FaSpinner,
  FaEye,
  FaGraduationCap,
  FaBookOpen,
  FaLayerGroup,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaClock,
  FaUserGraduate,
  FaInfoCircle,
} from "react-icons/fa";
import { getCollegeAttendance } from "../../service/attendanceService";

const CollegeAttendancePanel = ({ courses = [] }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterHealth, setFilterHealth] = useState("ALL"); // ALL, GOOD, AT_RISK
  const [selectedStudentForLog, setSelectedStudentForLog] = useState(null);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCourseId) params.course_id = selectedCourseId;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const result = await getCollegeAttendance(params);
      setData(result);
    } catch (error) {
      toast.error(error.message || "Failed to load college student attendance");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedCourseId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAttendance();
  };

  const summary = data?.summary || {
    total_enrolled: 0,
    total_sessions: 0,
    avg_attendance_percentage: 0,
    high_attendance_count: 0,
    low_attendance_count: 0,
  };

  const students = useMemo(() => {
    if (!data?.students) return [];
    if (filterHealth === "GOOD") {
      return data.students.filter((s) => s.attendance_percentage >= 75);
    }
    if (filterHealth === "AT_RISK") {
      return data.students.filter((s) => s.attendance_percentage < 75);
    }
    return data.students;
  }, [data, filterHealth]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Partner Students</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{summary.total_enrolled}</p>
          <p className="text-[11px] text-slate-400 mt-1">Joined via partner link</p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Lectures Held</p>
          <p className="text-2xl font-black text-blue-700 mt-1">{summary.total_sessions}</p>
          <p className="text-[11px] text-blue-600/80 mt-1">Total recorded sessions</p>
        </div>

        <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-4 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-orange-700">Average Rate</p>
          <p className="text-2xl font-black text-orange-600 mt-1">{summary.avg_attendance_percentage}%</p>
          <p className="text-[11px] text-orange-600/80 mt-1">Across all courses</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Regular (≥75%)</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{summary.high_attendance_count}</p>
          <p className="text-[11px] text-emerald-600/80 mt-1">Satisfactory standing</p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 shadow-xs col-span-2 sm:col-span-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Low Attendance (&lt;75%)</p>
          <p className="text-2xl font-black text-rose-700 mt-1">{summary.low_attendance_count}</p>
          <p className="text-[11px] text-rose-600/80 mt-1">Needs attention</p>
        </div>
      </div>

      {/* Main Filter & Roster Panel */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Banner with Read-Only Notice */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900">Student Attendance Tracker</h3>
              <span className="rounded-full bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
                Read-Only Partner View
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Verify if students enrolled via your college partnership are attending their scheduled Google Classroom sessions.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search student name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-52 sm:w-64 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
              />
            </div>

            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-orange-500 focus:bg-white focus:outline-none transition"
            >
              <option value="">All Partner Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            <select
              value={filterHealth}
              onChange={(e) => setFilterHealth(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-orange-500 focus:bg-white focus:outline-none transition"
            >
              <option value="ALL">All Attendance Levels</option>
              <option value="GOOD">Regular (&ge; 75%)</option>
              <option value="AT_RISK">At Risk (&lt; 75%)</option>
            </select>

            <button
              type="submit"
              className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-2 text-xs font-bold transition shadow-xs"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Student Attendance Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-semibold flex items-center justify-center gap-2">
            <FaSpinner className="animate-spin text-orange-500 text-lg" />
            Loading partner attendance records...
          </div>
        ) : !students.length ? (
          <div className="p-12 text-center text-slate-500">
            <FaUserGraduate className="mx-auto text-4xl text-slate-300 mb-3" />
            <p className="font-bold text-slate-700">No student attendance records found</p>
            <p className="text-xs text-slate-400 mt-1">
              Either no students have enrolled through your link yet, or no attendance sessions have been logged.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/90 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course & Batch</th>
                  <th className="py-3 px-4 text-center">Lectures Held</th>
                  <th className="py-3 px-4 text-center">Attended</th>
                  <th className="py-3 px-4 text-center">Absent</th>
                  <th className="py-3 px-4">Attendance Rate</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => {
                  const name = [student.first_name, student.last_name].filter(Boolean).join(" ") || "Student";
                  const pct = student.attendance_percentage || 0;
                  const isHealthy = pct >= 75;

                  return (
                    <tr key={`${student.student_id}-${student.course_id}`} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {student.profile_image ? (
                            <img
                              src={student.profile_image}
                              alt={name}
                              className="h-9 w-9 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-xs uppercase">
                              {name.slice(0, 2)}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">{name}</p>
                            <p className="text-xs text-slate-500 leading-tight mt-0.5">{student.email}</p>
                            {student.phone_number && (
                              <p className="text-[11px] text-slate-400 mt-0.5">{student.phone_number}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800 leading-tight">{student.course_title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {student.batch_name ? `${student.batch_name} (${student.batch_timing})` : "Unassigned Batch"}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                        {student.total_sessions}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-xs">
                          {student.attended_sessions}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 text-xs">
                          {student.absent_sessions}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 min-w-[150px]">
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className={isHealthy ? "text-emerald-700" : "text-rose-700"}>
                            {pct}%
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {isHealthy ? "Good Standing" : "Needs Attention"}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isHealthy ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500"
                            }`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedStudentForLog(student)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 text-xs font-bold transition shadow-2xs"
                        >
                          <FaEye className="text-slate-500 text-xs" />
                          <span>Lecture Log</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Student Lecture History Modal */}
      {selectedStudentForLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    {[selectedStudentForLog.first_name, selectedStudentForLog.last_name].filter(Boolean).join(" ")}
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                      selectedStudentForLog.attendance_percentage >= 75
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {selectedStudentForLog.attendance_percentage}% Attendance
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Course: <span className="font-semibold text-slate-700">{selectedStudentForLog.course_title}</span>
                  {selectedStudentForLog.batch_name && ` • Batch: ${selectedStudentForLog.batch_name}`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudentForLog(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Quick Summary Pill Bar */}
            <div className="grid grid-cols-4 gap-2 my-4 text-center">
              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400">Total Lectures</p>
                <p className="text-base font-extrabold text-slate-800">{selectedStudentForLog.total_sessions}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-2.5 border border-emerald-100">
                <p className="text-[10px] uppercase font-bold text-emerald-600">Present</p>
                <p className="text-base font-extrabold text-emerald-700">{selectedStudentForLog.attended_sessions}</p>
              </div>
              <div className="rounded-xl bg-rose-50 p-2.5 border border-rose-100">
                <p className="text-[10px] uppercase font-bold text-rose-600">Absent</p>
                <p className="text-base font-extrabold text-rose-700">{selectedStudentForLog.absent_sessions}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-2.5 border border-amber-100">
                <p className="text-[10px] uppercase font-bold text-amber-600">Late</p>
                <p className="text-base font-extrabold text-amber-700">{selectedStudentForLog.late_sessions || 0}</p>
              </div>
            </div>

            {/* Sessions List */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-2.5">
              {!selectedStudentForLog.sessions || !selectedStudentForLog.sessions.length ? (
                <p className="text-center text-xs text-slate-400 py-8">
                  No individual session logs recorded for this student yet.
                </p>
              ) : (
                selectedStudentForLog.sessions.map((sess, idx) => {
                  const statusColors = {
                    PRESENT: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    ABSENT: "bg-rose-50 text-rose-700 border-rose-200",
                    LATE: "bg-amber-50 text-amber-700 border-amber-200",
                    EXCUSED: "bg-blue-50 text-blue-700 border-blue-200",
                  };

                  return (
                    <div
                      key={sess.session_id || idx}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-bold">
                          #{idx + 1}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            {sess.session_title || "Course Lecture"}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {sess.session_date ? new Date(sess.session_date).toLocaleDateString() : "Date N/A"}
                            {sess.remarks && ` • Note: ${sess.remarks}`}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold border uppercase tracking-wider ${
                          statusColors[sess.status] || "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {sess.status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setSelectedStudentForLog(null)}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeAttendancePanel;
