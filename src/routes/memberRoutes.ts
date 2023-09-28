// Importing all the dependencies here
import express from "express";
import { addMember, deleteMember, getMemberById, getMembers, updateMember } from "../controller/members.controller";
import upload from "../middleware/uploadFiles"

// Calling the router function
const router = express.Router();

// ALl the routes are defined below
// Main route to test the working of the login_logout route
router.post("/addMember", upload.single('memberPhoto'), addMember);

// This route is used to get the members details from the database
router.get("/getMembers", getMembers);

// This route is used to delete the member's details from the table
router.get("/deleteMember/:id", deleteMember);

// This route is used to update the member's details
router.put("/updateMember/:id", upload.single('memberPhoto'), updateMember);

// This route is used to get the members details from the database on  the basis of the member id
router.get("/getMember/:id", getMemberById);

// Exporting the router
export default router;
