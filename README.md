"# Splitwise - Expense Management Application

A backend focused expense management application built with Node.js, Express, and MySQL. Splitwise helps users track shared expenses and manage group finances efficiently.

Get the complete documentation here
[Documentation](https://docs.google.com/document/d/1pSwJunzJMqVKVqv1VmydpFUGrxdcBb-lrsd2HVeu6Vg/edit?tab=t.0)

Get the PostMan Documentation here
[PostMan Docs](https://docs.google.com/document/d/1Oj30NM4dZAQ_R6bSGNTxPHVNKKFIvoA2tSwfeYYtwz0/edit?tab=t.0)

## 🚀 Features

- **User Management**: Register, login, and manage user profiles
- **Expense Tracking**: Create, update, and delete expenses with multiple participants
- **Balance Calculation**: Track who owes whom and calculate balances between users
- **Optimized Settlements**: Get optimized payment suggestions to settle all debts
- **JWT Authentication**: Secure API endpoints with token-based authentication
- **MySQL Database**: Persistent data storage with Sequelize ORM

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Technologies Used](#technologies-used)

## Prerequisites

- Node.js
- MySQL
- npm or yarn package manager

## Installation

1. Clone or extract the project directory
2. Install dependencies:

```bash
npm install
```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=splitwise
JWT_SECRET=your_secret_key
```

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your .env file)

## Project Structure

```
splitwise/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── expense.controller.js
│   │   └── balance.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── expense.model.js
│   │   ├── expenseParticipant.model.js
│   │   └── index.js
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── expense.routes.js
│   │   └── balance.routes.js
│   ├── services/
│   │   ├── user.service.js
│   │   ├── expense.service.js
│   │   └── balance.service.js
│   └── utils/
│       └── helpers.js
├── server.js
├── package.json
└── README.md
```

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## User Endpoints

### 1. Register User

**Endpoint:** `POST /users/register`

**Authentication:** No

**Request Body:** User provides their desired username, email address, and password to create a new account.

**Response (Success - 201):** Server returns the newly created user's ID, username, email, and a success message confirming the account was registered.

**Response (Error - 400):** Server indicates the email is already registered or the input provided was invalid.

---

### 2. Login User

**Endpoint:** `POST /users/login`

**Authentication:** No

**Request Body:** User provides their email address and password to authenticate and gain access to their account.

**Response (Success - 200):** Server verifies the credentials and returns a JWT token for authentication, along with the user's basic information (ID, username, email).

**Response (Error - 401):** Server indicates the provided email or password is incorrect and authentication failed.

---

### 3. Get User Profile

**Endpoint:** `GET /users/profile`

**Authentication:** Required (Bearer Token)

**Response (Success - 200):** Server returns the authenticated user's profile information including ID, username, email, and account timestamps (when the account was created and last updated).

**Response (Error - 401):** Server indicates the provided authentication token is invalid, expired, or missing.

---

### 4. Update User Profile

**Endpoint:** `PUT /users/profile`

**Authentication:** Required (Bearer Token)

**Request Body:** User provides their new username, email, and password to update their profile information for security verification.

**Response (Success - 200):** Server confirms the profile was updated successfully and returns the user's new information.

---

### 5. Delete User Account

**Endpoint:** `DELETE /users/`

**Authentication:** Required (Bearer Token)

**Response (Success - 200):** Server permanently removes the user's account and all associated data from the system.

---

## Expense Endpoints

### 1. Create Expense

**Endpoint:** `POST /expenses/`

**Authentication:** Required (Bearer Token)

**Request Body:** User provides expense details including description, amount, category, date, and a list of participants with their individual shares to be split.

**Response (Success - 201):** Server creates the expense record and returns the expense ID, all details, participant information, and a confirmation message.

---

### 2. Get All Expenses

**Endpoint:** `GET /expenses/`

**Authentication:** Required (Bearer Token)

**Query Parameters:** User can optionally specify how many records to return and how many to skip for pagination.

**Response (Success - 200):** Server returns a list of all expenses the user is involved in, with complete details including participants and their shares, along with the total count.

---

### 3. Get Single Expense

**Endpoint:** `GET /expenses/:id`

**Authentication:** Required (Bearer Token)

**Parameters:** User provides the specific expense ID they want to view.

**Response (Success - 200):** Server returns complete details of the requested expense including all participants and their share amounts.

**Response (Error - 404):** Server indicates the requested expense ID doesn't exist in the system.

---

### 4. Update Expense

**Endpoint:** `PUT /expenses/:id`

**Authentication:** Required (Bearer Token)

**Parameters:** User provides the expense ID they want to modify.

**Request Body:** User provides updated expense details such as new description, amount, category, and modified participant shares.

**Response (Success - 200):** Server confirms the expense was updated successfully and returns the modified expense information.

---

### 5. Delete Expense

**Endpoint:** `DELETE /expenses/:id`

**Authentication:** Required (Bearer Token)

**Parameters:** User provides the expense ID they want to remove.

**Response (Success - 200):** Server permanently deletes the expense and confirms the deletion was successful.

---

## Balance Endpoints

### 1. Get Balances

**Endpoint:** `GET /balance/`

**Authentication:** Required (Bearer Token)

**Response (Success - 200):** Server returns a list showing the user's financial status with each other user, indicating whether they owe money (negative balance) or are owed money (positive balance) with the exact amounts.

---

### 2. Get Optimized Settlements

**Endpoint:** `GET /balance/optimized-settlements`

**Authentication:** Required (Bearer Token)

**Response (Success - 200):** Server analyzes all outstanding debts and returns the minimum number of transactions needed to settle everything, showing who should pay whom and the amounts involved.

---

## Authentication

The application uses JWT (JSON Web Tokens) for authentication.

## Technologies Used

**Express.js**
**MySQL**
**Sequelize**
**JWT**
**Bcrypt**
**Dotenv**
**Nodemon**

---

## Error Handling

The API returns standard HTTP status codes:

- `200` - OK (Success)
- `201` - Created (Resource created successfully)
- `400` - Bad Request (Invalid input)
- `401` - Unauthorized (Authentication failed)
- `403` - Forbidden (Not authorized for this action)
- `404` - Not Found (Resource doesn't exist)
- `500` - Internal Server Error

---

## Example Usage

**Register a User:** Submit a registration request with username, email, and password to create a new account. The server validates and stores the credentials securely.

**Login:** Submit login credentials with email and password to receive an authentication token that grants access to protected features.

**Create an Expense:** Submit expense details with description, amount, category, date, and participant information to record a shared expense in the system.

**Get All Expenses:** Request your complete expense history with optional pagination parameters to view expenses in batches.

**Get Balances:** Query your account balance to see how much you owe or are owed by each other user involved in shared expenses.

**Get Settlements:** Request an optimized settlement plan that shows the most efficient way to clear all outstanding debts with minimum transactions.

## Support

For issues or questions, please refer to the project structure and ensure all environment variables are properly configured.
