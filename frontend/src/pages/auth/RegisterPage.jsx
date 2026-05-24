import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "./AuthLayout";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Your account is ready!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Could not create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Join us" subtitle="Create a free account to save homes and book viewings.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">First name</label>
            <input required className="input-field" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last name</label>
            <input required className="input-field" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input type="email" required className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input type="password" required minLength={8} className="input-field" placeholder="At least 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button disabled={loading} type="submit" className="btn-primary w-full">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="text-center mt-8 text-caption">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-[var(--color-brand)] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
