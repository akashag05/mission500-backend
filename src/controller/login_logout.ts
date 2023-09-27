import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken';
import { db } from '../database/dbConnection';
import CustomRequest from '../middleware/authentication';
import bcrypt from "bcrypt";

// Defining all the controller routes here
export const LoginMainRoute = (req: CustomRequest, res: Response, next: NextFunction) => {
    res.status(200).json({ message: 'Main route for login logout routes running fine!' });
};

// This route is used to signup a new user into the database
export const signup = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { user_id, user_name, user_email, user_password } = req.body;
        if (!user_id || !user_name || !user_email || !user_password) {
            res.status(401).json({
                type: false,
                error: "Missing required fields!"
            })
        } else {
            const query = "SELECT user_email FROM users WHERE user_email = ?";
            db.getConnection(function (error, connection) {
                if (error) {
                    return res.status(400).json({
                        type: false,
                        error: error,
                        message: "Cannot establish the connection!"
                    });
                } else {
                    connection.query(query, [user_email], async (error: any, data: any) => {
                        if (error) {
                            return res.status(400).json({
                                type: false,
                                error: error,
                            })
                        }
                        if (data.length) {
                            return res.status(409).json({
                                type: false,
                                message: "User already exist!"
                            })
                        } else {
                            const hashedPassword = await bcrypt.hash(user_password, 10);
                            const query = "INSERT INTO users (user_id, user_name, user_email, user_password) VALUES (?)";
                            const values = [user_id, user_name, user_email, hashedPassword];

                            connection.query(query, [values], async (error: any, data: any) => {
                                if (error) {
                                    return res.status(400).json({
                                        type: false,
                                        error: error,
                                    })
                                } else {
                                    const userId = data.insertId;
                                    return res.json({
                                        type: true,
                                        message: `New user added successfully with user id ${userId}!`
                                    })
                                }
                            })
                        }
                    })
                }
                connection.release();
            })
        }
    } catch (error) {
        next(error)
    }
};