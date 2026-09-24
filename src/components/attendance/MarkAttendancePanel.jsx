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
  FaArrowLeft,
  FaChalkboardTeacher,
  FaEdit,
  FaPlus,
  FaChevronRight,
  FaHistory,
} from "react-icons/fa";
import {
  getBatchAttendance,
  markAttendance,
  getAttendanceSessions,
} from "../../service/attendanceService";

const MarkAttendancePanel = ({
  courses = [],
  batches = [],
  initialBatchId = null,
  initialDate = null,
}) => {
  // Navigation view levels: "BATCHES" | "CLASSES" | "ROSTER"
  const [viewLevel, setViewLevel] = useState("BATCHES");

  // Selected batch & class session state
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [sessionTopic, setSessionTopic] = useState("");
  const [sessionRemarks, setSessionRemarks] = useState("");
  const [students, setStudents] = useState([]);
  const [existingSessionId, setExistingSessionId] = useState(null);

  // Batch classes history state (Level 2)
  const [batchSessions, setBatchSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // Roster loading & saving state (Level 3)
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [saving, setSaving] = useState(false);

  // Filters for Level 1 (Batches)
  const [batchSearch, setBatchSearch] = useState("");
  const [batchCourseFilter, setBatchCourseFilter] = useState("");
  const [batchTimingFilter, setBatchTimingFilter] = useState("");

  // Filters for Level 3 (Roster)
  const [rosterSearch, setRosterSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Handle initial preselection (e.g. from AttendanceSessionsPanel)
  useEffect(() => {
    if (initialBatchId && batches.length) {
      const found = batches.find((b) => String(b.id) === String(initialBatchId));
      if (found) {
        setSelectedBatch(found);
        if (initialDate) {
          setSelectedDate(initialDate);
          setViewLevel("ROSTER");
        } else {
          setViewLevel("CLASSES");
        }
      }
    }
  }, [initialBatchId, initialDate, batches]);

  // Find course object for selected batch
  const selectedCourse = useMemo(() => {
    if (!selectedBatch) return null;
    const courseId = selectedBatch.course_id || selectedBatch.course?.id;
    return courses.find((c) => String(c.id) === String(courseId)) || selectedBatch.course;
  }, [selectedBatch, courses]);

  // Load historical sessions for selected batch (Level 2)
  const loadBatchSessions = async (batchId) => {
    if (!batchId) return;
    try {
      setLoadingSessions(true);
      const res = await getAttendanceSessions({ batch_id: batchId, limit: 50 });
      setBatchSessions(res.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to load classes for this batch");
      setBatchSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  // Load batch roster for a specific date (Level 3)
  const loadClassRoster = async (batchId, date) => {
    if (!batchId || !date) return;
    try {
      setLoadingRoster(true);
      const data = await getBatchAttendance(batchId, date);
      setExistingSessionId(data.session_id || null);
      setSessionTopic(data.session_topic || "");
      setSessionRemarks(data.session_remarks || "");

      const mapped = (data.students || []).map((s) => ({
        ...s,
        status: s.status || "PRESENT",
        remarks: s.remarks || "",
      }));
      setStudents(mapped);
    } catch (error) {
      toast.error(error.message || "Failed to load students for this class");
      setStudents([]);
    } finally {
      setLoadingRoster(false);
    }
  };

  // When selectedBatch changes and we enter CLASSES view
  useEffect(() => {
    if (selectedBatch && (viewLevel === "CLASSES" || viewLevel === "ROSTER")) {
      loadBatchSessions(selectedBatch.id);
    }
  }, [selectedBatch]);

  // When selectedBatch or selectedDate changes and we are in ROSTER view
  useEffect(() => {
    if (selectedBatch && selectedDate && viewLevel === "ROSTER") {
      loadClassRoster(selectedBatch.id, selectedDate);
    }
  }, [selectedBatch, selectedDate, viewLevel]);

  // Navigation handlers
  const handleOpenBatch = (batch) => {
    setSelectedBatch(batch);
    setViewLevel("CLASSES");
  };

  const handleOpenClassRoster = (date, topic = "") => {
    setSelectedDate(date);
    setSessionTopic(topic || "");
    setViewLevel("ROSTER");
  };

  const handleBackToBatches = () => {
    setViewLevel("BATCHES");
    setSelectedBatch(null);
  };

  const handleBackToClasses = () => {
    setViewLevel("CLASSES");
    if (selectedBatch) {
      loadBatchSessions(selectedBatch.id);
    }
  };

  // Status updates in Roster
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

  // Save Attendance (Level 3)
  const handleSaveAttendance = async (returnToClasses = false) => {
    if (!selectedBatch) {
      toast.error("No batch selected");
      return;
    }
    if (!selectedDate) {
      toast.error("Please pick a class session date");
      return;
    }
    if (!students.length) {
      toast.error("No students enrolled in this batch to mark attendance for");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        batch_id: Number(selectedBatch.id),
        session_date: selectedDate,
        session_topic: sessionTopic?.trim() || null,
        remarks: sessionRemarks?.trim() || null,
        records: students.map((s) => ({
          student_id: s.student_id,
          enrollment_id: s.enrollment_id || null,
          status: s.status,
          remarks: s.remarks?.trim() || null,
        })),
      };

      await markAttendance(payload);
      toast.success(
        existingSessionId
          ? "Class session attendance updated!"
          : "Class session attendance recorded successfully!"
      );

      // Refresh batch sessions list
      await loadBatchSessions(selectedBatch.id);

      if (returnToClasses) {
        setViewLevel("CLASSES");
      } else {
        await loadClassRoster(selectedBatch.id, selectedDate);
      }
    } catch (error) {
      toast.error(error.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  // Filtered batches for Level 1
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      const name = (b.batch_name || "").toLowerCase();
      const courseTitle = (b.course?.title || b.course_title || "").toLowerCase();
      const mentor = [b.mentor?.first_name, b.mentor?.last_name].filter(Boolean).join(" ").toLowerCase();
      const q = batchSearch.toLowerCase().trim();

      const matchesSearch = !q || name.includes(q) || courseTitle.includes(q) || mentor.includes(q);
      const matchesCourse = !batchCourseFilter || String(b.course_id || b.course?.id) === String(batchCourseFilter);
      const matchesTiming = !batchTimingFilter || b.batch_timing === batchTimingFilter;

      return matchesSearch && matchesCourse && matchesTiming;
    });
  }, [batches, batchSearch, batchCourseFilter, batchTimingFilter]);

  // Filtered students for Level 3
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const name = `${s.first_name || ""} ${s.last_name || ""}`.toLowerCase();
      const email = (s.email || "").toLowerCase();
      const q = rosterSearch.toLowerCase().trim();

      const matchesSearch = !q || name.includes(q) || email.includes(q);
      const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, rosterSearch, statusFilter]);

  // Statistics for Level 3
  const rosterStats = useMemo(() => {
    const total = students.length;
    const present = students.filter((s) => s.status === "PRESENT").length;
    const absent = students.filter((s) => s.status === "ABSENT").length;
    const late = students.filter((s) => s.status === "LATE").length;
    const excused = students.filter((s) => s.status === "EXCUSED").length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    return { total, present, absent, late, excused, rate };
  }, [students]);

  // Classroom Link for selected batch
  const classroomLink = selectedCourse?.google_classroom_link;

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* LEVEL 1: BATCHES LIST VIEW                                                */}
      {/* ========================================================================= */}
      {viewLevel === "BATCHES" && (
        <div className="space-y-6">
          {/* Header Panel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 text-xl shadow-xs">
                  <FaLayerGroup />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Batch Attendance Directory</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select a batch below to inspect its classes and record student attendance.
                  </p>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2">
                Active Batches: <span className="font-bold text-slate-900">{filteredBatches.length}</span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                <input
                  type="text"
                  placeholder="Search by batch name, course, or mentor..."
                  value={batchSearch}
                  onChange={(e) => setBatchSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none transition"
                />
              </div>

              <div>
                <select
                  value={batchCourseFilter}
                  onChange={(e) => setBatchCourseFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:border-orange-500 focus:bg-white focus:outline-none transition"
                >
                  <option value="">All Courses ({courses.length})</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={batchTimingFilter}
                  onChange={(e) => setBatchTimingFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 focus:border-orange-500 focus:bg-white focus:outline-none transition"
                >
                  <option value="">All Timings</option>
                  <option value="MORNING">Morning Batch</option>
                  <option value="AFTERNOON">Afternoon Batch</option>
                  <option value="EVENING">Evening Batch</option>
                  <option value="NIGHT">Night Batch</option>
                </select>
              </div>
            </div>
          </div>

          {/* Batches Grid */}
          {!filteredBatches.length ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
              <FaLayerGroup className="mx-auto text-4xl text-slate-300 mb-3" />
              <p className="font-bold text-slate-700">No batches match your filter</p>
              <p className="text-xs text-slate-400 mt-1">Try clearing your search or changing the course filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBatches.map((batch) => {
                const course = courses.find((c) => String(c.id) === String(batch.course_id || batch.course?.id)) || batch.course;
                const mentorName = batch.mentor
                  ? [batch.mentor.first_name, batch.mentor.last_name].filter(Boolean).join(" ")
                  : batch.mentor_name || "Unassigned Mentor";
                const enrolledCount = batch.student_count ?? batch.enrollments?.length ?? 0;
                const hasClassroom = Boolean(course?.google_classroom_link);

                return (
                  <div
                    key={batch.id}
                    onClick={() => handleOpenBatch(batch)}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:border-orange-300 hover:shadow-md transition cursor-pointer"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="rounded-full bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-[11px] font-bold text-orange-700">
                          {batch.batch_timing} BATCH
                        </span>
                        <div className="flex items-center gap-1.5">
                          {hasClassroom && (
                            <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                              Classroom Link
                            </span>
                          )}
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                              batch.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {batch.status || "ACTIVE"}
                          </span>
                        </div>
                      </div>

                      {/* Batch Name & Course */}
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition leading-snug">
                        {batch.batch_name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <FaBookOpen className="text-slate-400 shrink-0 text-[10px]" />
                        <span className="truncate">{course?.title || "Curriculum Course"}</span>
                      </p>

                      {/* Mentor */}
                      <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                        <FaChalkboardTeacher className="text-slate-400 shrink-0 text-xs" />
                        <span className="truncate">{mentorName}</span>
                      </p>
                    </div>

                    {/* Footer Info & Action */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                        <FaUsers className="text-orange-500 text-xs" />
                        <span>{enrolledCount} Students</span>
                      </div>

                      <div className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 group-hover:translate-x-0.5 transition">
                        <span>Open Classes</span>
                        <FaChevronRight className="text-[10px]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 2: BATCH CLASSES / SESSIONS VIEW                                    */}
      {/* ========================================================================= */}
      {viewLevel === "CLASSES" && selectedBatch && (
        <div className="space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBackToBatches}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs transition"
            >
              <FaArrowLeft className="text-[11px]" />
              <span>Back to All Batches</span>
            </button>

            <span className="text-xs text-slate-400 hidden sm:inline">
              Batches / <span className="font-bold text-slate-700">{selectedBatch.batch_name}</span>
            </span>
          </div>

          {/* Batch Hero Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="rounded-full bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-xs font-bold text-orange-700">
                    {selectedBatch.batch_timing} BATCH
                  </span>
                  <span className="rounded-full bg-slate-100 text-slate-600 px-2.5 py-0.5 text-xs font-semibold">
                    {selectedCourse?.category || "TECH"}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  {selectedBatch.batch_name}
                </h3>
                <p className="text-sm font-semibold text-slate-600 mt-1">
                  Course: {selectedCourse?.title || selectedBatch.course_title}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                  <span>
                    Instructor: <span className="font-semibold text-slate-700">
                      {selectedBatch.mentor
                        ? [selectedBatch.mentor.first_name, selectedBatch.mentor.last_name].filter(Boolean).join(" ")
                        : selectedBatch.mentor_name || "Assigned Mentor"}
                    </span>
                  </span>
                  <span>•</span>
                  <span>
                    Enrolled: <span className="font-semibold text-slate-700">{selectedBatch.student_count ?? selectedBatch.enrollments?.length ?? 0} Students</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                {classroomLink && (
                  <a
                    href={classroomLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 px-4 py-2.5 text-xs font-bold transition shadow-xs"
                  >
                    <span>Launch Google Classroom</span>
                    <FaExternalLinkAlt className="text-[11px]" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() =>
                    handleOpenClassRoster(new Date().toISOString().split("T")[0])
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 text-xs font-bold shadow-md transition"
                >
                  <FaPlus className="text-xs" />
                  <span>Record Today's Attendance</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Date Start Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-800">Or mark attendance for a specific date:</span> Pick any scheduled lecture date below.
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 focus:border-orange-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleOpenClassRoster(selectedDate)}
                className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 text-xs font-bold transition shadow-xs"
              >
                Open Class Sheet
              </button>
            </div>
          </div>

          {/* Past Class Sessions Table */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-900">Recorded Class Sessions</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click on any past class below to review or update attendance records.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
                {batchSessions.length} Classes Held
              </span>
            </div>

            {loadingSessions ? (
              <div className="p-12 text-center text-slate-500 font-semibold flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin text-orange-500 text-lg" />
                Loading batch class sessions...
              </div>
            ) : !batchSessions.length ? (
              <div className="p-12 text-center text-slate-500">
                <FaCalendarAlt className="mx-auto text-4xl text-slate-300 mb-3" />
                <p className="font-bold text-slate-700">No class sessions recorded for this batch yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Click "+ Record Today's Attendance" above to mark your first class.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Class #</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Lecture Topic</th>
                      <th className="py-3 px-4 text-center">Present / Enrolled</th>
                      <th className="py-3 px-4 text-center">Rate</th>
                      <th className="py-3 px-4">Marked By</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {batchSessions.map((session, idx) => {
                      const present = session.present_count || 0;
                      const total = session.total_enrolled || session.total_count || 0;
                      const absent = session.absent_count || 0;
                      const pct = session.attendance_percentage ?? (total > 0 ? Math.round((present / total) * 100) : 0);

                      return (
                        <tr
                          key={session.id}
                          onClick={() => handleOpenClassRoster(session.session_date, session.session_topic)}
                          className="hover:bg-slate-50/80 transition cursor-pointer"
                        >
                          <td className="py-3.5 px-4 font-bold text-slate-400 text-xs">
                            Class #{batchSessions.length - idx}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                            {session.session_date ? new Date(session.session_date).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="py-3.5 px-4 max-w-[240px]">
                            <p className="font-semibold text-slate-800 truncate" title={session.session_topic}>
                              {session.session_topic || "General Lecture"}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="font-bold text-xs">
                              <span className="text-emerald-700">{present}</span>
                              <span className="text-slate-400"> / </span>
                              <span className="text-slate-700">{total}</span>
                            </span>
                            {absent > 0 && (
                              <span className="block text-[10px] text-rose-600 font-semibold">
                                {absent} absent
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-block font-extrabold text-xs px-2.5 py-0.5 rounded-full border ${
                                pct >= 75
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : pct >= 50
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                              }`}
                            >
                              {pct}%
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                            {session.created_by_name || session.marker_name || "Admin"}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenClassRoster(session.session_date, session.session_topic);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-1.5 text-xs font-bold transition shadow-2xs"
                            >
                              <FaEdit className="text-[11px]" />
                              <span>Mark / Edit</span>
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEVEL 3: CLASS ATTENDANCE SHEET (STUDENT ROSTER)                          */}
      {/* ========================================================================= */}
      {viewLevel === "ROSTER" && selectedBatch && (
        <div className="space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleBackToClasses}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs transition"
            >
              <FaArrowLeft className="text-[11px]" />
              <span>Back to Batch Classes</span>
            </button>

            <span className="text-xs text-slate-400 hidden sm:inline">
              Batches / <span className="font-semibold text-slate-600">{selectedBatch.batch_name}</span> /{" "}
              <span className="font-bold text-slate-800">Class on {selectedDate}</span>
            </span>
          </div>

          {/* Session Header Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900">
                    Class Attendance Sheet
                  </h3>
                  {existingSessionId ? (
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                      Saved Session (Editing)
                    </span>
                  ) : (
                    <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                      New Class Session
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Batch: <span className="font-semibold text-slate-700">{selectedBatch.batch_name}</span> ({selectedBatch.batch_timing}) • Course: <span className="font-semibold text-slate-700">{selectedCourse?.title || selectedBatch.course_title}</span>
                </p>
              </div>

              {/* Classroom Launch Link */}
              {classroomLink && (
                <a
                  href={classroomLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 text-xs font-bold shadow-md transition"
                >
                  <span>Open Google Classroom</span>
                  <FaExternalLinkAlt className="text-[11px]" />
                </a>
              )}
            </div>

            {/* Inputs: Date, Topic, Remarks */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Class Session Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Lecture Topic / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. React Hooks, Node APIs, Database Indexing"
                  value={sessionTopic}
                  onChange={(e) => setSessionTopic(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Instructor Notes / Remarks
                </label>
                <input
                  type="text"
                  placeholder="e.g. Covered assignment 3, 2 students excused"
                  value={sessionRemarks}
                  onChange={(e) => setSessionRemarks(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-orange-500 focus:bg-white focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Classroom Helper Banner */}
          {classroomLink && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/80 p-4 text-xs">
              <div className="flex items-center gap-3 text-blue-900">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <FaInfoCircle className="text-base" />
                </span>
                <div>
                  <p className="font-bold text-sm">Live Google Classroom Connected</p>
                  <p className="text-blue-700 mt-0.5">
                    Open Google Classroom to see who joined the meeting, then mark attendance below.
                  </p>
                </div>
              </div>
              <a
                href={classroomLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1.5 shrink-0 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 text-xs transition shadow-xs"
              >
                <span>Launch Live Room</span>
                <FaExternalLinkAlt className="text-[10px]" />
              </a>
            </div>
          )}

          {/* Live Statistics Counter Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3 text-center shadow-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Enrolled Students</p>
              <p className="text-xl font-extrabold text-slate-900 mt-0.5">{rosterStats.total}</p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-center shadow-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Present</p>
              <p className="text-xl font-extrabold text-emerald-700 mt-0.5">{rosterStats.present}</p>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-center shadow-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Absent</p>
              <p className="text-xl font-extrabold text-rose-700 mt-0.5">{rosterStats.absent}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-center shadow-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Late</p>
              <p className="text-xl font-extrabold text-amber-700 mt-0.5">{rosterStats.late}</p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 text-center shadow-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Excused</p>
              <p className="text-xl font-extrabold text-blue-700 mt-0.5">{rosterStats.excused}</p>
            </div>
            <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-3 text-center shadow-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-orange-700">Attendance %</p>
              <p className="text-xl font-extrabold text-orange-600 mt-0.5">{rosterStats.rate}%</p>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Roster Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-slate-50/80 border-b border-slate-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                  Bulk Quick:
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
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="text"
                    placeholder="Search enrolled student..."
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                    className="w-44 sm:w-56 rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:border-orange-500 focus:outline-none"
                >
                  <option value="ALL">All Statuses ({students.length})</option>
                  <option value="PRESENT">Present ({rosterStats.present})</option>
                  <option value="ABSENT">Absent ({rosterStats.absent})</option>
                  <option value="LATE">Late ({rosterStats.late})</option>
                  <option value="EXCUSED">Excused ({rosterStats.excused})</option>
                </select>
              </div>
            </div>

            {/* Roster Table Content */}
            {loadingRoster ? (
              <div className="p-12 text-center text-slate-500 font-semibold flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin text-orange-500 text-lg" />
                Loading enrolled students for this batch...
              </div>
            ) : !students.length ? (
              <div className="p-12 text-center text-slate-500">
                <FaUsers className="mx-auto text-4xl text-slate-300 mb-3" />
                <p className="font-bold text-slate-700">No students are enrolled in this batch</p>
                <p className="text-xs text-slate-400 mt-1">
                  Allocate students to this batch in the "Student Allocation" tab to take attendance.
                </p>
              </div>
            ) : !filteredStudents.length ? (
              <div className="p-12 text-center text-slate-500">
                <FaSearch className="mx-auto text-4xl text-slate-300 mb-3" />
                <p className="font-bold text-slate-700">No students match your search/filter</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/90 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">College / Origin</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4">Remarks (Optional)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((student) => {
                      const name = student.student_name || [student.first_name, student.last_name].filter(Boolean).join(" ") || "Student";
                      return (
                        <tr key={student.student_id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {student.profile_image ? (
                                <img
                                  src={student.profile_image}
                                  alt={name}
                                  className="h-9 w-9 rounded-full object-cover border border-slate-200"
                                />
                              ) : (
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-xs uppercase">
                                  {name.slice(0, 2)}
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-slate-900 leading-tight">{name}</p>
                                <p className="text-xs text-slate-500 leading-tight mt-0.5">{student.email}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-xs">
                            {student.college_name && student.college_name !== "Individual" ? (
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

            {/* Bottom Footer Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-slate-50 border-t border-slate-200">
              <div className="text-xs text-slate-500">
                <span className="font-bold text-slate-700">Class Rate:</span> {rosterStats.present} Present, {rosterStats.absent} Absent ({rosterStats.rate}% attendance rate for this class).
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSaveAttendance(true)}
                  disabled={saving || loadingRoster || !students.length}
                  className="rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 text-xs font-bold transition disabled:opacity-50"
                >
                  Save &amp; Return to Classes
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveAttendance(false)}
                  disabled={saving || loadingRoster || !students.length}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-6 py-2.5 text-sm font-bold shadow-md transition disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin text-sm" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FaCalendarCheck className="text-sm" />
                      <span>{existingSessionId ? "Update Attendance" : "Save Attendance"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkAttendancePanel;
