# Face Recognition Attendance System

This project is a full-stack web application designed to automate school attendance using facial recognition technology. It leverages the MERN stack—**MongoDB**, **Express.js**, **React.js**, and **Node.js**—alongside [face-api.js](https://justadudewhohacks.github.io/face-api.js/docs/index.html) for real-time face detection and recognition.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Features

- **User Authentication:** Secure login for administrators and students.
- **Face Enrollment:** Register student faces for recognition.
- **Automated Attendance:** Detect and recognize faces to mark attendance.
- **Attendance Reports:** Generate and view attendance records.

## Technologies Used

- **Frontend:**
  - React.js
  - Vite (for build tooling)
  - face-api.js
- **Backend:**
  - Node.js
  - Express.js
  - MongoDB

## Getting Started

### Prerequisites

- Node.js (version 14.x or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Melvins-Simon/face_recognition_attendance_system_MERN.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd face_recognition_attendance_system_MERN
   ```

3. **Install dependencies:**

   - **Backend:**
     ```bash
     cd server
     npm install
     ```
   - **Frontend:**
     ```bash
     cd ../client
     npm install
     ```

### Running the Application

1. **Start the backend server:**

   ```bash
   cd server
   npm run server
   ```

   The backend server will run on `http://localhost:5000`.

2. **Start the frontend development server:**

   ```bash
   cd ../client
   npm run dev
   ```

   The frontend will be accessible at `http://localhost:5173`.

## Project Structure

```
face_recognition_attendance_system_MERN/
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
|
└── client/
    ├── public/
    └── src/
        ├── components/
        ├── pages/
        ├── assets/
        ├── contexts/
        ├── hooks/
        ├── layouts/
        ├── utils/
        ├── styles/
        ├── index.css
        ├── App.jsx
        └── main.jsx
```

- **server/**: Contains the Express.js server, routes, controllers, models, and middleware.
- **client/**: Contains the React application source code.

## API Endpoints

- **`POST /api/auth/signup`**: Register a new user.
- **`POST /api/auth/signin`**: Authenticate a user and return a JWT.
- **`POST /api/auth/forgot-password`**: sends forgot password token to user.
- **`POST /api/auth/reset-password`**: sends link for reseting password.
- **`POST /api/auth/signout`**: Logs out user.
- **`POST /api/students/enroll`**: Enroll a student's face data.
- **`POST /api/attendance/mark`**: Mark attendance for a recognized face.
- **`GET /api/attendance`**: Retrieve attendance records.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.

## Acknowledgements

- [face-api.js](https://justadudewhohacks.github.io/face-api.js/docs/index.html) for providing the face detection and recognition functionality.
