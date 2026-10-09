import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPaperPlane, FaSignInAlt, FaSpinner, FaCreditCard, FaBuilding, FaCheck } from "react-icons/fa";
import AuthFormShell from "../components/forms/AuthFormShell";
import FormInput from "../components/forms/FormInput";
import FormSelect from "../components/forms/FormSelect";
import { login } from "../service/authService";
import { verifyPartner } from "../service/collegeService";
import { getCourses } from "../service/courseService";
import { createStudent } from "../service/userService";
import useStore from "../store/useStore";
import { storeActions } from "../store/useStore";
import { loginSchema } from "../validator/loginSchema";
import { userRegistrationSchema } from "../validator/userSchema";
import { mapZodIssuesToFieldErrors } from "../validator/validation";

const INITIAL_FORM = {
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
  role: "STUDENT",
};

const PartnerJoin = () => {
  const { partnerCode } = useParams();
  const navigate = useNavigate();
  const { auth } = useStore();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loginFieldErrors, setLoginFieldErrors] = useState({});
  const [partner, setPartner] = useState(null);
  const [courses, setCourses] = useState([]);
  const [courseBatchTiming, setCourseBatchTiming] = useState({});
  const [coursePaymentMode, setCoursePaymentMode] = useState({});
  const [mode, setMode] = useState("signup");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const isStudentLoggedIn = auth?.token && auth?.user?.role === "STUDENT";

  const loadCourses = useCallback(async () => {
    try {
      const courseData = await getCourses();
      setCourses(courseData || []);
    } catch (error) {
      console.warn("Could not load courses:", error);
    }
  }, []);

  useEffect(() => {
    const loadPartner = async () => {
      try {
        const data = await verifyPartner(partnerCode);
        setPartner(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setChecking(false);
      }
    };

    loadPartner();
    loadCourses();
  }, [partnerCode, loadCourses]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    setLoginFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const saveAuthAndLoadCourses = async (authData) => {
    storeActions.setAuth({
      user: authData.user,
      token: authData.tokens.access_token,
      refreshToken: authData.tokens.refresh_token,
    });
    await loadCourses(authData.tokens.access_token);
  };

  const handleAccountSubmit = async (event) => {
    event.preventDefault();

    const accountPayload = {
      first_name: form.first_name,
      middle_name: form.middle_name,
      last_name: form.last_name,
      email: form.email,
      password: form.password,
      confirm_password: form.confirm_password,
      role: "STUDENT",
    };

    const parsed = userRegistrationSchema.safeParse(accountPayload);

    if (!parsed.success) {
      setFieldErrors(mapZodIssuesToFieldErrors(parsed.error));
      toast.error("Please fix the highlighted errors");
      return;
    }

    const loginPayload = loginSchema.safeParse({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (!loginPayload.success) {
      setFieldErrors(mapZodIssuesToFieldErrors(loginPayload.error));
      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      setLoading(true);
      await createStudent(parsed.data);

      const authData = await login(loginPayload.data);

      await saveAuthAndLoadCourses(authData);
      setFieldErrors({});
      toast.success("Student account created");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    const parsed = loginSchema.safeParse(loginForm);

    if (!parsed.success) {
      setLoginFieldErrors(mapZodIssuesToFieldErrors(parsed.error));
      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      setLoading(true);
      const authData = await login(parsed.data);
      if (authData.user.role !== "STUDENT") {
        toast.error("Please login with a student account to join this college cohort.");
        return;
      }
      await saveAuthAndLoadCourses(authData);
      setLoginFieldErrors({});
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const continueToEnroll = (courseId) => {
    const batchTiming = courseBatchTiming[courseId] || "EVENING";
    const defaultMode = partner?.cohort_payment_mode === "OFFLINE_ONLY" ? "OFFLINE" : "ONLINE";
    const paymentMode = coursePaymentMode[courseId] || defaultMode;
    navigate(`/join/${partnerCode}/enroll?courseId=${courseId}&batchTiming=${batchTiming}&paymentMode=${paymentMode}`);
  };

  if (checking) {
    return (
      <AuthFormShell badge="Partner Link" title="Checking Partner Link">
        <div className="flex items-center justify-center gap-3 text-orange-600 font-semibold">
          <FaSpinner className="animate-spin" />
          Verifying partner link...
        </div>
      </AuthFormShell>
    );
  }

  if (!partner) {
    return (
      <AuthFormShell badge="Partner Link" title="Invalid Partner Link">
        <p className="text-center text-gray-600">
          This partner link is inactive, invalid, or not approved.
        </p>
      </AuthFormShell>
    );
  }

  return (
    <AuthFormShell
      badge="Student Onboarding"
      title={`Join ${partner.college_name}`}
      subtitle={`${partner.city}, ${partner.state} college cohort enrollment.`}
    >
      {/* COHORT ADMISSION & FEE POLICY BANNER (Always visible) */}
      <div className="mb-6 rounded-2xl border p-4 sm:p-5 shadow-xs transition bg-gradient-to-r from-orange-50/90 to-amber-50/70 border-orange-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-orange-500 text-white flex items-center justify-center text-base font-bold shadow-xs shrink-0">
              <FaBuilding />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-orange-700">
                Official College Cohort Portal
              </p>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {partner.college_name}
              </h3>
            </div>
          </div>
          <span className="shrink-0 self-start sm:self-auto rounded-full border border-orange-200 bg-white px-3 py-1 text-xs font-mono font-bold text-orange-800">
            Partner Code: {partner.partner_code}
          </span>
        </div>

        {/* PAYMENT POLICY HIGHLIGHT */}
        <div className="mt-3.5 rounded-xl bg-white border border-orange-100 p-3.5 text-xs flex items-start gap-3 shadow-2xs">
          <div className="h-7 w-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
            <FaCreditCard className="text-sm" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-slate-900 text-xs">
                Fee Collection &amp; Payment Options
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                partner.cohort_payment_mode === "OFFLINE_ONLY"
                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                  : partner.cohort_payment_mode === "ONLINE_ONLY"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}>
                {partner.cohort_payment_mode === "OFFLINE_ONLY"
                  ? "Offline Campus Only"
                  : partner.cohort_payment_mode === "ONLINE_ONLY"
                  ? "Online Razorpay Only"
                  : "Student Choice (Online & Offline)"}
              </span>
            </div>
            <p className="text-slate-600 mt-1 leading-relaxed">
              {partner.cohort_payment_mode === "OFFLINE_ONLY"
                ? "This college collects fees offline directly on campus. Online Razorpay payment is disabled. When you apply, your application status will show APPLIED until fees are settled on campus."
                : partner.cohort_payment_mode === "ONLINE_ONLY"
                ? "Students in this cohort must complete the fee payment online via Razorpay. Your seat is confirmed immediately with ENROLLED status."
                : "You can choose either to Pay Online via Razorpay (Instant Active ENROLLED status) or Pay Offline via College Campus (College collects fees offline; status will be APPLIED)."}
            </p>
          </div>
        </div>
      </div>

      {!isStudentLoggedIn ? (
        <div className="space-y-6">
          {/* PREVIEW OF AVAILABLE COURSES AND FEES */}
          {courses.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Available Cohort Programs ({courses.length})
                </span>
                <span className="text-xs font-bold text-orange-600">
                  Standard Fee: ₹25,000 / Course
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-xs">
                {courses.map((c) => (
                  <div key={c.id} className="rounded-xl bg-white border border-slate-200 p-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{c.title}</p>
                      <p className="text-[11px] text-slate-500">{c.duration_weeks || 12} Weeks Training</p>
                    </div>
                    <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md shrink-0">
                      ₹{Number(c.price || 25000).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-slate-500 text-center font-medium">
                👉 Create an account or log in below to choose your batch and select your payment option.
              </p>
            </div>
          )}

          {mode === "signup" ? (
      <form onSubmit={handleAccountSubmit}>
        <div className="grid md:grid-cols-3 gap-6">
          <FieldErrorInput label="First Name" name="first_name" value={form.first_name} onChange={handleChange} error={fieldErrors.first_name} required />
          <FieldErrorInput label="Middle Name" name="middle_name" value={form.middle_name} onChange={handleChange} error={fieldErrors.middle_name} />
          <FieldErrorInput label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} error={fieldErrors.last_name} />
          <FieldErrorInput label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={fieldErrors.email} required />
          <FieldErrorInput label="Password" type="password" name="password" value={form.password} onChange={handleChange} error={fieldErrors.password} required />
          <FieldErrorInput label="Confirm Password" type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} error={fieldErrors.confirm_password} required />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 transition"
        >
          {loading ? "Submitting..." : "Create Account & Continue"}
          {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
        </button>

        <button
          type="button"
          onClick={() => setMode("login")}
          className="mt-5 w-full rounded-xl border border-orange-200 py-4 text-lg font-semibold text-orange-600 transition hover:bg-orange-50"
        >
          Already have an account? Login
        </button>
      </form>
        ) : (
          <form onSubmit={handleLoginSubmit} className="grid gap-6">
            <FormInput
              label="Email"
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleLoginChange}
              className={loginFieldErrors.email ? "border-red-400 focus:ring-red-300" : ""}
              aria-invalid={Boolean(loginFieldErrors.email)}
              required
            />
            {loginFieldErrors.email && <p className="-mt-4 text-sm font-medium text-red-500">{loginFieldErrors.email}</p>}
            <FormInput
              label="Password"
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleLoginChange}
              className={loginFieldErrors.password ? "border-red-400 focus:ring-red-300" : ""}
              aria-invalid={Boolean(loginFieldErrors.password)}
              required
            />
            {loginFieldErrors.password && <p className="-mt-4 text-sm font-medium text-red-500">{loginFieldErrors.password}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 transition"
            >
              {loading ? "Logging in..." : "Login and Continue"}
              {loading ? <FaSpinner className="animate-spin" /> : <FaSignInAlt />}
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="rounded-xl border border-orange-200 py-4 text-lg font-semibold text-orange-600 transition hover:bg-orange-50"
            >
              Need an account? Sign up
            </button>
          </form>
        )}
        </div>
      ) : (
        <div>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-8">
            <p className="font-semibold text-gray-900">College</p>
            <p className="text-orange-600 mt-2">{partner.college_name}</p>
          </div>

          <h2 className="text-2xl font-bold mb-6">Choose a Course</h2>

          {courses.length === 0 ? (
            <p className="text-gray-600">No active courses found.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {courses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-orange-600">{course.category}</p>
                  <h3 className="text-xl font-bold mt-2">{course.title}</h3>
                  <p className="text-gray-600 mt-2 text-sm">{course.description}</p>
                  
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs font-semibold text-gray-700">{course.duration_weeks} Weeks Training</span>
                    <span className="text-lg font-black text-slate-900">
                      ₹{Number(course.price || 25000).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="mt-3">
                    <FormSelect
                      label="Batch Timing"
                      value={courseBatchTiming[course.id] || "EVENING"}
                      onChange={(event) =>
                        setCourseBatchTiming((prev) => ({
                          ...prev,
                          [course.id]: event.target.value,
                        }))
                      }
                    >
                      <option value="MORNING">Morning</option>
                      <option value="AFTERNOON">Afternoon</option>
                      <option value="EVENING">Evening</option>
                      <option value="NIGHT">Night</option>
                    </FormSelect>
                  </div>

                  {/* Payment Mode Selector on Course Card */}
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-2">
                      Payment &amp; Admission Option *
                    </label>

                    {partner?.cohort_payment_mode === "OFFLINE_ONLY" ? (
                      <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-3 text-xs text-purple-900 flex items-center gap-2.5">
                        <FaBuilding className="text-purple-600 text-sm shrink-0" />
                        <div>
                          <p className="font-bold">Offline Campus Collection Only</p>
                          <p className="text-[11px] text-purple-700">Fees collected offline on campus. Status: APPLIED</p>
                        </div>
                      </div>
                    ) : partner?.cohort_payment_mode === "ONLINE_ONLY" ? (
                      <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-3 text-xs text-orange-900 flex items-center gap-2.5">
                        <FaCreditCard className="text-orange-600 text-sm shrink-0" />
                        <div>
                          <p className="font-bold">Online Payment Only (Razorpay)</p>
                          <p className="text-[11px] text-orange-700">Immediate active enrollment via Razorpay</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <label
                          className={`flex flex-col justify-between p-2.5 rounded-xl border-2 cursor-pointer transition ${
                            (coursePaymentMode[course.id] || "ONLINE") === "ONLINE"
                              ? "border-orange-500 bg-orange-50/60 shadow-2xs"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <input
                              type="radio"
                              name={`payment_mode_${course.id}`}
                              value="ONLINE"
                              checked={(coursePaymentMode[course.id] || "ONLINE") === "ONLINE"}
                              onChange={() =>
                                setCoursePaymentMode((prev) => ({ ...prev, [course.id]: "ONLINE" }))
                              }
                              className="text-orange-600"
                            />
                            <span className="font-bold text-slate-800 text-[11px]">Pay Online</span>
                          </div>
                          <span className="text-[10px] text-slate-500 mt-1">Razorpay &bull; Enrolled</span>
                        </label>

                        <label
                          className={`flex flex-col justify-between p-2.5 rounded-xl border-2 cursor-pointer transition ${
                            coursePaymentMode[course.id] === "OFFLINE"
                              ? "border-purple-500 bg-purple-50/60 shadow-2xs"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <input
                              type="radio"
                              name={`payment_mode_${course.id}`}
                              value="OFFLINE"
                              checked={coursePaymentMode[course.id] === "OFFLINE"}
                              onChange={() =>
                                setCoursePaymentMode((prev) => ({ ...prev, [course.id]: "OFFLINE" }))
                              }
                              className="text-purple-600"
                            />
                            <span className="font-bold text-slate-800 text-[11px]">Pay Offline</span>
                          </div>
                          <span className="text-[10px] text-slate-500 mt-1">Campus &bull; Applied</span>
                        </label>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => continueToEnroll(course.id)}
                    className={`mt-5 w-full py-3.5 rounded-xl font-bold transition shadow-sm cursor-pointer flex items-center justify-center gap-2 text-white ${
                      (coursePaymentMode[course.id] || (partner?.cohort_payment_mode === "OFFLINE_ONLY" ? "OFFLINE" : "ONLINE")) === "ONLINE"
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    <span>
                      {(coursePaymentMode[course.id] || (partner?.cohort_payment_mode === "OFFLINE_ONLY" ? "OFFLINE" : "ONLINE")) === "ONLINE"
                        ? `Proceed to Pay Online (₹${Number(course.price || 25000).toLocaleString("en-IN")})`
                        : "Apply with Offline Fee Collection"}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AuthFormShell>
  );
};

const FieldErrorInput = ({ error, ...props }) => (
  <div>
    <FormInput
      {...props}
      className={error ? "border-red-400 focus:ring-red-300" : ""}
      aria-invalid={Boolean(error)}
    />
    {error && <p className="mt-1.5 text-sm font-medium text-red-500">{error}</p>}
  </div>
);

export default PartnerJoin;
