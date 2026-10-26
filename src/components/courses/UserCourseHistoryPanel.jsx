import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaGraduationCap,
  FaLayerGroup,
  FaReceipt,
  FaSearch,
  FaShieldAlt,
  FaTimes,
  FaPrint,
  FaUserTie,
  FaBuilding,
  FaArrowRight,
  FaInfoCircle,
} from "react-icons/fa";

const statusBadgeStyles = {
  BATCH_ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ENROLLED: "bg-amber-50 text-amber-700 border-amber-200",
  APPLIED: "bg-purple-50 text-purple-700 border-purple-200",
  COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
};

const UserCourseHistoryPanel = ({
  courses = [],
  currentUser = null,
  onSelectCourse = null,
  onViewPayments = null,
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      let statusKey = "ENROLLED";
      if (course.enrollment_status === "COMPLETED") statusKey = "COMPLETED";
      else if (course.is_allocated) statusKey = "BATCH_ACTIVE";
      else if (course.enrollment_status === "APPLIED") statusKey = "APPLIED";

      const matchesStatus =
        statusFilter === "ALL" || statusKey === statusFilter;

      const term = search.toLowerCase().trim();
      if (!term) return matchesStatus;

      const title = course.title?.toLowerCase() || "";
      const category = course.category?.toLowerCase() || "";
      const mentor = course.mentor_name?.toLowerCase() || "";
      const college = course.college_name?.toLowerCase() || "";
      const batchName = course.batch_name?.toLowerCase() || "";

      const matchesSearch =
        title.includes(term) ||
        category.includes(term) ||
        mentor.includes(term) ||
        college.includes(term) ||
        batchName.includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [courses, statusFilter, search]);

  const metrics = useMemo(() => {
    const totalEnrolled = courses.length;
    const activeBatches = courses.filter((c) => c.is_allocated).length;
    const appliedCount = courses.filter(
      (c) => c.enrollment_status === "APPLIED"
    ).length;
    const totalWeeks = courses.reduce(
      (sum, c) => sum + (Number(c.duration_weeks) || 12),
      0
    );

    return { totalEnrolled, activeBatches, appliedCount, totalWeeks };
  }, [courses]);

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Banner & Metric Header */}
      <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 via-amber-50/60 to-orange-50 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white text-2xl shadow-md">
              <FaGraduationCap />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Course &amp; Enrollment History
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Full chronological record of your academy admissions, batch allocations, and live classes.
              </p>
            </div>
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-orange-600 transition hover:scale-105 shrink-0"
          >
            <FaBookOpen />
            Browse New Courses
          </Link>
        </div>

        {/* Metrics Row */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-orange-100 bg-white/80 p-3.5 backdrop-blur-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Enrolled
            </span>
            <p className="mt-1 text-lg sm:text-xl font-black text-slate-900">
              {metrics.totalEnrolled}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-white/80 p-3.5 backdrop-blur-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Active Batches
            </span>
            <p className="mt-1 text-lg sm:text-xl font-black text-emerald-600">
              {metrics.activeBatches}
            </p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-white/80 p-3.5 backdrop-blur-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Pending Allocation
            </span>
            <p className="mt-1 text-lg sm:text-xl font-black text-amber-600">
              {metrics.totalEnrolled - metrics.activeBatches}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/80 p-3.5 backdrop-blur-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Curriculum Training
            </span>
            <p className="mt-1 text-lg sm:text-xl font-black text-slate-700">
              {metrics.totalWeeks} Weeks
            </p>
          </div>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search enrolled courses by title, mentor, college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 shadow-2xs focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs focus:border-orange-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="BATCH_ACTIVE">Active Batches Only</option>
            <option value="ENROLLED">Enrolled (Awaiting Batch)</option>
            <option value="APPLIED">Applied Only</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Courses List */}
      {filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 text-2xl shadow-inner mb-4">
            <FaBookOpen />
          </div>
          <h3 className="text-base font-bold text-slate-800">No courses in history</h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {search || statusFilter !== "ALL"
              ? "No enrolled courses match your current search or filter."
              : "You have not enrolled in any programs yet. Start learning today with our industry-led modules."}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-orange-600 transition hover:scale-105"
            >
              Explore Programs
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => {
            const isAllocated = Boolean(course.is_allocated);
            const statusKey =
              course.enrollment_status === "COMPLETED"
                ? "COMPLETED"
                : isAllocated
                ? "BATCH_ACTIVE"
                : course.enrollment_status === "APPLIED"
                ? "APPLIED"
                : "ENROLLED";

            const statusBadgeClass =
              statusBadgeStyles[statusKey] || statusBadgeStyles.ENROLLED;

            const isCohort =
              course.enrollment_type === "COLLEGE_COHORT" ||
              (course.college_name && course.college_name !== "Individual");

            return (
              <div
                key={course.enrollment_id || course.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs hover:border-orange-300 transition space-y-4"
              >
                {/* Header row: Category, Title & Badges */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded-md bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-orange-700">
                        {course.category || "TECHNOLOGY"}
                      </span>
                      {course.duration_weeks && (
                        <span className="text-xs font-semibold text-slate-400">
                          &bull; {course.duration_weeks} Weeks Duration
                        </span>
                      )}
                      {course.enrollment_id && (
                        <span className="font-mono text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                          #ENR-{course.enrollment_id}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-lg sm:text-xl font-black text-slate-900 leading-tight">
                      {course.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap sm:flex-col sm:items-end">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusBadgeClass}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isAllocated
                            ? "bg-emerald-500 animate-pulse"
                            : "bg-amber-500"
                        }`}
                      />
                      {isAllocated
                        ? "Batch Active"
                        : course.enrollment_status === "APPLIED"
                        ? "Applied"
                        : "Batch Pending"}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Enrolled:{" "}
                      {course.joined_at
                        ? new Date(course.joined_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Enrollment & Batch Details Grid */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold text-[11px] uppercase tracking-wider">
                      Batch Timing
                    </span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {course.batch_timing
                        ? `${course.batch_timing} BATCH`
                        : "Standard Batch"}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-semibold text-[11px] uppercase tracking-wider">
                      Admission Type
                    </span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {isCohort ? `College: ${course.college_name}` : "Individual Admission"}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-semibold text-[11px] uppercase tracking-wider">
                      Assigned Instructor
                    </span>
                    <span className="font-bold text-slate-800 mt-0.5 block flex items-center gap-1">
                      <FaUserTie className="text-orange-500 text-xs shrink-0" />
                      {course.mentor_name || "Allocation in progress"}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-semibold text-[11px] uppercase tracking-wider">
                      Batch Schedule
                    </span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {course.batch_name || "Pending batch assignment"}
                    </span>
                  </div>
                </div>

                {/* Footer Row: Payment Info & Classroom Action */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    {course.payment ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                          <FaCheckCircle className="text-emerald-500" />
                          Fee Paid: ₹{Number(course.payment.amount || 0).toLocaleString("en-IN")}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(course.payment)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 underline cursor-pointer"
                        >
                          <FaReceipt className="text-orange-500" />
                          View Receipt
                        </button>
                      </div>
                    ) : isCohort ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-blue-700">
                        <FaBuilding className="text-blue-500" />
                        Institution Sponsored Admission
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                        Admission Active
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectCourse) {
                          onSelectCourse(course.course_id || course.id);
                        } else {
                          navigate(`/course/${course.course_id || course.id}/classes`);
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-2xs transition hover:scale-105 cursor-pointer"
                    >
                      <span>Enter Classroom</span>
                      <FaArrowRight className="text-[11px]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Official Payment Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-orange-100 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/images/companylogo.jpg"
                  alt="First Track Skills Academy"
                  className="h-10 w-10 rounded-full border-2 border-orange-500 object-cover shadow-sm"
                />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                    First Track <span className="text-orange-500">Skills Academy</span>
                  </h3>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Official Fee Payment Receipt
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-orange-50/70 p-3.5 border border-orange-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Receipt Number
                  </span>
                  <div className="font-mono text-xs font-bold text-slate-800">
                    #REC-FTST-{selectedReceipt.id.toString().padStart(5, "0")}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Payment Status
                  </span>
                  <div className="text-xs font-black text-emerald-700 flex items-center gap-1 justify-end">
                    <FaCheckCircle className="text-emerald-500 text-xs" />
                    {selectedReceipt.status || "SUCCESS"}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 border-b border-slate-100 pb-4">
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-medium">Participant Name</span>
                  <span className="font-bold text-slate-900">
                    {currentUser?.first_name || "Enrolled Student"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-medium">Email Address</span>
                  <span className="font-semibold text-slate-800">
                    {currentUser?.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-medium">Payment Date &amp; Time</span>
                  <span className="font-semibold text-slate-800">
                    {selectedReceipt.created_at
                      ? new Date(selectedReceipt.created_at).toLocaleString("en-IN")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-medium">Payment Mode</span>
                  <span className="font-semibold text-slate-800">
                    {selectedReceipt.payment_method || "Online Razorpay Gateway"}
                  </span>
                </div>
                <div className="flex justify-between py-1 font-mono text-[11px]">
                  <span className="text-slate-400 font-sans">Payment / Ref ID</span>
                  <span className="text-slate-700">
                    {selectedReceipt.razorpay_payment_id || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-1 font-mono text-[11px]">
                  <span className="text-slate-400 font-sans">Order ID</span>
                  <span className="text-slate-700">
                    {selectedReceipt.razorpay_order_id || "N/A"}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Total Tuition Fee Paid</div>
                    <div className="text-[11px] text-slate-500">Includes all applicable training taxes</div>
                  </div>
                  <div className="text-xl font-black text-orange-600">
                    ₹{Number(selectedReceipt.amount || 0).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50/70 p-3 text-emerald-800 text-xs border border-emerald-100">
                <FaShieldAlt className="text-emerald-600 text-lg shrink-0" />
                <p className="text-[11px] leading-relaxed">
                  Verified payment voucher issued by First Track Skills Academy. Admission confirmed for live interactive batches.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition cursor-pointer"
              >
                <FaPrint />
                Print / Save PDF
              </button>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCourseHistoryPanel;
