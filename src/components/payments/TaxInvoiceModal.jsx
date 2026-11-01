import React, { useState } from "react";
import {
  FaTimes,
  FaPrint,
  FaDownload,
  FaFileInvoice,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import {
  COMPANY_INFO,
  calculateTaxBreakdown,
  formatInvoiceDate,
  getInvoiceNumber,
  numberToWordsINR,
  downloadInvoiceAsFile,
  downloadInvoiceAsPDF,
} from "../../utils/invoiceGenerator";

const TaxInvoiceModal = ({ receipt, currentUser, onClose, isOdisha = true }) => {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  if (!receipt) return null;

  const amount = Number(receipt.amount || 25000);
  const tax = calculateTaxBreakdown(amount, isOdisha);
  const invoiceNo = getInvoiceNumber(receipt);
  const invoiceDate = formatInvoiceDate(receipt.created_at);

  const studentName = (
    (receipt.student
      ? `${receipt.student.first_name || ""} ${receipt.student.last_name || ""}`
      : `${currentUser?.first_name || ""} ${currentUser?.last_name || ""}`) ||
    currentUser?.name ||
    "ANIKET KUMAR"
  ).trim().toUpperCase();

  const studentEmail =
    receipt.student?.email || currentUser?.email || "aniketkumar5155@gmail.com";
  const studentPhone =
    receipt.student?.phone_number ||
    receipt.student?.phone ||
    currentUser?.phone_number ||
    currentUser?.student_profile?.phone_number ||
    "+91 8240742313";

  const studentAddress =
    receipt.student?.address ||
    (currentUser?.student_profile?.district
      ? `${currentUser.student_profile.district}, ${currentUser.student_profile.state || "Odisha"}, India - ${currentUser.student_profile.pin || "751007"}`
      : "Saheed Nagar, Bhubaneswar, Odisha, India - 751007");

  const courseTitle =
    receipt.course?.title || "Full Stack Web Development (MERN)";
  const courseCategory = receipt.course?.category || "Professional Certification";
  const durationWeeks = receipt.course?.duration_weeks || "24";
  const orderRef =
    receipt.razorpay_payment_id ||
    receipt.razorpay_order_id ||
    "pay_live_948aBc123xyz";

  const dateRaw = receipt.created_at
    ? new Date(receipt.created_at).toISOString().replace("T", " ")
    : new Date().toISOString().replace("T", " ");

  const amountInWords = numberToWordsINR(amount);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadFile = () => {
    downloadInvoiceAsFile(receipt, currentUser, { isOdisha, invoiceNo });
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloadingPdf(true);
      await downloadInvoiceAsPDF("print-invoice-sheet", invoiceNo);
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-2 sm:p-4 md:p-6 backdrop-blur-xs overflow-y-auto">
      {/* Print Stylesheet injection to ensure pixel-perfect print isolation */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-invoice-sheet, #print-invoice-sheet * {
            visibility: visible !important;
          }
          #print-invoice-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 12mm 15mm !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl border border-slate-200 my-auto overflow-hidden">
        {/* Top Control Bar (Hidden during Print) */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm sm:text-base">
            <FaFileInvoice className="text-orange-500 text-lg" />
            <span>Tax Invoice / Merchant Bill Preview</span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              GST Compliant (SAC: {COMPANY_INFO.sacCode})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={downloadingPdf}
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition cursor-pointer disabled:opacity-70"
              title="Download official PDF invoice"
            >
              {downloadingPdf ? (
                <FaSpinner className="animate-spin text-xs" />
              ) : (
                <FaDownload className="text-white text-xs" />
              )}
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-2xs transition cursor-pointer"
              title="Print or Save as PDF"
            >
              <FaPrint />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
              title="Close modal"
            >
              <FaTimes className="text-base" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Container */}
        <div className="max-h-[82vh] overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center">
          <div
            id="print-invoice-sheet"
            className="w-full max-w-[820px] bg-white p-6 sm:p-10 shadow-sm border border-slate-200 text-slate-800 text-[12px] sm:text-[13px] leading-relaxed"
          >
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="/images/companylogo.jpg"
                  alt="Company Logo"
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 border-orange-500 object-cover shrink-0 shadow-xs"
                />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                    First Track Skills Academy
                  </h1>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1">
                    {COMPANY_INFO.legalEntity} &bull; Student Tuition Invoice
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-600 font-medium">
                <div>
                  <span className="text-slate-400 font-semibold">Invoice No:</span>{" "}
                  <strong className="text-slate-900 font-mono">{invoiceNo}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Invoice Date:</span>{" "}
                  <strong className="text-slate-900">{invoiceDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">HSN/SAC Code:</span>{" "}
                  <strong className="text-slate-900 font-mono">{COMPANY_INFO.sacCode}</strong>
                </div>
              </div>
            </div>

            {/* Orange / Copper Accent Line */}
            <div className="h-0.75 w-full bg-[#b85d19] my-4 sm:my-5"></div>

            {/* From & To Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 text-[11.5px] text-slate-600 leading-normal my-4">
              {/* From Column */}
              <div className="space-y-0.5">
                <div className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1.5">
                  From
                </div>
                <div className="font-bold text-slate-900">{COMPANY_INFO.legalEntity}</div>
                <div>{COMPANY_INFO.address}</div>
                <div>Contact No: {COMPANY_INFO.contactNo}</div>
                <div>Email Id: {COMPANY_INFO.email}</div>
                <div>
                  <strong>GSTIN:</strong> {COMPANY_INFO.gstin}
                </div>
                <div>
                  <strong>PAN:</strong> {COMPANY_INFO.pan}
                </div>
              </div>

              {/* To Column */}
              <div className="space-y-0.5 sm:pl-4">
                <div className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1.5">
                  To
                </div>
                <div className="font-bold text-slate-900">{studentName}</div>
                <div>{studentAddress}</div>
                <div>Contact No: {studentPhone}</div>
                <div>Email: {studentEmail}</div>
                <div>
                  <strong>GSTIN:</strong> N/A
                </div>
                <div>
                  <strong>PAN:</strong> N/A
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto mt-6 mb-4">
              <table className="w-full border-collapse text-[11px] sm:text-xs">
                <thead>
                  <tr className="bg-[#f4e7dc] text-slate-900 font-bold border border-[#ebd9cb]">
                    <th className="py-2.5 px-2 text-center border-r border-[#ebd9cb] w-[5%]">
                      S.L
                    </th>
                    <th className="py-2.5 px-2 text-center border-r border-[#ebd9cb] w-[18%]">
                      Date
                    </th>
                    <th className="py-2.5 px-3 text-left border-r border-[#ebd9cb] w-[32%]">
                      Order ID / Consignment
                    </th>
                    <th className="py-2.5 px-2 text-center border-r border-[#ebd9cb] w-[6%]">
                      Qty
                    </th>
                    <th className="py-2.5 px-2 text-center border-r border-[#ebd9cb] w-[13%]">
                      Course Fee (Rs)
                    </th>
                    <th className="py-2.5 px-2 text-center border-r border-[#ebd9cb] w-[13%]">
                      Dispute Charge (Rs)
                    </th>
                    <th className="py-2.5 px-2 text-center border-r border-[#ebd9cb] w-[13%]">
                      Extra Charge (Rs)
                    </th>
                    <th className="py-2.5 px-2 text-center w-[14%]">
                      Total Amount (Rs)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="border-b border-slate-200">
                    <td className="py-3 px-2 text-center font-semibold text-slate-700">1</td>
                    <td className="py-3 px-2 text-center font-mono text-[10px] sm:text-[11px] text-slate-600">
                      {dateRaw}
                    </td>
                    <td className="py-3 px-3 text-left">
                      <div className="font-bold text-slate-900">{courseTitle}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Ref: {orderRef} &bull; {durationWeeks} Weeks &bull; {courseCategory}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center font-semibold text-slate-700">1</td>
                    <td className="py-3 px-2 text-center font-mono">
                      {tax.bv.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-slate-400">0.00</td>
                    <td className="py-3 px-2 text-center font-mono text-slate-400">0.00</td>
                    <td className="py-3 px-2 text-center font-mono font-bold text-slate-900">
                      {tax.total.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom Summary Section (Words on Left, Tax Box on Right) */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2">
              <div className="sm:col-span-7 text-xs text-slate-600 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-slate-800">Total Amount in Words:</span>{" "}
                  <span className="font-medium text-slate-700">{amountInWords}.</span>
                </div>

                <div className="mt-6 text-[11px] text-slate-500 leading-relaxed hidden sm:block">
                  <div className="font-semibold text-slate-700">Tax Breakdown Notice:</div>
                  Commercial training and vocational skill education are taxed at 18% GST (SAC: 999293).
                </div>
              </div>

              {/* Tax Calculations Box */}
              <div className="sm:col-span-5">
                <table className="w-full text-xs border-collapse">
                  <tbody>
                    <tr>
                      <td className="py-1 text-slate-500 font-semibold">BV</td>
                      <td className="py-1 text-right font-mono font-medium text-slate-800">
                        Rs. {tax.bv.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 text-slate-500 font-semibold">CGST</td>
                      <td className="py-1 text-right font-mono font-medium text-slate-800">
                        Rs. {tax.cgst.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 text-slate-500 font-semibold">SGST</td>
                      <td className="py-1 text-right font-mono font-medium text-slate-800">
                        Rs. {tax.sgst.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1 text-slate-500 font-semibold">IGST(18%)</td>
                      <td className="py-1 text-right font-mono font-medium text-slate-800">
                        Rs. {tax.igst.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="border-t border-slate-300 font-bold text-slate-900">
                      <td className="pt-2 text-xs uppercase tracking-wide">
                        Total Amount (With Tax)
                      </td>
                      <td className="pt-2 text-right font-mono text-sm font-black">
                        Rs. {tax.total.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 pt-4 border-t border-slate-200 text-center text-[11px] text-slate-500 leading-normal">
              <div>Details: Billing of {invoiceDate}</div>
              <div className="mt-0.5">
                This is a computer-generated invoice and does not require a signature.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Modal Actions (Hidden during print) */}
        <div className="no-print flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3">
          <div className="text-xs text-slate-500">
            Need an official stamped copy? Reach out to{" "}
            <a href="mailto:support@firsttracksolution.tech" className="text-orange-600 font-medium underline">
              support@firsttracksolution.tech
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadFile}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <FaDownload className="text-slate-500" />
              Download HTML
            </button>
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={downloadingPdf}
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 px-5 py-2 text-xs font-bold text-white shadow-md transition cursor-pointer disabled:opacity-70"
            >
              {downloadingPdf ? (
                <FaSpinner className="animate-spin text-xs" />
              ) : (
                <FaDownload className="text-white text-xs" />
              )}
              Download PDF
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <FaPrint />
              Print
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxInvoiceModal;
