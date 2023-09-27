import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../database/dbConnection";
import fs from "fs";
import path from "path";
import CustomRequest from "../middleware/authentication";

// This is the route to add the member and the path to his photo in the database
export const addMember = (req: Request, res: Response, next: NextFunction) => {
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
      const filePath = `uploads/members/${fileName}`;
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
    next(error)
  }
};


// This route is used to get all the members name, id and photo
export const getMembers = (req: any, res: Response, next: NextFunction) => {
  try {
    const query = "SELECT id, memberName, memberPhoto_path FROM members";
    db.getConnection(function (err, connection) {
      if (err) {
        return res.status(400).json({
          type: false,
          error: err,
          message: "Cannot establish the connection!",
        });
      } else {
        connection.query(query, (err: any, data: any) => {
          if (err) {
            // console.log(err);
            return res.json({
              type: false,
              error: err,
              message: "Cannot get the members details!",
            });
          } else {
            const membersData = data.map((member: any) => {
              const photoBuffer = fs.readFileSync(member.memberPhoto_path);
              const photoBase64 = photoBuffer.toString("base64");

              return {
                id: member.id,
                memberName: member.memberName,
                memberPhoto_path: `data:image/png;base64,${photoBase64}`,
              };
            });
            res.json(membersData);
          }
        })
      }
      connection.release();
    })
  } catch (error) {
    next(error)
  }
}