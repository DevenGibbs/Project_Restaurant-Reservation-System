import TableView from "./TableView"

export default function TablesList({ tables = [] }) {
    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead>
                    <tr className="bg-dark text-white">
                        <th scope="col">#</th>
                        <th scope="col">Description</th>
                        <th scope="col">Capacity</th>
                        <th scope="col">Availability</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {!tables && "No available tables."}
                    {tables.map((table) => (
                        <TableView key={table.table_id} table={table} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}