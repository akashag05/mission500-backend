// Importing all the dependencies here
import express from "express";
import { addMember, getMembers } from "../controller/members.controller";
import upload from "../middleware/uploadFiles"

// Calling the router function
const router = express.Router();

// ALl the routes are defined below
// Main route to test the working of the login_logout route
router.post("/addMember", upload.single('pdfFile'), addMember);

// This route is used to get the members details from the database
router.get("/getMembers", getMembers);

// Exporting the router
export default router;
