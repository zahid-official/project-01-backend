/* eslint-disable @typescript-eslint/no-explicit-any */
import envVars from "../../config/env";
import AppError from "../../errors/AppError";
import Payment from "../payment/payment.model";
import { ISSLCommerz } from "./sslCommerz.interface";
import axios from "axios";
import httpStatus from "http-status-codes";

// SSLCommerz service initialization
const sslCommerz = async (payload: ISSLCommerz) => {
  try {
    // Payment data
    const data = {
      store_id: envVars.SSL.STORE_ID,
      store_passwd: envVars.SSL.STORE_PASSWORD,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,

      success_url: `${envVars.SSL.SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
      fail_url: `${envVars.SSL.FAILED_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=failed`,
      cancel_url: `${envVars.SSL.CANCELED_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=canceled`,
      ipn_url: `${envVars.SSL.IPN_URL}`,

      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.address,
      cus_city: "Dhaka",
      cus_postcode: 1230,
      cus_country: "Bangladesh",
      cus_phone: payload.phone,

      shipping_method: "N/A",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_area: "N/A",
      ship_city: "N/A",
      ship_sub_city: "N/A",
      ship_postcode: "N/A",
      ship_country: "N/A",

      product_name: "Tour Booking",
      product_category: "Service",
      product_profile: "General",
    };

    // Make payment request to SSLCommerz
    const response = await axios.post(envVars.SSL.PAYMENT_API, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Return the response data
    return response.data;
  } catch (error: any) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      error.message || "Failed to initiate SSLCommerz payment"
    );
  }
};

// Validate sslCommerz payment
const validatePayment = async (payload: any) => {
  try {
    const response = await axios.get(
      `${envVars.SSL.VALIDATION_API}?val_id=${payload.val_id}&store_id=${envVars.SSL.STORE_ID}&store_passwd=${envVars.SSL.STORE_PASSWORD}`
    );

    // Update payment record with the response data
    await Payment.updateOne(
      { transactionId: payload.tran_id },
      {
        paymentGateway: response.data,
      },
      { runValidators: true }
    );
  } catch (error: any) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      error.message || "Failed to validate SSLCommerz payment"
    );
  }
};

const SSLService = { sslCommerz, validatePayment };
export default SSLService;
