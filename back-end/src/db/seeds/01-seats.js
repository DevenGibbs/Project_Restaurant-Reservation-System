const seatsData = require("./01-seats.json");

exports.seed = function (knex) {
  return knex
    .raw("TRUNCATE TABLE seats RESTART IDENTITY CASCADE")
    .then(() => knex("seats").insert(seatsData));
};
