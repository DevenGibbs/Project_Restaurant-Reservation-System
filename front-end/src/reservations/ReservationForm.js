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
            <div className="form-group">
                <label htmlFor="inputFirstName" className="form-label font-weight-bold">
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
            <div className="form-group">
                <label htmlFor="inputLastName" className="form-label font-weight-bold">
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
            <div className="form-group">
                <label htmlFor="inputMobileNumber" className="form-label font-weight-bold">
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
            <div className="form-group">
                <label htmlFor="inputParty" className="form-label font-weight-bold">
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
            <div className="form-group">
                <label htmlFor="inputDate" className="form-label font-weight-bold">
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
            <div className="form-group">
                <label htmlFor="inputTime" className="form-label font-weight-bold">
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