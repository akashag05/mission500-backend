// Importing all the dependencies here
import express from "express";
import { addMember } from "../controller/members.controller";
import upload from "../middleware/uploadFiles"

// Calling the router function
const router = express.Router();

// ALl the routes are defined below
// Main route to test the working of the login_logout route
router.post("/addMember", upload.single('pdfFile'), addMember);

// This route is used to signup a new user into the database
// router.post("/signup", authentication, signup);

// Exporting the router
export default router;
