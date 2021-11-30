import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";
import TodayPrevNextButtons from "./TodayPrevNextButtons";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const query = useQuery();
  const dateQuery = query.get("date");

  if (dateQuery) date = dateQuery;

  // useEffect(loadDashboard, [date]);

  // function loadDashboard() {
  //   const abortController = new AbortController();
  //   setReservationsError(null);
  //   listReservations({ date }, abortController.signal)
  //     .then(setReservations)
  //     .catch(setReservationsError);
  //   return () => abortController.abort();
  // }

  // Get request for an array of reservations with date query
  useEffect(() => {
    const abortController = new AbortController();

    async function loadReservations() {
      setReservationsError(null);
      try {
        const data = await listReservations({ date }, abortController.signal);
        setReservations(data);
      } catch (error) {
        setReservationsError(error);
      }
    }
    loadReservations();
    return () => abortController.abort();
  }, [date]);

  //Get request for all tables

  const unfinishedReservations = reservations.filter(
    (reservation) => reservation.status !== "finished"
  );

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">
          {reservations.length <1 && "No "}
          {`Reservations for`}&nbsp;
        </h4>
        <h4 className="fw-bold">{date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <TodayPrevNextButtons date={date} />
      <ReservationsList reservations={unfinishedReservations} />
      <br></br>
      <hr></hr>
      <div>
        <h4>List of Tables:</h4>
      </div>
    </main>
  );
}

export default Dashboard;
