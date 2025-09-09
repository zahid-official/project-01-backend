// Generates a unique transaction ID
const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

export default getTransactionId;
