import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaCheck,
  FaPaperPlane,
  FaSpinner,
  FaCreditCard,
  FaBuilding,
  FaShieldAlt,
  FaClock,
  FaReceipt,
  FaCheckCircle,
} from "react-icons/fa";
import AuthFormShell from "../components/forms/AuthFormShell";
import FormSelect from "../components/forms/FormSelect";
import { getCourses } from "../service/courseService";
import { enrollCohort } from "../service/enrollmentService";
import { verifyPartner } from "../service/collegeService";
import { createPaymentOrder, verifyPayment } from "../service/paymentService";
import { loadRazorpayScript } from "../utils/loadRazorpay";
import useStore from "../store/useStore";
import { enrollCohortCourseSchema } from "../validator/enrollmentSchema";
import { mapZodIssuesToFieldErrors } from "../validator/validation";

const PartnerEnroll = () => {
  const { partnerCode } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { auth } = useStore();
  const [partner, setPartner] = useState(null);
  const [courses, setCourses] = useState([]);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolledDetails, setEnrolledDetails] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  // Payment mode: "OFFLINE" | "ONLINE"
  const [paymentMode, setPaymentMode] = useState("ONLINE");
  const [mockModalOpen, setMockModalOpen] = useState(false);
  const [pendingMockOrder, setPendingMockOrder] = useState(null);

  const courseId = Number(searchParams.get("courseId"));
  const batchTiming = searchParams.get("batchTiming") || "EVENING";

  useEffect(() => {
    const loadPage = async () => {
      try {
        const partnerData = await verifyPartner(partnerCode);
        setPartner(partnerData);

        // Adjust default payment mode based on college preference and URL param
        const urlMode = searchParams.get("paymentMode");
        if (partnerData?.cohort_payment_mode === "OFFLINE_ONLY") {
          setPaymentMode("OFFLINE");
        } else if (partnerData?.cohort_payment_mode === "ONLINE_ONLY") {
          setPaymentMode("ONLINE");
        } else if (urlMode === "OFFLINE" || urlMode === "ONLINE") {
          setPaymentMode(urlMode);
        } else {
          setPaymentMode("ONLINE");
        }

        if (auth?.token && auth?.user?.role === "STUDENT") {
          const courseData = await getCourses(auth.token);
          setCourses(courseData || []);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setChecking(false);
      }
    };

    loadPage();
  }, [auth, partnerCode]);

  const selectedCourse = useMemo(
    () => courses.find((course) => Number(course.id) === courseId),
    [courseId, courses]
  );

  const coursePrice = Number(selectedCourse?.price) || 25000;

  const updateBatchTiming = (event) => {
    setSearchParams({
      courseId: String(courseId),
      batchTiming: event.target.value,
    });
  };

  const handleEnroll = async () => {
    const payload = {
      course_id: courseId,
      partner_code: partnerCode,
      batch_timing: batchTiming,
      payment_mode: paymentMode,
    };

    const parsed = enrollCohortCourseSchema.safeParse(payload);
    if (!parsed.success) {
      setFieldErrors(mapZodIssuesToFieldErrors(parsed.error));
      toast.error("Please fix the highlighted errors");
      return;
    }

    // SCENARIO B: OFFLINE PAYMENT VIA COLLEGE (CAMPUS COLLECTION)
    if (paymentMode === "OFFLINE") {
      try {
        setLoading(true);
        const result = await enrollCohort(parsed.data, auth.token);
        setEnrolledDetails({
          status: "APPLIED",
          mode: "OFFLINE",
          courseTitle: selectedCourse.title,
          collegeName: partner.college_name,
          batchTiming,
        });
        setEnrolled(true);
        setFieldErrors({});
        toast.success("Application submitted! College will collect fees offline.");
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || "Failed to submit cohort application");
      } finally {
        setLoading(false);
      }
      return;
    }

    // SCENARIO A: ONLINE PAYMENT VIA RAZORPAY
    try {
      setLoading(true);
      const orderData = await createPaymentOrder({
        course_id: courseId,
        partner_code: partnerCode,
      });

      const isScriptLoaded = await loadRazorpayScript();

      // Graceful fallback to Sandbox simulation if keys are mock or script is unavailable
      if (orderData.is_mock || !isScriptLoaded || !window.Razorpay || orderData.key_id?.includes("placeholder")) {
        setPendingMockOrder(orderData);
        setMockModalOpen(true);
        setLoading(false);
        return;
      }

      // Live Razorpay Checkout
      const rzpOptions = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "First Track Skills Academy",
        description: `Cohort Fee: ${selectedCourse.title}`,
        image: "/images/companylogo.jpg",
        order_id: orderData.order_id,
        prefill: {
          name: orderData.student?.name || "",
          email: orderData.student?.email || "",
          contact: orderData.student?.phone || "",
        },
        theme: {
          color: "#f97316",
        },
        handler: async function (response) {
          try {
            setLoading(true);
            const verifyResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              batch_timing: batchTiming,
              payment_method: "ONLINE",
            });

            setEnrolledDetails({
              status: "ENROLLED",
              mode: "ONLINE",
              courseTitle: selectedCourse.title,
              collegeName: partner.college_name,
              batchTiming,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: coursePrice,
            });
            setEnrolled(true);
            toast.success("Payment verified! You are enrolled in the course.");
          } catch (verifyError) {
            toast.error(verifyError.response?.data?.message || "Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.info("Payment was cancelled. You can choose to pay offline or retry.");
          },
        },
      };

      const razorpayInstance = new window.Razorpay(rzpOptions);
      razorpayInstance.open();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to initiate online payment");
      setLoading(false);
    }
  };

  // Complete Sandbox Mock Payment
  const handleCompleteMockPayment = async () => {
    if (!pendingMockOrder) return;
    try {
      setLoading(true);
      const mockPaymentId = `pay_mock_${Date.now()}`;
      await verifyPayment({
        razorpay_order_id: pendingMockOrder.order_id,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: "mock_signature_dev_sandbox",
        batch_timing: batchTiming,
        payment_method: "ONLINE_MOCK",
      });

      setEnrolledDetails({
        status: "ENROLLED",
        mode: "ONLINE (SANDBOX)",
        courseTitle: selectedCourse.title,
        collegeName: partner.college_name,
        batchTiming,
        paymentId: mockPaymentId,
        orderId: pendingMockOrder.order_id,
        amount: coursePrice,
      });
      setMockModalOpen(false);
      setEnrolled(true);
      toast.success("Sandbox payment verified! Student enrolled.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Mock payment verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (!auth) return <Navigate to={`/join/${partnerCode}`} replace />;
  if (auth.user.role !== "STUDENT") return <Navigate to="/dashboard" replace />;

  if (checking) {
    return (
      <AuthFormShell badge="College Cohort" title="Preparing Enrollment">
        <div className="flex items-center justify-center gap-3 font-semibold text-orange-600">
          <FaSpinner className="animate-spin" />
          Loading selected course...
        </div>
      </AuthFormShell>
    );
  }

  if (!partner) {
    return (
      <AuthFormShell badge="Partner Link" title="Invalid Partner Link">
        <p className="text-center text-gray-600">This partner link is inactive, invalid, or not approved.</p>
      </AuthFormShell>
    );
  }

  if (!selectedCourse) {
    return (
      <AuthFormShell badge="College Cohort" title="Choose a Course First">
        <div className="text-center">
          <p className="text-gray-600">The selected course could not be found.</p>
          <Link
            to={`/join/${partnerCode}`}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
          >
            <FaArrowLeft />
            Back to Courses
          </Link>
        </div>
      </AuthFormShell>
    );
  }

  // ENROLLED / APPLIED CONFIRMATION VIEW
  if (enrolled && enrolledDetails) {
    const isAppliedOffline = enrolledDetails.status === "APPLIED";

    return (
      <AuthFormShell
        badge={isAppliedOffline ? "Application Submitted" : "Enrollment & Payment Complete"}
        title={isAppliedOffline ? "Application Received!" : "You Are Enrolled!"}
      >
        <div
          className={`rounded-3xl border p-6 sm:p-8 text-center ${
            isAppliedOffline
              ? "border-purple-200 bg-purple-50/70"
              : "border-emerald-200 bg-emerald-50/70"
          }`}
        >
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-white shadow-md mb-5 ${
              isAppliedOffline ? "bg-purple-600" : "bg-emerald-600"
            }`}
          >
            {isAppliedOffline ? <FaClock className="text-2xl" /> : <FaCheck className="text-2xl" />}
          </div>

          <span
            className={`inline-block rounded-full px-4 py-1 text-xs font-black tracking-wider uppercase mb-3 ${
              isAppliedOffline
                ? "bg-purple-200 text-purple-900 border border-purple-300"
                : "bg-emerald-200 text-emerald-900 border border-emerald-300"
            }`}
          >
            Status: {enrolledDetails.status} ({isAppliedOffline ? "Awaiting Campus Fee Collection" : "Paid & Verified"})
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            {enrolledDetails.courseTitle}
          </h2>

          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-md mx-auto leading-relaxed">
            {isAppliedOffline ? (
              <>
                You joined under <span className="font-bold text-gray-900">{enrolledDetails.collegeName}</span>.
                Your status is currently <strong className="text-purple-700">APPLIED</strong>.
                Your college will collect the course fees offline. Once verified, you will be allocated to a batch and mentor.
              </>
            ) : (
              <>
                Congratulations! Your payment has been verified. You joined under{" "}
                <span className="font-bold text-gray-900">{enrolledDetails.collegeName}</span> for the{" "}
                <strong>{enrolledDetails.batchTiming.toLowerCase()}</strong> batch.
              </>
            )}
          </p>

          {/* Receipt / Details Box */}
          <div className="mt-6 rounded-2xl bg-white border border-slate-200 p-5 text-left text-sm space-y-2.5 shadow-sm max-w-md mx-auto">
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Partner College</span>
              <span className="font-bold text-slate-800">{enrolledDetails.collegeName}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Batch Timing</span>
              <span className="font-bold text-slate-800">{enrolledDetails.batchTiming} Batch</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Payment Mode</span>
              <span className="font-bold text-slate-800">{enrolledDetails.mode}</span>
            </div>
            {enrolledDetails.paymentId && (
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Payment ID</span>
                <span className="font-mono text-xs font-bold text-emerald-700">{enrolledDetails.paymentId}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-500 font-medium">Admission Status</span>
              <span
                className={`font-bold flex items-center gap-1.5 ${
                  isAppliedOffline ? "text-purple-700" : "text-emerald-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isAppliedOffline ? "bg-purple-600 animate-pulse" : "bg-emerald-600"
                  }`}
                />
                {enrolledDetails.status}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 font-bold text-white shadow-md transition hover:bg-orange-600 hover:scale-105"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-6 py-3.5 font-bold text-slate-700 transition hover:bg-slate-200"
            >
              Academy Home
            </Link>
          </div>
        </div>
      </AuthFormShell>
    );
  }

  const isOnlineOnly = partner?.cohort_payment_mode === "ONLINE_ONLY";
  const isOfflineOnly = partner?.cohort_payment_mode === "OFFLINE_ONLY";

  return (
    <>
      <AuthFormShell
        badge="Confirm Enrollment"
        title="Enroll in Course"
        subtitle={`Partner admission for ${partner.college_name}.`}
      >
        <button
          onClick={() => navigate(`/join/${partnerCode}`)}
          className="mb-6 inline-flex items-center gap-2 font-semibold text-orange-600 hover:text-orange-700"
        >
          <FaArrowLeft />
          Back to courses
        </button>

        {/* Selected Course Card */}
        <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-600">{selectedCourse.category}</p>
            <span className="rounded-full bg-orange-100 border border-orange-200 px-3 py-0.5 text-xs font-bold text-orange-800">
              {partner.college_name}
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">{selectedCourse.title}</h2>
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{selectedCourse.description}</p>
          <div className="mt-4 flex items-center justify-between border-t border-orange-100 pt-3">
            <span className="text-sm font-semibold text-gray-700">{selectedCourse.duration_weeks} Weeks Duration</span>
            <span className="text-lg font-black text-slate-900">₹{coursePrice.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Batch Timing Selection */}
        <div className="mt-6">
          <FormSelect label="Batch Timing Preference" value={batchTiming} onChange={updateBatchTiming}>
            <option value="MORNING">Morning Batch (09:00 AM - 11:00 AM)</option>
            <option value="AFTERNOON">Afternoon Batch (02:00 PM - 04:00 PM)</option>
            <option value="EVENING">Evening Batch (06:00 PM - 08:00 PM)</option>
            <option value="NIGHT">Night Batch (08:00 PM - 10:00 PM)</option>
          </FormSelect>
          {fieldErrors.batch_timing && (
            <p className="mt-1.5 text-sm font-medium text-red-500">{fieldErrors.batch_timing}</p>
          )}
        </div>

        {/* Cohort Payment / Fee Collection Options */}
        <div className="mt-6">
          <label className="block text-sm font-bold text-gray-800 mb-2">
            Payment &amp; Fee Settlement Option *
          </label>

          <div className="grid sm:grid-cols-2 gap-3">
            {/* Option 1: Pay Online via Razorpay */}
            {!isOfflineOnly && (
              <label
                className={`relative flex flex-col justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMode === "ONLINE"
                    ? "border-orange-500 bg-orange-50/50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMode"
                      value="ONLINE"
                      checked={paymentMode === "ONLINE"}
                      onChange={() => setPaymentMode("ONLINE")}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="font-bold text-slate-900 text-sm">Pay Online Now</span>
                  </div>
                  <FaCreditCard className="text-orange-500 text-lg" />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Pay ₹{coursePrice.toLocaleString("en-IN")} instantly via Razorpay (UPI / Cards / Netbanking). Status will be <strong>ENROLLED</strong> immediately.
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-emerald-700">
                  <span>Instant Activation</span>
                  <span>Razorpay Secured</span>
                </div>
              </label>
            )}

            {/* Option 2: Pay Offline via College Campus */}
            {!isOnlineOnly && (
              <label
                className={`relative flex flex-col justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMode === "OFFLINE"
                    ? "border-purple-500 bg-purple-50/50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMode"
                      value="OFFLINE"
                      checked={paymentMode === "OFFLINE"}
                      onChange={() => setPaymentMode("OFFLINE")}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="font-bold text-slate-900 text-sm">Pay Offline via College</span>
                  </div>
                  <FaBuilding className="text-purple-600 text-lg" />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  College collects fees on campus with student roster. Status will show <strong>APPLIED</strong> until verified and allocated by college/admin.
                </p>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-purple-700">
                  <span>Campus Collection</span>
                  <span>Batch Allocation Later</span>
                </div>
              </label>
            )}
          </div>

          {isOnlineOnly && (
            <p className="text-xs text-amber-700 mt-2 font-medium">
              Note: {partner.college_name} has designated online payment via Razorpay for this cohort.
            </p>
          )}
          {isOfflineOnly && (
            <p className="text-xs text-purple-700 mt-2 font-medium">
              Note: {partner.college_name} collects course fees offline on campus. Your status will be recorded as APPLIED.
            </p>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleEnroll}
          disabled={loading}
          className={`mt-8 flex w-full items-center justify-center gap-3 rounded-xl py-4 text-lg font-bold text-white transition shadow-md disabled:opacity-60 cursor-pointer ${
            paymentMode === "ONLINE"
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? (
            <>
              <span>{paymentMode === "ONLINE" ? "Opening Payment Gateway..." : "Submitting Application..."}</span>
              <FaSpinner className="animate-spin" />
            </>
          ) : paymentMode === "ONLINE" ? (
            <>
              <span>Proceed to Pay ₹{coursePrice.toLocaleString("en-IN")}</span>
              <FaPaperPlane />
            </>
          ) : (
            <>
              <span>Join via College (Status: APPLIED)</span>
              <FaBuilding />
            </>
          )}
        </button>
      </AuthFormShell>

      {/* DEV SANDBOX MODAL (When live Razorpay keys are not yet configured in .env) */}
      {mockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600 font-bold">
                <FaShieldAlt className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Razorpay Sandbox Simulation</h3>
                <p className="text-xs text-slate-500">Development / Test Gateway</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              Live Razorpay API keys have not been configured in the environment yet. Would you like to complete a verified simulated payment of{" "}
              <strong className="text-slate-900">₹{coursePrice.toLocaleString("en-IN")}</strong> to test the cohort enrollment flow?
            </p>

            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs space-y-1.5 font-mono text-slate-700">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-bold">{pendingMockOrder?.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-bold text-emerald-700">₹{coursePrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>College:</span>
                <span>{partner?.college_name}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setMockModalOpen(false)}
                className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteMockPayment}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-md transition"
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                Simulate Successful Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PartnerEnroll;
