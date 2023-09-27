// Importing all the dependencies here
import express from "express";
import { addBlog } from "../controller/blogs";

// Calling the router function
const router = express.Router();

// ALl the routes are defined below
// Main route to test the working of the login_logout route
router.post("/", addBlog);

// This route is used to signup a new user into the database
// router.post("/signup", authentication, signup);

// Exporting the router
export default router;
