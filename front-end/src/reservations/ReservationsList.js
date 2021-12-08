import ReservationView from "./ReservationView";
import "./ReservationsList.css";

export default function ReservationList({ reservations = [] }) {
  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col" className="align-middle text-center">
                ID
              </th>
              <th scope="col" className="align-middle text-center">
                Guest Name
              </th>
              <th scope="col" className="align-middle text-center">
                Mobile Number
              </th>
              <th scope="col" className="align-middle text-center">
                Date
              </th>
              <th scope="col" className="align-middle text-center">
                Time
              </th>
              <th scope="col" className="align-middle text-center">
                Party Size
              </th>
              <th scope="col" className="align-middle text-center">
                Status
              </th>
              <th scope="col" className="align-middle text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <ReservationView
                reservation={reservation}
                key={reservation.reservation_id}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
