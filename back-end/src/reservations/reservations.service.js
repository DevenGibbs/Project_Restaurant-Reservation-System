const knex = require("../db/connection");

function list() {
  return knex("reservations").select("*").orderBy("reservation_date");
}

function listByDate(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot("status", "finished")
    .orderBy("reservation_time");
}

function listByMobileNumber(mobile_number) {
  return knex("reservations")
    .select("*")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

function update(updatedreservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedreservation.reservation_id })
    .update(updatedreservation, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

function destroy(reservation_id) {
  return knex("reservations").where({ reservation_id }).del();
}

module.exports = {
  list,
  listByDate,
  listByMobileNumber,
  create,
  read,
  update,
  delete: destroy,
};
