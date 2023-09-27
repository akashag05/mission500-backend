// Importing all the dependencies here
import express, { Request, Response } from "express";

// Calling the router function
const router = express.Router();

// ALl the routes are defined below
// Main route to test the working of the login_logout route
router.get('/', (req: Request, res: Response) => {
    res.status(200).json("Main route for rbac routes running fine!")
})

// Exporting the router
export default router;