import { useHistory } from "react-router";
import ReservationForm from "./ReservationForm";
import formatReservationDate from "../utils/format-reservation-date";
import formatReservationTime from "../utils/format-reservation-time";
import { useState } from "react";
import { createReservation } from "../utils/api";

export default function NewReservation() {
    const history = useHistory();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [party, setParty] = useState(0);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [error, setError] = useState("");

    async function submitClickHandler(event) {
        event.preventDefault();
        const abortController = new AbortController();
        const formattedDate = formatReservationDate();
        const formattedTime = formatReservationTime();
        const newReservation = {
            first_name: firstName,
            last_name: lastName,
            mobile_number: mobileNumber,
            reservation_date: formattedDate,
            reservation_time: formattedTime,
            people: Number(party),
        };
        try {
            await createReservation(newReservation, abortController.signal);
        } catch (error) {
            setError(error);
        return;
        }

        history.push(`/dashboard?date=${formattedDate}`);
        return () => abortController.abort();
    }
    
    return (
        <div>
            <h1>New Reservation</h1>
            <div>
                <h4>Please complete all fields to create a new reservation.</h4>
            </div>
            <hr></hr>
            <ReservationForm
                submitClickHandler={submitClickHandler}
                setFirstName={setFirstName}
                setLastName={setLastName}
                setMobileNumber={setMobileNumber}
                setParty={setParty}
                setDate={setDate}
                setTime={setTime}
                firstName={firstName}
                lastName={lastName}
                mobileNumber={mobileNumber}
                party={party}
                date={date}
                time={time}
                error={error}
            />
        </div>
    );
}