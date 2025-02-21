import React from "react";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalItemsSoldQuery,
} from "../../../redux/order/order.service";
import { useCountUsersQuery } from "../../../redux/user/user.service";
import { motion } from "framer-motion";
import SkeletonPost from "../../../SkeletonPost";

const Dashboard = () => {
  const formatCurrency = (amount: any) => {
    return amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };
  const { data: totalOrdersData, isLoading: loadingOrders } =
    useGetTotalOrdersQuery();
  const { data: totalUsersData } = useCountUsersQuery();
  const { data: totalSalesData, isLoading: loadingSales } =
    useGetTotalSalesQuery();
  const { data: totalItemsSoldData, isLoading: loadingItemsSold } =
    useGetTotalItemsSoldQuery();

  if (loadingOrders || loadingSales || loadingItemsSold) {
    return (
      <div>
        <SkeletonPost />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 py-6 md:px-4 md:py-4">
        <div className="grid md:grid-cols-4 gap-2 ">
          <div className="flex mb-4 md:mb-0 px-2 py-4 md:py-2 gap-3 bg-orange-600 rounded-lg text-white items-center justify-center">
            <i className="bx bx-cart text-2xl"></i>
            <span className="ml-2 font-medium">
              Số đơn đặt hàng: <br /> {totalOrdersData?.data}
            </span>
          </div>

          <div className="flex mb-4 md:mb-0 px-2 py-4 md:py-2 gap-3 bg-green-600 rounded-md text-white items-center justify-center">
            <i className="bx bx-user text-2xl"></i>
            <span className="ml-2 font-medium">
              Số khách hàng: <br /> {totalUsersData?.data}
            </span>
          </div>

          <div className="flex mb-4 md:mb-0 px-2 py-4 md:py-2 gap-3 bg-pink-600 rounded-md text-white items-center justify-center">
            <i className="bx bx-money text-2xl"></i>
            <span className="ml-2 font-medium">
              Tổng doanh thu: <br /> {formatCurrency(totalSalesData?.data)}
            </span>
          </div>

          <div className="flex px-2 py-4 md:py-2 gap-3 bg-orange-400 rounded-md text-white items-center justify-center">
            <i className="bx bx-stats text-2xl"></i>
            <span className="ml-3 font-medium">
              Số lượng bán: <br /> {totalItemsSoldData?.data}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
