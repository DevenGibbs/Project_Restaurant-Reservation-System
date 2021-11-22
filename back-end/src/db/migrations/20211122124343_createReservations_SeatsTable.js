
exports.up = function(knex) {
    return knex.schema.createTable("reservations_seats", (table) => {
        table.increments("reservation_seat_id").primary();
        table.integer("reservation_id").unsigned().notNullable();
        table
            .foreign("reservation_id")
            .references("reservation_id")
            .inTable("reservations")
            .onDelete("CASCADE");
        table.integer("seat_id").unsigned().notNullable();
        table
            .foreign("seat_id")
            .references("seat_id")
            .inTable("seats")
            .onDelete("CASCADE");
        table.timestamps(true, true);
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable("reservations_seats");
};