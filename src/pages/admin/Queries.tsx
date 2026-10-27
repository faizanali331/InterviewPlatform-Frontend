import { useEffect, useState } from "react";

import Header from "../../components/common/Header";
import Badge from "../../components/common/Badge";
import { getQueries, resolveQuery } from "../../api/adminApi";
import { ContactQuery } from "../../types/admin";

const VISITOR_LABELS: Record<string, string> = {
  fresher: "Fresher",
  student: "Student",
  professional: "Professional",
  interviewer: "Interviewer",
  other: "Other",
};

export default function Queries() {
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getQueries()
      .then(setQueries)
      .catch(() => setQueries([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleResolve = async (id: number) => {
    await resolveQuery(id);
    load();
  };

  const open = queries.filter((q) => q.status === "NEW").length;

  return (
    <>
      <Header
        title="Visitor queries"
        sub={`Questions sent from the landing page. ${open} waiting for a reply.`}
      />

      <div className="panel table">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Received</th>
                <th>From</th>
                <th>Question</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {queries.map((q) => (
                <tr key={q.id}>
                  <td>{new Date(q.createdAt).toLocaleString()}</td>
                  <td>
                    <b>{q.name}</b>
                    <small>{q.email}</small>
                    <small>{q.phone}</small>
                    {q.visitorType && (
                      <small>
                        {VISITOR_LABELS[q.visitorType] ?? q.visitorType}
                      </small>
                    )}
                  </td>
                  <td style={{ maxWidth: 420, whiteSpace: "pre-wrap" }}>
                    {q.message}
                  </td>
                  <td>
                    <Badge tone={q.status === "NEW" ? "warning" : "success"}>
                      {q.status}
                    </Badge>
                  </td>
                  <td>
                    {q.status === "NEW" && (
                      <button
                        className="text"
                        onClick={() => handleResolve(q.id)}
                      >
                        Mark resolved
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {queries.length === 0 && (
                <tr>
                  <td colSpan={5}>No queries yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
