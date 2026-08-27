import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSpinner, FaSignInAlt } from "react-icons/fa";
import AuthFormShell from "../components/forms/AuthFormShell";
import FormInput from "../components/forms/FormInput";
import { login } from "../services/api";
import { storeActions } from "../store/useStore";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const data = await login(form);
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
          required
        />
        <FormInput
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
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
