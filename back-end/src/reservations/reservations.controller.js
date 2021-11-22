const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");
const specifiedTimeString = require("../utils/specifiedTimeString");

/**

 ***VALIDATION***

*/

/**
 * Validation for reservation creation
 */
function bodyValidation(req, res, next) {
  const {
    data: {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
      status,
    } = {},
  } = req.body;
  let message = "";
  if(!first_name) {
    message = "Reservation must include a first_name.";
  }
  if(!last_name) {
    message = "Reservation must include a last_name.";
  }
  if(!mobile_number) {
    message = "Reservation must include a mobile_number.";
  }
  if(!reservation_date) {
    message = "Reservation must include a reservation_date.";
  }
  if(!reservation_time) {
    message = "Reservation must include a reservation_time.";
  }
  if(!people || people <= 0 || !Number.isInteger(people)) {
    message = "Reservation must have a number of people that is greater than 0.";
  }
  if(Number.isNaN(Date.parse(reservation_date))) {
    message = "The reservation_date must be an actual date.";
  }
  if(reservation_time && !reservation_time.match(/\d\d:\d\d/)) {
    message = "The reservation_time must be an actual time.";
  }
  if (status && status !== "booked") {
    message = `Reservation status of ${status} is not allowed. Status can only be "booked."`
  }
  if (message.length) {
    next({
      status: 400,
      message: message,
    });
  }
  res.locals.body = req.body.data;
  return next();
}

/**
 * Validation for specified time constraints
 */
 function dayAndTimeValidation(req, res, next) {
  const { reservation_date, reservation_time } = res.locals.body;
  const dateObject = new Date(reservation_date + "T" + reservation_time);
  const today = new Date();
  const [year, month, day] = [
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ];
  const todayObject = new Date(year, month, day);
  todayObject.setHours(0);

  const reservationTimeTruncated = reservation_time.match(/\d\d:\d\d/)[0];
  const timeNow = today.toTimeString().match(/\d\d:\d\d/)[0];

  let message = "";
  if (dateObject < today) {
    message = "Only future and present reservation dates are allowed";
  }
  if (dateObject.getDay() === 2) {
    message = "Reservation date must not be a Tuesday since business is closed";
  }
  if (
    reservationTimeTruncated < specifiedTimeString(10, 30) ||
    reservationTimeTruncated > specifiedTimeString(21, 30)
  ) {
    message = "Reservation time must be between 10:30 AM and 9:30 PM";
  }
  if (message.length) {
    next({
      status: 400,
      message: message,
    });
  }
  return next();
}

/**
 * Validation for reservation existence
 */
async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservationId} cannot be found.`,
  });
}

/**
 * Validation for status update
 */
function statusValidation(req, res, next) {
  const acceptableStatus = ["booked", "seated", "finished", "cancelled"];
  const reservation = res.locals.reservation;
  const currentStatus = reservation.status;
  const { data: { status } = {} } = req.body;
  let message = "";
  if (!acceptableStatus.includes(status)) {
    message = "Status is unknown. The status must be 'booked', 'seated', 'finised', or 'cancelled'.";
  }
  if (currentStatus === "finished") {
    message = "A finished reservation cannot be updated.";
  }
  if (message.length) {
    next({
      status: 400,
      message: message,
    });
  }
  res.locals.body = req.body.data;
  return next();
}

/**

 ***HANDLERS***

*/

/**
 * Create handler for reservation resources
 */
async function create(req, res) {
  const reservation = res.locals.body;
  const data = await service.create(reservation);
  res.status(201).json({
    data,
  });
}

/**
 * Read handler for reservation resources
 */
async function read(req, res) {
  res.json({ data: res.locals.reservation });
}

/**
 * Update handler for reservation resources
 */
async function update(req, res) {
  const { reservation_id } = res.locals.reservation;
  const updatedReservation = res.locals.body;
  await service.update(reservation_id, updatedReservation);
  res.json({
    data: updatedReservation,
  });
}

/**
 * UpdateStatus handler for reservation resources
 */
async function updateStatus(req, res) {
  const { reservation_id } = res.locals.reservation;
  const { status } = res.locals.body;
  await service.updateStatus(reservation_id, status);
  res.json({ data: { status } });
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { mobile_number } = req.query;
  if (mobile_number) {
    const data = await service.search(mobile_number);

    res.json({
      data,
    });
  } else {
    const date = req.query.date;
    const results = await service.list(date);
    const data = results.filter((result) => result.status !== "finished");

    res.json({
      data,
    });
  }
}

module.exports = {
  create: [bodyValidation, dayAndTimeValidation, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    bodyValidation,
    dayAndTimeValidation,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    statusValidation,
    asyncErrorBoundary(updateStatus),
  ],
  list: asyncErrorBoundary(list),
};
