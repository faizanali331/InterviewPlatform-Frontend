// import Header from "../../components/common/Header";
// import Badge from "../../components/common/Badge";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { getMyBookingsAsInterviewer } from "../../api/bookingApi";
// import { Booking } from "../../types/booking";

// export default function InterviewerInterviews() {
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getMyBookingsAsInterviewer()
//       .then(setBookings)
//       .catch(() => setBookings([]))
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <>
//       <Header
//         title="My interviews"
//         sub="Upcoming and past candidate interviews. Candidate identity stays confidential."
//       />

//       <div className="panel table">
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <table>
//             <thead>
//               <tr>
//                 <th>Domain</th>
//                 <th>Date</th>
//                 <th>Status</th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {bookings.map((b) => (
//                 <tr key={b.id}>
//                   <td>{b.domainName}</td>
//                   <td>
//                     {b.slotDate}
//                     <small>{b.startTime.slice(0, 5)}</small>
//                   </td>
//                   <td>
//                     <Badge tone={b.status === "CONFIRMED" ? "info" : "danger"}>
//                       {b.status}
//                     </Badge>
//                   </td>
//                   <td>
//                     {b.status === "CONFIRMED" && (
//                       <Link
//                         className="text"
//                         to={`/interviewer/feedback/give/${b.id}`}
//                       >
//                         Give feedback
//                       </Link>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//               {bookings.length === 0 && (
//                 <tr>
//                   <td colSpan={4}>No interviews yet.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </>
//   );
// }

import Header from "../../components/common/Header";

export default function InterviewerInterviews() {
  return (
    <>
      <Header
        title="My interviews"
        sub="Interviews assigned to you will appear here. Candidate identity stays confidential."
      />

      <div className="panel center">
        <h3>Nothing assigned yet</h3>
        <p>
          Our team assigns verified interviewers to bookings. Once that's set
          up, your interviews will show here.
        </p>
      </div>
    </>
  );
}
