import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

export default function ReservationForm({
    submitClickHandler,
    setFirstName,
    setLastName,
    setMobileNumber,
    setParty,
    setDate,
    setTime,
    firstName,
    lastName,
    mobileNumber,
    party,
    date,
    time,
    error
}) {

    const firstNameChangeHandler = (event) => setFirstName(event.target.value);
    const lastNameChangeHandler = (event) => setLastName(event.target.value);
    const mobileNumberChangeHandler = (event) => setMobileNumber(event.target.value);
    const partyChangeHandler = (event) => setParty(event.target.value);
    const dateChangeHandler = (event) => setDate(event.target.value);
    const timeChangeHandler = (event) => setTime(event.target.value);

    const history = useHistory();
    const cancelClickHandler = () => history.goBack();

    return (
        <>
        {error && <ErrorAlert error={error} />}
        <form onSubmit={submitClickHandler}>
            <div>
                <label htmlFor="inputFirstName" className="form-label">
                    First Name
                </label>
                <input 
                    name="first_name"
                    type="text"
                    className="form-control"
                    id="inputFirstName"
                    placeholder="Jane"
                    require={true}
                    value={firstName}
                    onChange={firstNameChangeHandler}
                ></input>
            </div>
            <div>
                <label htmlFor="inputLastName" className="form-label">
                    Last Name
                </label>
                <input 
                    name="last_name"
                    type="text"
                    className="form-control"
                    id="inputLastName"
                    placeholder="Doe"
                    require={true}
                    value={lastName}
                    onChange={lastNameChangeHandler}
                ></input>
            </div>
            <div>
                <label htmlFor="inputMobileNumber" className="form-label">
                    Mobile Number
                </label>
                <input 
                    name="mobile_number"
                    type="text"
                    className="form-control"
                    id="inputMobileNumber"
                    placeholder="xxx-xxx-xxxx"
                    require={true}
                    value={mobileNumber}
                    onChange={mobileNumberChangeHandler}
                ></input>
            </div>
            <div>
                <label htmlFor="inputParty" className="form-label">
                    Party Size
                </label>
                <input 
                    name="people"
                    type="text"
                    className="form-control"
                    id="inputParty"
                    placeholder="Enter a number"
                    require={true}
                    value={party}
                    onChange={partyChangeHandler}
                ></input>
            </div>
            <div>
                <label htmlFor="inputDate" className="form-label">
                    Date
                </label>
                <input 
                    name="reservation_date"
                    type="text"
                    className="form-control"
                    id="inputDate"
                    placeholder="MMDDYYYY"
                    require={true}
                    value={date}
                    onChange={dateChangeHandler}
                ></input>
            </div>
            <div>
                <label htmlFor="inputTime" className="form-label">
                    Time
                </label>
                <input 
                    name="reservation_time"
                    type="text"
                    className="form-control"
                    id="inputTime"
                    placeholder="13:00"
                    require={true}
                    value={time}
                    onChange={timeChangeHandler}
                ></input>
            </div>
            <hr></hr>
            <div>
                <button type="submit" className="btn btn-primary mr-2">
                    Submit
                </button>
                <button type="button" className="btn btn-secondary" onClick={cancelClickHandler} >
                    Cancel
                </button>
            </div>
        </form>
        </>
    );
}