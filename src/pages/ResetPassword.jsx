import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSpinner, FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import AuthFormShell from "../components/forms/AuthFormShell";
import FormInput from "../components/forms/FormInput";
import { resetPassword } from "../service/authService";
import { resetPasswordSchema } from "../validator/resetPasswordSchema";
import { mapZodIssuesToFieldErrors } from "../validator/validation";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("Reset link is invalid or missing. Please request a new one.");
      return;
    }

    const parsed = resetPasswordSchema.safeParse(form);

    if (!parsed.success) {
      setFieldErrors(mapZodIssuesToFieldErrors(parsed.error));
      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      setLoading(true);
      const data = await resetPassword({ token, password: parsed.data.password });
      toast.success(data.message || "Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthFormShell badge="Account Recovery" title="Invalid Link" subtitle="">
        <div className="text-center py-6">
          <p className="text-lg font-medium text-gray-700">
            This reset link is invalid or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block mt-6 text-orange-500 hover:text-orange-600 font-semibold"
          >
            Request a new link
          </Link>
        </div>
      </AuthFormShell>
    );
  }

  return (
    <AuthFormShell
      badge="Account Recovery"
      title="Reset Password"
      subtitle="Choose a new password for your account."
    >
      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="relative">
          <FormInput
            label="New Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            className={`pr-12 ${fieldErrors.password ? "border-red-400 focus:ring-red-300" : ""}`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-[46px] text-gray-500 hover:text-gray-700"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="-mt-4 text-sm font-medium text-red-500">{fieldErrors.password}</p>
        )}

        <div className="relative">
          <FormInput
            label="Confirm New Password"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`pr-12 ${fieldErrors.confirmPassword ? "border-red-400 focus:ring-red-300" : ""}`}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-4 top-[46px] text-gray-500 hover:text-gray-700"
            tabIndex={-1}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {fieldErrors.confirmPassword && (
          <p className="-mt-4 text-sm font-medium text-red-500">{fieldErrors.confirmPassword}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 transition"
        >
          {loading ? "Resetting..." : "Reset Password"}
          {loading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
        </button>
      </form>
    </AuthFormShell>
  );
};

export default ResetPassword;