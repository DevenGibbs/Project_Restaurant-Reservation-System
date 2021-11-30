import ReservationForm from "./ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";

export default function EditReservation() {
    const {reservation_id } = useParams();
    const history = useHistory();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [party, setParty] = useState(0);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const abortController = new AbortController();

        async function loadReservation() {
            try {
                const data = await readReservation(
                    reservation_id,
                    abortController.signal
                );
                const MMDDYYYY = formatDatetoMMDDYYYY(data.reservation_date);
                setFirstName(data.first_name);
                setLastName(data.last_name);
                setMobileNumber(data.mobile_number);
                setParty(data.people);
                setDate(MMDDYYYY);
                setTime(data.reservation_time);
            } catch (error) {
                return <ErrorAlert error={error} />;
            }
        }

        loadReservation();

        return () => abortController.abort();
    }, [reservation_id]);

    async function submitClickHandler(event) {
        event.preventDefault();
        const abortController = new AbortController();

        const formattedDate = formatDate();
        const formattedTime = formatTime();

        const updatedReservation = {
            reservation_id,
            first_name: firstName,
            last_name: lastName,
            mobile_number: mobileNumber,
            reservation_date: formattedDate,
            reservation_time: formattedTime,
            people: Number(party),
        };

        try {
            await updateReservation(updatedReservation, abortController.signal);
        } catch (error) {
            setError(error);
            return;
        }

        history.push(`/dashboard?date=${formattedDate}`);
        return () => abortController.abort();
    }

    function formatDatetoMMDDYYYY(originalDate) {
        const date = originalDate.replace(/[\s-]/g, "");
        return `${date.substring(4, 6)}${date.substring(6, 8)}${date.substring(0, 4)}`;
    }

    function formatDate() {
        return `${date.substring(4, 8)}${date.substring(0, 2)}${date.substring(2, 4)}`;
    }

    function formatTime() {
        let cleanTime = time.replace(/[\s:]/g, "").toLowerCase();
        if (cleanTime.includes("pm")) {
            cleanTime = Number(cleanTime.slice(0, 4)) + 1200;
            cleanTime = String(cleanTime);
        }
        return `${cleanTime.slice(0, 2)}:${cleanTime.slice(2, 4)}`;
    }
    
    return (
        <div>
            <h1>Edit Reservation</h1>
            <div>
                <h4>Please complete all fields to edit an existing reservation.</h4>
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