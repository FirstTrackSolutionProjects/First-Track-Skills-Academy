import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import AuthFormShell from "../components/forms/AuthFormShell";
import FormInput from "../components/forms/FormInput";
import { login } from "../service/authService";
import { createCollege } from "../service/collegeService";
import { storeActions } from "../store/useStore";
import { loginSchema } from "../validator/loginSchema";
import { collegeOnboardingSchema } from "../validator/collegeProfileSchema";
import { mapZodIssuesToFieldErrors } from "../validator/validation";

const INITIAL_FORM = {
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
  college_name: "",
  college_code: "",
  website: "",
  address: "",
  city: "",
  state: "",
  designation: "",
  contact_number: "",
  role: "COLLEGE",
};

const CollegeOnboarding = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const parsed = collegeOnboardingSchema.safeParse(form);

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
      await createCollege(parsed.data);
      const authData = await login(loginPayload.data);
      storeActions.setAuth({
        user: authData.user,
        token: authData.tokens.access_token,
        refreshToken: authData.tokens.refresh_token,
      });
      toast.success("College onboarding submitted");
      setFieldErrors({});
      navigate("/college-dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormShell
      badge="College Partner"
      title="College Onboarding"
      subtitle="Create a college partner account and generate the student partner link."
    >
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-6">
          <FieldErrorInput label="First Name" name="first_name" value={form.first_name} onChange={handleChange} error={fieldErrors.first_name} required />
          <FieldErrorInput label="Middle Name" name="middle_name" value={form.middle_name} onChange={handleChange} error={fieldErrors.middle_name} />
          <FieldErrorInput label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} error={fieldErrors.last_name} />
          <FieldErrorInput label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={fieldErrors.email} required />
          <FieldErrorInput label="Password" type="password" name="password" value={form.password} onChange={handleChange} error={fieldErrors.password} required />
          <FieldErrorInput label="Confirm Password" type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} error={fieldErrors.confirm_password} required />
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-6">College Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <FieldErrorInput label="College Name" name="college_name" value={form.college_name} onChange={handleChange} error={fieldErrors.college_name} required />
          <FieldErrorInput label="College Code" name="college_code" value={form.college_code} onChange={handleChange} error={fieldErrors.college_code} />
          <FieldErrorInput label="Website" type="url" name="website" value={form.website} onChange={handleChange} error={fieldErrors.website} />
          <FieldErrorInput label="City" name="city" value={form.city} onChange={handleChange} error={fieldErrors.city} required />
          <FieldErrorInput label="State" name="state" value={form.state} onChange={handleChange} error={fieldErrors.state} required />
          <FieldErrorInput label="Contact Number" name="contact_number" value={form.contact_number} onChange={handleChange} error={fieldErrors.contact_number} required />
          <FieldErrorInput label="Contact Designation" name="designation" value={form.designation} onChange={handleChange} error={fieldErrors.designation} required />
          <label className="block md:col-span-2">
            <span className="block font-semibold mb-2">Address</span>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              rows="4"
              className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                fieldErrors.address ? "border-red-400 focus:ring-red-300" : "border-gray-300"
              }`}
              aria-invalid={Boolean(fieldErrors.address)}
            />
            {fieldErrors.address && <p className="mt-1.5 text-sm font-medium text-red-500">{fieldErrors.address}</p>}
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 transition"
        >
          {loading ? "Submitting..." : "Create College"}
          {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
        </button>
      </form>
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

export default CollegeOnboarding;
