import React, { useState } from "react";
import {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "../../../redux/order/order.service";
import SkeletonPost from "../../../SkeletonPost";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { cancelEdit, startEdit } from "../../../redux/id.slice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  RETURNED = "RETURNED",
  CANCELLED = "CANCELLED",
}

const statusTranslations = {
  PENDING: "Chờ xác nhận",
  PROCESSING: "Chờ lấy hàng",
  SHIPPED: "Chờ giao hàng",
  DELIVERED: "Đã giao",
  RETURNED: "Đã trả hàng",
  CANCELLED: "Đã hủy",
};

const Order = () => {
  const { data, error, isLoading } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [isModalOpen, setIsModalOpen] = useState(false); // State để quản lý việc hiển thị modal
  const dispatch = useDispatch();
  const orderId = useSelector((state: RootState) => state.id.id);
  const { data: orderDetails, isLoading: isLoadingOrderDetails } =
    useGetOrderByIdQuery(orderId, {
      skip: !orderId,
    });

  const formatCurrency = (amount: any) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };

  if (isLoading) {
    return (
      <div>
        <SkeletonPost />
      </div>
    );
  }

  const handleShow = (id: number) => {
    dispatch(startEdit(id));
    setIsModalOpen(true);
  };

  const orders = data?.data || [];
  const orderDetail = orderDetails?.data || [];
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const response = await updateOrderStatus({ orderId, newStatus }).unwrap();
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.data.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    dispatch(cancelEdit(0));
  };

  return (
    <motion.div
      className="mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-[18px] text-black md:text-xl bg-white p-4 rounded-md font-[500] mb-4">
        Danh sách đơn hàng
      </h2>
      <div className="mt-4 bg-white w-[360px] md:w-full ">
        <div className="mx-auto px-6 py-4 border border-3 rounded-lg">
          <div className="max-h-96 overflow-y-auto">
            <table className="border-collapse w-full table-auto mb-4 border-b border-[#dee2e6] text-[#212529] hover:bg-[#f8f9fa] hover:text-[#212529]">
              <thead className="table-header-group table-light text-black bg-[#f8f9fa] hover:bg-[#e5e6e7] hover:text-black active:bg-[#dfe0e1] active:text-black">
                <tr>
                  <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                    Order#
                  </th>
                  <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                    Ngày đặt
                  </th>
                  <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                    Người dùng
                  </th>
                  <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                    Địa chỉ
                  </th>
                  <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                    Trạng thái
                  </th>
                  <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                    Tổng thanh toán
                  </th>
                  <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order: any) => (
                    <tr key={order.id}>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        {order.id}
                      </td>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        {order.address.userName}
                      </td>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">{`${order.address.streetAddress}, ${order.address.ward}, ${order.address.district}, ${order.address.province}`}</td>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className={`rounded-lg p-2 ${
                            order.orderStatus === "CANCELLED"
                              ? "bg-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-300 transition-all duration-300 ease-in-out"
                              : order.orderStatus === "DELIVERED"
                              ? "bg-green-600 text-white focus:outline-none focus:ring-2 focus:ring-green-300 transition-all duration-300 ease-in-out"
                              : order.orderStatus === "SHIPPED"
                              ? "bg-blue-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 ease-in-out"
                              : order.orderStatus === "PROCESSING"
                              ? "bg-orange-600 text-white focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-300 ease-in-out"
                              : order.orderStatus === "RETURNED"
                              ? "bg-purple-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300 ease-in-out"
                              : order.orderStatus === "PENDING"
                              ? "bg-yellow-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-300 ease-in-out"
                              : "bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ease-in-out"
                          }`}
                        >
                          {Object.values(OrderStatus).map((status) => (
                            <option
                              key={status}
                              value={status}
                              className="text-[8px] md:text-[14px]"
                              style={{
                                backgroundColor: "white",
                                color: "black",
                              }}
                            >
                              {statusTranslations[status]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        <div className="flex items-center gap-2">
                          <div>
                            <button
                              onClick={() => {
                                handleShow(order.id);
                              }}
                              className="hover:text-blue-600 cursor-pointer text-[18px] w-[34px] h-[34px] flex justify-center border border-[#eeecec] items-center bg-[#f1f1f1] rounded-md"
                            >
                              <i className="bx bx-show"></i>
                            </button>
                          </div>
                          <div>
                            <button className="hover:text-red-600 cursor-pointer text-[18px] w-[34px] h-[34px] flex justify-center border border-[#eeecec] items-center bg-[#f1f1f1 ">
                              <i className="bx bxs-trash"></i>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center border-b border-[#dee2e6] bg-[#f8f9fa] p-2"
                    >
                      Không có đơn hàng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && orderDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="bg-[#f7f7ff] p-4 left-[130px] rounded shadow-lg relative w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              <i className="bx bx-x text-xl"></i>
            </button>
            <h2 className="text-[22px] text-orange-600 font-[500] text-center uppercase py-2 ">
              Thông tin chi tiết đơn hàng
            </h2>
            <div className="overflow-hidden bg-white md:rounded-xl">
              <div className="flex items-center justify-between px-4 py-3 lg:border-b lg:border-[#e5e7eb]">
                <div className="flex items-center gap-1 lg:gap-2">
                  <h6 className="font-semibold text-sm leading-5">
                    {new Date(orderDetail.orderDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </h6>
                  <span className="h-1 w-1 rounded-full bg-[#e5e7eb]"></span>
                  <span>
                    {orderDetail.deliveryMethod === "HOME_DELIVERY"
                      ? "Giao hàng tận nơi"
                      : "Nhận tại cửa hàng"}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-[#e5e7eb] "></span>
                  <span className="">
                    {orderDetail.orderItems?.length} sản phẩm
                  </span>
                </div>
                <p className="flex items-center gap-1.5 text-sm leading-5">
                  {orderDetail.orderStatus === "CANCELLED" ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-red-600"></span>
                      <span className="text-red-600">Đã hủy</span>
                    </>
                  ) : orderDetail.orderStatus === "DELIVERED" ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-green-600"></span>
                      <span className="text-green-600">Đã giao</span>
                    </>
                  ) : orderDetail.orderStatus === "SHIPPED" ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                      <span className="text-blue-600">Đang giao hàng</span>
                    </>
                  ) : orderDetail.orderStatus === "PROCESSING" ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-orange-600"></span>
                      <span className="text-orange-600">Chờ lấy hàng</span>
                    </>
                  ) : orderDetail.orderStatus === "RETURNED" ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-purple-600"></span>
                      <span className="text-purple-600">Đã trả hàng</span>
                    </>
                  ) : orderDetail.orderStatus === "PENDING" ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-yellow-600"></span>
                      <span className="text-yellow-600">Chờ xác nhận</span>
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-gray-600"></span>
                      <span className="text-gray-600">Không xác định</span>
                    </>
                  )}
                </p>
              </div>
              <div className="flex flex-col gap-3 p-4">
                <div className="flex gap-3 text-[14px] leading-5 font-[500] text-[#090d14]">
                  <div className="sm:w-full lg:flex-1">
                    <div className="mb-3 flex items-center gap-1">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="#DC2626"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                      >
                        <path
                          d="M17.7545 13.9999C18.9966 13.9999 20.0034 15.0068 20.0034 16.2488V17.1673C20.0034 17.7406 19.8242 18.2997 19.4908 18.7662C17.9449 20.9294 15.4206 22.0011 12.0004 22.0011C8.5794 22.0011 6.05643 20.9289 4.51427 18.7646C4.18231 18.2987 4.00391 17.7409 4.00391 17.1688V16.2488C4.00391 15.0068 5.01076 13.9999 6.25278 13.9999H17.7545ZM12.0004 2.00464C14.7618 2.00464 17.0004 4.24321 17.0004 7.00464C17.0004 9.76606 14.7618 12.0046 12.0004 12.0046C9.23894 12.0046 7.00036 9.76606 7.00036 7.00464C7.00036 4.24321 9.23894 2.00464 12.0004 2.00464Z"
                          fill="inherit"
                        ></path>
                      </svg>
                      <span>Thông tin người nhận</span>
                    </div>
                    <h5 className="font-[500] text-[14px] leading-6">
                      {orderDetail.address.userName}
                    </h5>
                    <p className="text-[#6b7280]">
                      {orderDetail.address.mobile}
                    </p>
                  </div>
                  <div className="sm:w-full lg:flex-1">
                    <div className="mb-3 flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 384 512"
                        width="24"
                        height="24"
                        fill="#DC2626" // Màu sắc của biểu tượng
                        className="h-5 w-5" // Kích thước
                      >
                        <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                      </svg>
                      <span>Nhận hàng tại</span>
                    </div>
                    <h5 className="font-[500] text-[14px] leading-6">
                      {`${orderDetail.address.streetAddress}, ${orderDetails.data.address.ward}, ${orderDetails.data.address.district}, ${orderDetails.data.address.province}`}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white pb-4 sm:mb-2 lg:rounded-xl">
              <div className="p-4 font-[500] text-[16px] leading-6 text-[#090d14]">
                Danh sách sản phẩm
              </div>
              <ul>
                {orderDetail.orderItems?.map((item: any) => (
                  <li key={item.id} className="px-4 py-3">
                    <div className="flex flex-col gap-2 xl:flex-row xl:gap-3">
                      <div className="flex h-14 w-14 min-w-14 cursor-pointer rounded border p-1.5 xl:h-16 xl:w-16 xl:min-w-16">
                        <img
                          alt={item.product.name}
                          loading="lazy"
                          width={50}
                          height={50}
                          decoding="async"
                          data-nimg="1"
                          className="object-contain"
                          src={item.product.imageUrl}
                          style={{ color: "transparent" }}
                        />
                      </div>
                      <div className="flex flex-col items-center justify-between w-full lg:flex-row lg:w-[calc(100%-76px)]">
                        <div className="relative flex flex-col justify-center truncate xl:w-2/3 xl:flex-1 xl:gap-1">
                          <h6 className="cursor-pointer truncate text-[#090d14] text-xs font-medium leading-[18px] xl:text-sm xl:leading-6">
                            <span className="truncate">
                              {item.product.name}
                            </span>
                          </h6>
                          <span className="text-[#6b7280] text-xs font-[400] leading-[18px] xl:text-sm xl:leading-6">
                            Số lượng: {item.quantity}
                          </span>
                        </div>
                        <div className="flex sm:flex-col flex-row sm:justify-end sm:items-center gap-1 text-right">
                          <h6 className="text-[#090d14] text-xs font-medium leading-[18px] xl:text-sm xl:leading-6 sm:order-2">
                            {formatCurrency(item.price)}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div>
                <div className="bg-white p-4 pb-2 lg:rounded-t-xl">
                  <h6 className="mb-4 font-[500] text-[16px] leading-6 text-[#090d14]">
                    Thông tin thanh toán
                  </h6>
                  <ul className="flex flex-col gap-2 text-[14px] leading-5 font-[400] text-[#6b7280]">
                    {orderDetail.note ? (
                      <li className="flex items-center justify-between">
                        <span>Ghi chú</span>
                        <span className="font-[500] text-[14px] leading-5 text-[#090d14]">
                          {orderDetail.note}
                        </span>
                      </li>
                    ) : null}
                    <li className="flex items-center justify-between">
                      <span>Tổng tiền</span>
                      <span className="font-[500] text-[14px] leading-5 text-[#090d14]">
                        {formatCurrency(orderDetail.subtotalAmount)}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Giảm giá voucher</span>
                      <span className="font-[500] text-[14px] leading-5 text-[#059669]">
                        -{formatCurrency(orderDetail.discountAmount)}
                      </span>
                    </li>
                  </ul>
                  <div className="mt-3 text-[#090d14] flex items-center justify-between border-t border-dashed pt-3 text-[14px] leading-6 font-[400]">
                    Thành tiền
                    <span className="text-[14px] font-[500] text-[#dc2626]">
                      {formatCurrency(orderDetail.totalAmount)}
                    </span>
                  </div>
                  <div className="mt-3 text-[#090d14] flex items-center justify-between border-t border-dashed pt-3 text-[14px] leading-6 font-[400]">
                    Phương thức thanh toán
                    <span className="text-[14px] leading-5 text-yellow-600 flex gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 text-yellow-500"
                      >
                        <path
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6h6v-2h-4z"
                          fill="currentColor"
                        />
                      </svg>
                      {orderDetail.paymentMethod === "COD"
                        ? "Chưa thanh toán"
                        : "Đã thanh toán"}
                    </span>
                  </div>

                  {orderDetail.paymentMethod === "COD" && (
                    <div className="flex items-center gap-2 py-3">
                      <div>
                        <img
                          width={30}
                          height={30}
                          src="https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/cod.png?w=96&q=100"
                          alt="COD Icon"
                        />
                      </div>
                      <div>
                        <span className="text-[14px] text-[#090d14]">
                          COD - Thanh toán khi nhận hàng
                        </span>
                      </div>
                    </div>
                  )}

                  {orderDetail.paymentMethod === "VNPAY" && (
                    <div className="flex items-center gap-2 py-3">
                      <div>
                        <img
                          width={30}
                          height={30}
                          src="https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/vnpay.png?w=96&q=100"
                          alt="VNPAY Icon"
                        />
                      </div>
                      <div>
                        <span className="text-[14px] text-[#090d14]">
                          VNPAY - Thanh toán qua thẻ ATM nội địa
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Order;
