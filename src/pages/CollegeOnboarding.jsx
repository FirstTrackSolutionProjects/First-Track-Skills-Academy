import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import AuthFormShell from "../components/forms/AuthFormShell";
import FormInput from "../components/forms/FormInput";
import { createCollege, login } from "../services/api";
import { storeActions } from "../store/useStore";

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await createCollege(form);
      const authData = await login({ email: form.email, password: form.password });
      storeActions.setAuth({
        user: authData.user,
        token: authData.tokens.access_token,
        refreshToken: authData.tokens.refresh_token,
      });
      toast.success("College onboarding submitted");
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
          <FormInput label="First Name" name="first_name" value={form.first_name} onChange={handleChange} required />
          <FormInput label="Middle Name" name="middle_name" value={form.middle_name} onChange={handleChange} />
          <FormInput label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} />
          <FormInput label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
          <FormInput label="Password" type="password" name="password" value={form.password} onChange={handleChange} required />
          <FormInput label="Confirm Password" type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} required />
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-6">College Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <FormInput label="College Name" name="college_name" value={form.college_name} onChange={handleChange} required />
          <FormInput label="College Code" name="college_code" value={form.college_code} onChange={handleChange} />
          <FormInput label="Website" type="url" name="website" value={form.website} onChange={handleChange} />
          <FormInput label="City" name="city" value={form.city} onChange={handleChange} required />
          <FormInput label="State" name="state" value={form.state} onChange={handleChange} required />
          <FormInput label="Contact Number" name="contact_number" value={form.contact_number} onChange={handleChange} required />
          <FormInput label="Contact Designation" name="designation" value={form.designation} onChange={handleChange} required />
          <label className="block md:col-span-2">
            <span className="block font-semibold mb-2">Address</span>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              rows="4"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
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

export default CollegeOnboarding;
