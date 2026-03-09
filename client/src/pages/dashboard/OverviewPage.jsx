import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../../api/products";
import { getUsers } from "../../api/users";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import SalesChart from "../../components/charts/SalesChart";
import UserChart from "../../components/charts/UserChart";
import useAuth from "../../hooks/useAuth";

const monthLabel = (date) => new Date(date).toLocaleString("en-US", { month: "short" });

const buildSeries = (items, key) => {
  const bucket = {};
  items.forEach((item) => {
    const label = monthLabel(item.createdAt);
    bucket[label] = (bucket[label] || 0) + (key === "sales" ? item.price * item.stock : 1);
  });
  return Object.entries(bucket).map(([name, value]) => ({ name, [key]: Math.round(value) }));
};

const OverviewPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, userRes] = await Promise.all([
          getProducts({ limit: 200, page: 1 }),
          user?.role === "admin" ? getUsers({ limit: 200, page: 1 }) : Promise.resolve({ data: [] })
        ]);
        setProducts(productRes.data || []);
        setUsers(userRes.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.role]);

  const kpis = useMemo(() => {
    const totalInventory = products.reduce((sum, item) => sum + item.stock, 0);
    const totalSales = products.reduce((sum, item) => sum + item.price * item.stock, 0);
    return [
      { label: "Total Products", value: products.length },
      { label: "Total Users", value: users.length },
      { label: "Inventory Units", value: totalInventory },
      { label: "Sales Value", value: `$${totalSales.toLocaleString()}` }
    ];
  }, [products, users]);

  const salesData = useMemo(() => buildSeries(products, "sales"), [products]);
  const userData = useMemo(() => buildSeries(users, "users"), [users]);

  const recentActivity = useMemo(() => {
    const userItems = users.slice(0, 5).map((u) => ({ id: u._id || u.id, text: `New user: ${u.name}`, createdAt: u.createdAt }));
    const productItems = products.slice(0, 5).map((p) => ({ id: p._id || p.id, text: `Product updated: ${p.name}`, createdAt: p.createdAt }));
    return [...userItems, ...productItems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);
  }, [users, products]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-300">{kpi.label}</p>
            <h3 className="mt-2 text-2xl font-bold">{kpi.value}</h3>
          </article>
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <SalesChart data={salesData} />
        <UserChart data={userData} />
      </section>
      <section className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
        <h3 className="mb-4 text-sm font-semibold">Recent Activity</h3>
        <ul className="space-y-2 text-sm">
          {recentActivity.map((item) => (
            <li key={item.id} className="rounded-lg bg-slate-100 p-3 dark:bg-slate-700">
              <p>{item.text}</p>
              <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default OverviewPage;
