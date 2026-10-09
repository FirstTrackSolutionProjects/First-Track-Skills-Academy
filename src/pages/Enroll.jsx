import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, NavLink, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  FaArrowRight,
  FaClock,
  FaHome,
  FaPaperPlane,
  FaSpinner,
  FaCreditCard,
  FaShieldAlt,
  FaLock,
  FaCheckCircle,
  FaReceipt,
  FaCheck,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { COURSES_ENUM } from "../constants/enums";
import { getCourses } from "../service/courseService";
import getEnrollUploadUrls from "@/services/courses/get_enroll_upload_urls.courses.service";
import putObjectService from "@/services/putObjectService";
import sendEnrollment from "@/services/courses/send_enrollment.courses.service";
import useStore, { storeActions } from "../store/useStore";
import { createStudent } from "../service/userService";
import { login } from "../service/authService";
import { createPaymentOrder, verifyPayment } from "../service/paymentService";
import { loadRazorpayScript } from "../utils/loadRazorpay";

const INITIAL_FORM_STATE = Object.freeze({
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
  phone_number: "",
  dob: "",
  gender: "Male",
  district: "",
  state: "",
  pin: "",
  qualification: "",
  college: "",
  course: COURSES_ENUM.FRONTEND_DEVELOPMENT,
  batch: "Morning",
  agree: false,
});

const mapBatchTiming = (batch = "") => {
  const upper = (batch || "").toUpperCase();
  if (upper.includes("MORN")) return "MORNING";
  if (upper.includes("AFTER")) return "AFTERNOON";
  if (upper.includes("EVEN")) return "EVENING";
  if (upper.includes("NIGHT")) return "NIGHT";
  return "MORNING";
};

const Enroll = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { auth } = useStore();
  const isLoggedIn = Boolean(auth?.user);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [files, setFiles] = useState({ profileImage: null, resume: null });
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Dev Mock Sandbox modal state
  const [mockModalOpen, setMockModalOpen] = useState(false);
  const [pendingMockOrder, setPendingMockOrder] = useState(null);
  const [pendingSubmissionPayload, setPendingSubmissionPayload] = useState(null);

  const profileRef = useRef(null);
  const resumeRef = useRef(null);

  const paramCourse =
    searchParams.get("course") ||
    location.state?.course ||
    location.state?.courseTitle;
  const isLockedFromInfo = Boolean(paramCourse);

  // Fetch available courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        if (Array.isArray(data) && data.length > 0) {
          setCourseList(data);
        } else {
          setCourseList(
            Object.values(COURSES_ENUM).map((title, idx) => ({
              id: idx + 1,
              title,
              price: 25000,
            }))
          );
        }
      } catch (err) {
        setCourseList(
          Object.values(COURSES_ENUM).map((title, idx) => ({
            id: idx + 1,
            title,
            price: 25000,
          }))
        );
      }
    };
    fetchCourses();
  }, []);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (auth?.user) {
      setFormData((prev) => ({
        ...prev,
        first_name: auth.user.first_name || "",
        last_name: auth.user.last_name || "",
        email: auth.user.email || "",
      }));
    }
  }, [auth]);

  // Set default / preselected course
  useEffect(() => {
    if (paramCourse) {
      setFormData((prev) => ({ ...prev, course: paramCourse }));
    } else if (courseList.length > 0 && !formData.course) {
      setFormData((prev) => ({ ...prev, course: courseList[0].title }));
    }
  }, [paramCourse, courseList]);

  // Identify currently selected course object and price
  const selectedCourseObj = useMemo(() => {
    if (!courseList.length) return null;
    return (
      courseList.find(
        (c) =>
          c.title === formData.course ||
          c.id === formData.course ||
          String(c.id) === String(formData.course)
      ) || courseList[0]
    );
  }, [courseList, formData.course]);

  const coursePrice = Number(selectedCourseObj?.price) || 25000;

  const handleChange = (e) => {
    const { name, value, type, checked, files: inputFiles } = e.target;
    if (type === "file") {
      setFiles((prev) => ({
        ...prev,
        [name]: inputFiles[0] || null,
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agree) {
      toast.error("Please agree to the Terms & Conditions and Privacy Policy");
      return;
    }

    try {
      setLoading(true);

      let profile_image = "";
      let resume = "";

      // 1. If not logged in, register student and auto-login
      if (!isLoggedIn) {
        if (formData.password !== formData.confirm_password) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }

        // Upload files if attached
        const uploadList = [];
        if (files.profileImage) {
          uploadList.push({
            inputName: "profileImage",
            filename: files.profileImage.name,
            filetype: files.profileImage.type,
          });
        }
        if (files.resume) {
          uploadList.push({
            inputName: "resume",
            filename: files.resume.name,
            filetype: files.resume.type,
          });
        }

        if (uploadList.length > 0) {
          try {
            const uploadUrlObject = await getEnrollUploadUrls(uploadList);
            await Promise.all(
              Object.keys(uploadUrlObject).map((key) => {
                const fileObj = key === "profileImage" ? files.profileImage : files.resume;
                return putObjectService(uploadUrlObject[key].uploadUrl, fileObj, fileObj.type);
              })
            );
            profile_image = uploadUrlObject.profileImage?.fileKey || "";
            resume = uploadUrlObject.resume?.fileKey || "";
          } catch (uploadError) {
            console.warn("File upload error:", uploadError);
          }
        }

        // Create student account
        await createStudent({
          first_name: formData.first_name.trim(),
          middle_name: formData.middle_name ? formData.middle_name.trim() : undefined,
          last_name: formData.last_name ? formData.last_name.trim() : undefined,
          email: formData.email.trim(),
          password: formData.password,
          confirm_password: formData.confirm_password,
          phone_number: formData.phone_number.trim(),
          dob: formData.dob,
          gender: formData.gender,
          district: formData.district.trim(),
          state: formData.state.trim(),
          pin: formData.pin.trim(),
          qualification: formData.qualification.trim(),
          college: formData.college.trim(),
          profile_image,
          resume,
          role: "STUDENT",
        });

        // Auto login
        const authData = await login({
          email: formData.email.trim(),
          password: formData.password,
        });

        storeActions.setAuth({
          user: authData.user,
          token: authData.tokens.access_token,
          refreshToken: authData.tokens.refresh_token,
        });
      }

      const fullName = isLoggedIn
        ? `${auth?.user?.first_name || ""} ${auth?.user?.last_name || ""}`.trim() || auth?.user?.email
        : [formData.first_name, formData.middle_name, formData.last_name].filter(Boolean).join(" ");
      const email = isLoggedIn ? auth?.user?.email : formData.email.trim();

      const submissionPayload = {
        fullName,
        email,
        phone: formData.phone_number || "",
        dob: formData.dob || "",
        gender: formData.gender || "",
        district: formData.district || "",
        state: formData.state || "",
        pin: formData.pin || "",
        qualification: formData.qualification || "",
        college: formData.college || "",
        course: selectedCourseObj?.title || formData.course,
        mode: "Online",
        batch: formData.batch,
        files: {
          ...(profile_image ? { profileImage: profile_image } : {}),
          ...(resume ? { resume } : {}),
        },
      };

      // 2. INITIATE COMPULSORY RAZORPAY PAYMENT
      const targetCourseId = Number(selectedCourseObj?.id) || 1;
      const orderData = await createPaymentOrder({
        course_id: targetCourseId,
      });

      const isScriptLoaded = await loadRazorpayScript();

      // Fallback to Sandbox Modal if mock mode, keys absent, or script blocked
      if (
        orderData.is_mock ||
        !isScriptLoaded ||
        !window.Razorpay ||
        orderData.key_id?.includes("placeholder")
      ) {
        setPendingMockOrder(orderData);
        setPendingSubmissionPayload(submissionPayload);
        setMockModalOpen(true);
        setLoading(false);
        return;
      }

      // 3. LAUNCH RAZORPAY CHECKOUT MODAL
      const rzpOptions = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "First Track Skills Academy",
        description: `Enrollment Fee: ${orderData.course?.title || formData.course}`,
        image: "/images/companylogo.jpg",
        order_id: orderData.order_id,
        prefill: {
          name: orderData.student?.name || fullName,
          email: orderData.student?.email || email,
          contact: orderData.student?.phone || formData.phone_number || "",
        },
        theme: {
          color: "#f97316",
        },
        handler: async function (response) {
          try {
            setLoading(true);
            // Verify payment on backend
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              batch_timing: mapBatchTiming(formData.batch),
              payment_method: "ONLINE",
            });

            // Send notification email
            try {
              await sendEnrollment(submissionPayload);
            } catch (err) {
              console.warn("Enrollment email error:", err);
            }

            setSubmittedData({
              fullName,
              email,
              course: selectedCourseObj?.title || formData.course,
              batch: formData.batch,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: coursePrice,
              date: new Date().toLocaleString(),
            });
            setSubmitted(true);
            toast.success("Payment verified! Course admission completed successfully.");
          } catch (verifyError) {
            toast.error(
              verifyError.response?.data?.message || "Payment verification failed"
            );
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.warning("Payment was not completed. Admission requires verified course fee payment.");
          },
        },
      };

      const razorpayInstance = new window.Razorpay(rzpOptions);
      razorpayInstance.open();
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message || error.message || "Failed to initiate course enrollment";
      toast.error(message);
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
        batch_timing: mapBatchTiming(formData.batch),
        payment_method: "ONLINE_MOCK",
      });

      if (pendingSubmissionPayload) {
        try {
          await sendEnrollment(pendingSubmissionPayload);
        } catch (err) {
          console.warn("Enrollment email error:", err);
        }
      }

      const fullName =
        pendingSubmissionPayload?.fullName ||
        [formData.first_name, formData.middle_name, formData.last_name].filter(Boolean).join(" ");
      const email = pendingSubmissionPayload?.email || formData.email;

      setSubmittedData({
        fullName,
        email,
        course: selectedCourseObj?.title || formData.course,
        batch: formData.batch,
        paymentId: mockPaymentId,
        orderId: pendingMockOrder.order_id,
        amount: coursePrice,
        date: new Date().toLocaleString(),
      });
      setMockModalOpen(false);
      setSubmitted(true);
      toast.success("Sandbox payment verified! Admission completed.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Mock payment verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#FFF8F0] py-20 min-h-[85vh] flex items-center">
      <div className="max-w-6xl mx-auto px-5 w-full">
        {submitted && submittedData ? (
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center max-w-2xl mx-auto border border-orange-100">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-6 border border-emerald-200 shadow-sm">
              <FaCheck className="text-4xl" />
            </div>

            <span className="inline-block rounded-full bg-emerald-100 border border-emerald-300 px-4 py-1.5 text-xs font-black text-emerald-800 tracking-wider uppercase mb-3">
              Fee Paid &bull; Enrolled &bull; Awaiting Batch Allocation
            </span>

            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Admission Confirmed!
            </h2>

            <p className="mt-4 text-base text-gray-600 sm:text-lg max-w-xl mx-auto leading-relaxed">
              Congratulations! Your payment for{" "}
              <span className="font-bold text-gray-900">{submittedData.course}</span> has been verified.
              Your seat is confirmed and your profile is currently{" "}
              <strong className="text-amber-700">Pending Batch Allocation</strong>.
              We will notify you at <span className="font-semibold text-orange-600">{submittedData.email}</span> as soon as your batch and mentor are assigned.
            </p>

            {/* Official Admission & Payment Receipt */}
            <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200 p-6 text-left max-w-md mx-auto space-y-3 shadow-inner">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <FaReceipt className="text-orange-500 text-lg" />
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                  Payment Receipt &bull; First Track Skills
                </h3>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Student</span>
                <span className="font-bold text-slate-800">{submittedData.fullName}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Course</span>
                <span className="font-bold text-slate-800">{submittedData.course}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Batch Timing</span>
                <span className="font-bold text-slate-800">{submittedData.batch} Batch</span>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Amount Paid</span>
                <span className="font-black text-emerald-700 text-base">₹{Number(submittedData.amount || 25000).toLocaleString("en-IN")}</span>
              </div>
              {submittedData.paymentId && (
                <div className="flex justify-between items-center text-xs py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Payment ID</span>
                  <span className="font-mono font-bold text-slate-700">{submittedData.paymentId}</span>
                </div>
              )}
              {submittedData.orderId && (
                <div className="flex justify-between items-center text-xs py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Order ID</span>
                  <span className="font-mono text-slate-600">{submittedData.orderId}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm py-1">
                <span className="text-slate-500 font-medium">Admission Status</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  Verified &amp; Active
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold transition shadow-md hover:scale-105 cursor-pointer"
              >
                Go to Dashboard
                <FaArrowRight />
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3.5 rounded-xl font-bold transition cursor-pointer"
              >
                <FaHome />
                Back to Homepage
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <span className="bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
                Admission Form
              </span>

              <NavLink to="/" className="flex flex-col items-center gap-3 mt-5">
                <img
                  src="/images/companylogo.jpg"
                  alt="First Track"
                  className="w-24 h-24 rounded-full border-2 border-orange-500 object-cover shadow-md"
                />
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                  First Track
                  <span className="text-orange-500"> Skills Academy</span>
                </h1>
              </NavLink>

              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Begin your career journey by enrolling in one of our
                industry-oriented training programs.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-8 md:p-10"
            >
              {isLoggedIn ? (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-8 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Logged in as</p>
                    <p className="text-lg font-bold text-gray-800">
                      {auth?.user?.first_name || ""} {auth?.user?.last_name || ""}
                      <span className="text-sm font-normal text-gray-600 ml-2">({auth?.user?.email})</span>
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 font-semibold rounded-full text-xs">
                    {auth?.user?.role}
                  </span>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6">
                    Student Information
                  </h2>

                  <div className="grid md:grid-cols-3 gap-6">
                    <input
                      type="text"
                      name="first_name"
                      placeholder="First Name *"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="border rounded-xl px-4 py-3"
                    />

                    <input
                      type="text"
                      name="middle_name"
                      placeholder="Middle Name"
                      value={formData.middle_name}
                      onChange={handleChange}
                      className="border rounded-xl px-4 py-3"
                    />

                    <input
                      type="text"
                      name="last_name"
                      placeholder="Last Name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="border rounded-xl px-4 py-3"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border rounded-xl px-4 py-3"
                    />

                    <input
                      type="tel"
                      name="phone_number"
                      placeholder="Phone Number (10 digits) *"
                      value={formData.phone_number}
                      onChange={handleChange}
                      required
                      maxLength={10}
                      className="border rounded-xl px-4 py-3"
                    />

                    <input
                      type="password"
                      name="password"
                      placeholder="Password (min 8 chars, 1 uppercase, 1 digit, 1 special) *"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="border rounded-xl px-4 py-3"
                    />

                    <input
                      type="password"
                      name="confirm_password"
                      placeholder="Confirm Password *"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      required
                      className="border rounded-xl px-4 py-3"
                    />

                    <div className="relative">
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                        className="w-full h-12 border border-gray-300 rounded-xl px-4 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                      {!formData.dob && (
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">
                          Select Date of Birth *
                        </span>
                      )}
                    </div>

                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="border rounded-xl px-4 py-3"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <h2 className="text-2xl font-bold mt-10 mb-6">
                    Address Information
                  </h2>

                  <div className="grid md:grid-cols-3 gap-6">
                    <input
                      type="text"
                      name="district"
                      placeholder="District *"
                      value={formData.district}
                      onChange={handleChange}
                      required
                      className="border rounded-xl px-4 py-3"
                    />

                    <input
                      type="text"
                      name="state"
                      placeholder="State *"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="border rounded-xl px-4 py-3"
                    />

                    <input
                      type="text"
                      name="pin"
                      placeholder="PIN Code (6 digits) *"
                      value={formData.pin}
                      onChange={handleChange}
                      required
                      maxLength={6}
                      className="border rounded-xl px-4 py-3"
                    />
                  </div>

                  <h2 className="text-2xl font-bold mt-10 mb-6">
                    Academic Background
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="qualification"
                      placeholder="Highest Qualification (e.g. B.Tech, BCA, MCA) *"
                      value={formData.qualification}
                      onChange={handleChange}
                      required
                      className="border rounded-xl px-4 py-3"
                    />

                    <input
                      type="text"
                      name="college"
                      placeholder="College / Institute Name *"
                      value={formData.college}
                      onChange={handleChange}
                      required
                      className="border rounded-xl px-4 py-3"
                    />
                  </div>

                  <h2 className="text-2xl font-bold mt-10 mb-6">
                    Upload Documents (Optional)
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-semibold mb-2 text-sm text-gray-700">
                        Profile Image
                      </label>
                      <input
                        ref={profileRef}
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3 file:bg-orange-500 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:cursor-pointer text-sm"
                      />
                      {files.profileImage && (
                        <p className="text-xs text-green-600 mt-2 font-medium">
                          Selected: {files.profileImage.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold mb-2 text-sm text-gray-700">
                        Upload Resume
                      </label>
                      <input
                        ref={resumeRef}
                        type="file"
                        name="resume"
                        accept=".pdf,.doc,.docx"
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-3 file:bg-orange-500 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:cursor-pointer text-sm"
                      />
                      {files.resume && (
                        <p className="text-xs text-green-600 mt-2 font-medium">
                          Selected: {files.resume.name}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <h2 className={`text-2xl font-bold mb-6 ${isLoggedIn ? "mt-2" : "mt-10"}`}>
                Course &amp; Batch Preference
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Selected Course *
                  </label>
                  {isLockedFromInfo ? (
                    <select
                      name="course"
                      value={formData.course}
                      disabled
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 text-gray-900 font-semibold cursor-not-allowed shadow-sm"
                    >
                      <option value={formData.course}>{formData.course}</option>
                    </select>
                  ) : (
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
                    >
                      {courseList.map((c) => {
                        const courseTitle = c.title || c;
                        return (
                          <option key={c.id || courseTitle} value={courseTitle}>
                            {courseTitle}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Preferred Batch Timing
                  </label>
                  <select
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-xl px-4 py-3 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Morning">Morning Batch (09:00 AM - 11:00 AM)</option>
                    <option value="Afternoon">Afternoon Batch (02:00 PM - 04:00 PM)</option>
                    <option value="Evening">Evening Batch (06:00 PM - 08:00 PM)</option>
                    <option value="Weekend">Weekend Batch (Saturday - Sunday)</option>
                  </select>
                </div>
              </div>

              {/* COMPULSORY PAYMENT SUMMARY CARD */}
              <div className="mt-8 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 p-5 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <FaCreditCard className="text-orange-600" />
                      <span className="text-xs uppercase tracking-wider font-extrabold text-orange-700">
                        Compulsory Course Admission Fee
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-black text-gray-900">
                        ₹{coursePrice.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">
                        (All-inclusive fee for {selectedCourseObj?.duration_weeks || 12} weeks)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 max-w-md">
                      Admission to individual courses requires upfront payment verification via Razorpay. Supports UPI (GPay/PhonePe), Credit/Debit Cards, and Netbanking.
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800">
                      <FaLock className="text-[10px]" />
                      100% Secure Razorpay
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Instant Seat Confirmation
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  required
                  className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />

                <span className="text-gray-600 text-sm">
                  I agree to the{" "}
                  <Link to="/terms-of-use" className="text-orange-500 underline hover:text-orange-600">
                    Terms &amp; Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" className="text-orange-500 underline hover:text-orange-600">
                    Privacy Policy
                  </Link>.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition shadow-md cursor-pointer"
              >
                {loading ? (
                  <>
                    <span>Connecting to Razorpay...</span>
                    <FaSpinner className="animate-spin" />
                  </>
                ) : (
                  <>
                    <span>Pay ₹{coursePrice.toLocaleString("en-IN")} &amp; Enroll</span>
                    <FaCreditCard />
                  </>
                )}
              </button>

              {!isLoggedIn && (
                <p className="mt-4 text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold text-orange-600 hover:underline">
                    Login here
                  </Link>
                </p>
              )}
            </form>
          </>
        )}
      </div>

      {/* DEV SANDBOX MODAL (When live Razorpay keys are not yet set in .env) */}
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
              Razorpay API keys have not yet been configured in the environment (.env). You can simulate a successful payment of{" "}
              <strong className="text-slate-900">₹{coursePrice.toLocaleString("en-IN")}</strong> to verify the entire compulsory admission flow.
            </p>

            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs space-y-1.5 font-mono text-slate-700">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-bold">{pendingMockOrder?.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span>Course:</span>
                <span className="font-bold">{pendingMockOrder?.course?.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-bold text-emerald-700">₹{coursePrice.toLocaleString("en-IN")}</span>
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
    </section>
  );
};

export default Enroll;
