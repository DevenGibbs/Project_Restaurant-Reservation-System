# Periodic Tables Presents: **Ready Rezzy** 
A Simple, Easy-to-Use Restaurant Reservation System

*Also, my Thinkful Capstone Project*

## Try It Yourself:

[ReadyRezzy](https://dlg-reservations-front-end.herokuapp.com/dashboard)

Ready Rezzy is a restaurant reservation app built for restauranteurs to allow them to easily create, manage, and track both reservations and tables for their places of business. Restaurant personnel can use the system and information made available to them in this app to manage day-to-day operations and support customers when they call to inquire about reservations. 

## Key Features

### - **Easily access existing reservations and tables on the Dashboard.**

![dashboard](screenshots/dashboard.png)


### - **Ability to create and store new reservations and tables.**
   - New Reservation:
   ![new-reservation](screenshots/new-reservation.png)

   - New Table:
   ![new-table](screenshots/new-table.png)



### - **Seat reservations at specific, available tables.**

![seat-selection](screenshots/seat-selection.png)

### - **Seamlessly manage a reservation's status and/or table's availability throughout the course of business.**
   - Reservation Status: "booked", "seated" or "finished"
   - Table Availability: "free" or "occupied"

![status-and-availability](screenshots/status-and-availability.png)

### - **Search for a reservation by the guest's phone number.**

![search](screenshots/search.png)

## API Documentation

### **In alignment with REST best practices:**
 - `GET` requests return JSON responses.
 - `POST` and `PUT` requests require an application/JSON body and return a JSON response.

### **Endpoints for Reservations**

1. **List Reservations:** `GET /reservations`
    - Requests all reservations
    - 

2. **Create a New Reservation:** `POST /reservations`
    - Posts a single JSON object
    - 

...

### **Endpoints for Tables**

1. **List Tables:** `GET /tables`
    - Requests all reservations
    - 

2. **Create a New Table:** `POST /tables`
    - Posts a single JSON object
    - 

...

## Technology Used

| Location | Tool(s)                                                      
| ---------------- | ---------------------------------------------------------------- |
| front-end   | React, HTML, CSS, Bootstrap 5  |
| back-end    | Node.js, Express, Knex |
| database    | PostgreSQL |
| overall     | Javascript, Heroku, Github |

## Installation Instructions

1. Fork and clone this repository.
1. Run `npm install` to install project dependencies.
1. Run `npm run start` to start the client & server.

## Special Thanks
* Thinkful, for the opportunity and support.
* My mentor, Lawrence Bautista, for his help and guidance throughout this project.

