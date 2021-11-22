const knex = require("../db/connection");

const tableName = "reservations";

function create(reservation) {
    return knex(tableName)
        .insert(reservation)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

function read(reservation_id) {
    return knex(tableName)
        .select("*")
        .where({ reservation_id })
        .then((returnedRecords) => returnedRecords[0]);
}

function update(reservation_id, updatedReservation) {
    return knex(tableName)
        .select("*")
        .where({ reservation_id })
        .update(updatedReservation)
}

function updateStatus(reservation_id, status) {
    return knex(tableName)
        .select("*")
        .where({ reservation_id })
        .update({ status })
        .then((updatedRecords) => updatedRecords[0]);
}

function list(date) {
    return knex(tableName)
        .select("*")
        .where({ reservation_date: date })
        .groupBy("reservation_id")
        .orderBy("reservation_time");
}

function search(mobile_number) {
    return knex("reservations")
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");
}

module.exports = {
    create,
    read,
    update,
    updateStatus,
    list,
    search,
}