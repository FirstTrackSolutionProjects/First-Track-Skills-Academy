import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import AuthFormShell from "../components/forms/AuthFormShell";
import FormInput from "../components/forms/FormInput";
import { createStudent } from "../service/userService";
import { login } from "../service/authService";
import { storeActions } from "../store/useStore";
import { userRegistrationSchema } from "../validator/userSchema";
import { mapZodIssuesToFieldErrors } from "../validator/validation";
import getEnrollUploadUrls from "@/services/courses/get_enroll_upload_urls.courses.service";
import putObjectService from "@/services/putObjectService";

const INITIAL_FORM = {
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
  role: "STUDENT",
  agree: false,
};

const StudentOnboarding = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [files, setFiles] = useState({ profileImage: null, resume: null });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const profileRef = useRef(null);
  const resumeRef = useRef(null);

  const handleChange = (event) => {
    const { name, value, type, checked, files: inputFiles } = event.target;
    if (type === "file") {
      setFiles((prev) => ({ ...prev, [name]: inputFiles[0] || null }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.agree) {
      toast.error("Please agree to the Terms & Conditions and Privacy Policy");
      return;
    }

    const parsed = userRegistrationSchema.safeParse(form);

    if (!parsed.success) {
      setFieldErrors(mapZodIssuesToFieldErrors(parsed.error));
      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      setLoading(true);

      // Handle optional file uploads
      let profile_image = "";
      let resume = "";

      const uploadList = [];
      if (files.profileImage) {
        uploadList.push({ inputName: "profileImage", filename: files.profileImage.name, filetype: files.profileImage.type });
      }
      if (files.resume) {
        uploadList.push({ inputName: "resume", filename: files.resume.name, filetype: files.resume.type });
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
          console.warn("File upload notice:", uploadError);
        }
      }

      await createStudent({
        ...parsed.data,
        profile_image,
        resume,
      });

      const authData = await login({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      storeActions.setAuth({
        user: authData.user,
        token: authData.tokens.access_token,
        refreshToken: authData.tokens.refresh_token,
      });

      toast.success("Student account and profile created successfully!");
      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Failed to create account";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormShell
      badge="Student Registration"
      title="Create Student Profile"
      subtitle="Complete your profile to access all courses, live sessions, and track your progress."
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Student Information */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Student Information
          </h3>
          <div className="grid md:grid-cols-2 gap-5">
            <FieldErrorInput
              label="First Name"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              error={fieldErrors.first_name}
              required
            />
            <FieldErrorInput
              label="Middle Name"
              name="middle_name"
              value={form.middle_name}
              onChange={handleChange}
              error={fieldErrors.middle_name}
            />
            <FieldErrorInput
              label="Last Name"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              error={fieldErrors.last_name}
            />
            <FieldErrorInput
              label="Email Address"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              error={fieldErrors.email}
              required
            />
            <FieldErrorInput
              label="Password"
              type="password"
              name="password"
              placeholder="Min 8 chars, 1 uppercase, 1 digit, 1 special"
              value={form.password}
              onChange={handleChange}
              error={fieldErrors.password}
              required
            />
            <FieldErrorInput
              label="Confirm Password"
              type="password"
              name="confirm_password"
              value={form.confirm_password}
              onChange={handleChange}
              error={fieldErrors.confirm_password}
              required
            />
            <FieldErrorInput
              label="Phone Number"
              type="tel"
              name="phone_number"
              placeholder="+91 9876543210"
              value={form.phone_number}
              onChange={handleChange}
              error={fieldErrors.phone_number}
              required
            />
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                required
                className="w-full h-[50px] border border-slate-200 rounded-xl px-4 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="w-full h-[50px] border border-slate-200 rounded-xl px-4 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <FieldErrorInput
              label="District / City"
              name="district"
              value={form.district}
              onChange={handleChange}
              required
            />
            <FieldErrorInput
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
              required
            />
            <FieldErrorInput
              label="PIN Code"
              name="pin"
              maxLength={6}
              value={form.pin}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Education Information */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Education
          </h3>
          <div className="grid md:grid-cols-2 gap-5">
            <FieldErrorInput
              label="Highest Qualification"
              name="qualification"
              placeholder="e.g. B.Tech / BCA / MCA / Diploma"
              value={form.qualification}
              onChange={handleChange}
              required
            />
            <FieldErrorInput
              label="College / University"
              name="college"
              placeholder="e.g. IIT, NIT, State University"
              value={form.college}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Upload Documents (Optional) */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">
            Upload Documents <span className="text-sm font-normal text-slate-500">(Optional)</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">You can upload these now or add them later in your profile.</p>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Image</label>
              <input
                ref={profileRef}
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-xs file:mr-3 file:bg-orange-500 file:text-white file:border-0 file:px-3.5 file:py-1.5 file:rounded-lg file:cursor-pointer"
              />
              {files.profileImage && <p className="text-xs text-emerald-600 mt-1">Selected: {files.profileImage.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Resume</label>
              <input
                ref={resumeRef}
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-xs file:mr-3 file:bg-orange-500 file:text-white file:border-0 file:px-3.5 file:py-1.5 file:rounded-lg file:cursor-pointer"
              />
              {files.resume && <p className="text-xs text-emerald-600 mt-1">Selected: {files.resume.name}</p>}
            </div>
          </div>
        </div>

        {/* Agreement */}
        <div className="flex items-start gap-3 pt-2">
          <input
            type="checkbox"
            name="agree"
            id="agree"
            checked={form.agree}
            onChange={handleChange}
            required
            className="mt-1 h-4 w-4 rounded text-orange-500 focus:ring-orange-400"
          />
          <label htmlFor="agree" className="text-xs sm:text-sm text-slate-600">
            I agree to the{" "}
            <Link to="/terms-of-use" className="text-orange-500 underline hover:text-orange-600">
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacy-policy" className="text-orange-500 underline hover:text-orange-600">
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-3 transition shadow-lg hover:shadow-xl"
        >
          {loading ? "Registering & Setting Up Profile..." : "Register as Student"}
          {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
        </button>
      </form>
    </AuthFormShell>
  );
};

const FieldErrorInput = ({ error, label, ...props }) => (
  <div>
    <FormInput
      label={label}
      {...props}
      className={error ? "border-red-400 focus:ring-red-300" : ""}
      aria-invalid={Boolean(error)}
    />
    {error && <p className="mt-1 text-xs font-medium text-red-500">{error}</p>}
  </div>
);

export default StudentOnboarding;
