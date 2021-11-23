const tablesService = require("./tables.service");
const hasProperties = require("../utils/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**

 ***VALIDATION***

*/

/**
 * Validation for table creation
 */
const VALID_PROPERTIES = [
    "table_id", 
    "table_name", 
    "capacity", 
    "reservation_id"
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

/**
 * Validation for inputs (table_name and capacity)
 */
function hasValidInputs(req, res, next) {
  const { table_name, capacity } = req.body.data;
  let invalidInputs = "Invalid input(s):";

  if (table_name.length < 2) {
    invalidInputs = invalidInputs.concat(" table_name");
  }

  if (typeof capacity !== "number") {
    invalidInputs = invalidInputs.concat(" capacity");
  }

  if (invalidInputs !== "Invalid input(s):") {
    return next({
      status: 400,
      message: invalidInputs,
    });
  }

  next();
}

/**
 * Validation for table existence
 */
async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await tablesService.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table ID ${table_id} does not exist.`,
  });
}

/**
 * Validation for reservation_id existence
 */
async function reservationIdExists(req, res, next) {
  let reservation_id = null;
  if (req.body.data) {
    // checks reservation_id before status changes to "seated"
    reservation_id = req.body.data.reservation_id;
  } else if (res.locals.table) {
    // checks reservation_id before status changes to "finished"
    reservation_id = res.locals.table.reservation_id;
  }
  const reservation = await tablesService.readReservation(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }

  next({
    status: 404,
    message: `Reservation ID ${reservation_id} does not exist.`,
  });
}

/**
 * Validation for table capacity relative to number of people on reservation
 */
function tableHasSufficientCapacity(req, res, next) {
  const { people } = res.locals.reservation;
  const { capacity } = res.locals.table;

  if (capacity >= people) return next();

  next({
    status: 400,
    message: `Table does not have sufficient capacity.`,
  });
}

/**
 * Validation for table availability (occupied)
 */
function tableIsNotOccupied(req, res, next) {
  const { reservation_id } = res.locals.table;

  if (reservation_id) {
    return next({
      status: 400,
      message: `Table is occupied.`,
    });
  }
  next();
}

/**
 * Validation for table availability (not occupied)
 */
function tableIsOccupied(req, res, next) {
    const { reservation_id } = res.locals.table;
  
    if (reservation_id) return next();
  
    next({
      status: 400,
      message: `Table is not occupied.`,
    });
  }

/**
 * Validation for table status ("seated")
 */
function reservationStatusIsNotSeated(req, res, next) {
    const { status } = res.locals.reservation;
  
    if (status === "seated") {
      return next({
        status: 400,
        message: `Reservation status is ${status}.`,
      });
    }
  
    next();
  }

/**

 ***HANDLERS***

*/

/**
 * Create handler for tables resources
 */
async function create(req, res) {
  const data = await tablesService.create(req.body.data);
  res.status(201).json({ data });
}

/**
 * Read handler for tables resources
 */
async function read(req, res) {
    const data = res.locals.table;
    res.json({ data: data });
}

/**
 * Update handler for tables resources (status = "seated")
 */
async function updateReservationStatusToSeated(req, res, next) {
  const updatedReservation = {
    ...res.locals.reservation,
    status: "seated",
  };
  const data = await tablesService.updateReservationStatus(updatedReservation);
  next();
}

/**
 * Update handler for tables resources
 */
async function update(req, res) {
  const updatedTable = {
    ...res.locals.table,
    reservation_id: res.locals.reservation.reservation_id,
  };
  const data = await tablesService.update(updatedTable);
  res.json({ data });
}

/**
 * Update handler for tables resources (status = "finished")
 */
async function updateReservationStatusToFinished(req, res, next) {
  const updatedReservation = {
    ...res.locals.reservation,
    status: "finished",
  };
  const data = await tablesService.updateReservationStatus(updatedReservation);
  next();
}

/**
 * Delete handler for tables resources (reservation_id)
 */
async function deleteReservationId(req, res) {
  const updatedTable = {
    ...res.locals.table,
    reservation_id: null,
  };
  const data = await tablesService.update(updatedTable);
  res.json({ data });
}

/**
 * Destroy handler for tables resources (table_id)
 */
async function destroy(req, res) {
  const { table_id } = res.locals.table
  await tablesService.delete(table_id);
  res.sendStatus(204);
}

/**
 * List handler for tables resources
 */
async function list(req, res, next) {
    const data = await tablesService.list();
    res.json({ data: data });
}

module.exports = {
  create: [
    hasOnlyValidProperties,
    hasProperties("table_name", "capacity"),
    hasValidInputs,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(tableExists),
    hasOnlyValidProperties,
    hasProperties("reservation_id"),
    asyncErrorBoundary(reservationIdExists),
    tableHasSufficientCapacity,
    tableIsNotOccupied,
    reservationStatusIsNotSeated,
    asyncErrorBoundary(updateReservationStatusToSeated),
    asyncErrorBoundary(update),
  ],
  deleteReservationId: [
    asyncErrorBoundary(tableExists),
    tableIsOccupied,
    asyncErrorBoundary(reservationIdExists),
    asyncErrorBoundary(updateReservationStatusToFinished),
    asyncErrorBoundary(deleteReservationId),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(destroy)
  ],
  list: [asyncErrorBoundary(list)],
};