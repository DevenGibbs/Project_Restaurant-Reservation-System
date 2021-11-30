import ReservationView from "./ReservationView";

export default function ReservationList({ reservations = [] }) {
    return (
        <>
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr className="bg-dark text-white">
                            <th scope="col">#</th>
                            <th scope="col">Guest Name</th>
                            <th scope="col">Mobile Number</th>
                            <th scope="col">Date</th>
                            <th scope="col">Time</th>
                            <th scope="col">Party</th>
                            <th scope="col">Status</th>
                            <th scope="col"></th>
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