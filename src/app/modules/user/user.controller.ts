/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import User from "./user.model";
import httpStatus from "http-status-codes";

// Create new user
const createUser = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    // const { name, email } = req.body;
    // const result = await User.create({
    //   name,
    //   email,
    // });

    // res.status(httpStatus.CREATED).json({
    //   message: "User created successfully",
    //   data: result,
    // });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: error.message ?? "Something went wrong!!",
      error: error,
    });
  }
};

// User controller object
const userController = {
  createUser,
};

export default userController;
