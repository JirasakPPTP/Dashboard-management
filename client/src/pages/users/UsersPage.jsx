import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createUser, deleteUser, getUsers, updateUser } from "../../api/users";
import DataTable from "../../components/tables/DataTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const initialForm = { name: "", email: "", password: "", role: "user" };

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, limit: 10 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchUsers = async (page = 1, currentSearch = search) => {
    try {
      setLoading(true);
      const res = await getUsers({ page, limit: 10, search: currentSearch });
      setUsers(res.data.map((u) => ({ id: u._id || u.id, name: u.name, email: u.email, role: u.role, createdAt: new Date(u.createdAt).toLocaleDateString() })));
      setPagination(res.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(1, ""); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        const payload = { name: form.name, email: form.email, role: form.role };
        if (form.password) payload.password = form.password;
        await updateUser(editingId, payload);
        toast.success("User updated");
      } else {
        await createUser(form);
        toast.success("User created");
      }
      setForm(initialForm);
      setEditingId(null);
      fetchUsers(pagination.page, search);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save user");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: "name", title: "Name" },
    { key: "email", title: "Email" },
    { key: "role", title: "Role" },
    { key: "createdAt", title: "Created At" }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      <form onSubmit={handleSubmit} className="grid gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800 md:grid-cols-4">
        <input className="rounded-lg border p-2 dark:bg-slate-900" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
        <input className="rounded-lg border p-2 dark:bg-slate-900" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required />
        <input className="rounded-lg border p-2 dark:bg-slate-900" placeholder={editingId ? "New password (optional)" : "Password"} type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} required={!editingId} />
        <select className="rounded-lg border p-2 dark:bg-slate-900" value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})}><option value="user">User</option><option value="admin">Admin</option></select>
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-white disabled:opacity-70 md:col-span-2" type="submit" disabled={submitting}>{submitting ? "Saving..." : editingId ? "Update User" : "Create User"}</button>
        {editingId ? <button className="rounded-lg border px-4 py-2 md:col-span-2" type="button" onClick={()=>{setEditingId(null);setForm(initialForm);}}>Cancel</button> : null}
      </form>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input className="w-full rounded-lg border p-2 dark:bg-slate-900 sm:max-w-sm" placeholder="Search by name or email" value={search} onChange={(e)=>setSearch(e.target.value)} />
        <button type="button" className="rounded-lg bg-slate-900 px-4 py-2 text-white dark:bg-slate-100 dark:text-slate-900" onClick={()=>fetchUsers(1, search)}>Search</button>
      </div>
      {loading ? <LoadingSpinner /> : <>
        <DataTable columns={columns} rows={users} actions={(row)=><><button className="rounded bg-sky-500 px-2 py-1 text-white" onClick={()=>{setEditingId(row.id);setForm({name:row.name,email:row.email,password:"",role:row.role});}} type="button">Edit</button><button className="rounded bg-rose-500 px-2 py-1 text-white" onClick={async()=>{await deleteUser(row.id);toast.success("User deleted");fetchUsers(pagination.page, search);}} type="button">Delete</button></>} />
        <div className="flex items-center justify-between">
          <button type="button" className="rounded border px-3 py-1 disabled:opacity-50" disabled={pagination.page<=1} onClick={()=>fetchUsers(pagination.page-1, search)}>Previous</button>
          <span className="text-sm">Page {pagination.page} of {pagination.pages || 1}</span>
          <button type="button" className="rounded border px-3 py-1 disabled:opacity-50" disabled={pagination.page>=(pagination.pages || 1)} onClick={()=>fetchUsers(pagination.page+1, search)}>Next</button>
        </div>
      </>}
    </div>
  );
};

export default UsersPage;
