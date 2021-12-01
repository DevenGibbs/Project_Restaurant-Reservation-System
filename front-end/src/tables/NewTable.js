import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function NewTable() {
    const history = useHistory();
    const [tableName, setTableName] = useState("");
    const [capacity, setCapacity] = useState(0);
    const [error, setError] = useState("");

    const tableNameChangeHandler = (event) => setTableName(event.target.value);
    const capacityChangeHandler = (event) => setCapacity(event.target.value);
    const cancelClickHandler = () => history.goBack();

    async function submitClickHandler(event) {
        event.preventDefault();
        const abortController = new AbortController();
        const newTable = {
            table_name: tableName,
            capacity: Number(capacity),
        };

        try {
            await createTable(newTable, abortController.signal);
        } catch (error) {
            setError(error);
            return;
        }

        history.push(`/dashboard`);
        return () => abortController.abort();
    }

    return (
        <div>
            <h1>New Table</h1>
            <div>
                <h4>Please complete all fields to create a new table.</h4>
            </div>
            <hr></hr>
            {error && <ErrorAlert error={error} />}
            <form onSubmit={submitClickHandler}>
                <div>
                    <label htmlFor="inputTableName" className="form-label font-weight-bold">
                        Table Name
                    </label>
                    <input
                        name="table_name"
                        type="text"
                        className="form-control"
                        id="inputTableName"
                        placeholder="Ex: Dining #47"
                        required={true}
                        onChange={tableNameChangeHandler}
                    ></input>
                </div>
                <div>
                    <label htmlFor="inputCapacity" className="form-label font-weight-bold">
                        Capacity
                    </label>
                    <input
                        name="capacity"
                        type="text"
                        className="form-control"
                        id="inputCapacity"
                        placeholder="Ex: 2"
                        required={true}
                        onChange={capacityChangeHandler}
                    ></input>
                </div>
                <hr></hr>
                <div>
                    <button type="submit" className="btn btn-primary mr-2">
                        Submit
                    </button>
                    <button type="button" className="btn btn-secondary mr-2" onClick={cancelClickHandler} >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}