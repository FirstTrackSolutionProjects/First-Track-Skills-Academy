import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaCalendarCheck,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaExternalLinkAlt,
  FaChalkboardTeacher,
  FaBookOpen,
  FaLayerGroup,
  FaSpinner,
  FaInfoCircle,
  FaGraduationCap,
} from "react-icons/fa";
import { getMyAttendance } from "../../service/attendanceService";

const StudentAttendancePanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await getMyAttendance();
      setData(res);
      // Auto expand first course if present
      if (res?.courses?.length) {
        setExpandedCourseId(res.courses[0].course_id);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load your attendance record");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const overall = data?.overall || {
    total_sessions: 0,
    attended_sessions: 0,
    absent_sessions: 0,
    overall_percentage: 0,
  };

  const isHealthyOverall = overall.overall_percentage >= 75;

  if (loading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center gap-3 font-semibold text-blue-700">
        <FaSpinner className="animate-spin text-xl text-orange-500" />
        Loading your attendance records...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Overall Attendance</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span
              className={`text-3xl font-black ${
                isHealthyOverall ? "text-emerald-600" : overall.overall_percentage >= 50 ? "text-amber-500" : "text-rose-600"
              }`}
            >
              {overall.overall_percentage}%
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {isHealthyOverall ? "Good Standing" : "Below 75%"}
            </span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isHealthyOverall ? "bg-emerald-500" : overall.overall_percentage >= 50 ? "bg-amber-500" : "bg-rose-500"
              }`}
              style={{ width: `${Math.min(overall.overall_percentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Total Lectures</p>
          <p className="text-3xl font-black text-blue-800 mt-2">{overall.total_sessions}</p>
          <p className="text-xs text-blue-600 mt-1">Conducted so far</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Attended</p>
          <p className="text-3xl font-black text-emerald-700 mt-2">{overall.attended_sessions}</p>
          <p className="text-xs text-emerald-600 mt-1">Present &amp; On-Time</p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-rose-700">Missed</p>
          <p className="text-3xl font-black text-rose-700 mt-2">{overall.absent_sessions}</p>
          <p className="text-xs text-rose-600 mt-1">Unattended sessions</p>
        </div>
      </div>

      {/* Minimum Attendance Policy Alert */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-xs text-blue-800">
        <FaInfoCircle className="mt-0.5 text-base text-blue-600 shrink-0" />
        <div>
          <p className="font-bold">Academy Attendance Requirement</p>
          <p className="mt-0.5 text-blue-700 leading-relaxed">
            Students are required to maintain a minimum of <span className="font-bold">75% attendance</span> in each enrolled course to be eligible for certification, company placement opportunities, and hackathons.
          </p>
        </div>
      </div>

      {/* Courses Attendance Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Enrolled Courses &amp; Lecture Logs</h3>

        {!data?.courses || !data.courses.length ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
            <FaBookOpen className="mx-auto text-4xl text-slate-300 mb-3" />
            <p className="font-bold text-slate-700">No course enrollments found</p>
            <p className="text-xs text-slate-400 mt-1">
              Enroll in a course from the Courses tab to start tracking your classroom attendance.
            </p>
          </div>
        ) : (
          data.courses.map((course) => {
            const isExpanded = expandedCourseId === course.course_id;
            const coursePct = course.attendance_percentage || 0;
            const isCourseHealthy = coursePct >= 75;

            return (
              <div
                key={course.course_id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
              >
                {/* Course Header Bar */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 text-lg shadow-xs">
                      <FaBookOpen />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-slate-900">{course.course_title}</h4>
                        {course.course_category && (
                          <span className="rounded-full bg-slate-100 text-slate-600 px-2.5 py-0.5 text-[11px] font-bold">
                            {course.course_category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                        {course.batch_name && (
                          <span>
                            Batch: <span className="font-semibold text-slate-700">{course.batch_name}</span> ({course.batch_timing})
                          </span>
                        )}
                        {course.mentor_name && (
                          <span>
                            Instructor: <span className="font-semibold text-slate-700">{course.mentor_name}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Classroom Link Launch */}
                    {course.google_classroom_link && (
                      <a
                        href={course.google_classroom_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3.5 py-2 text-xs font-bold transition shadow-xs"
                      >
                        <span>Classroom</span>
                        <FaExternalLinkAlt className="text-[10px]" />
                      </a>
                    )}

                    {/* Percentage Indicator */}
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <span
                          className={`text-xl font-black ${
                            isCourseHealthy ? "text-emerald-600" : coursePct >= 50 ? "text-amber-500" : "text-rose-600"
                          }`}
                        >
                          {coursePct}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {course.attended_sessions} / {course.total_sessions} Lectures
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedCourseId(isExpanded ? null : course.course_id)}
                      className="rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2 text-xs font-bold transition"
                    >
                      {isExpanded ? "Hide Logs" : "View Logs"}
                    </button>
                  </div>
                </div>

                {/* Progress bar below header */}
                <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCourseHealthy ? "bg-emerald-500" : coursePct >= 50 ? "bg-amber-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${Math.min(coursePct, 100)}%` }}
                  />
                </div>

                {/* Expandable Session Log Table */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-4 sm:p-5">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                      Lecture Attendance History
                    </h5>

                    {!course.sessions || !course.sessions.length ? (
                      <p className="text-xs text-slate-400 text-center py-6">
                        No individual class sessions recorded yet for this batch.
                      </p>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                            <tr>
                              <th className="py-2.5 px-3">Session #</th>
                              <th className="py-2.5 px-3">Date</th>
                              <th className="py-2.5 px-3">Topic / Subject</th>
                              <th className="py-2.5 px-3 text-center">Status</th>
                              <th className="py-2.5 px-3">Remarks</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {course.sessions.map((sess, idx) => {
                              const statusBadges = {
                                PRESENT: "bg-emerald-50 text-emerald-700 border-emerald-200",
                                ABSENT: "bg-rose-50 text-rose-700 border-rose-200",
                                LATE: "bg-amber-50 text-amber-700 border-amber-200",
                                EXCUSED: "bg-blue-50 text-blue-700 border-blue-200",
                              };

                              return (
                                <tr key={sess.session_id || idx} className="hover:bg-slate-50/70 transition">
                                  <td className="py-2.5 px-3 font-bold text-slate-500">#{idx + 1}</td>
                                  <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                                    {sess.session_date ? new Date(sess.session_date).toLocaleDateString() : "N/A"}
                                  </td>
                                  <td className="py-2.5 px-3 font-medium text-slate-700 max-w-[200px] truncate">
                                    {sess.session_title || "Standard Lecture"}
                                  </td>
                                  <td className="py-2.5 px-3 text-center">
                                    <span
                                      className={`inline-block px-2.5 py-0.5 rounded-full font-extrabold text-[10px] border uppercase tracking-wider ${
                                        statusBadges[sess.status] || "bg-slate-100 text-slate-600"
                                      }`}
                                    >
                                      {sess.status}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-3 text-slate-500">
                                    {sess.remarks || "—"}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentAttendancePanel;
