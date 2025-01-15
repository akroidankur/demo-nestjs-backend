# Full-Stack Project

## Technologies Used:
- **Frontend**: Angular, TypeScript, Signal, LocalStorage, Light/Dark Theme
- **Backend**: NestJS, MongoDB, Express, bcrypt, JWT, Mongoose, Validator
- **Database**: MongoDB

---

## Frontend (Angular)

The frontend of this application is developed using **Angular**. It includes the following functionalities:

1. **Login Page and User Authentication**: 
   - The login page provides user authentication, ensuring secure access to the application.

2. **Staff Table**: 
   - This table fetches and displays data from the API, providing an overview of all staff members.

3. **Staff Creation Form**: 
   - A form that allows the creation of new staff members. This form is fully integrated with the backend API for data persistence.

4. **Signal & LocalStorage**: 
   - **Signal** and **LocalStorage** are used for maintaining data and ensuring smooth user experience even after page reloads.

5. **Light/Dark Theme**: 
   - Aesthetic themes for the user interface have been implemented, providing a choice between a light and dark mode for better user experience.

### Features:
- **Signal**: 
   - Used to maintain real-time updates without page reloads.

- **LocalStorage**: 
   - Ensures that data persists even after the user closes the browser.

- **Responsive Design**: 
   - The UI adjusts gracefully across different screen sizes.

---

## Backend (NestJS)

The backend is built with **NestJS**, which provides a structured, scalable architecture for managing the application’s APIs and logic. The following features and modules have been implemented:

1. **User Authentication**: 
   - Implemented **JWT-based authentication** for secure access to the system.
   - **bcrypt** is used to securely hash user passwords before storing them in the database.

2. **Role-based Access Control**: 
   - Created **global middleware (auth)** to handle authentication and authorization.
   - Added **local middleware (permissions)** to check user permissions for specific actions.
   - Defined three core modules: **Roles**, **Staffs (User Management)**, and **Customers**.

3. **MongoDB Integration**: 
   - Used **Mongoose** for MongoDB integration, ensuring smooth data interactions with the database.
   - The database stores user data, roles, permissions, and customer information.

4. **Validation**: 
   - Implemented **Express validation** for request data to ensure that the incoming data is accurate and valid before being processed.

5. **Security**: 
   - Used **bcrypt** for hashing user passwords and **JWT (JSON Web Token)** for creating secure authentication tokens.

6. **Mongoose**: 
   - Utilized **Mongoose** for schema management, providing a structured approach to storing data.

### Why NestJS Over Plain ExpressJS?

NestJS offers several advantages over plain **ExpressJS**:
- **Modular Architecture**: 
   - NestJS's modular approach makes it easy to scale the project by separating concerns into modules, such as roles, users, and permissions.

- **TypeScript Support**: 
   - NestJS is built with **TypeScript**, which offers type safety, improved autocompletion, and better maintainability compared to plain JavaScript in Express.

- **Decorator-based Syntax**: 
   - NestJS leverages decorators, which provide a more declarative and readable way of defining routes, middleware, and services, improving code clarity and reducing boilerplate.

- **Built-in Features**: 
   - NestJS comes with **built-in features** such as **dependency injection**, **validation pipes**, and **guards** that would require third-party libraries in ExpressJS, improving productivity and code maintainability.

---

## How to Run the Project:

### Frontend (Angular):
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd frontend
