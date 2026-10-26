import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaCreditCard,
  FaReceipt,
  FaSearch,
  FaSpinner,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSyncAlt,
  FaTimes,
  FaPrint,
  FaBuilding,
  FaBookOpen,
  FaMoneyBillWave,
  FaShieldAlt,
  FaExternalLinkAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { getMyPayments } from "../../service/paymentService";

const statusConfig = {
  SUCCESS: {
    label: "Successful",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <FaCheckCircle className="text-emerald-500" />,
  },
  PENDING: {
    label: "Pending",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <FaClock className="text-amber-500" />,
  },
  FAILED: {
    label: "Failed",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    icon: <FaTimesCircle className="text-rose-500" />,
  },
};

const UserPaymentHistoryPanel = ({ isCollege = false, currentUser = null }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyPayments();
      setPayments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load user payments:", err);
      toast.error(err.response?.data?.message || "Failed to load payment history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filteredPayments = useMemo(() => {
    return payments.filter((item) => {
      const matchesStatus =
        statusFilter === "ALL" || (item.status || "PENDING").toUpperCase() === statusFilter;

      const term = search.toLowerCase().trim();
      if (!term) return matchesStatus;

      const courseTitle = item.course?.title?.toLowerCase() || "";
      const category = item.course?.category?.toLowerCase() || "";
      const paymentId = item.razorpay_payment_id?.toLowerCase() || "";
      const orderId = item.razorpay_order_id?.toLowerCase() || "";
      const studentName = item.student
        ? `${item.student.first_name || ""} ${item.student.last_name || ""}`.toLowerCase()
        : "";

      const matchesSearch =
        courseTitle.includes(term) ||
        category.includes(term) ||
        paymentId.includes(term) ||
        orderId.includes(term) ||
        studentName.includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [payments, statusFilter, search]);

  const metrics = useMemo(() => {
    const successPayments = payments.filter((p) => p.status === "SUCCESS");
    const totalSpent = successPayments.reduce(
      (sum, p) => sum + (Number(p.amount) || 0),
      0
    );
    const pendingCount = payments.filter((p) => p.status === "PENDING").length;

    return {
      totalSpent,
      successCount: successPayments.length,
      pendingCount,
      totalCount: payments.length,
    };
  }, [payments]);

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
              <FaReceipt />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {isCollege ? "Cohort Payment History" : "My Payment History"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {isCollege
                  ? "Track fees paid by students under your institution's cohort."
                  : "View all your tuition fee transactions, payment receipts, and enrollment invoices."}
              </p>
            </div>
          </div>

          <button
            onClick={fetchPayments}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-300 bg-white px-4 py-2 text-xs font-bold text-orange-700 shadow-xs hover:bg-orange-50 transition cursor-pointer shrink-0"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Metrics Row */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-orange-100 bg-white/80 p-3.5 backdrop-blur-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Amount
            </span>
            <p className="mt-1 text-lg sm:text-xl font-black text-slate-900">
              ₹{metrics.totalSpent.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-white/80 p-3.5 backdrop-blur-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Successful
            </span>
            <p className="mt-1 text-lg sm:text-xl font-black text-emerald-600">
              {metrics.successCount}
            </p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-white/80 p-3.5 backdrop-blur-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Pending
            </span>
            <p className="mt-1 text-lg sm:text-xl font-black text-amber-600">
              {metrics.pendingCount}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white/80 p-3.5 backdrop-blur-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Records
            </span>
            <p className="mt-1 text-lg sm:text-xl font-black text-slate-700">
              {metrics.totalCount}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search by course, transaction ID, order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 shadow-2xs focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs focus:border-orange-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUCCESS">Successful Only</option>
            <option value="PENDING">Pending Only</option>
            <option value="FAILED">Failed Only</option>
          </select>
        </div>
      </div>

      {/* Payment Records List */}
      {loading ? (
        <div className="flex min-h-[260px] items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 font-semibold text-orange-600">
          <FaSpinner className="animate-spin text-xl" />
          <span>Loading payment history...</span>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 text-2xl shadow-inner mb-4">
            <FaCreditCard />
          </div>
          <h3 className="text-base font-bold text-slate-800">No payment transactions found</h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {search || statusFilter !== "ALL"
              ? "No payments match your current search or filter criteria. Try resetting the filters."
              : isCollege
              ? "No student payments have been recorded under your partner college yet."
              : "You haven't made any course fee payments yet. Explore our career programs to enroll."}
          </p>
          {!isCollege && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-orange-600 transition hover:scale-105"
              >
                <FaBookOpen />
                Browse Courses
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3.5">Course &amp; Category</th>
                  {isCollege && <th className="px-5 py-3.5">Student</th>}
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Payment ID</th>
                  <th className="px-5 py-3.5">Date &amp; Time</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredPayments.map((payment) => {
                  const statusInfo =
                    statusConfig[(payment.status || "PENDING").toUpperCase()] ||
                    statusConfig.PENDING;

                  return (
                    <tr key={payment.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">
                          {payment.course?.title || "Industry Training Program"}
                        </div>
                        <div className="text-[11px] font-semibold text-orange-600 mt-0.5">
                          {payment.course?.category || "CERTIFICATION"} &bull;{" "}
                          {payment.payment_type === "COHORT"
                            ? "College Cohort"
                            : "Individual"}
                        </div>
                      </td>

                      {isCollege && (
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-800">
                            {payment.student
                              ? `${payment.student.first_name || ""} ${payment.student.last_name || ""}`.trim() ||
                                "Student"
                              : "Student"}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {payment.student?.email || "N/A"}
                          </div>
                        </td>
                      )}

                      <td className="px-5 py-4">
                        <span className="font-black text-slate-900 text-base">
                          ₹{Number(payment.amount || 0).toLocaleString("en-IN")}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {payment.payment_method || "Online"}
                        </div>
                      </td>

                      <td className="px-5 py-4 font-mono text-[11px] text-slate-600">
                        {payment.razorpay_payment_id ? (
                          <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-800 font-semibold">
                            {payment.razorpay_payment_id}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Pending capture</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        <div>
                          {payment.created_at
                            ? new Date(payment.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "N/A"}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {payment.created_at
                            ? new Date(payment.created_at).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.badge}`}
                        >
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(payment)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 shadow-2xs hover:bg-orange-100 hover:text-orange-800 transition cursor-pointer"
                        >
                          <FaReceipt className="text-orange-500" />
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card View */}
          <div className="grid gap-3 lg:hidden">
            {filteredPayments.map((payment) => {
              const statusInfo =
                statusConfig[(payment.status || "PENDING").toUpperCase()] ||
                statusConfig.PENDING;

              return (
                <div
                  key={payment.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-md">
                        {payment.course?.category || "COURSE"}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base mt-1">
                        {payment.course?.title || "Industry Training Program"}
                      </h4>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${statusInfo.badge}`}
                    >
                      {statusInfo.icon}
                      {statusInfo.label}
                    </span>
                  </div>

                  {isCollege && payment.student && (
                    <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Student:</span>
                      <span className="font-bold text-slate-800">
                        {`${payment.student.first_name || ""} ${payment.student.last_name || ""}`.trim()}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-slate-400 block font-medium">Amount:</span>
                      <span className="font-black text-slate-900 text-base">
                        ₹{Number(payment.amount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Date:</span>
                      <span className="font-semibold text-slate-700">
                        {payment.created_at
                          ? new Date(payment.created_at).toLocaleDateString("en-IN")
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-slate-500 truncate">
                      {payment.razorpay_payment_id || payment.razorpay_order_id}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedReceipt(payment)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3.5 py-2 text-xs font-bold text-orange-700 hover:bg-orange-100 transition shrink-0 cursor-pointer"
                    >
                      <FaReceipt className="text-orange-500" />
                      Receipt
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
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
              {/* Receipt Top Status Pill */}
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

              {/* Student & Course Details */}
              <div className="space-y-2.5 text-xs text-slate-700 border-b border-slate-100 pb-4">
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-medium">Participant Name</span>
                  <span className="font-bold text-slate-900">
                    {selectedReceipt.student
                      ? `${selectedReceipt.student.first_name || ""} ${selectedReceipt.student.last_name || ""}`.trim()
                      : currentUser?.first_name || "Enrolled Student"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-medium">Email Address</span>
                  <span className="font-semibold text-slate-800">
                    {selectedReceipt.student?.email || currentUser?.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-medium">Program Title</span>
                  <span className="font-bold text-orange-600 text-right max-w-[240px]">
                    {selectedReceipt.course?.title || "Industry Certification Program"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400 font-medium">Category / Domain</span>
                  <span className="font-semibold text-slate-800">
                    {selectedReceipt.course?.category || "Professional Training"}
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

              {/* Amount Breakdown */}
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

              {/* Watermark / Guarantee notice */}
              <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50/70 p-3 text-emerald-800 text-xs border border-emerald-100">
                <FaShieldAlt className="text-emerald-600 text-lg shrink-0" />
                <p className="text-[11px] leading-relaxed">
                  Verified payment voucher issued by First Track Skills Academy. Admission confirmed for live interactive batches.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
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

export default UserPaymentHistoryPanel;
