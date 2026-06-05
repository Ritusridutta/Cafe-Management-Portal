# Cafe BE ☕

A full-stack Cafe Management System built using Node.js, Express, MySQL, HTML, CSS, and JavaScript.

## Features

### Customer Portal

* Browse menu
* Add items to cart
* Place orders
* Account management
* Order history
* Email receipts with PDF attachment

### Reception Portal

* Accept orders
* Complete orders
* View active orders
* View past orders
* Dashboard analytics

### Kitchen Portal

* Start preparing orders
* Mark orders as ready
* View current orders
* View past orders
* Dashboard analytics

### Admin Portal

* Manage menu items
* Manage stock
* View all orders
* Dashboard analytics

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MySQL (Railway)

### Email Service

* Nodemailer
* Resend

### PDF Generation

* PDFKit

## Installation

Clone the repository:

```bash
git clone https://github.com/Ritusridutta/Cafe-Management-Portal.git
```

Install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

RESEND_API_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Start the server:

```bash
node server.js
```

## Live Demo

### Customer Portal

https://cafe-management-portal.onrender.com/

### Reception Portal

https://cafe-management-portal.onrender.com/receptionist/receptionist-login.html

### Kitchen Portal

https://cafe-management-portal.onrender.com/kitchen/cook-login.html

### Admin Portal

https://cafe-management-portal.onrender.com/admin/admin-login.html

## Order Workflow

→ Placed
→ Accepted
→ Preparing
→ Ready
→ Completed

## Project Structure

Cafe Website

backend/

* config
* controllers
* models
* routes
* uploads
* receipts
* utils

frontend/

* user
* receptionist
* kitchen
* admin

## Author

Ritusri Dutta
