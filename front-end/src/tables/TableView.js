import FinishTable from "./FinishTable";

export default function TableView({ table }) {
  const { table_id, table_name, capacity, reservation_id } = table;

  return (
    <tr>
      <td className="align-middle text-center">{table_id}</td>
      <td className="align-middle text-center">{table_name}</td>
      <td className="align-middle text-center">{capacity}</td>

      <td className="align-middle text-center" data-table-id-status={table_id}>
        {reservation_id ? "occupied" : "free"}
      </td>

      <td className="align-middle text-center">
        {reservation_id && <FinishTable table_id={table_id} />}
      </td>
    </tr>
  );
}
