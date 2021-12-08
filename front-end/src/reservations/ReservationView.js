import CancelReservation from "./CancelReservation";

export default function ReservationView({ reservation }) {
  const {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status,
  } = reservation;

  return (
    <tr>
      <td className="align-middle text-center">{reservation_id}</td>
      <td className="align-middle text-center">
        {first_name} {last_name}
      </td>
      <td className="align-middle text-center">{mobile_number}</td>
      <td className="align-middle text-center">{reservation_date}</td>
      <td className="align-middle text-center">{reservation_time}</td>
      <td className="align-middle text-center">{people}</td>
      <td
        className="align-middle text-center"
        data-reservation-id-status={reservation.reservation_id}
      >
        {status}
      </td>

      {status === "booked" ? (
        <>
          <td>
            <a
              className="btn btn-primary mx-1 mb-1"
              href={`/reservations/${reservation_id}/seat`}
            >
              Seat
            </a>
            <a
              className="btn btn-secondary mx-1 mb-1"
              href={`/reservations/${reservation_id}/edit`}
            >
              Edit
            </a>
            <CancelReservation reservation={reservation} />
          </td>
        </>
      ) : (
        <>
          <td></td>
        </>
      )}
    </tr>
  );
}
