// Importing all the dependencies here
import express from "express";
import { addBlog } from "../controller/blogs";

// Calling the router function
const router = express.Router();

// ALl the routes are defined below
// Main route to test the working of the blog route
router.post("/", addBlog);

// Exporting the router
export default router;
