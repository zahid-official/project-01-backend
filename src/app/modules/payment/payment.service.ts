// Successful payment handler
const successPayment = async () => {
  return {};
};

// Failed payment handler
const failedPayment = async () => {
  return {};
};

// Canceld payment handler
const canceledPayment = async () => {
  return {};
};

// Payment service object
const paymentService = {
  successPayment,
  failedPayment,
  canceledPayment,
};

export default paymentService;
