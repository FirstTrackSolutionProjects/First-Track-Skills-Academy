import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import {
  FaCalendarCheck,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaClock,
  FaInfoCircle,
  FaExternalLinkAlt,
  FaUsers,
  FaSearch,
  FaSpinner,
  FaFilter,
  FaGraduationCap,
  FaBookOpen,
  FaLayerGroup,
} from "react-icons/fa";
import { getBatchAttendance, markAttendance } from "../../service/attendanceService";

const MarkAttendancePanel = ({ courses = [], batches = [], initialBatchId = null, initialDate = null }) => {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState(initialBatchId || "");
  const [selectedDate, setSelectedDate] = useState(
    initialDate || new Date().toISOString().split("T")[0]
  );
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  const [students, setStudents] = useState([]);
  const [existingSession, setExistingSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Filter batches based on selected course
  const availableBatches = useMemo(() => {
    if (!selectedCourseId) return batches;
    return batches.filter(
      (b) => String(b.course_id || b.course?.id) === String(selectedCourseId)
    );
  }, [batches, selectedCourseId]);

  // When courses/batches load or initialBatchId is passed
  useEffect(() => {
    if (initialBatchId && batches.length) {
      const found = batches.find((b) => String(b.id) === String(initialBatchId));
      if (found) {
        setSelectedBatchId(found.id);
        setSelectedCourseId(found.course_id || found.course?.id || "");
      }
    } else if (batches.length && !selectedBatchId) {
      setSelectedBatchId(batches[0].id);
      setSelectedCourseId(batches[0].course_id || batches[0].course?.id || "");
    }
  }, [batches, initialBatchId]);

  // Find currently active course object
  const currentCourse = useMemo(() => {
    if (selectedCourseId) {
      return courses.find((c) => String(c.id) === String(selectedCourseId));
    }
    if (selectedBatchId) {
      const b = batches.find((b) => String(b.id) === String(selectedBatchId));
      if (b) {
        return courses.find((c) => String(c.id) === String(b.course_id || b.course?.id)) || b.course;
      }
    }
    return null;
  }, [courses, batches, selectedCourseId, selectedBatchId]);

  // Load batch roster and attendance for selected date
  const loadBatchRoster = async (batchId, date) => {
    if (!batchId || !date) return;
    try {
      setLoading(true);
      const data = await getBatchAttendance(batchId, date);
      setExistingSession(data.session);

      if (data.session) {
        setSessionTitle(data.session.session_title || "");
        setSessionNotes(data.session.notes || "");
      } else {
        setSessionTitle("");
        setSessionNotes("");
      }

      // Default students to their current session status or "PRESENT"
      const mapped = (data.students || []).map((s) => ({
        ...s,
        status: s.status || "PRESENT",
        remarks: s.remarks || "",
      }));
      setStudents(mapped);
    } catch (error) {
      toast.error(error.message || "Failed to load batch attendance roster");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBatchId && selectedDate) {
      loadBatchRoster(selectedBatchId, selectedDate);
    }
  }, [selectedBatchId, selectedDate]);

  // Status changers
  const updateStudentStatus = (studentId, newStatus) => {
    setStudents((prev) =>
      prev.map((s) => (s.student_id === studentId ? { ...s, status: newStatus } : s))
    );
  };

  const updateStudentRemarks = (studentId, newRemarks) => {
    setStudents((prev) =>
      prev.map((s) => (s.student_id === studentId ? { ...s, remarks: newRemarks } : s))
    );
  };

  const markAll = (status) => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
    toast.info(`Marked all students as ${status}`);
  };

  // Submit attendance to backend
  const handleSaveAttendance = async (e) => {
    e?.preventDefault();
    if (!selectedBatchId) {
      toast.error("Please select a batch");
      return;
    }
    if (!selectedDate) {
      toast.error("Please select a session date");
      return;
    }
    if (!students.length) {
      toast.error("No enrolled students in this batch to mark attendance for");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        batch_id: Number(selectedBatchId),
        session_date: selectedDate,
        session_title: sessionTitle?.trim() || undefined,
        notes: sessionNotes?.trim() || undefined,
        records: students.map((s) => ({
          student_id: s.student_id,
          status: s.status,
          remarks: s.remarks?.trim() || undefined,
        })),
      };

      await markAttendance(payload);
      toast.success(
        existingSession
          ? "Attendance updated successfully!"
          : "Attendance recorded successfully!"
      );
      // Reload updated session
      await loadBatchRoster(selectedBatchId, selectedDate);
    } catch (error) {
      toast.error(error.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  // Filtered student list for rendering
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const name = `${s.first_name || ""} ${s.last_name || ""}`.toLowerCase();
      const email = (s.email || "").toLowerCase();
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || name.includes(query) || email.includes(query);
      const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [students, searchQuery, statusFilter]);

  // Statistics counts
  const stats = useMemo(() => {
    const total = students.length;
    const present = students.filter((s) => s.status === "PRESENT").length;
    const absent = students.filter((s) => s.status === "ABSENT").length;
    const late = students.filter((s) => s.status === "LATE").length;
    const excused = students.filter((s) => s.status === "EXCUSED").length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    return { total, present, absent, late, excused, rate };
  }, [students]);

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 text-xl shadow-xs">
              <FaCalendarCheck />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-slate-900">Mark Live Attendance</h3>
                {existingSession && (
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                    Recorded (Editing)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manually record and verify student attendance during or after Google Classroom lectures.
              </p>
            </div>
          </div>

          {/* Google Classroom Direct Launch Button */}
          {currentCourse?.google_classroom_link ? (
            <a
              href={currentCourse.google_classroom_link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 text-xs font-bold shadow-md transition"
            >
              <span>Open Google Classroom</span>
              <FaExternalLinkAlt className="text-[11px]" />
            </a>
          ) : (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl flex items-center gap-2">
              <FaInfoCircle className="shrink-0" />
              <span>No Google Classroom link set for this course yet</span>
            </div>
          )}
        </div>

        {/* Selection Form */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => {
                const newCourseId = e.target.value;
                setSelectedCourseId(newCourseId);
                const matchingBatches = batches.filter(
                  (b) => String(b.course_id || b.course?.id) === String(newCourseId)
                );
                if (matchingBatches.length > 0) {
                  setSelectedBatchId(matchingBatches[0].id);
                } else {
                  setSelectedBatchId("");
                }
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
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
              Batch <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
            >
              <option value="">Select a Batch</option>
              {availableBatches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.batch_name} ({b.batch_timing} - {b.course?.title || b.course_title || "Course"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Session Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Lecture Topic / Session Title (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. React Hooks, Docker Basics, System Design Introduction"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Notes / Remarks (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Lab assignment discussed, 1 student excused"
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Classroom Helper Banner */}
      {currentCourse?.google_classroom_link && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/80 p-4 text-xs">
          <div className="flex items-center gap-3 text-blue-900">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <FaInfoCircle className="text-base" />
            </span>
            <div>
              <p className="font-bold text-sm">Active Google Classroom Linked</p>
              <p className="text-blue-700 mt-0.5">
                URL: <span className="font-mono font-medium underline">{currentCourse.google_classroom_link}</span>
              </p>
            </div>
          </div>
          <a
            href={currentCourse.google_classroom_link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 shrink-0 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 text-xs transition shadow-xs"
          >
            <span>Launch Live Classroom</span>
            <FaExternalLinkAlt className="text-[10px]" />
          </a>
        </div>
      )}

      {/* Metrics & Quick Actions Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Enrolled</p>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-center shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Present</p>
          <p className="text-xl font-extrabold text-emerald-700 mt-0.5">{stats.present}</p>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-center shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Absent</p>
          <p className="text-xl font-extrabold text-rose-700 mt-0.5">{stats.absent}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-center shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Late</p>
          <p className="text-xl font-extrabold text-amber-700 mt-0.5">{stats.late}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 text-center shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Excused</p>
          <p className="text-xl font-extrabold text-blue-700 mt-0.5">{stats.excused}</p>
        </div>
        <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-3 text-center shadow-xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-orange-700">Attendance %</p>
          <p className="text-xl font-extrabold text-orange-600 mt-0.5">{stats.rate}%</p>
        </div>
      </div>

      {/* Roster Container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Controls Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-slate-50/80 border-b border-slate-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              Quick Bulk:
            </span>
            <button
              type="button"
              onClick={() => markAll("PRESENT")}
              disabled={!students.length}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-1.5 text-xs font-bold transition disabled:opacity-50"
            >
              <FaCheck className="text-xs" />
              All Present
            </button>
            <button
              type="button"
              onClick={() => markAll("ABSENT")}
              disabled={!students.length}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 px-3 py-1.5 text-xs font-bold transition disabled:opacity-50"
            >
              <FaTimes className="text-xs" />
              All Absent
            </button>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 sm:w-56 rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Filter by Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:border-orange-500 focus:outline-none"
            >
              <option value="ALL">All Statuses ({students.length})</option>
              <option value="PRESENT">Present ({stats.present})</option>
              <option value="ABSENT">Absent ({stats.absent})</option>
              <option value="LATE">Late ({stats.late})</option>
              <option value="EXCUSED">Excused ({stats.excused})</option>
            </select>
          </div>
        </div>

        {/* Student Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-semibold flex items-center justify-center gap-2">
            <FaSpinner className="animate-spin text-orange-500 text-lg" />
            Loading batch roster...
          </div>
        ) : !selectedBatchId ? (
          <div className="p-12 text-center text-slate-500">
            <FaLayerGroup className="mx-auto text-4xl text-slate-300 mb-3" />
            <p className="font-bold text-slate-700">Please select a Batch above to load students</p>
          </div>
        ) : !filteredStudents.length ? (
          <div className="p-12 text-center text-slate-500">
            <FaUsers className="mx-auto text-4xl text-slate-300 mb-3" />
            <p className="font-bold text-slate-700">No students found matching your filters</p>
            <p className="text-xs text-slate-400 mt-1">
              Ensure students have been allocated to this batch in the Student Allocation tab.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/90 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">College / Origin</th>
                  <th className="py-3 px-4 text-center">Attendance Status</th>
                  <th className="py-3 px-4">Remarks (Optional)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => {
                  const studentName = [student.first_name, student.last_name].filter(Boolean).join(" ") || "Student";
                  return (
                    <tr key={student.student_id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {student.profile_image ? (
                            <img
                              src={student.profile_image}
                              alt={studentName}
                              className="h-9 w-9 rounded-full object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-xs uppercase">
                              {studentName.slice(0, 2)}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">{studentName}</p>
                            <p className="text-xs text-slate-500 leading-tight mt-0.5">{student.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs">
                        {student.college_name ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                            <FaGraduationCap className="text-[10px]" />
                            {student.college_name}
                          </span>
                        ) : (
                          <span className="inline-block text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                            Individual Enrollment
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 gap-1">
                          <button
                            type="button"
                            onClick={() => updateStudentStatus(student.student_id, "PRESENT")}
                            className={`px-3 py-1 text-xs font-extrabold rounded-lg transition ${
                              student.status === "PRESENT"
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                            }`}
                          >
                            P
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStudentStatus(student.student_id, "ABSENT")}
                            className={`px-3 py-1 text-xs font-extrabold rounded-lg transition ${
                              student.status === "ABSENT"
                                ? "bg-rose-600 text-white shadow-xs"
                                : "text-slate-600 hover:text-rose-700 hover:bg-rose-50"
                            }`}
                          >
                            A
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStudentStatus(student.student_id, "LATE")}
                            className={`px-3 py-1 text-xs font-extrabold rounded-lg transition ${
                              student.status === "LATE"
                                ? "bg-amber-500 text-white shadow-xs"
                                : "text-slate-600 hover:text-amber-700 hover:bg-amber-50"
                            }`}
                          >
                            L
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStudentStatus(student.student_id, "EXCUSED")}
                            className={`px-3 py-1 text-xs font-extrabold rounded-lg transition ${
                              student.status === "EXCUSED"
                                ? "bg-blue-600 text-white shadow-xs"
                                : "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                            }`}
                          >
                            E
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <input
                          type="text"
                          placeholder="Note..."
                          value={student.remarks || ""}
                          onChange={(e) => updateStudentRemarks(student.student_id, e.target.value)}
                          className="w-full max-w-[200px] rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:outline-none"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Submit Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-slate-50 border-t border-slate-200">
          <div className="text-xs text-slate-500">
            <span className="font-bold text-slate-700">Summary:</span> {stats.present} Present, {stats.absent} Absent, {stats.late} Late ({stats.rate}% attendance rate for this date).
          </div>

          <button
            type="button"
            onClick={handleSaveAttendance}
            disabled={saving || loading || !students.length}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-6 py-2.5 text-sm font-bold shadow-md transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin text-sm" />
                <span>Saving Attendance...</span>
              </>
            ) : (
              <>
                <FaCalendarCheck className="text-sm" />
                <span>{existingSession ? "Update Attendance" : "Save Attendance"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendancePanel;
