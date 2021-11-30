import { useHistory } from "react-router-dom";
import { deleteTableReservation } from "../utils/api";


export default function FinishTable({ table_id }) {
    const history = useHistory();

    async function finishClickHandler(event) {
        event.preventDefault();
        const abortController = new AbortController();

        const finishTable = window.confirm(
            "\nIs this table ready to seat new guests? This cannot be undone."
        );

        if (!finishTable) return history.push("/dashboard");

        try {
            await deleteTableReservation(table_id, abortController.signal);
        } catch (error) {
            console.log(error.message);
        }

        window.location.reload();

        return () => abortController.abort();
    }

    return (
        <button
            type="button"
            className = "btn btn-primary"
            data-table-id-finish={table_id}
            onClick={(event) => finishClickHandler(event)}
        >
            Finish
        </button>
    );
}