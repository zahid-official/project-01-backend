// Get all bookings
const getAllBookings = async () => {
  return {
    data: { data: 0 },
    meta: { meta: 0 },
  };
};

// Get user bookings
const getUserBookings = async () => {
  return {
    data: { data: 0 },
    meta: { meta: 0 },
  };
};

// Get single bookings
const getSingleBooking = async () => {
  return {};
};

// Create new booking
const createBooking = async () => {
  return {};
};

// Update booking
const updateBooking = async () => {
  return {};
};

// Delete booking
const deleteBooking = async () => {
  return {};
};

// Booking service object
const bookingService = {
  getAllBookings,
  getUserBookings,
  getSingleBooking,
  createBooking,
  updateBooking,
  deleteBooking,
};

export default bookingService;
