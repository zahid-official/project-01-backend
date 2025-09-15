import { AccountStatus } from "../user/user.interface";
import User from "../user/user.model";

// Constants for date calculations
const today = new Date();

const lastWeek = new Date(today);
lastWeek.setDate(today.getDate() - 7);

const lastMonth = new Date(today);
lastMonth.setMonth(today.getMonth() - 1);

// User stats function
const getUserStats = async () => {
  // Get counts of users by various criteria
  const allUsersPromise = User.countDocuments();
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
    allUsers,
    activeUsers,
    inactiveUsers,
    blockedUsers,
    newUsersLastWeek,
    newUsersLastMonth,
    usersByRole,
  ] = await Promise.all([
    allUsersPromise,
    activeUsersPromise,
    inactiveUsersPromise,
    blockedUsersPromise,
    newUsersLastWeekPromise,
    newUsersLastMonthPromise,
    usersByRolePromise,
  ]);

  return {
    allUsers,
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
  return;
};

// Booking stats function
const getBookingStats = async () => {
  return;
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
