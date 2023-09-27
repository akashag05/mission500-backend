import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../database/dbConnection";
import fs from "fs";
import CustomRequest from "../middleware/authentication";
export const addMember = (req: any, res: Response) => {
  try {
    console.log("req file -", req.file);
    console.log("req body -", req.body);
    const { memberName } = req.body;
    console.log(memberName)
    if (!req.file || !memberName) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        type: false,
        error: "Missing required file!",
      });
    } else {
      const fileName = req.file.filename;
      const filePath = `uploads/team/${fileName}`;
      const query = "INSERT INTO members (memberName, memberPhoto_path) VALUES (?)";
      const values = [memberName, filePath];
      db.getConnection(function (err, connection) {
        if (err) {
          return res.status(400).json({
            type: false,
            error: err,
            message: "Cannot establish the connection!",
          });
        } else {
          connection.query(query, [values], (err: any, data: any) => {
            if (err) {
              // console.log(err);
              return res.json({
                type: false,
                error: err,
                message: "Cannot add the new member!",
              });
            } else {
              return res.status(201).json({
                type: true,
                message: "New member has been added successfully!",
              });
            }
          });
        }
        connection.release();
      });
    }
  } catch (error) {
    return res.status(500).json({
      type: false,
      error: error,
      message: "Internal Server Error",
    });
  }
};
