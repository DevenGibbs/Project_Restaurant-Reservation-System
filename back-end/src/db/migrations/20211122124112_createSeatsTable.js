
exports.up = function(knex) {
    return knex.schema.createTable("seats", (table) => {
        table.increments("seat_id").primary();
        table.string("seat_name").notNullable();
        table.integer("capacity").notNullable();
        table.timestamps(true, true);
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable("seats");
};
