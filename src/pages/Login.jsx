import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSpinner, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import AuthFormShell from "../components/forms/AuthFormShell";
import FormInput from "../components/forms/FormInput";
import { login } from "../service/authService";
import { storeActions } from "../store/useStore";
import { loginSchema } from "../validator/loginSchema";
import { mapZodIssuesToFieldErrors } from "../validator/validation";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const parsed = loginSchema.safeParse(form);

    if (!parsed.success) {
      setFieldErrors(mapZodIssuesToFieldErrors(parsed.error));
      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      setLoading(true);
      const data = await login(parsed.data);
      storeActions.setAuth({
        user: data.user,
        token: data.tokens.access_token,
        refreshToken: data.tokens.refresh_token,
      });
      toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormShell
      badge="Account Login"
      title="Login"
      subtitle="Access your Skills Academy account."
    >
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
        {fieldErrors.email && <p className="-mt-4 text-sm font-medium text-red-500">{fieldErrors.email}</p>}

        <div className="relative">
          <FormInput
            label="Password"
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
        {fieldErrors.password && <p className="-mt-4 text-sm font-medium text-red-500">{fieldErrors.password}</p>}

        <div className="-mt-2 text-right">
          <Link to="/forgot-password" className="text-sm font-medium text-orange-500 hover:text-orange-600">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-3 transition"
        >
          {loading ? "Logging in..." : "Login"}
          {loading ? <FaSpinner className="animate-spin" /> : <FaSignInAlt />}
        </button>
      </form>
    </AuthFormShell>
  );
};

export default Login;