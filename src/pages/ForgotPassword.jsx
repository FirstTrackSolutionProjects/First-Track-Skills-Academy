import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSpinner, FaPaperPlane } from "react-icons/fa";
import AuthFormShell from "../components/forms/AuthFormShell";
import FormInput from "../components/forms/FormInput";
import { forgotPassword } from "../service/authService";
import { forgotPasswordSchema } from "../validator/forgotPasswordSchema";
import { mapZodIssuesToFieldErrors } from "../validator/validation";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ email: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const parsed = forgotPasswordSchema.safeParse(form);

    if (!parsed.success) {
      setFieldErrors(mapZodIssuesToFieldErrors(parsed.error));
      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      setLoading(true);
      const data = await forgotPassword(parsed.data);
      toast.success(data.message || "Reset link sent if the account exists");
      setSubmitted(true);
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormShell
      badge="Account Recovery"
      title="Forgot Password"
      subtitle="Enter your email and we'll send you a link to reset your password."
    >
      {submitted ? (
        <div className="text-center py-6">
          <p className="text-lg font-medium text-gray-700">
            If an account with that email exists, a reset link has been sent.
          </p>
          <p className="text-gray-500 mt-2">Please check your inbox (and spam folder).</p>
          <Link
            to="/login"
            className="inline-block mt-6 text-orange-500 hover:text-orange-600 font-semibold"
          >
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-6">
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={fieldErrors.email ? "border-red-400 focus:ring-red-300" : ""}
            required
          />
          {fieldErrors.email && (
            <p className="-mt-4 text-sm font-medium text-red-500">{fieldErrors.email}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
            {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
          </button>

          <div className="text-center">
            <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-700">
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </AuthFormShell>
  );
};

export default ForgotPassword;