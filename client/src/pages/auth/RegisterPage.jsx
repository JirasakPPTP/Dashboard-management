import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as authApi from "../../api/auth";
import useAuth from "../../hooks/useAuth";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await authApi.register(form);
      login(data);
      toast.success("Registration successful");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
        <h1 className="text-2xl font-bold">Register</h1>
        <input name="name" placeholder="Full name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="w-full rounded-lg border p-3 dark:bg-slate-900" required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} className="w-full rounded-lg border p-3 dark:bg-slate-900" required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} className="w-full rounded-lg border p-3 dark:bg-slate-900" required />
        <button type="submit" disabled={loading} className="w-full rounded-lg bg-brand-600 py-3 text-white disabled:opacity-70">{loading ? "Creating account..." : "Register"}</button>
        <p className="text-sm">Already have an account? <Link to="/login" className="text-brand-600">Login</Link></p>
      </form>
    </div>
  );
};

export default RegisterPage;
