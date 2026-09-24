import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaSearch,
  FaSpinner,
  FaEye,
  FaEdit,
  FaFilter,
  FaBookOpen,
  FaLayerGroup,
  FaHistory,
} from "react-icons/fa";
import { getAttendanceSessions } from "../../service/attendanceService";

const AttendanceSessionsPanel = ({ courses = [], batches = [], onEditSession }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSessions = async (pageToFetch = 1) => {
    try {
      setLoading(true);
      const params = { page: pageToFetch, limit: 15 };
      if (selectedBatchId) params.batch_id = selectedBatchId;
      if (selectedCourseId) params.course_id = selectedCourseId;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const res = await getAttendanceSessions(params);
      setSessions(res.data || []);
      setPage(res.page || 1);
      setTotalPages(res.totalPages || 1);
      setTotalCount(res.count || 0);
    } catch (error) {
      toast.error(error.message || "Failed to load attendance session logs");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions(1);
  }, [selectedBatchId, selectedCourseId, startDate, endDate]);

  const handleClearFilters = () => {
    setSelectedCourseId("");
    setSelectedBatchId("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 text-xl shadow-xs">
              <FaHistory />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Attendance Session History</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit and inspect previously recorded classroom attendance sessions across batches.
              </p>
            </div>
          </div>

          <div className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
            Total Sessions Recorded: <span className="font-bold text-slate-900">{totalCount}</span>
          </div>
        </div>

        {/* Filter Inputs */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                setSelectedBatchId("");
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
            >
              <option value="">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Batch
            </label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
            >
              <option value="">All Batches</option>
              {batches
                .filter((b) => !selectedCourseId || String(b.course_id || b.course?.id) === String(selectedCourseId))
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.batch_name} ({b.batch_timing})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
            />
          </div>
        </div>

        {(selectedCourseId || selectedBatchId || startDate || endDate) && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-orange-600 hover:text-orange-700 font-bold hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-semibold flex items-center justify-center gap-2">
            <FaSpinner className="animate-spin text-orange-500 text-lg" />
            Loading attendance sessions...
          </div>
        ) : !sessions.length ? (
          <div className="p-12 text-center text-slate-500">
            <FaCalendarCheck className="mx-auto text-4xl text-slate-300 mb-3" />
            <p className="font-bold text-slate-700">No attendance sessions recorded yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Select "Mark Attendance" from the sidebar to take attendance for your first class session.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/90 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Session Date</th>
                  <th className="py-3 px-4">Batch & Timing</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Lecture Topic</th>
                  <th className="py-3 px-4">Marked By</th>
                  <th className="py-3 px-4 text-center">Present / Total</th>
                  <th className="py-3 px-4 text-center">Rate</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sessions.map((session) => {
                  const presentCount = session.present_count || 0;
                  const totalCount = session.total_count || 0;
                  const absentCount = session.absent_count || 0;
                  const percentage = session.attendance_percentage ?? (totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0);

                  return (
                    <tr key={session.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {session.session_date ? new Date(session.session_date).toLocaleDateString() : "N/A"}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800 leading-tight">
                          {session.batch?.batch_name || `Batch #${session.batch_id}`}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {session.batch?.batch_timing || "TIMING"}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {session.course?.title || "Course"}
                      </td>

                      <td className="py-3.5 px-4 max-w-[220px]">
                        <p className="truncate text-xs font-semibold text-slate-800" title={session.session_title}>
                          {session.session_title || "General Lecture"}
                        </p>
                        {session.notes && (
                          <p className="truncate text-[11px] text-slate-400 mt-0.5" title={session.notes}>
                            {session.notes}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                        {session.marker
                          ? [session.marker.first_name, session.marker.last_name].filter(Boolean).join(" ") || session.marker.email
                          : "System Admin"}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-xs">
                          <span className="text-emerald-700">{presentCount}</span>
                          <span className="text-slate-400">/</span>
                          <span className="text-slate-700">{totalCount}</span>
                        </span>
                        {absentCount > 0 && (
                          <span className="block text-[10px] text-rose-600 font-semibold mt-0.5">
                            {absentCount} absent
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block font-extrabold text-xs px-2 py-0.5 rounded-full border ${
                            percentage >= 75
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : percentage >= 50
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {percentage}%
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            onEditSession?.({
                              batchId: session.batch_id,
                              date: session.session_date,
                            })
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-1.5 text-xs font-bold transition shadow-2xs"
                        >
                          <FaEdit className="text-[11px]" />
                          <span>Edit Roster</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 bg-slate-50 border-t border-slate-200 text-xs">
            <span className="text-slate-500">
              Showing page <span className="font-bold text-slate-800">{page}</span> of{" "}
              <span className="font-bold text-slate-800">{totalPages}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => fetchSessions(page - 1)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => fetchSessions(page + 1)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceSessionsPanel;
