import { useState } from "react";
import toast from "react-hot-toast";
import { changePassword } from "../../api/auth";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";

const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await changePassword(passwordForm);
      toast.success("Password updated");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
        <h2 className="mb-3 text-lg font-semibold">User Profile</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>
      </section>
      <section className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
        <h2 className="mb-3 text-lg font-semibold">Theme</h2>
        <p className="mb-3 text-sm">Current theme: {theme}</p>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-white" type="button" onClick={toggleTheme}>Toggle Theme</button>
      </section>
      <section className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800 lg:col-span-2">
        <h2 className="mb-3 text-lg font-semibold">Change Password</h2>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handlePasswordChange}>
          <input type="password" value={passwordForm.currentPassword} onChange={(e)=>setPasswordForm({...passwordForm,currentPassword:e.target.value})} placeholder="Current password" className="rounded-lg border p-2 dark:bg-slate-900" required />
          <input type="password" value={passwordForm.newPassword} onChange={(e)=>setPasswordForm({...passwordForm,newPassword:e.target.value})} placeholder="New password" className="rounded-lg border p-2 dark:bg-slate-900" required />
          <button className="rounded-lg bg-slate-900 px-4 py-2 text-white dark:bg-slate-100 dark:text-slate-900" type="submit">Update Password</button>
        </form>
      </section>
    </div>
  );
};

export default SettingsPage;
