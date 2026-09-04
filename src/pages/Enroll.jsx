import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { FaArrowRight, FaClock, FaHome, FaPaperPlane, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { COURSES_ENUM } from "../constants/enums";
import { getCourses } from "../service/courseService";
import getEnrollUploadUrls from "@/services/courses/get_enroll_upload_urls.courses.service";
import putObjectService from "@/services/putObjectService";
import sendEnrollment from "@/services/courses/send_enrollment.courses.service";
import useStore, { storeActions } from "../store/useStore";
import { createStudent } from "../service/userService";
import { login } from "../service/authService";

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

  const profileRef = useRef(null);
  const resumeRef = useRef(null);

  // Fetch available courses to populate dynamic course titles
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        if (Array.isArray(data) && data.length > 0) {
          setCourseList(data);
        } else {
          setCourseList(Object.values(COURSES_ENUM).map((title) => ({ id: title, title })));
        }
      } catch (err) {
        setCourseList(Object.values(COURSES_ENUM).map((title) => ({ id: title, title })));
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

  // Set default / preselected course by course.title from URL or state
  useEffect(() => {
    const paramCourse =
      searchParams.get("course") ||
      location.state?.course ||
      location.state?.courseTitle;

    if (paramCourse) {
      setFormData((prev) => ({ ...prev, course: paramCourse }));
    } else if (courseList.length > 0 && !formData.course) {
      setFormData((prev) => ({ ...prev, course: courseList[0].title }));
    }
  }, [searchParams, location.state, courseList]);

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

      if (!isLoggedIn) {
        // Validate password match
        if (formData.password !== formData.confirm_password) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }

        // Upload files if attached (optional)
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

        // Create student account with all profile fields
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
        course: formData.course,
        mode: "Online", // Mode is always Online
        batch: formData.batch,
        files: {
          ...(profile_image ? { profileImage: profile_image } : {}),
          ...(resume ? { resume } : {}),
        },
      };

      await sendEnrollment(submissionPayload);

      setSubmittedData({
        fullName,
        email,
        course: formData.course,
        batch: formData.batch,
      });
      setSubmitted(true);

      toast.success(
        isLoggedIn
          ? "Enrollment submitted successfully!"
          : "Account created and enrolled successfully!"
      );
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || error.message || "Failed to submit enrollment";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#FFF8F0] py-20 min-h-[85vh] flex items-center">
      <div className="max-w-6xl mx-auto px-5 w-full">
        {submitted && submittedData ? (
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center max-w-2xl mx-auto border border-orange-100">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500 mb-6 border border-amber-200 shadow-sm">
              <FaClock className="text-4xl animate-pulse" />
            </div>

            <span className="inline-block rounded-full bg-amber-100 border border-amber-300 px-4 py-1.5 text-xs font-bold text-amber-800 tracking-wide uppercase mb-3">
              Status: Pending - Awaiting Batch Allocation
            </span>

            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Enrollment Received!
            </h2>

            <p className="mt-4 text-base text-gray-600 sm:text-lg max-w-xl mx-auto leading-relaxed">
              Thank you for enrolling in{" "}
              <span className="font-bold text-gray-900">{submittedData.course}</span>.
              Your course is currently <strong className="text-amber-700">Pending (Awaiting Batch Allocation)</strong>.
              You will receive updates via email at{" "}
              <span className="font-semibold text-orange-600">{submittedData.email}</span> when
              you are assigned a batch.
            </p>

            <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200 p-6 text-left max-w-md mx-auto space-y-3 shadow-inner">
              <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Selected Course</span>
                <span className="font-bold text-slate-800">{submittedData.course}</span>
              </div>
              <div className="flex justify-between items-center text-sm py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Preferred Batch Timing</span>
                <span className="font-bold text-slate-800">{submittedData.batch} Batch</span>
              </div>
              <div className="flex justify-between items-center text-sm py-1">
                <span className="text-slate-500 font-medium">Course Status</span>
                <span className="font-bold text-amber-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500 inline-block animate-pulse" />
                  Pending - Awaiting Batch Allocation
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
                      className="border rounded-xl px-4 py-3 bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>

                    <input
                      type="text"
                      name="district"
                      placeholder="District / City *"
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
                    Education
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="qualification"
                      placeholder="Highest Qualification (e.g., B.Tech, BCA, B.Sc) *"
                      value={formData.qualification}
                      onChange={handleChange}
                      required
                      className="border rounded-xl px-4 py-3"
                    />

                    <input
                      type="text"
                      name="college"
                      placeholder="College / University Name *"
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
                    Selected Course
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    disabled
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-100 text-gray-900 font-semibold cursor-not-allowed shadow-sm"
                  >
                    <option value={formData.course}>{formData.course}</option>
                  </select>
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

              <div className="mt-8 flex items-center gap-3">
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
                  <Link to="/terms-of-use" className="text-orange-500 underline hover:text-orange-600">Terms &amp; Conditions</Link>
                  {" "}and{" "}
                  <Link to="/privacy-policy" className="text-orange-500 underline hover:text-orange-600">Privacy Policy</Link>.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 transition shadow-md cursor-pointer"
              >
                {loading ? "Submitting..." : "Enroll Now"}
                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaPaperPlane />
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
    </section>
  );
};

export default Enroll;
