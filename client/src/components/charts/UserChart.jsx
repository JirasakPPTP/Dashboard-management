import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const UserChart = ({ data }) => (
  <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800">
    <h3 className="mb-4 text-sm font-semibold">User Growth</h3>
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="users" fill="#0ea5e9" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default UserChart;
