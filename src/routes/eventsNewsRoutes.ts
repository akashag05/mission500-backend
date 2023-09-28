// Importing all the dependencies here
import express from "express";
import { addEventNews, deleteEventNews, getAllEventsNews, getEventsNewsById } from "../controller/enentsNewsController";
import eventsUpload from "../middleware/eventsUploadFile";

// Calling the router function
const router = express.Router();

// ALl the routes are defined below
// This is the route to get all the events and news
router.get("/getAllEventsNews", getAllEventsNews);

// This is the route to add the new event or news and the path to its image in the database
router.post("/addEventNews", eventsUpload.single("memberPhoto"), addEventNews);

// This route is used to delete the events's details from the table
router.delete("/deleteEvent/:id", deleteEventNews);

// This route is used to get the members details from the database on  the basis of the member id
router.get("/getEventsNewsById/:id", getEventsNewsById)

// Exporting the router
export default router;
