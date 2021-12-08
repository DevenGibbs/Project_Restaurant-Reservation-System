import { useState } from "react";
import { listReservations } from "../utils/api";
import ReservationsList from "./ReservationsList";

export default function SearchReservation() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);

  const mobileNumberChangeHandler = (event) =>
    setMobileNumber(event.target.value);
  async function findClickHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();

    const data = await listReservations(
      { mobile_number: mobileNumber },
      abortController.signal
    );
    setReservations(data);

    return () => abortController.abort();
  }

  return (
    <div>
      <h1>Search Reservations</h1>
      <div>
        <h4>
          Please enter a mobile number to search for an existing reservation.
        </h4>
      </div>
      <hr></hr>
      <form onSubmit={findClickHandler}>
        <label
          htmlFor="inputMobileNumber"
          className="form-label font-weight-bold"
        >
          Mobile Number:
        </label>
        <input
          name="mobile_number"
          type="text"
          className="form-control"
          id="inputMobileNumber"
          required={true}
          placeholder="Enter a customer's phone number"
          onChange={mobileNumberChangeHandler}
        ></input>
        <br></br>
        <button type="submit" className="btn btn-primary">
          Find
        </button>
      </form>
      <br></br>

      {reservations.length < 1 ? (
        <div>
          <h4>No reservations found.</h4>
        </div>
      ) : (
        <>
          <div>
            <h4>{`Reservations for ${mobileNumber}`}</h4>
          </div>
          <ReservationsList reservations={reservations} />
        </>
      )}
    </div>
  );
}
