import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db } from "../database/dbConnection";
import fs from "fs";
import path from "path";
import CustomRequest from "../middleware/authentication";

// This is the route to add the member and the path to his photo in the database
export const addMember = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { memberName } = req.body;
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
            res.status(200).json(membersData);
          }
        })
      }
      connection.release();
    })
  } catch (error) {
    next(error)
  }
}

// This route is used to delete the member's details from the table
export const deleteMember = (req: any, res: Response, next: NextFunction) => {
  try {
    db.getConnection(function (err, connection) {
      if (err) {
        return res.status(400).json({
          type: false,
          error: err,
          message: "Cannot establish the connection!",
        });
      } else {
        const id = req.params.id;
        const query = "DELETE FROM members WHERE id=?";
        connection.query(query, id, (err: any, data: any) => {
          if (err) {
            return res.status(400).json({
              type: false,
              error: err,
              message: "Cannot establish the connection!",
            });
          } else {
            return res.status(200).json({
              type: true,
              message: `Successfully deleted member with id ${id}`,
            });
          }
        });
      }
      connection.release();
    });
  } catch (error) {
    next(error)
  }
};

// This route is used to update the member's details
export const updateMember = (req: any, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { memberName } = req.body;
    if (!req.file) {
      const query = "UPDATE members SET memberName=? WHERE id=?";
      db.getConnection(function (err, connection) {
        if (err) {
          return res.status(400).json({
            type: false,
            error: err,
            message: "Cannot establish the connection!",
          });
        } else {
          connection.query(query, [memberName, id], (err: any, data: any) => {
            if (err) {
              return res.json({
                type: false,
                error: err,
                message: "Cannot update the member!",
              });
            } else {
              return res.status(200).json({
                type: true,
                message: "Member has been updated successfully!",
              });
            }
          });
        }
        connection.release();
      });
    } else {
      const fileName = req.file.filename;
      const filePath = `uploads/members/${fileName}`;
      const query = "UPDATE members SET memberName=?, memberPhoto_path=? WHERE id=?";
      db.getConnection(function (err, connection) {
        if (err) {
          return res.status(400).json({
            type: false,
            error: err,
            message: "Cannot establish the connection!",
          });
        } else {
          connection.query(query, [memberName, filePath, id], (err: any, data: any) => {
            if (err) {
              return res.json({
                type: false,
                error: err,
                message: "Cannot update the member!",
              });
            } else {
              return res.status(200).json({
                type: true,
                message: "Member has been updated successfully!",
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

// This route is used to get the members details from the database on  the basis of the member id
export const getMemberById = (req: any, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const query = "SELECT id, memberName, memberPhoto_path FROM members WHERE id=?";
    db.getConnection(function (err, connection) {
      if (err) {
        return res.status(400).json({
          type: false,
          error: err,
          message: "Cannot establish the connection!",
        });
      } else {
        connection.query(query, [id], (err: any, data: any) => {
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
            res.status(200).json(membersData);
          }
        });
      }
      connection.release();
    });
  } catch (error) {
    next(error)
  }
};