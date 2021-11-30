import FinishTable from "./FinishTable";

export default function TableView({ table }) {
    const { table_id, table_name, capacity, reservation_id } = table;

    return (
        <tr>
            <th scope="row">{table_id}</th>
            <td>{table_name}</td>
            <td>{capacity}</td>

            <td data-table-id-status={table_id}>
                {reservation_id ? "occupied" : "free"}
            </td>

            <td>{reservation_id && <FinishTable table_id={table_id} />}</td>
        </tr>
    );
}