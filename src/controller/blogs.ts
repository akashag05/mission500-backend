import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../database/dbConnection";
import CustomRequest from "../middleware/authentication";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

// This route is used to signup a new user into the database
export const addBlog = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    console.log("Add blog try !")
  } catch (error) {
    next(error);
  }
};
