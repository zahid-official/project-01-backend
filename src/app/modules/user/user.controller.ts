/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import User from "./user.model";
import statusCodes from "http-status-codes";

// Create new user
const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const result = await User.create({
      name,
      email,
    });

    res.status(statusCodes.CREATED).json({
      message: "User created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(statusCodes.BAD_REQUEST).json({
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
