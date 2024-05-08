// app.js

const express = require("express");

const app = express();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const secretKey = 'some$secrectcode123#'; // Replace this with a strong and secure key

// Set up middleware to parse JSON data

app.use(express.json());

require("./db");

const User = require("./models/user");

//route for register user

app.post("/register", async (req, res) => {
  try {
    const { email, password } = await req.body;

    console.log(email, password);

    // Check if the user already exists

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists, jusr login" });
    }

    // Hash the password using bcrypt

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    // Create a new user in the database

    const newUser = new User({
      email,

      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

//login route 
// Route for user login

app.post('/login', async (req, res) => {

  try {

    const { email, password } = await req.body;

 

    // Check if the user exists in the database

    const user = await User.findOne({ email });
    console.log(user)

    if (!user) {

      return res.status(401).json({ error: 'Invalid credentials'});

    }

// Compare the provided password with the hashed password using bcrypt

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {

      return res.status(401).json({ error: 'Invalid credentials' });

    }

    // Generate a JWT for the authenticated user

    const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, {

      expiresIn: '1h', // Token will expire in 1 hour

    });
    console.log(jwt)

 

    return res.status(200).json({ token });

  } catch (err) {

    return res.status(500).json({ error: 'Internal server error' });

  }

});

//protected route

// Middleware to authenticate and authorize requests

const authenticateUser = (req, res, next) => {
  try {
    // Extract the token from the Authorization header

    const token = req.header("Authorization").split(" ")[1];
    console.log(token)

    // Verify the token using the secret key
    if (token) {
      let user = jwt.verify(token, secretKey);
      console.log(user)

      // Attach the user ID and email to the request object for further processing
      req.userId = user.userId;

      req.email = user.email;
    } else {
      res.status(401).json({ message: "Unauthorized User" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};


 

// Protected route example

app.get('/protected', authenticateUser, (req, res) => {

  return res.status(200).json({ message: 'You have access to this protected route' });

});


// Start the server

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port this is updated${port}`);
});
