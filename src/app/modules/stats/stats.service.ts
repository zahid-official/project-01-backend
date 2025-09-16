import Tour from "../tour/tour.model";
import User from "../user/user.model";
import { AccountStatus } from "../user/user.interface";
import Booking from "../booking/booking.model";

// Constants for date calculations
const today = new Date();

const lastWeek = new Date(today);
lastWeek.setDate(today.getDate() - 7);

const lastMonth = new Date(today);
lastMonth.setMonth(today.getMonth() - 1);

// User stats function
const getUserStats = async () => {
  // Get counts of users by various criteria
  const totalUsersPromise = User.countDocuments();
  const activeUsersPromise = User.countDocuments({
    accountStatus: AccountStatus.ACTIVE,
  });
  const inactiveUsersPromise = User.countDocuments({
    accountStatus: AccountStatus.INACTIVE,
  });
  const blockedUsersPromise = User.countDocuments({
    accountStatus: AccountStatus.BLOCKED,
  });

  // Get counts of new users in the last week and month
  const newUsersLastWeekPromise = User.countDocuments({
    createdAt: { $gte: lastWeek },
  });
  const newUsersLastMonthPromise = User.countDocuments({
    createdAt: { $gte: lastMonth },
  });

  // Get counts of users by role
  const usersByRolePromise = User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
  ]);

  // Await all promises
  const [
    totalUsers,
    activeUsers,
    inactiveUsers,
    blockedUsers,
    newUsersLastWeek,
    newUsersLastMonth,
    usersByRole,
  ] = await Promise.all([
    totalUsersPromise,
    activeUsersPromise,
    inactiveUsersPromise,
    blockedUsersPromise,
    newUsersLastWeekPromise,
    newUsersLastMonthPromise,
    usersByRolePromise,
  ]);

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    blockedUsers,
    newUsersLastWeek,
    newUsersLastMonth,
    usersByRole,
  };
};

// Tour stats function
const getTourStats = async () => {
  const totalToursPromise = Tour.countDocuments();
  const toursByTourTypePromise = Tour.aggregate([
    // stage - 1: Join with tourType collection
    {
      $lookup: {
        from: "tourTypeCollection",
        localField: "tourTypeId",
        foreignField: "_id",
        as: "tourType",
      },
    },

    // stage - 2: Unwind the joined array
    { $unwind: "$tourType" },

    // stage - 3: Group by tour type name and count
    { $group: { _id: "$tourType.name", count: { $sum: 1 } } },
  ]);

  const toursByDivisionPromise = Tour.aggregate([
    // stage - 1: Join with division collection
    {
      $lookup: {
        from: "divisionCollection",
        localField: "divisionId",
        foreignField: "_id",
        as: "division",
      },
    },

    // stage - 2: Unwind the joined array
    { $unwind: "$division" },

    // stage - 3: Group by division name and count
    { $group: { _id: "$division.name", count: { $sum: 1 } } },
  ]);

  const averageTourCostPromise = Tour.aggregate([
    // stage - 1: Group all documents to calculate average cost
    { $group: { _id: null, averageCost: { $avg: "$cost" } } },
  ]);
  // Await all promises
  const [totalTours, toursByTourType, toursByDivision, averageTourCost] =
    await Promise.all([
      totalToursPromise,
      toursByTourTypePromise,
      toursByDivisionPromise,
      averageTourCostPromise,
    ]);

  return {
    totalTours,
    toursByTourType,
    toursByDivision,
    averageTourCost,
  };
};

// Booking stats function
const getBookingStats = async () => {
  const totalBookingsPromise = Booking.countDocuments();
  const topBookedToursPromise = Booking.aggregate([
    // stage - 1: Group by tour name and count
    { $group: { _id: "$tourId", count: { $sum: 1 } } },

    // stage - 2: Sort by count in descending order
    { $sort: { count: -1 } },

    // stage - 3: Limit to top 5
    { $limit: 5 },

    // stage - 4: Join with tour collection to get tour details
    {
      $lookup: {
        from: "tourCollection",
        let: { tourId: "$_id" },
        pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$tourId"] } } }],
        as: "tour",
      },
    },

    // stage - 5: Unwind the joined array
    { $unwind: "$tour" },

    // stage - 6: Project the desired fields
    { $project: { count: 1, "tour.title": 1, "tour.slug": 1 } },
  ]);

  const bookingByStatusPromise = Booking.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const avgGuestPerBookingPromise = Booking.aggregate([
    { $group: { _id: null, avgGuests: { $avg: "$guests" } } },
  ]);

  const lastWeekBookingsPromise = Booking.countDocuments({
    createdAt: { $gte: lastWeek },
  });

  const lastMonthBookingsPromise = Booking.countDocuments({
    createdAt: { $gte: lastMonth },
  });

  const bookingByUniqueUsersPromise = Booking.distinct("userId").then(
    (user) => user.length
  );

  const [
    totalBookings,
    topBookedTours,
    bookingByStatus,
    avgGuestPerBooking,
    lastWeekBookings,
    lastMonthBookings,
    bookingByUniqueUsers,
  ] = await Promise.all([
    totalBookingsPromise,
    topBookedToursPromise,
    bookingByStatusPromise,
    avgGuestPerBookingPromise,
    lastWeekBookingsPromise,
    lastMonthBookingsPromise,
    bookingByUniqueUsersPromise,
  ]);

  return {
    totalBookings,
    topBookedTours,
    bookingByStatus,
    lastWeekBookings,
    lastMonthBookings,
    avgGuestPerBooking: avgGuestPerBooking[0]?.avgGuests,
    bookingByUniqueUsers,
  };
};

// Payment stats function
const getPaymentStats = async () => {
  return;
};

// Stat service object
const statsService = {
  getUserStats,
  getTourStats,
  getBookingStats,
  getPaymentStats,
};

export default statsService;
