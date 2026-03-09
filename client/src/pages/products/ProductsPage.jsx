import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../../api/products";
import DataTable from "../../components/tables/DataTable";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import useAuth from "../../hooks/useAuth";

const initialForm = { name: "", price: "", category: "", stock: "" };

const ProductsPage = () => {
  const { user } = useAuth();
  const canManage = user?.role === "admin";
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, limit: 10 });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const fetchProducts = async (page = 1, currentSearch = search, currentCategory = category) => {
    try {
      setLoading(true);
      const res = await getProducts({ page, limit: 10, search: currentSearch, category: currentCategory });
      setProducts(res.data.map((p) => ({ id: p._id, name: p.name, price: `$${Number(p.price).toLocaleString()}`, category: p.category, stock: p.stock, createdAt: new Date(p.createdAt).toLocaleDateString() })));
      setPagination(res.pagination);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(1, "", ""); }, []);
  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Product Management</h1>
      {canManage ? <form onSubmit={async(e)=>{e.preventDefault();const payload={name:form.name,price:Number(form.price),category:form.category,stock:Number(form.stock)};if(editingId){await updateProduct(editingId,payload);toast.success("Product updated");}else{await createProduct(payload);toast.success("Product created");}setForm(initialForm);setEditingId(null);fetchProducts(pagination.page,search,category);}} className="grid gap-3 rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800 md:grid-cols-4">
        <input className="rounded-lg border p-2 dark:bg-slate-900" placeholder="Product name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
        <input className="rounded-lg border p-2 dark:bg-slate-900" placeholder="Price" type="number" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} required />
        <input className="rounded-lg border p-2 dark:bg-slate-900" placeholder="Category" value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} required />
        <input className="rounded-lg border p-2 dark:bg-slate-900" placeholder="Stock" type="number" value={form.stock} onChange={(e)=>setForm({...form,stock:e.target.value})} required />
        <button className="rounded-lg bg-brand-600 px-4 py-2 text-white disabled:opacity-70 md:col-span-2" type="submit" disabled={submitting}>{submitting ? "Saving..." : editingId ? "Update Product" : "Create Product"}</button>
        {editingId ? <button className="rounded-lg border px-4 py-2 md:col-span-2" type="button" onClick={()=>{setEditingId(null);setForm(initialForm);}}>Cancel</button> : null}
      </form> : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input className="w-full rounded-lg border p-2 dark:bg-slate-900 sm:max-w-sm" placeholder="Search products" value={search} onChange={(e)=>setSearch(e.target.value)} />
        <select className="w-full rounded-lg border p-2 dark:bg-slate-900 sm:max-w-xs" value={category} onChange={(e)=>setCategory(e.target.value)}><option value="">All Categories</option>{categories.map((cat)=><option key={cat} value={cat}>{cat}</option>)}</select>
        <button type="button" className="rounded-lg bg-slate-900 px-4 py-2 text-white dark:bg-slate-100 dark:text-slate-900" onClick={()=>fetchProducts(1, search, category)}>Filter</button>
      </div>
      {loading ? <LoadingSpinner /> : <>
        <DataTable columns={[{key:"name",title:"Name"},{key:"price",title:"Price"},{key:"category",title:"Category"},{key:"stock",title:"Stock"},{key:"createdAt",title:"Created At"}]} rows={products} actions={canManage ? (row)=><><button className="rounded bg-sky-500 px-2 py-1 text-white" onClick={()=>{setEditingId(row.id);setForm({name:row.name,price:row.price.replace("$","").replace(",",""),category:row.category,stock:String(row.stock)});}} type="button">Edit</button><button className="rounded bg-rose-500 px-2 py-1 text-white" onClick={async()=>{await deleteProduct(row.id);toast.success("Product deleted");fetchProducts(pagination.page,search,category);}} type="button">Delete</button></> : undefined} />
        <div className="flex items-center justify-between">
          <button type="button" className="rounded border px-3 py-1 disabled:opacity-50" disabled={pagination.page<=1} onClick={()=>fetchProducts(pagination.page-1, search, category)}>Previous</button>
          <span className="text-sm">Page {pagination.page} of {pagination.pages || 1}</span>
          <button type="button" className="rounded border px-3 py-1 disabled:opacity-50" disabled={pagination.page>=(pagination.pages || 1)} onClick={()=>fetchProducts(pagination.page+1, search, category)}>Next</button>
        </div>
      </>}
    </div>
  );
};

export default ProductsPage;
