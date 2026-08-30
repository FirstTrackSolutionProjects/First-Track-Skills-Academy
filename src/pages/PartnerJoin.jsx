import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPaperPlane, FaSignInAlt, FaSpinner } from "react-icons/fa";
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
  const [mode, setMode] = useState("signup");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const isStudentLoggedIn = auth?.token && auth?.user?.role === "STUDENT";

  const loadCourses = useCallback(async (token) => {
    const courseData = await getCourses(token);
    setCourses(courseData || []);
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
  }, [partnerCode]);

  useEffect(() => {
    if (!checking && partner && isStudentLoggedIn) {
      Promise.resolve()
        .then(() => loadCourses(auth.token))
        .catch((error) => toast.error(error.message));
    }
  }, [auth, checking, isStudentLoggedIn, loadCourses, partner]);

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
    navigate(`/join/${partnerCode}/enroll?courseId=${courseId}&batchTiming=${batchTiming}`);
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
      {!isStudentLoggedIn ? (
        mode === "signup" ? (
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
          {loading ? "Submitting..." : "Create Account"}
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
        )
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
                  <p className="text-gray-600 mt-3">{course.description}</p>
                  <p className="text-gray-900 font-semibold mt-4">
                    {course.duration_weeks} weeks
                  </p>
                  <div className="mt-5">
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
                  <button
                    onClick={() => continueToEnroll(course.id)}
                    className="mt-5 w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition"
                  >
                    Continue to Enroll
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
