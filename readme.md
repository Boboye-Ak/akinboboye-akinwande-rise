# Akinboboye Akinwande's submission for Tobmas Group Coding Assessment. A RESTful API with Node.js, MongoDB, and JWT Authentication

This repository contains a RESTful API built using Node.js(Typescript), Postgres for data storage, and Passport local-strategy as well as express sessions for authentication to access protected user information and files. 

## Tasks attempted
- Users can create an account with:
- email address
- password
- full name
- Users can upload files up to 200mb
- Users can download uploaded files
- Users can create folders to hold files
- An admin user type for managing the content uploaded
- Admins can mark pictures and videos as unsafe
- Unsafe files automatically get deleted(If two or more admins flag a file, it receives the flag mark and is automatically deleted)
- Revokable session management
- Multiple admin reviews before file is deleted (2 admin reviews are needed)


## Features

- User authentication using passport
- Secure password storage with hashing
- Password validation using a regex function(Only allows strong passwords. Password must contain letters, numbers, symbols and at least 8 characters long with at least one capital letter)
- Postgres as the database backend
- Cloudinary as file storage
- Multer as file upload handling middleware
- Admin users with admin privileges
- Express.js for routing and middleware
- Error handling and validation
- Environmental configuration using `.env` file
- API documentation using Swagger
- API documentation using Postman

## Prerequisites

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- Postgres

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Boboye-Ak/akinboboye-akinwande-rise-assessment/
   cd akinboboye-akinwande-rise-assessment
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

Create a `.env` file in the project root and add the following variables:

```plaintext
PORT=5000
DB_PORT=5432
DB_USER="username"
DB_PASS="password"
DB_NAME="db_name"
USER_SESSION_SECRET="user-session-secret"
CLOUDINARY_CLOUD_NAME="cloudinary-cloud-name"
CLOUDINARY_API_KEY="cloudinary-api-key"
CLOUDINARY_API_SECRET="cloudinary-api-secret"
   ```
Create a `.env.test` file in the project root and add the following variables(the environment variables that will be used to run tests):

```plaintext
DB_PORT=5432
DB_USER="username"
DB_PASS="password"
DB_NAME="db_name"
 ```

4. **Start the server:**

   ```bash
   npm start
   ```

   ```bash
   npm run dev #for development mode
   ```

   ```bash
   npm run swagger-autogen #to update the documentation if you make changes
   ```

    ```bash
   npm run test #to run mocha tests. To be able to use tests you need to have Postgres running locally on your PC on port 5432
   ```

5. **Access the API:**

   The API should be accessible at `http://localhost:5000` if running on your local device.
   It is also live remotely at ``.

## API Endpoints

- **GET /test**: Test the api
- **POST /auth/signup**: Register a new user
- **POST /api/login**: Authenticate and generate JWT token
- **GET /api/dashboard**: Get user dashboard data (protected route)
- **GET /doc/**: Get api swagger documentation

See swagger documentation at ``

## Authentication

This API uses express-sessions and passport local-strategy. When you send a valid username and password to the login endpoint, a user session is created and you can access protected data. You can end the session by calling the logout endpoint. This revokes the session.

## Error Handling

Error handling is implemented for various scenarios, including validation errors, authentication errors, and server errors with appropriate status codes and informative messages.

## Postman Collection

The postman collection for this project is available at [Postman Collection](https://www.postman.com/planetary-rocket-306155/workspace/public-workspace/collection/18499196-cb1ae28c-2ac2-4d92-bd98-6c232dc0f18f?action=share&creator=18499196&active-environment=18499196-94083831-2784-437f-bc2e-30266dd6e512) in the collection `Akinboboye-Akinwande-rise-assessment`

## Appreciation

I greatly appreciate this opportunity and look forward to hearing from you.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
