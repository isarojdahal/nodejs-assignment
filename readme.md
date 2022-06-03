install dependencies in both frontend and backend folder :
npm install

create a .env file inside backend folder and insert these things

DB_NAME=bookstore
DB_USERNAME=root
DB_PASSWORD= _
DB_HOST=localhost
JWT_SECRETE = _
PORT=8000
GOOGLE_CLIENT_ID = _
GOOGLE_CLIENT_SECRET = _
SESSION_SECRETE_KEY = \*

note:all of these must be given in .env file

Then start backend server inside backend folder: npm start
And start frontend server inside frontend folder: npm start

Thats all , Check your browser url : "http://localhost:3000/"
