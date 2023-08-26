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
- An admin user type for managing the content uploaded(Users with the "isAdmin" column as `true` and are admins. They can access other users' files and mark files as unsafe).
- Admins can mark pictures and videos as unsafe.
- Unsafe files automatically get deleted(If two or more admins flag a file, it receives the flag mark and is automatically deleted from the storage.)
- Revokable session management(Sessions are revoked when the logout endpoint is called and user has to login again. Sessions are stored in the database instead of on the server so restarting the server doesn't invalidate user sessions on already logged in clients.)
- Multiple admin reviews before file is deleted (2 admin need to mark a file as unsafe(flag) before it is automatically deleted.)
- File History: Records of deleted files remain on the database and information about them can be seen if you set the showDeletedFiles query parameter in the get files endpoint to a non-zero integer(eg 1). You can also see deleted file data by calling the file id to the get file data endpoint.


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
- Typescript
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
DB_URL="db-url"
USER_SESSION_SECRET="user-session-secret"
CLOUDINARY_CLOUD_NAME="dc55ir792"
CLOUDINARY_API_KEY="cloudinary-api-key"
CLOUDINARY_API_SECRET="cloudinary-api-secret"
CLOUDINARY_FOLDER_NAME="cloudinary-folder-name"
 ```
Create a `.env.test` file in the project root and add the following variables(the environment variables that will be used to run tests):

```plaintext
DB_URL="db-url"
CLOUDINARY_FOLDER_NAME="cloudinary-folder-name"
 ```

4. **Start the server:**

   ```bash
   npm start
   ```

   ```bash
   npm run dev #for development mode
   ```


    ```bash
   npm run test #to run mocha tests. To be able to use tests you need to have Postgres running locally on your PC on port 5432
   ```

5. **Access the API:**

   The API should be accessible at `http://localhost:5000` if running on your local device.
   It is also live remotely at ``.

## API Endpoints

- **GET /test**: Test the api to see if it's online
- **POST /auth/signup**: Register and login a new user
- **POST /auth/login**: Authenticate and get user session
- **GET /auth/myuser**: Get user data of logged in user(protected route)
- **POST /auth/logout**: Revoke current session and logout.

- **GET /files**: Get file list(protected route)
- **GET /files/file/:id**: Get file list(protected route)
- **GET /files/folders**: Get user folder list(proteced route)
- **POST /files/folders**: Create new folder(protected route)
- **POST /files/upload**: Upload new file(protected route)
- **GET /files/download/:id**: download file(protected route)
- **GET /files/stream/:id**: stream audio/video file(protected route)
- **DELETE /files/delete/:id**: Delete file from storage(protected route)
- **PUT /files/flag/:id**: flag a file as unsafe(protected route and requires admin privileges)



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
