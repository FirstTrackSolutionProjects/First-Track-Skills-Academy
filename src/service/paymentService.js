import axiosPaymentInstance from "../axiosInstance/axiosPaymentInstance";

/**
 * Initiates a payment order for a course
 * @param {{ course_id: number, partner_code?: string }} payload
 */
export const createPaymentOrder = async (payload) => {
  const response = await axiosPaymentInstance.post("/create-order", payload);
  return response.data.data;
};

/**
 * Verifies Razorpay payment signature and activates enrollment
 * @param {{
 *   razorpay_order_id: string,
 *   razorpay_payment_id: string,
 *   razorpay_signature: string,
 *   batch_timing?: string,
 *   payment_method?: string
 * }} payload
 */
export const verifyPayment = async (payload) => {
  const response = await axiosPaymentInstance.post("/verify", payload);
  return response.data.data;
};

/**
 * Retrieves the logged-in student's payment transactions
 */
export const getMyPayments = async () => {
  const response = await axiosPaymentInstance.get("/my-payments");
  return response.data.data;
};

/**
 * Retrieves all transactions for Admin / Superadmin
 */
export const getAllPayments = async () => {
  const response = await axiosPaymentInstance.get("/all");
  return response.data.data;
};
