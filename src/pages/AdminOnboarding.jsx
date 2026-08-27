import { useState } from "react";
import { toast } from "react-toastify";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import AuthFormShell from "../components/forms/AuthFormShell";
import FormInput from "../components/forms/FormInput";
import { createAdmin } from "../services/api";

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await createAdmin(form);
      toast.success("Admin account created");
      setForm(INITIAL_FORM);
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
          <FormInput label="First Name" name="first_name" value={form.first_name} onChange={handleChange} required />
          <FormInput label="Middle Name" name="middle_name" value={form.middle_name} onChange={handleChange} />
          <FormInput label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} />
          <FormInput label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
          <FormInput label="Password" type="password" name="password" value={form.password} onChange={handleChange} required />
          <FormInput label="Confirm Password" type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} required />
          <FormInput label="Department" name="department" value={form.department} onChange={handleChange} required />
          <FormInput label="Phone Number" name="phone_number" value={form.phone_number} onChange={handleChange} required />
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

export default AdminOnboarding;
