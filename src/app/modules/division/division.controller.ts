/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import divisionService from "./division.service";
import sendResponse from "../../utils/sendResponse";

// Create new division
const createDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await divisionService.createDivision(req?.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Division created successfully",
      data: result,
    });
  }
);

// Division controller object
const divisionController = {
  createDivision,
};

export default divisionController;
