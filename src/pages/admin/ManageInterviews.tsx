// import Header from "../../components/common/Header";
// import Badge from "../../components/common/Badge";

// import { interviews } from "../../data/interviews";

// export default function ManageInterviews() {
//   return (
//     <>
//       <Header
//         title="Manage interviews"
//         sub="Monitor scheduled, completed and cancelled interviews."
//       />

//       <div className="panel table">
//         <table>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Candidate</th>
//               <th>Company</th>
//               <th>Domain</th>
//               <th>Date</th>
//               <th>Status</th>
//               <th>Amount</th>
//             </tr>
//           </thead>

//           <tbody>
//             {interviews.map((interview) => (
//               <tr key={interview.id}>
//                 <td>{interview.id}</td>

//                 <td>
//                   <b>Candidate</b>

//                   <small>Anonymous</small>
//                 </td>

//                 <td>{interview.company}</td>

//                 <td>{interview.domain}</td>

//                 <td>
//                   {interview.date}

//                   <small>{interview.time}</small>
//                 </td>

//                 <td>
//                   <Badge
//                     tone={interview.status === "Upcoming" ? "info" : "success"}
//                   >
//                     {interview.status}
//                   </Badge>
//                 </td>

//                 <td>₹{interview.amount.toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// }

import { useEffect, useState } from "react";

import Header from "../../components/common/Header";
import Badge from "../../components/common/Badge";
import { getAdminBookings, scheduleBooking } from "../../api/bookingApi";
import { Booking, BookingStatus } from "../../types/booking";
import { formatRupees } from "../../utils/format";
import {
  STATUS_LABEL,
  STATUS_TONE,
  experienceLabel,
  tierLabel,
} from "../../utils/bookingOptions";

const TABS: { status: BookingStatus; label: string }[] = [
  { status: "CONFIRMED", label: "Paid, to schedule" },
  { status: "SCHEDULED", label: "Scheduled" },
  { status: "PENDING_PAYMENT", label: "Unpaid" },
  { status: "CANCELLED", label: "Cancelled" },
];

export default function ManageInterviews() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tab, setTab] = useState<BookingStatus>("CONFIRMED");
  const [loading, setLoading] = useState(true);

  const load = () => {
    getAdminBookings()
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSchedule = async (id: number) => {
    const note = window.prompt(
      "When is it scheduled? This is shown to the candidate (for example: Sat 8 Nov, 7 pm, meeting link).",
    );
    if (!note || !note.trim()) return;
    await scheduleBooking(id, note.trim());
    load();
  };

  const visible = bookings.filter((b) => b.status === tab);
  const toSchedule = bookings.filter((b) => b.status === "CONFIRMED").length;

  return (
    <>
      <Header
        title="Bookings"
        sub={`Every mock interview booked on the platform. ${toSchedule} paid and waiting to be scheduled.`}
      />

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.status}
            className={t.status === tab ? "tab active" : "tab"}
            onClick={() => setTab(t.status)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="panel table">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Booked</th>
                <th>Contact</th>
                <th>Wants</th>
                <th>Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((b) => (
                <tr key={b.id}>
                  <td>
                    BK-{b.id}
                    <small>
                      {new Date(b.paidAt ?? b.createdAt).toLocaleString()}
                    </small>
                  </td>
                  <td>
                    <b>{b.name ?? "No name given"}</b>
                    <small>{b.mobile}</small>
                    {b.email && <small>{b.email}</small>}
                    <small>
                      {b.registered ? "Registered candidate" : "Guest"}
                    </small>
                  </td>
                  <td>
                    <b>{tierLabel(b.tier)}</b>
                    <small>{b.companyName ?? "Any company in this tier"}</small>
                    <small>{b.domainName ?? "Any domain"}</small>
                    <small>
                      {b.designation ?? "Designation not given"} ·{" "}
                      {experienceLabel(b.experience)}
                    </small>
                    {b.availability && (
                      <small>Available: {b.availability}</small>
                    )}
                  </td>
                  <td>{formatRupees(b.amount)}</td>
                  <td>
                    <Badge tone={STATUS_TONE[b.status]}>
                      {STATUS_LABEL[b.status]}
                    </Badge>
                    {b.scheduleNote && <small>{b.scheduleNote}</small>}
                  </td>
                  <td>
                    {b.status === "CONFIRMED" && (
                      <button
                        className="text"
                        onClick={() => handleSchedule(b.id)}
                      >
                        Schedule
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={6}>Nothing here.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
