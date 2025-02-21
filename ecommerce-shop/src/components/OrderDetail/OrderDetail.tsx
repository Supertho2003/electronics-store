import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import { useGetOrderByIdQuery } from "../../redux/order/order.service";
import SkeletonPost from "../../SkeletonPost";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const { data: order, error, isLoading } = useGetOrderByIdQuery(orderId);
  console.log(order);
  const formatCurrency = (amount: any) => {
    return amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };

  if (isLoading)
    return (
      <div>
        <SkeletonPost />
      </div>
    );
  return (
    <div>
      <Header />
      <motion.div
        className={`mt-[120px] h-[100%] px-4 xl:mx-[67px] 2xl:mx-[360px] 
         `}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <nav>
          <ol className="flex flex-wrap md:my-3 my-2">
            <li className="inline-flex items-center">
              <Link to={`/`} className="text-[#1250dc] font-[500]">
                Trang chủ
              </Link>
              <span className="ml-2 mr-1 text-sm font-medium text-[#1250dc]">
                /
              </span>
            </li>
            <li className="inline-flex items-center">
              <Link to={`/tai-khoan`} className="text-[#1250dc] font-[500]">
                Tài khoản
              </Link>
              <span className="ml-2 mr-1 text-sm font-medium text-[#1250dc]">
                /
              </span>
            </li>
            <li className="inline-flex items-center">
              <Link
                to={`/tai-khoan/tai-don-hang-cua-toi`}
                className="text-[#1250dc] font-[500]"
              >
                Đơn hàng của tôi
              </Link>
              <span className="ml-2 mr-1 text-sm font-medium text-[#1250dc]">
                /
              </span>
            </li>
            <li className="inline-flex items-center">
              <span className="text-[#090d14] font-[500]">
                Chi tiết đơn hàng
              </span>
            </li>
          </ol>
        </nav>
        <div className="gap-4 -mx-4 lg:grid lg:grid-cols-[820px_404px] lg:pt-5">
          <div className="flex flex-col gap-2 md:gap-6">
            <div>
              <div className="overflow-hidden bg-white md:rounded-xl">
                <div className="flex items-center justify-between px-4 py-3 lg:border-b lg:border-[#e5e7eb]">
                  <div className="flex flex-col  md:flex-row items-center gap-1 lg:gap-2">
                    <h6 className="font-semibold w-full md:w-auto text-sm leading-5">
                      {new Date(order.data.orderDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </h6>
                    <div className="flex justify-between items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-[#e5e7eb]"></span>
                      <span>
                        {order.deliveryMethod === "HOME_DELIVERY"
                          ? "Giao hàng tận nơi"
                          : "Nhận tại cửa hàng"}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-[#e5e7eb] "></span>
                      <span className="">
                        {order.data.orderItems?.length} sản phẩm
                      </span>
                    </div>
                  </div>
                  <p className="flex items-center gap-1.5 text-sm leading-5">
                    {order.data.orderStatus === "CANCELLED" ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-red-600"></span>
                        <span className="text-red-600">Đã hủy</span>
                      </>
                    ) : order.data.orderStatus === "DELIVERED" ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-green-600"></span>
                        <span className="text-green-600">Đã giao</span>
                      </>
                    ) : order.data.orderStatus === "SHIPPED" ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                        <span className="text-blue-600">Đang giao hàng</span>
                      </>
                    ) : order.data.orderStatus === "PROCESSING" ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-orange-600"></span>
                        <span className="text-orange-600">Chờ lấy hàng</span>
                      </>
                    ) : order.data.orderStatus === "RETURNED" ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-purple-600"></span>
                        <span className="text-purple-600">Đã trả hàng</span>
                      </>
                    ) : order.data.orderStatus === "PENDING" ? (
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
                        {order.data.address?.userName}
                      </h5>
                      <p className="text-[#6b7280]">
                        {order.data.address?.mobile}
                      </p>
                    </div>
                    <div className="sm:w-full lg:flex-1">
                      <div className="mb-3 flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 384 512"
                          width="24"
                          height="24"
                          fill="#DC2626"
                          className="h-5 w-5"
                        >
                          <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                        </svg>
                        <span>Nhận hàng tại</span>
                      </div>
                      <h5 className="font-[500] text-[14px] leading-6">
                        {order.data.address?.streetAddress},{" "}
                        {order.data.address?.ward},{" "}
                        {order.data.address?.district},{" "}
                        {order.data.address?.province}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white pb-4 mb-2 md:mb-0 md:rounded-xl">
              <div className="p-4 font-[500] text-[16px] leading-6 text-[#090d14]">
                Danh sách sản phẩm
              </div>
              <ul>
                {order.data.orderItems?.map((item: any) => (
                  <li key={item.id} className="px-4 py-3">
                    <div className="flex items-center  gap-2 xl:flex-row xl:gap-3">
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
                        <div className="flex w-full md:w-auto md:flex-row justify-end items-center gap-1 text-right">
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
          </div>
          <div>
            <div>
              <div className="bg-white p-4 pb-2 lg:rounded-t-xl">
                <h6 className="mb-4 font-[500] text-[16px] leading-6 text-[#090d14]">
                  Thông tin thanh toán
                </h6>
                <ul className="flex flex-col gap-2 text-[14px] leading-5 font-[400] text-[#6b7280]">
                  {order.data.note ? (
                    <li className="flex items-center justify-between">
                      <span>Ghi chú</span>
                      <span className="font-[500] text-[14px] leading-5 text-[#090d14]">
                        {order.data.note}
                      </span>
                    </li>
                  ) : null}
                  <li className="flex items-center justify-between">
                    <span>Tổng tiền</span>
                    <span className="font-[500] text-[14px] leading-5 text-[#090d14]">
                      {formatCurrency(order.data.subtotalAmount)}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Giảm giá voucher</span>
                    <span className="font-[500] text-[14px] leading-5 text-[#059669]">
                      -{formatCurrency(order.data.discountAmount)}
                    </span>
                  </li>
                </ul>
                <div className="mt-3 text-[#090d14] flex items-center justify-between border-t border-dashed pt-3 text-[14px] leading-6 font-[400]">
                  Thành tiền
                  <span className="text-[14px] font-[500] text-[#dc2626]">
                    {formatCurrency(order.data.totalAmount)}
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
                    {order.data.paymentMethod === "COD"
                      ? "Chưa thanh toán"
                      : "Đã thanh toán"}
                  </span>
                </div>

                {order.data.paymentMethod === "COD" && (
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

                {order.data.paymentMethod === "VNPAY" && (
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
      </motion.div>
      <Footer />
    </div>
  );
};

export default OrderDetail;
