# Events Application Backend Server

## Overview
This is the backend server for the Events Application, providing APIs to manage user authentication, event creation, and notification handling. Built with Node.js and Express, it connects to a MongoDB database and integrates with the Novu notification service to send event-related notifications.

---

## Features

- **Authentication**
  - User registration and login.
  - JSON Web Token (JWT) for secure authentication.

- **Event Management**
  - CRUD operations for events.
  - Filtering and searching for events.

- **Notifications**
  - Integration with Novu for sending real-time notifications.

- **Cross-Origin Support**
  - CORS is enabled to allow communication from frontend clients.

---

## Tech Stack

- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Notifications**: Novu API
- **Environment Variables**: Dotenv

---

## Prerequisites

1. **Node.js**: Ensure Node.js is installed on your system.
2. **MongoDB**: Install and configure MongoDB.
3. **Novu Account**: Set up a Novu account for notification services.
4. **Environment Variables**:
   - Create a `.env` file in the root directory with the following keys:
     ```env
     PORT=8080
     DATABASE_URL=mongodb://localhost:27017/mydatabase
     NOVU_KEY=<your_novu_api_key>
     JWT_SECRET=<your_jwt_secret>
     ```

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. The server will run on `http://localhost:8080` (or the port specified in your `.env` file).

---

## API Endpoints

### **Authentication Routes** (`/api/auth`)
- **POST** `/register` - Register a new user.
- **POST** `/login` - Authenticate a user.

### **Event Routes** (`/api/event`)
- **POST** `/` - Create a new event.
- **GET** `/` - Fetch all events.
- **GET** `/:id` - Fetch event details by ID.
- **PUT** `/:id` - Update an event by ID.
- **DELETE** `/:id` - Delete an event by ID.

---

## Notification Handling

The backend integrates with Novu to send notifications. Ensure you have:

1. Configured the Novu API key in the `.env` file.
2. Registered subscribers in Novu matching the `subscriberId` used in API calls.

Example of sending a notification:
```javascript
const { Novu } = require('@novu/node');
const novu = new Novu(process.env.NOVU_KEY);

await novu.trigger('event-notification', {
  to: {
    subscriberId: 'your-subscriber-id',
  },
  payload: {
    subject: 'New Event Created',
    body: 'An exciting new event has been added!',
  },
});
```

---

## File Structure

```
project-root/
├── models/
│   ├── mongooseConnect.js   # MongoDB connection setup
│   └── userModel.js         # User schema
├── routes/
│   ├── authRouter.js        # Authentication routes
│   └── eventRouter.js       # Event routes
├── .env                     # Environment variables
├── server.js                # Main server entry point
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

---

## Known Issues

- Ensure environment variables are loaded properly.
- Verify subscriber IDs exist in Novu before sending notifications.

---

## Contributions

Feel free to fork the repository and submit pull requests. All contributions are welcome!

---

## License

This project is licensed under the [MIT License](LICENSE).

