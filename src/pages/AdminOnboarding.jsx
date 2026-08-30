import { useState } from "react";
import { toast } from "react-toastify";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import AuthFormShell from "../components/forms/AuthFormShell";
import FormInput from "../components/forms/FormInput";
import { createAdmin } from "../service/adminService";
import { adminOnboardingSchema } from "../validator/adminProfileSchema";
import { mapZodIssuesToFieldErrors } from "../validator/validation";

const INITIAL_FORM = {
  first_name: "",
  middle_name: "",
  last_name: "",
  email: "",
  password: "",
  confirm_password: "",
  department: "",
  phone_number: "",
  role: "ADMIN",
};

const AdminOnboarding = () => {
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

    const parsed = adminOnboardingSchema.safeParse(form);

    if (!parsed.success) {
      setFieldErrors(mapZodIssuesToFieldErrors(parsed.error));
      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      setLoading(true);
      await createAdmin(parsed.data);
      toast.success("Admin account created");
      setForm(INITIAL_FORM);
      setFieldErrors({});
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormShell
      badge="Admin"
      title="Admin Onboarding"
      subtitle="Create an admin account for managing Skills Academy operations."
    >
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <FieldErrorInput label="First Name" name="first_name" value={form.first_name} onChange={handleChange} error={fieldErrors.first_name} required />
          <FieldErrorInput label="Middle Name" name="middle_name" value={form.middle_name} onChange={handleChange} error={fieldErrors.middle_name} />
          <FieldErrorInput label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} error={fieldErrors.last_name} />
          <FieldErrorInput label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={fieldErrors.email} required />
          <FieldErrorInput label="Password" type="password" name="password" value={form.password} onChange={handleChange} error={fieldErrors.password} required />
          <FieldErrorInput label="Confirm Password" type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} error={fieldErrors.confirm_password} required />
          <FieldErrorInput label="Department" name="department" value={form.department} onChange={handleChange} error={fieldErrors.department} required />
          <FieldErrorInput label="Phone Number" name="phone_number" value={form.phone_number} onChange={handleChange} error={fieldErrors.phone_number} required />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 transition"
        >
          {loading ? "Submitting..." : "Create Admin"}
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

export default AdminOnboarding;
