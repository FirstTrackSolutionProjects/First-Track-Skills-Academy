/**
 * First Track Skills Academy / First Track Solution Technologies Pvt. Ltd.
 * Tax Invoice Generator & Downloader matching official layout specifications.
 */

const COMPANY_INFO = {
  name: "First Track Skills Academy",
  legalEntity: "First Track Solution Technologies Pvt. Ltd.",
  address: "Saheed Nagar, Bhubaneswar, Odisha, India - 751007",
  contactNo: "+91 8240742313",
  alternateContact: "+91 9040170727",
  email: "contact@firsttrackskillsacademy.in",
  supportEmail: "support@firsttracksolution.tech",
  website: "https://skillsacademy.firsttracksolution.tech",
  // Odisha State Code is 21 under Indian GST system
  gstin: "21AAECF0000A1Z5",
  pan: "AAECF0000A",
  sacCode: "999293", // Commercial Training & Coaching Services / Skill Education
};

/**
 * Converts a numeric amount to Indian currency words
 * e.g. 25000 -> "Twenty Five Thousand Rupees Only"
 * 410 -> "Four Hundred Ten Rupees Only"
 */
export function numberToWordsINR(num) {
  const n = Math.round(Number(num) || 0);
  if (n === 0) return "Zero Rupees Only";

  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convertSection(amount) {
    let str = "";
    if (amount > 99) {
      str += a[Math.floor(amount / 100)] + " Hundred ";
      amount %= 100;
    }
    if (amount > 19) {
      str += b[Math.floor(amount / 10)] + (amount % 10 ? " " + a[amount % 10] : "");
    } else if (amount > 0) {
      str += a[amount];
    }
    return str.trim();
  }

  let words = "";
  let crore = Math.floor(n / 10000000);
  let remainder = n % 10000000;
  let lakh = Math.floor(remainder / 100000);
  remainder %= 100000;
  let thousand = Math.floor(remainder / 1000);
  remainder %= 1000;

  if (crore > 0) words += convertSection(crore) + " Crore ";
  if (lakh > 0) words += convertSection(lakh) + " Lakh ";
  if (thousand > 0) words += convertSection(thousand) + " Thousand ";
  if (remainder > 0) words += convertSection(remainder) + " ";

  return words.trim() + " Rupees Only";
}

/**
 * Calculates Base Value (BV), CGST, SGST, IGST from gross amount (inclusive of 18% GST).
 */
export function calculateTaxBreakdown(grossAmount, isOdisha = true) {
  const total = Number(grossAmount) || 0;
  const bv = Math.round((total / 1.18) * 100) / 100;
  const tax = Math.round((total - bv) * 100) / 100;

  if (isOdisha) {
    const cgst = Math.round((tax / 2) * 100) / 100;
    const sgst = Math.round((tax - cgst) * 100) / 100;
    return {
      bv,
      cgst,
      sgst,
      igst: 0,
      tax,
      total,
    };
  } else {
    return {
      bv,
      cgst: 0,
      sgst: 0,
      igst: tax,
      tax,
      total,
    };
  }
}

/**
 * Formats a date into DD-MM-YYYY or ISO format
 */
export function formatInvoiceDate(dateInput) {
  const d = dateInput ? new Date(dateInput) : new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Generates official formatted Invoice Number
 */
export function getInvoiceNumber(receipt) {
  const idStr = String(receipt?.id || "1").padStart(5, "0");
  const d = receipt?.created_at ? new Date(receipt.created_at) : new Date();
  const yr = String(d.getFullYear()).slice(-2);
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  return `FTSTINV${yr}${mo}${idStr}`;
}

/**
 * Builds the complete, self-contained HTML document for the invoice matching the uploaded layout.
 */
export function generateInvoiceHTMLString(receipt = {}, currentUser = {}, options = {}) {
  const amount = Number(receipt?.amount || 25000);
  const isOdisha = options.isOdisha !== undefined ? options.isOdisha : true;
  const tax = calculateTaxBreakdown(amount, isOdisha);
  const invoiceNo = options.invoiceNo || getInvoiceNumber(receipt);
  const invoiceDate = formatInvoiceDate(receipt?.created_at);

  const studentName = (
    (receipt?.student
      ? `${receipt.student.first_name || ""} ${receipt.student.last_name || ""}`
      : `${currentUser?.first_name || ""} ${currentUser?.last_name || ""}`) ||
    currentUser?.name ||
    "ANIKET KUMAR"
  ).trim().toUpperCase();

  const studentEmail =
    receipt?.student?.email || currentUser?.email || "aniketkumar5155@gmail.com";
  const studentPhone =
    receipt?.student?.phone_number ||
    receipt?.student?.phone ||
    currentUser?.phone_number ||
    currentUser?.student_profile?.phone_number ||
    "+91 8240742313";

  const studentAddress =
    receipt?.student?.address ||
    (currentUser?.student_profile?.district
      ? `${currentUser.student_profile.district}, ${currentUser.student_profile.state || "Odisha"}, India - ${currentUser.student_profile.pin || "751007"}`
      : "Saheed Nagar, Bhubaneswar, Odisha, India - 751007");

  const courseTitle =
    receipt?.course?.title || "Full Stack Web Development (MERN)";
  const courseCategory = receipt?.course?.category || "Professional Certification";
  const durationWeeks = receipt?.course?.duration_weeks || "24";
  const orderRef =
    receipt?.razorpay_payment_id ||
    receipt?.razorpay_order_id ||
    "pay_live_948aBc123xyz";

  const dateRaw = receipt?.created_at
    ? new Date(receipt.created_at).toISOString().replace("T", " ")
    : new Date().toISOString().replace("T", " ");

  const amountInWords = numberToWordsINR(amount);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tax Invoice - ${invoiceNo}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body {
      margin: 0;
      padding: 24px;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      font-size: 13px;
      line-height: 1.5;
    }
    .invoice-wrapper {
      max-width: 820px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 40px 48px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
      border-radius: 4px;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
    }
    .header-logo-td {
      vertical-align: middle;
      text-align: left;
    }
    .brand-flex {
      display: inline-flex;
      align-items: center;
      gap: 14px;
    }
    .brand-logo-img {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      border: 2px solid #ea580c;
      object-fit: cover;
      display: block;
    }
    .brand-title {
      font-size: 21px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.3px;
      margin: 0;
      line-height: 1.2;
    }
    .brand-subtitle {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      margin-top: 3px;
    }
    .header-meta-td {
      vertical-align: middle;
      text-align: right;
      font-size: 12px;
      color: #334155;
    }
    .header-meta-td div {
      margin-bottom: 2px;
    }
    .header-meta-td strong {
      color: #0f172a;
    }
    .accent-divider {
      width: 100%;
      height: 3px;
      background-color: #b85d19;
      margin: 14px 0 28px 0;
    }
    .address-grid {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .address-col {
      width: 50%;
      vertical-align: top;
      font-size: 11.5px;
      line-height: 1.6;
      color: #475569;
    }
    .address-col.from {
      padding-right: 28px;
    }
    .address-col.to {
      padding-left: 12px;
    }
    .address-heading {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 8px;
    }
    .entity-name {
      font-weight: 700;
      color: #1e293b;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      margin-bottom: 24px;
      font-size: 11.5px;
    }
    .data-table thead tr {
      background-color: #f4e7dc; /* Soft peach matching sample */
      color: #33271e;
    }
    .data-table th {
      padding: 10px 8px;
      font-weight: 700;
      font-size: 11px;
      text-align: center;
      border: 1px solid #ebd9cb;
      letter-spacing: 0.2px;
    }
    .data-table td {
      padding: 12px 8px;
      text-align: center;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
      font-size: 11px;
    }
    .data-table td.desc-td {
      text-align: left;
      padding-left: 10px;
    }
    .summary-section {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
    }
    .words-cell {
      width: 55%;
      vertical-align: top;
      padding-right: 20px;
      font-size: 11.5px;
      color: #475569;
    }
    .calc-cell {
      width: 45%;
      vertical-align: top;
    }
    .tax-breakdown-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    .tax-breakdown-table td {
      padding: 4px 6px;
    }
    .tax-breakdown-table td.label-col {
      color: #64748b;
      font-weight: 600;
      text-align: left;
    }
    .tax-breakdown-table td.val-col {
      color: #0f172a;
      font-weight: 600;
      text-align: right;
    }
    .total-tax-row td {
      border-top: 1px solid #cbd5e1;
      padding-top: 8px;
      margin-top: 4px;
      font-weight: 800;
      font-size: 13.5px;
      color: #0f172a;
    }
    .invoice-footer {
      margin-top: 44px;
      padding-top: 18px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 11px;
      color: #64748b;
      line-height: 1.6;
    }
    .actions-bar {
      max-width: 820px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .btn-primary {
      background-color: #ea580c;
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(234, 88, 12, 0.25);
    }
    .btn-primary:hover {
      background-color: #c2410c;
    }
    .btn-secondary {
      background-color: #ffffff;
      color: #334155;
      border-color: #cbd5e1;
    }
    .btn-secondary:hover {
      background-color: #f8fafc;
    }
    @media print {
      body {
        background: transparent !important;
        padding: 0 !important;
      }
      .actions-bar {
        display: none !important;
      }
      .invoice-wrapper {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        max-width: 100% !important;
      }
    }
  </style>
</head>
<body>

  <div class="actions-bar">
    <button onclick="window.print()" class="btn btn-primary">
      🖨️ Print / Save as PDF
    </button>
  </div>

  <div class="invoice-wrapper" id="invoice">
    
    <!-- Top Header Table -->
    <table class="header-table">
      <tr>
        <td class="header-logo-td">
          <div class="brand-flex">
            <img src="/images/companylogo.jpg" alt="Logo" class="brand-logo-img" onerror="this.style.display='none'">
            <div>
              <h1 class="brand-title">First Track Skills Academy</h1>
              <div class="brand-subtitle">${COMPANY_INFO.legalEntity} &bull; Tax Invoice</div>
            </div>
          </div>
        </td>
        <td class="header-meta-td">
          <div><strong>Invoice No:</strong> ${invoiceNo}</div>
          <div><strong>Invoice Date:</strong> ${invoiceDate}</div>
          <div><strong>HSN/SAC Code:</strong> ${COMPANY_INFO.sacCode}</div>
        </td>
      </tr>
    </table>

    <!-- Orange Divider Line -->
    <div class="accent-divider"></div>

    <!-- From and To Grid -->
    <table class="address-grid">
      <tr>
        <td class="address-col from">
          <div class="address-heading">From</div>
          <div class="entity-name">${COMPANY_INFO.legalEntity}</div>
          <div>${COMPANY_INFO.address}</div>
          <div>Contact No: ${COMPANY_INFO.contactNo}</div>
          <div>Email Id: ${COMPANY_INFO.email}</div>
          <div><strong>GSTIN:</strong> ${COMPANY_INFO.gstin}</div>
          <div><strong>PAN:</strong> ${COMPANY_INFO.pan}</div>
        </td>
        <td class="address-col to">
          <div class="address-heading">To</div>
          <div class="entity-name">${studentName}</div>
          <div>${studentAddress}</div>
          <div>Contact No: ${studentPhone}</div>
          <div>Email: ${studentEmail}</div>
          <div><strong>GSTIN:</strong> N/A</div>
          <div><strong>PAN:</strong> N/A</div>
        </td>
      </tr>
    </table>

    <!-- Items Table -->
    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 5%;">S.L</th>
          <th style="width: 18%;">Date</th>
          <th style="width: 32%;">Order ID / Description</th>
          <th style="width: 6%;">Qty</th>
          <th style="width: 13%;">Course Fee (Rs)</th>
          <th style="width: 13%;">Discount (Rs)</th>
          <th style="width: 13%;">Extra Charge (Rs)</th>
          <th style="width: 14%;">Total Amount (Rs)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td style="font-family: monospace; font-size: 10px;">${dateRaw}</td>
          <td class="desc-td">
            <div style="font-weight: 700; color: #0f172a;">${courseTitle}</div>
            <div style="color: #64748b; font-size: 10px; margin-top: 2px;">
              Ref: ${orderRef} &bull; ${durationWeeks} Weeks &bull; ${courseCategory}
            </div>
          </td>
          <td>1</td>
          <td>${tax.bv.toFixed(2)}</td>
          <td>0.00</td>
          <td>0.00</td>
          <td style="font-weight: 700; color: #0f172a;">${tax.total.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <!-- Bottom Breakdown & Words -->
    <table class="summary-section">
      <tr>
        <td class="words-cell">
          <div style="margin-top: 14px;">
            <strong>Total Amount in Words:</strong> ${amountInWords}.
          </div>
        </td>
        <td class="calc-cell">
          <table class="tax-breakdown-table">
            <tr>
              <td class="label-col">BV (Base Value)</td>
              <td class="val-col">Rs. ${tax.bv.toFixed(2)}</td>
            </tr>
            <tr>
              <td class="label-col">CGST (9%)</td>
              <td class="val-col">Rs. ${tax.cgst.toFixed(2)}</td>
            </tr>
            <tr>
              <td class="label-col">SGST (9%)</td>
              <td class="val-col">Rs. ${tax.sgst.toFixed(2)}</td>
            </tr>
            <tr>
              <td class="label-col">IGST (18%)</td>
              <td class="val-col">Rs. ${tax.igst.toFixed(2)}</td>
            </tr>
            <tr class="total-tax-row">
              <td>Total Amount (With Tax)</td>
              <td style="text-align: right;">Rs. ${tax.total.toFixed(2)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Footer -->
    <div class="invoice-footer">
      <div>Details: Billing of ${invoiceDate}</div>
      <div style="margin-top: 4px;">This is a computer-generated invoice and does not require a signature.</div>
    </div>

  </div>

</body>
</html>`;
}

/**
 * Initiates direct browser file download of the invoice as a .html file.
 */
export function downloadInvoiceAsFile(receipt, currentUser, options = {}) {
  const htmlContent = generateInvoiceHTMLString(receipt, currentUser, options);
  const invoiceNo = options.invoiceNo || getInvoiceNumber(receipt);
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Invoice-${invoiceNo}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export { COMPANY_INFO };

