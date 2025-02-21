import React, { useEffect, useState } from "react";
import Footer from "../Footer";
import { Link } from "react-router-dom";
import Header from "../Header";
import { useGetUserOrdersByStatusQuery } from "../../redux/order/order.service";
import { OrderDto } from "../../redux/order/order.type";
import SkeletonPost from "../../SkeletonPost";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/auth.slice";
import { useGetUserByIdQuery } from "../../redux/user/user.service";
import { motion } from "framer-motion";
import { useLogoutUserMutation } from "../../redux/auth/auth.service";
import { toast } from "react-toastify";

const Order = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { data: user } = useGetUserByIdQuery();
  const [loading, setLoading] = useState(true);
  const formatCurrency = (amount: any) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };
  const [logoutUser] = useLogoutUserMutation();

  const orderStatuses = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "RETURNED",
    "CANCELLED",
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const {
    data: orders,
    error,
    isLoading,
  } = useGetUserOrdersByStatusQuery(orderStatuses[activeTab]);

   const handleLogout = async () => {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          await logoutUser(refreshToken).unwrap();
          dispatch(logout());
        } catch (error: any) {
          toast.error("Có lỗi xảy ra");
        }
      }
    };

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
          <ol className="flex flex-wrap md:my-3 my-2 px-4">
            <li className="inline-flex items-center">
              <a className="text-[#1250dc] font-[500]" href="/">
                Trang chủ
              </a>
              <span className="ml-2 mr-1 text-sm font-medium text-[#1250dc]">
                /
              </span>
            </li>
            <li className="inline-flex items-center">
              <span className="text-[#090d14] font-[500]">
                Đơn hàng của tôi
              </span>
            </li>
          </ol>
        </nav>
        <div className="xl:mt-6 xl:flex xl:gap-5">
          <div className="flex flex-col gap-3 xl:w-[295px]">
            <div className="flex flex-col gap-3 rounded-2 p-3 mx-4 mb-1 px-0 xl:mx-0 sm:mb-0 xl:px-4 bg-white">
              <div className="flex items-center gap-2 ">
                <div className="overflow-hidden rounded-full">
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-flex h-11 w-11 select-none items-center justify-center overflow-hidden rounded-[100%] bg-[color:var(--black-a3)] align-middle"
                  >
                    <rect width="44" height="44" rx="22" fill="#FECAB5"></rect>
                    <path
                      d="M22.0086 10C23.3144 10 24.5909 10.3871 25.6767 11.1123C26.7624 11.8375 27.6087 12.8683 28.1084 14.0743C28.6081 15.2803 28.7389 16.6073 28.4841 17.8876C28.2294 19.1679 27.6006 20.3439 26.6772 21.2669C25.7538 22.1899 24.5774 22.8185 23.2967 23.0732C22.0159 23.3278 20.6884 23.1971 19.482 22.6976C18.2756 22.1981 17.2444 21.3521 16.519 20.2668C15.7935 19.1814 15.4063 17.9054 15.4062 16.6C15.4115 14.8512 16.1088 13.1755 17.3458 11.9389C18.5829 10.7023 20.2592 10.0052 22.0086 10Z"
                      fill="#F37021"
                    ></path>
                    <path
                      opacity="0.95"
                      d="M22.0049 39.6009C17.4561 39.5967 13.0859 37.8304 9.8125 34.6729C10.7861 32.2356 12.4672 30.1453 14.6394 28.6713C16.8117 27.1973 19.3756 26.4071 22.001 26.4024C24.6264 26.3976 27.1931 27.1786 29.3707 28.6448C31.5482 30.1109 33.2369 32.1951 34.2192 34.6289C30.9533 37.8169 26.5696 39.6013 22.0049 39.6009Z"
                      fill="#13001E"
                    ></path>
                    <path
                      opacity="0.3"
                      d="M33 22.9318C33.9545 22.8636 35.7273 21.7727 36 20C36 21.4318 37.7727 22.7955 39 22.9318C38 23.1364 36 24.6909 36 26C36 24.3636 33.8182 23.1364 33 22.9318Z"
                      fill="#F37021"
                    ></path>
                    <path
                      opacity="0.3"
                      d="M6 21.4432C6.79545 21.3864 8.27273 20.4773 8.5 19C8.5 20.1932 9.97727 21.3295 11 21.4432C10.1667 21.6136 8.5 22.9091 8.5 24C8.5 22.6364 6.68182 21.6136 6 21.4432Z"
                      fill="#F37021"
                    ></path>
                    <path
                      opacity="0.3"
                      d="M29 6.95455C29.6364 6.90909 30.8182 6.18182 31 5C31 5.95455 32.1818 6.86364 33 6.95455C32.3333 7.09091 31 8.12727 31 9C31 7.90909 29.5455 7.09091 29 6.95455Z"
                      fill="#F37021"
                    ></path>
                  </svg>
                </div>
                <div className="flex grow flex-col gap-1">
                  <h6 className="text-[16px] leading-6 text-[#090d14]">
                    {user?.data.username}
                  </h6>
                  <p className="flex items-center justify-between">
                    <span className="text-[14px] leading-6 font-[400] text-[#6b7280]">
                      {user?.data.email}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-md mt-2 rounded-md">
              <ul>
                <li className="relative group">
                  <Link
                    to={`/tai-khoan`}
                    className="relative block py-2.5 pl-6 pr-2 transition-all duration-400 ease-in-out hover:bg-gradient-to-r hover:from-red-100"
                  >
                    <div className="flex gap-2 items-center transition-all duration-400 ease-in-out group-hover:translate-x-1 group-hover:text-[#dc2626]">
                      <i className="bx bx-user text-[22px]"></i>
                      Thông tin cá nhân
                    </div>
                  </Link>
                  <div className="absolute left-0 top-0 h-full w-1 bg-red-500 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
                </li>
                <li className="relative group">
                  <Link
                    to={`/tai-khoan/tai-don-hang-cua-toi`}
                    className="relative block py-2.5 pl-6 pr-2 transition-all duration-400 ease-in-out bg-gradient-to-r from-red-100 hover:bg-gradient-to-r hover:from-red-100"
                  >
                    <div className="flex gap-2 items-center transition-all duration-400 ease-in-out text-[#dc2626] group-hover:translate-x-1 group-hover:text-[#dc2626]">
                      <i className="bx bx-package text-[22px]"></i>
                      Đơn hàng của tôi
                    </div>
                  </Link>
                  <div className="absolute left-0 top-0 h-full w-1 bg-red-500 transition-opacity duration-400 group-hover:opacity-100 opacity-100"></div>
                </li>
                <li className="relative group">
                  <Link
                    to={`/tai-khoan/quan-ly-so-dia-chi`}
                    className="relative block py-2.5 pl-6 pr-2 transition-all duration-400 ease-in-out hover:bg-gradient-to-r hover:from-red-100"
                  >
                    <div className="flex gap-2 items-center transition-all duration-400 ease-in-out group-hover:translate-x-1 group-hover:text-[#dc2626]">
                      <i className="bx bx-map text-[22px]"></i>
                      Sổ địa chỉ nhận hàng
                    </div>
                  </Link>
                  <div className="absolute left-0 top-0 h-full w-1 bg-red-500 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
                </li>
                <li className="relative group">
                  <button
                       onClick={handleLogout}
                    className="relative block py-2.5 pl-6 pr-2 transition-all duration-400 ease-in-out hover:bg-gradient-to-r hover:from-red-100"
                  >
                    <div className="flex gap-2 items-center transition-all duration-400 ease-in-out group-hover:translate-x-1 group-hover:text-[#dc2626]">
                      <i className="bx bx-exit text-[22px]"></i>
                      Đăng xuất
                    </div>
                  </button>
                  <div className="absolute left-0 top-0 h-full w-1 bg-red-500 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex-1">
            <div>
              <div className="py-4 md:mb-4">
                <h3 className="font-[500] text-[24px] leading-8 text-[#090d14]">
                  Đơn hàng của tôi
                </h3>
              </div>

              <nav className="bg-white mb-2 rounded-t-md border-b border-[#e5e7eb]">
                <ul className="container flex w-auto px-0 font-[500] text-[14px] leading-6 text-[#6b7280] overflow-x-auto ">
                  <li
                    className={`${
                      activeTab === 0
                        ? "font-[500] border-b-[#dc2626] text-[#dc2626] text-[14px] leading-6"
                        : "font-[400]"
                    } border-b-2 p-3 cursor-pointer min-w-[144px] text-center hover:font-[500] duration-300 hover:border-b-[#dc2626] hover:text-[#dc2626] hover:text-[14px] hover:leading-6`}
                    onClick={() => setActiveTab(0)}
                  >
                    Chờ xác nhận
                  </li>

                  <li
                    className={`${
                      activeTab === 1
                        ? "font-[500] border-b-[#dc2626] text-[#dc2626] text-[14px] leading-6"
                        : "font-[400]"
                    } border-b-2 p-3 cursor-pointer min-w-[144px] text-center hover:font-[500] duration-300 hover:border-b-[#dc2626] hover:text-[#dc2626] hover:text-[14px] hover:leading-6`}
                    onClick={() => setActiveTab(1)}
                  >
                    Chờ lấy hàng
                  </li>
                  <li
                    className={`${
                      activeTab === 2
                        ? "font-[500] border-b-[#dc2626] text-[#dc2626] text-[14px] leading-6"
                        : "font-[400]"
                    } border-b-2 p-3 cursor-pointer min-w-[144px] text-center hover:font-[500] duration-300 hover:border-b-[#dc2626] hover:text-[#dc2626] hover:text-[14px] hover:leading-6`}
                    onClick={() => setActiveTab(2)}
                  >
                    Chờ giao hàng
                  </li>
                  <li
                    className={`${
                      activeTab === 3
                        ? "font-[500] border-b-[#dc2626] text-[#dc2626] text-[14px] leading-6"
                        : "font-[400]"
                    } border-b-2 p-3 cursor-pointer min-w-[144px] text-center hover:font-[500] duration-300 hover:border-b-[#dc2626] hover:text-[#dc2626] hover:text-[14px] hover:leading-6`}
                    onClick={() => setActiveTab(3)}
                  >
                    Đã giao
                  </li>
                  <li
                    className={`${
                      activeTab === 4
                        ? "font-[500] border-b-[#dc2626] text-[#dc2626] text-[14px] leading-6"
                        : "font-[400]"
                    } border-b-2 p-3 cursor-pointer min-w-[144px] text-center hover:font-[500] duration-300 hover:border-b-[#dc2626] hover:text-[#dc2626] hover:text-[14px] hover:leading-6`}
                    onClick={() => setActiveTab(4)}
                  >
                    Trả hàng
                  </li>
                  <li
                    className={`${
                      activeTab === 5
                        ? "font-[500] border-b-[#dc2626] text-[#dc2626] text-[14px] leading-6"
                        : "font-[400]"
                    } border-b-2 p-3 cursor-pointer min-w-[144px] text-center hover:font-[500] duration-300 hover:border-b-[#dc2626] hover:text-[#dc2626] hover:text-[14px] hover:leading-6`}
                    onClick={() => setActiveTab(5)}
                  >
                    Đã huỷ
                  </li>
                </ul>
              </nav>
              <div className="min-h-full">
                {isLoading && <SkeletonPost />}

                {orders && orders.data && orders.data.length === 0 && (
                  <div className="flex w-full flex-col items-center gap-4 py-6 xl:mt-4 xl:gap-5 xl:py-5">
                    <div className="flex flex-col items-center">
                      <div className="relative h-[168px] w-[300px] md:h-[168px] md:w-[300px]">
                        <img
                          sizes="100w"
                          className="inset-0 h-full w-full text-transparent"
                          src="https://fptshop.com.vn/img/empty_state.png?w=640&q=100"
                          alt="Giỏ hàng trống"
                        />
                      </div>
                      <h6 className="mb-2 font-[500] text-[#090d14]">
                        Bạn chưa có đơn hàng nào
                      </h6>
                      <p className="text-center font-[400] text-[14px] leading-6">
                        Cùng khám phá hàng ngàn sản phẩm tại Rocker nhé!
                      </p>
                    </div>
                  </div>
                )}

                {orders && orders.data && orders.data.length > 0 && (
                  <ul className="flex w-full flex-col gap-2 xl:gap-3">
                    {orders.data.map((order: any) => {
                      // Tính tổng số lượng sản phẩm trong đơn hàng
                      const uniqueProductsCount = order.orderItems.length;
                      return (
                        <li key={order.id}>
                          <div className="rounded-md bg-white">
                            <div className="flex items-center justify-between px-4 py-3 xl:border-b xl:border-[#e5e7eb]">
                              <div className="flex flex-col md:flex-row items-center gap-1 xl:gap-2">
                                <h6 className="font-semibold justify-start w-full md:w-auto text-sm leading-5">
                                  {new Date(order.orderDate).toLocaleDateString(
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
                                    {uniqueProductsCount} sản phẩm
                                  </span>
                                </div>
                              </div>
                              <p className="flex items-center gap-1.5 text-sm leading-5">
                                {order.orderStatus === "CANCELLED" ? (
                                  <>
                                    <span className="h-2 w-2 rounded-full bg-red-600"></span>
                                    <span className="text-red-600">Đã hủy</span>
                                  </>
                                ) : order.orderStatus === "DELIVERED" ? (
                                  <>
                                    <span className="h-2 w-2 rounded-full bg-green-600"></span>
                                    <span className="text-green-600">
                                      Đã giao
                                    </span>
                                  </>
                                ) : order.orderStatus === "SHIPPED" ? (
                                  <>
                                    <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                                    <span className="text-blue-600">
                                      Đang giao hàng
                                    </span>
                                  </>
                                ) : order.orderStatus === "PROCESSING" ? (
                                  <>
                                    <span className="h-2 w-2 rounded-full bg-orange-600"></span>
                                    <span className="text-orange-600">
                                      Chờ lấy hàng
                                    </span>
                                  </>
                                ) : order.orderStatus === "RETURNED" ? (
                                  <>
                                    <span className="h-2 w-2 rounded-full bg-purple-600"></span>
                                    <span className="text-purple-600">
                                      Đã trả hàng
                                    </span>
                                  </>
                                ) : order.orderStatus === "PENDING" ? (
                                  <>
                                    <span className="h-2 w-2 rounded-full bg-yellow-600"></span>
                                    <span className="text-yellow-600">
                                      Chờ xác nhận
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="h-2 w-2 rounded-full bg-gray-600"></span>
                                    <span className="text-gray-600">
                                      Không xác định
                                    </span>
                                  </>
                                )}
                              </p>
                            </div>
                            <ul>
                              {order.orderItems.map((item: any) => (
                                <li key={item.id} className="px-4 py-3">
                                  <div className="flex gap-2 items-center xl:gap-3">
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
                                    <div className="flex flex-col items-center justify-between w-full xl:flex-row xl:w-[calc(100%-76px)]">
                                      <div className="relative flex flex-col justify-center xl:w-2/3 xl:flex-1 xl:gap-1">
                                        <h6 className="cursor-pointer  text-[#090d14] text-xs font-medium leading-[18px] xl:text-sm xl:leading-6">
                                          <span className="">
                                            {item.product.name}
                                          </span>
                                        </h6>
                                        <span className="text-[#090d14] text-xs font-medium leading-[18px] xl:text-sm xl:leading-6">
                                          Số lượng: {item.quantity}
                                        </span>
                                      </div>
                                      <div className="flex w-full md:flex-row justify-end items-center gap-1 text-right">
                                        <h6 className="text-[#090d14] text-xs font-medium leading-[18px] xl:text-sm xl:leading-6 sm:order-2">
                                          {formatCurrency(item.price)}
                                        </h6>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            <div className="flex items-center justify-between px-4 pb-3">
                              <Link
                                to={`/tai-khoan/tai-don-hang-cua-toi/${order.id}`}
                                className="text-[#1250dc] text-sm font-medium leading-5 flex items-center"
                              >
                                <span className="">Xem chi tiết</span>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 -rotate-90"
                                >
                                  <path
                                    d="M3.20041 5.73966C3.48226 5.43613 3.95681 5.41856 4.26034 5.70041L8 9.22652L11.7397 5.70041C12.0432 5.41856 12.5177 5.43613 12.7996 5.73966C13.0815 6.0432 13.0639 6.51775 12.7603 6.7996L8.51034 10.7996C8.22258 11.0668 7.77743 11.0668 7.48967 10.7996L3.23966 6.7996C2.93613 6.51775 2.91856 6.0432 3.20041 5.73966Z"
                                    fill="#1250DC"
                                  ></path>
                                </svg>
                              </Link>
                              <div className="flex flex-col">
                                <div>
                                  <span className="mr-2 text-[14px] leading-5 text-[#6b7280]">
                                    Tổng số tiền:
                                  </span>
                                  <span className="text-sm font-medium text-[#dc2626]">
                                    {formatCurrency(order.totalAmount)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between gap-1 border-t px-4 py-3 border-[#e5e7eb]">
                              <span className="flex-1 sm:text-[14px] sm:leading-5 sm:font-[400] text-[12px] leading-[18px] text-[#6b7280]">
                                Bạn cần hỗ trợ? Liên hệ ngay với chúng tôi.
                              </span>
                              <div className="flex items-center gap-2">
                                <button className="flex items-center justify-center rounded-full font-medium py-2 bg-[#dc2626] hover:bg-[#b91c1c] px-3 text-base leading-6 text-white relative transition-all duration-300 ease-in-out">
                                  <a href="/">Hỗ trợ</a>
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
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

export default Order;
