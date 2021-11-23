const reservationsService = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../utils/hasProperties");
const { NotificationCenter } = require("node-notifier");
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

const VALID_PROPERTIES = [
  "reservation_id",
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "created_at",
  "updated_at",
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

// if 'status' property is present, validates that it is equal to "booked"
function statusIsBooked(req, res, next) {
  const { status } = req.body.data;

  if (!status) return next();

  if (status === "booked") return next();
  next({
    status: 400,
    message: `The reservation status is ${status}.`,
  });
}

/**
 * Validates input for people, reservation_date and reservation_time
 * @param req
 * @param next
 * @returns {Error}
 * a status code and a message with all the fields with invalid input
 */
function hasValidInputs(req, res, next) {
  const { people, reservation_date, reservation_time } = req.body.data;
  let invalidInputs = "Invalid input(s):";

  if (typeof people !== "number") {
    invalidInputs = invalidInputs.concat(" people");
  }
  if (!reservationDateIsValid(reservation_date)) {
    invalidInputs = invalidInputs.concat(" reservation_date");
  }

  if (!reservationTimeIsValid(reservation_time)) {
    invalidInputs = invalidInputs.concat(" reservation_time");
  }

  if (invalidInputs !== "Invalid input(s):") {
    return next({
      status: 400,
      message: invalidInputs,
    });
  }

  if (reservationDateIsTuesday(reservation_date)) {
    return next({
      status: 400,
      message: `The restaurant is closed on Tuesdays.`,
    });
  }

  if (reservationNotInTheFuture(reservation_date, reservation_time)) {
    return next({
      status: 400,
      message: `Please enter future reservation date.`,
    });
  }

  if (reservationTimeNotAllowed(reservation_time)) {
    return next({
      status: 400,
      message: `Please enter a time between 10:30 to 21:30.`,
    });
  }
  return next();
}

// checks if the reservation_date is a valid Date
function reservationDateIsValid(reservation_date) {
  const timestamp = Date.parse(reservation_date);
  if (isNaN(timestamp) == false) {
    const date = new Date(timestamp);
    return date instanceof Date;
  }
}

function reservationTimeIsValid(reservation_time) {
  const isTime = reservation_time.match(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
  return isTime;
}

// checks if the reservation_date is a Tuesday
function reservationDateIsTuesday(reservation_date) {
  const timestamp = Date.parse(`${reservation_date} PST`);
  const date = new Date(timestamp);
  return date.getDay() == 2;
}

// checks if the reservation is after the current time and date
function reservationNotInTheFuture(reservation_date, reservation_time) {
  const reservationDateTimestamp = Date.parse(
    `${reservation_date} ${reservation_time} PST`
  );
  return reservationDateTimestamp < Date.now();
}

// checks if the reservation time is NOT between 10:30 and 21:30
function reservationTimeNotAllowed(reservation_time) {
  const reservationTime = Number(reservation_time.replace(":", "").slice(0, 4));
  return reservationTime < 1030 || reservationTime > 2130;
}

// creates a new reservation adding 'status' key with default value "booked"
async function create(req, res) {
  const { data } = req.body;
  const newReservation = { ...data, status: "booked" };
  const newData = await reservationsService.create(newReservation);
  res.status(201).json({ data: newData });
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await reservationsService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ID ${reservation_id} does not exist.`,
  });
}

function read(req, res) {
  const { reservation: data } = res.locals;
  res.json({ data });
}

async function update(req, res) {
  const updatedreservation = {
    ...res.locals.reservation,
    ...req.body.data,
  };
  const data = await reservationsService.update(updatedreservation);
  res.json({ data });
}

// validates that the status !== "finished"
function statusIsNotFinished(req, res, next) {
  const { status } = res.locals.reservation;
  if (status !== "finished") return next();

  next({
    status: 400,
    message: `A ${status} reservation cannot be updated.`,
  });
}

function hasValidStatusRequest(req, res, next) {
  const { status } = req.body.data;

  if (status === "booked" || status === "seated" || status === "finished" || status === "cancelled") {
    return next();
  }

  next({
    status: 400,
    message: `The reservation status ${status} is invalid.`,
  })
}

async function destroy(req, res) {
  const { reservation } = res.locals;
  await reservationsService.delete(reservation.reservation_id);
  res.sendStatus(204);
}

/**
 * List handler for reservation resources with optional date or mobile_number query
 */
async function list(req, res) {
  const { date, mobile_number } = req.query;
  let data = [];

  if (date) {
    data = await reservationsService.listByDate(date);
  } else if (mobile_number) {
    data = await reservationsService.listByMobileNumber(mobile_number);
  } else {
    data = await reservationsService.list();
  }

  res.json({
    data: data,
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidInputs,
    statusIsBooked,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidInputs,
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    statusIsNotFinished,
    hasValidStatusRequest,
    asyncErrorBoundary(update),
  ],
};
