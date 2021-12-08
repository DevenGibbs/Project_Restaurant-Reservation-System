import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, listTables, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function SeatReservation() {
  const { reservation_id } = useParams();
  console.log(reservation_id);
  const [reservation, setReservation] = useState({});
  const [tables, setTables] = useState([]);
  const [tableId, setTableId] = useState(0);
  const [error, setError] = useState("");
  const history = useHistory();

  useEffect(() => {
    const abortController = new AbortController();

    async function loadTables() {
      const data = await listTables(abortController.signal);
      setTables(data);
    }

    loadTables();

    return () => abortController.abort();
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadReservation() {
      const data = await readReservation(
        reservation_id,
        abortController.signal
      );
      setReservation(data);
    }

    loadReservation();

    return () => abortController.abort();
  }, [reservation_id]);

  const submitHandler = async (event) => {
    event.preventDefault();

    const abortController = new AbortController();
    const updatedTable = {
      table_id: tableId,
      reservation_id: reservation.reservation_id,
    };
    try {
      await updateTable(updatedTable, abortController.signal);
    } catch (error) {
      setError(error);
      return;
    }
    history.push("/dashboard");
    return () => abortController.abort();
  };

  // filter tables without an assigned reservation
  const unassignedTables = tables.filter((table) => !table.reservation_id);

  return (
    <div>
      <h1>Seat Reservation</h1>
      <div className="d-md-flex mb-3">
        <h4>Please assign a table to the reservation.</h4>
      </div>
      {error && <ErrorAlert error={error} />}
      <hr></hr>
      <h5>{`${reservation.reservation_id}`}</h5>
      <form className="row g-3" onSubmit={submitHandler}>
        <div className="col-md-6">
          <select
            name="table_id"
            className="form-select"
            onChange={(e) => setTableId(e.target.value)}
          >
            <option defaultValue>Choose a table</option>
            {unassignedTables.map((table) => (
              <option
                value={table.table_id}
                key={table.table_id}
              >{`${table.table_name} - ${table.capacity}`}</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
