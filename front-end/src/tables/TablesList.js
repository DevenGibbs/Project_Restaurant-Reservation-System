import TableView from "./TableView"

export default function TablesList({ tables = [] }) {
    return (
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col" className="align-middle text-center">ID</th>
                        <th scope="col" className="align-middle text-center">Description</th>
                        <th scope="col" className="align-middle text-center">Capacity</th>
                        <th scope="col" className="align-middle text-center">Availability</th>
                        <th scope="col" className="align-middle text-center">Action</th>
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