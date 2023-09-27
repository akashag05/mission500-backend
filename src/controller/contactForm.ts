import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../database/dbConnection";
import CustomRequest from "../middleware/authentication";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";


// This route is used to signup a new user into the database
export const contactForm = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, phoneNumber, message } = req.body;
    if (!name || !email || !phoneNumber || !message) {
      return res.status(401).json({
        type: false,
        error: "Missing required fields!",
      });
    } else {
        const transporter = nodemailer.createTransport({
            service: "gmail", // e.g., Gmail, Yahoo, etc.
            host: 'smtp.gmail.com',
            auth: {
              user: "akash.agarwal@revdau.com",
              pass: "qwerty1234@@55",
            },
          });

          const mailOptions = {
            from: "akash.agarwal@revdau.com",
            to: "karmanshu.swami@revdau.com", // Replace with the recipient's email
            subject: "New Form Submission",
            text: `
                        Name: ${name}
                        Email: ${email}
                        Phone: ${phoneNumber}
                        Message: ${message}
                      `,
          };

          transporter.sendMail(
            mailOptions,
            function (error: any, info: any) {
              if (error) {
                throw new Error()
              } else {
                db.getConnection(function (error, connection) {
                    if (error) {
                      return res.status(400).json({
                        type: false,
                        error: error,
                        message: "Cannot establish the connection!",
                      });
                    } else {
                      const insertQuery = `INSERT INTO form_submissions (name, email, phoneNumber, message) VALUES (?, ?, ?, ?)`;
                      const values = [name, email, phoneNumber, message];
                      connection.query(
                        insertQuery,
                        values,
                        async (error: any, data: any) => {
                          if (error) {
                            return res.status(400).json({
                              type: false,
                              error: error,
                            });
                          } else {
                            return res.json({
                                type: true,
                                message: `'Email sent: ' + ${info.response}!`,
                              });
                          }
                        })
                        connection.release();
                    }
                })
              }
            }
          );
    }
  } catch (error) {
    next(error);
  }
};
