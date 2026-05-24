import { useEffect, useState } from "react";
import { userApi } from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userApi.list().then((res) => setUsers(res.data.data ?? [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dash-page-stack">
    <div className="dash-panel">
      <div className="dash-panel-header">
        <h2 className="dash-panel-title">All users</h2>
        <p className="text-sm text-slate-500">{users.length} accounts</p>
      </div>
      <div className="overflow-x-auto">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="font-medium text-slate-900">
                  {u.firstName} {u.lastName}
                </td>
                <td>{u.email}</td>
                <td>
                  <span
                    className={`dash-badge ${
                      u.role === "ADMIN" ? "dash-badge-success" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {u.role === "ADMIN" ? "Admin" : "User"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}
