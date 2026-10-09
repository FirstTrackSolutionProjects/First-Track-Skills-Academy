import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FaCreditCard,
  FaSearch,
  FaSpinner,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSyncAlt,
  FaBuilding,
  FaUserGraduate,
  FaReceipt,
  FaFilter,
  FaMoneyBillWave,
  FaEye,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { getAllPayments } from "../../service/paymentService";

const statusBadgeStyles = {
  SUCCESS: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  FAILED: "bg-rose-50 text-rose-700 border-rose-200",
};

const PaymentTransactionsPanel = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedTx, setSelectedTx] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit] = useState(25);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllPayments({
        search: search.trim() || undefined,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        payment_type: typeFilter !== "ALL" ? typeFilter : undefined,
        page,
        limit,
      });

      setTransactions(res?.data || []);
      setTotalRevenue(res?.totalRevenue || 0);
      setTotalCount(res?.totalCount || 0);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, typeFilter, page, limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const metrics = useMemo(() => {
    const successCount = transactions.filter((t) => t.status === "SUCCESS").length;
    const pendingCount = transactions.filter((t) => t.status === "PENDING").length;
    const individualCount = transactions.filter((t) => t.payment_type === "INDIVIDUAL").length;
    const cohortCount = transactions.filter((t) => t.payment_type === "COHORT").length;
    return { successCount, pendingCount, individualCount, cohortCount };
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500 text-white text-2xl shadow-md">
              <FaCreditCard />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">Payment Transactions &amp; Revenue</h2>
              <p className="text-sm text-slate-600 mt-0.5">
                Monitor online Razorpay admissions, cohort fee collections, and student payment receipts.
              </p>
            </div>
          </div>
          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-orange-300 bg-white px-4 py-2.5 text-xs font-bold text-orange-700 shadow-xs hover:bg-orange-50 transition cursor-pointer"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-extrabold uppercase tracking-wider">
              <FaMoneyBillWave />
              Total Revenue
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-black text-emerald-900">
              ₹{Number(totalRevenue || 0).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
            <div className="flex items-center gap-2 text-blue-700 text-xs font-extrabold uppercase tracking-wider">
              <FaReceipt />
              All Transactions
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-black text-blue-900">{totalCount}</p>
          </div>

          <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-4">
            <div className="flex items-center gap-2 text-purple-700 text-xs font-extrabold uppercase tracking-wider">
              <FaUserGraduate />
              Individual Admissions
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-black text-purple-900">
              {metrics.individualCount}
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
            <div className="flex items-center gap-2 text-amber-700 text-xs font-extrabold uppercase tracking-wider">
              <FaBuilding />
              Cohort Admissions
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-black text-amber-900">{metrics.cohortCount}</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search by student name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-orange-500 focus:outline-hidden"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:bg-white focus:border-orange-500 focus:outline-hidden"
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="SUCCESS">Verified (SUCCESS)</option>
              <option value="PENDING">Pending (PENDING)</option>
              <option value="FAILED">Failed (FAILED)</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs font-bold text-slate-700 focus:bg-white focus:border-orange-500 focus:outline-hidden"
            >
              <option value="ALL">All Admission Types</option>
              <option value="INDIVIDUAL">Individual Course (Compulsory Razorpay)</option>
              <option value="COHORT">College Cohort (Partner Admission)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-orange-600 gap-3">
            <FaSpinner className="animate-spin text-3xl" />
            <p className="text-sm font-bold text-slate-600">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <FaReceipt className="mx-auto text-4xl text-slate-300 mb-3" />
            <p className="font-bold text-slate-700">No payment records found</p>
            <p className="text-xs text-slate-400 mt-1">
              Transactions will appear here automatically when students enroll online.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Receipt / Order</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Course</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {transactions.map((tx) => {
                  const studentName =
                    [tx.student?.first_name, tx.student?.last_name].filter(Boolean).join(" ") ||
                    tx.student?.email ||
                    `User #${tx.student_id}`;

                  return (
                    <tr key={tx.id} className="hover:bg-orange-50/30 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        <div className="truncate max-w-[150px]" title={tx.receipt || tx.razorpay_order_id}>
                          {tx.receipt || tx.razorpay_order_id}
                        </div>
                        {tx.razorpay_payment_id && (
                          <div className="text-[10px] text-emerald-600 font-mono">
                            {tx.razorpay_payment_id}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{studentName}</div>
                        <div className="text-[11px] text-slate-500">{tx.student?.email}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 truncate max-w-[180px]">
                          {tx.course?.title || `Course #${tx.course_id}`}
                        </div>
                        <div className="text-[10px] text-orange-600 font-semibold">
                          {tx.course?.category}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                            tx.payment_type === "INDIVIDUAL"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {tx.payment_type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ₹{Number(tx.amount || 0).toLocaleString("en-IN")}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border ${
                            statusBadgeStyles[tx.status] || "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              tx.status === "SUCCESS"
                                ? "bg-emerald-500"
                                : tx.status === "PENDING"
                                ? "bg-amber-500 animate-pulse"
                                : "bg-rose-500"
                            }`}
                          />
                          {tx.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {tx.created_at ? new Date(tx.created_at).toLocaleDateString("en-IN") : "N/A"}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedTx(tx)}
                          className="inline-flex items-center gap-1 rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-orange-700 shadow-2xs hover:bg-orange-100 transition cursor-pointer"
                        >
                          <FaEye className="text-xs" />
                          View
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

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600 font-bold">
                  <FaReceipt className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Transaction Receipt</h3>
                  <p className="text-xs text-slate-500 font-mono">
                    ID #{selectedTx.id} &bull; {selectedTx.receipt || selectedTx.razorpay_order_id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mt-5 space-y-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Status</span>
                  <span
                    className={`font-black uppercase px-2 py-0.5 rounded text-[10px] border ${
                      statusBadgeStyles[selectedTx.status] || "bg-slate-100"
                    }`}
                  >
                    {selectedTx.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Amount</span>
                  <span className="text-sm font-black text-emerald-700">
                    ₹{Number(selectedTx.amount || 0).toLocaleString("en-IN")} {selectedTx.currency}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Admission Type</span>
                  <span className="font-bold text-slate-800">{selectedTx.payment_type}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Course</span>
                  <span className="font-bold text-slate-800">{selectedTx.course?.title || `ID ${selectedTx.course_id}`}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Student</span>
                  <span className="font-bold text-slate-800">
                    {[selectedTx.student?.first_name, selectedTx.student?.last_name].filter(Boolean).join(" ") || "Student"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Student Email</span>
                  <span className="font-mono text-slate-700">{selectedTx.student?.email}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Razorpay Order ID</span>
                  <span className="font-mono text-slate-700">{selectedTx.razorpay_order_id}</span>
                </div>
                {selectedTx.razorpay_payment_id && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Razorpay Payment ID</span>
                    <span className="font-mono font-bold text-emerald-700">{selectedTx.razorpay_payment_id}</span>
                  </div>
                )}
                {selectedTx.payment_method && (
                  <div className="flex justify-between items-center py-1 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Payment Method</span>
                    <span className="font-bold text-slate-700">{selectedTx.payment_method}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-medium">Timestamp</span>
                  <span className="text-slate-700">
                    {selectedTx.created_at ? new Date(selectedTx.created_at).toLocaleString("en-IN") : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="rounded-xl bg-slate-100 hover:bg-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 transition"
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

export default PaymentTransactionsPanel;
