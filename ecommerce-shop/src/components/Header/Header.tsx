import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetProductsByNameQuery } from "../../redux/product/product.service";
import "../../assets/css/app.css"; // Import CSS for Header if needed
import SkeletonPost from "../../SkeletonPost";
import { useGetTotalQuantityQuery } from "../../redux/cartItem/cartItem.service";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/auth.slice";
import { useGetAllCategoriesQuery } from "../../redux/category/category.service";
import { useGetUserByIdQuery } from "../../redux/user/user.service";
import { motion } from "framer-motion";
import { useLogoutUserMutation } from "../../redux/auth/auth.service";
import { toast } from "react-toastify";

const Header: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUserFormVisible, setIsUserFormVisible] = useState(false);
  const { data } = useGetTotalQuantityQuery();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const { data: categories = { data: [] }, isFetching } =
    useGetAllCategoriesQuery();
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const dispatch = useDispatch();
  const { data: user } = useGetUserByIdQuery();
  const totalQuantity = data?.data || 0;
  const [logoutUser] = useLogoutUserMutation();
  const handleFocus = () => {
    setIsSearchVisible(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsSearchVisible(false);
    }, 200);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        if (window.scrollY < 645) {
          setIsLogoVisible(false);
        } else {
          setIsLogoVisible(true);
        }
      } else {
        setIsLogoVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleUserMouseEnter = () => {
    setIsUserFormVisible(true);
  };

  const handleUserMouseLeave = () => {
    setIsUserFormVisible(false);
  };

  const formatCurrency = (amount: any) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };

  const {
    data: searchResults,
    error,
    isLoading,
  } = useGetProductsByNameQuery(searchTerm, {
    skip: !searchTerm,
  });

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken"); 
    if (refreshToken) {
      try {
        await logoutUser(refreshToken).unwrap(); 
        dispatch(logout()); 
      } catch (error : any) {
       toast.error("Có lỗi xảy ra");
      }
    }
  };

  return (
    <motion.header
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`fixed top-0 left-0 z-10 right-0 h-[${
          isLogoVisible ? "140px" : "60px"
        }] bg-[#ffffff] flex items-center md:h-[60px] border-b border-solid border-[#f0f0f0]`}
      >
        <nav className="w-[100%] flex flex-col md:flex-row items-center md:justify-start py-2 md:py-0 relative xl:mx-[67px] 2xl:mx-[360px] px-2">
          {isLogoVisible && (
            <Link
              to="/"
              className="w-auto flex items-center pr-[30px] mb-1 h-[30px]"
            >
              <div>
                <img
                  src="../../assets/images/logo-icon.png"
                  alt=""
                  className="w-[40px] md:w-[55px]"
                />
              </div>
              <div>
                <h4 className="text-[16px] ml-[10px] tracking-[1px] text-[#0d6efd] font-bold">
                  Rocker
                </h4>
              </div>
            </Link>
          )}
          <div className="flex justify-between items-center w-full gap-4 md:gap-0">
            <div>
              <button
                className="md:hidden flex items-center"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <i className="bx bx-menu text-2xl"></i>
              </button>
            </div>
            <div
              className={`absolute h-[100vh] top-0 left-0 right-0 bg-white shadow-md rounded-md z-20 transition-transform duration-500 ${
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
              } md:hidden`}
            >
              <div className="flex justify-between items-center border-b py-2 px-4">
                <div>
                  <Link
                    to="/"
                    className="w-auto flex items-center pr-[30px] pb-2 md:pb-0 "
                  >
                    <div>
                      <img
                        src="../../assets/images/logo-icon.png"
                        alt=""
                        className="w-[40px] md:w-[55px]"
                      />
                    </div>
                    <div>
                      <h4 className="text-[16px] ml-[10px] tracking-[1px] text-[#0d6efd] font-bold">
                        Rocker
                      </h4>
                    </div>
                  </Link>
                </div>

                <button
                  className="text-[32px] text-gray-500"
                  onClick={() => setIsMenuOpen(false)} // Đóng form khi nhấp vào nút "X"
                >
                  <i className="bx bx-x"></i>
                </button>
              </div>
              {isAuthenticated ? (
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2 ">
                    <Link to={`/tai-khoan`} className="flex gap-2">
                      <div className="overflow-hidden rounded-full">
                        <svg
                          width="44"
                          height="44"
                          viewBox="0 0 44 44"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="inline-flex h-11 w-11 select-none items-center justify-center overflow-hidden rounded-[100%] bg-[color:var(--black-a3)] align-middle"
                        >
                          <rect
                            width="44"
                            height="44"
                            rx="22"
                            fill="#FECAB5"
                          ></rect>
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

                      <span className="flex items-center">
                        <span className="mr-1 font-[500] text-black">
                          {user?.data.username}
                        </span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="-rotate-90"
                        >
                          <path
                            d="M3.20041 5.73966C3.48226 5.43613 3.95681 5.41856 4.26034 5.70041L8 9.22652L11.7397 5.70041C12.0432 5.41856 12.5177 5.43613 12.7996 5.73966C13.0815 6.0432 13.0639 6.51775 12.7603 6.7996L8.51034 10.7996C8.22258 11.0668 7.77743 11.0668 7.48967 10.7996L3.23966 6.7996C2.93613 6.51775 2.91856 6.0432 3.20041 5.73966Z"
                            fill="#090D14"
                          ></path>
                        </svg>
                      </span>
                    </Link>
                  </div>
                  <div className="">
                    <button
                      onClick={handleLogout}
                      className="px-4 border border-solid border-red-500 text-red-500 py-2 rounded-md font-[500] "
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-[14px] leading-5 font-[500] text-[#090d14] mb-3">
                      Đăng nhập hoặc đăng ký
                      <br />
                      để nhận nhiều ưu đãi hấp dẫn
                    </p>
                    <div className="flex gap-1">
                      <Link to="/dang-ky" className="">
                        <button className="px-4 border border-solid border-red-500 text-red-500 py-2 rounded-md font-[500] ">
                          Đăng ký
                        </button>
                      </Link>
                      <Link to="/dang-nhap" className="">
                        <button className="px-4 border bg-[#dc2626] text-white border-solid py-2 rounded-md font-[500] ">
                          Đăng nhập
                        </button>
                      </Link>
                    </div>
                  </div>
                  <img
                    alt="authentication"
                    loading="lazy"
                    width={130}
                    height={97}
                    decoding="async"
                    data-nimg="1"
                    src="https://fptshop.com.vn/img/login_mobile.png?w=360&q=100"
                    style={{ color: "transparent" }}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 p-4">
                {isFetching ? (
                  <div className="col-span-5 text-center">
                    <SkeletonPost />
                  </div>
                ) : categories.data.length > 0 ? (
                  categories.data.map((category) => (
                    <div className="border-b" key={category.id}>
                      <Link
                        to={`/${category.name}`}
                        className="py-2 md:mb-0 flex flex-row items-center gap-2 rounded transition duration-350 hover:cursor-pointer"
                      >
                        <img
                          src={`${category.imageUrl}`}
                          alt=""
                          loading="lazy"
                          width="60"
                          height="60"
                          decoding="async"
                          className="h-12 w-13 rounded xl:h-15 xl:w-15"
                        />
                        <h2 className="cursor-pointer font-regular xl:text-base">
                          {category.name}
                        </h2>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="col-span-5 text-center">
                    Không có danh mục nào
                  </div>
                )}
              </div>
            </div>
            <div className="flex-grow md:block md:px-[100px]">
              <div className="relative">
                <input
                  type="text"
                  className="border block w-full text-[14px] font-normal leading-6 py-1.5 px-3 transition duration-150 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 text-[#212529] bg-[#f7f7ff] border-[#e9e9f6] rounded-full pl-10 pr-10"
                  placeholder="Nhập tên điện thoại, máy tính, phụ kiện... cần tìm"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[18px]">
                  <i className="bx bx-search"></i>
                </span>
                {isSearchVisible && (
                  <div className="absolute top-full left-0 right-0 bg-white shadow-md p-4 mt-4 rounded-md z-20">
                    <form className="w-full">
                      {isLoading && <SkeletonPost />}
                      {searchResults && searchResults.data.length > 0 ? (
                        <div className="max-h-96 overflow-y-auto">
                          <ul>
                            {searchResults.data.map((product: any) => (
                              <li key={product.id} className="mb-2">
                                <Link to={`/product/${product.id}`}>
                                  <div className="flex gap-4">
                                    <img
                                      src={`${product?.imageUrl}`}
                                      alt=""
                                      loading="lazy"
                                      width="60"
                                      height="60"
                                      decoding="async"
                                      className="h-12 w-13 rounded xl:h-15 xl:w-15"
                                    />
                                    <div>
                                      <p className="cursor-pointer text-[14px] leading-[24px] text-[#090d14] ">
                                        {product?.name}
                                      </p>
                                      <p className="text-[14px] font-[500] leading-[24px] text-[#090d14]">
                                        {formatCurrency(product.price)}
                                      </p>
                                    </div>
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="">
                          <div>
                            <h6 className="flex flex-col md:flex-row items-center border-b border-[#9ca3af] p-2 text-[14px] md:text-[16px] leading-6 font-[400] text-[#090d14]">
                              <div className="flex items-center">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2"
                              >
                                <path
                                  d="M11.6682 11.6641L14.6682 14.6641"
                                  stroke="#dc2626"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>
                                <path
                                  d="M13.3362 7.33203C13.3362 4.01832 10.6499 1.33203 7.33618 1.33203C4.02247 1.33203 1.33618 4.01832 1.33618 7.33203C1.33618 10.6457 4.02247 13.332 7.33618 13.332C10.6499 13.332 13.3362 10.6457 13.3362 7.33203Z"
                                  stroke="#dc2626"
                                  strokeWidth="1.5"
                                  strokeLinejoin="round"
                                ></path>
                              </svg>
                              Không tìm thấy kết quả với từ khóa
                              </div>
                             
                              <span className="ml-2 break-all text-[16px] leading-6">
                                "{searchTerm}"
                              </span>
                            </h6>
                            <ul className="list-disc list-inside pl-2 md:pl-11 pt-4 text-[#6b7280]">
                              <li className="pb-1">
                                Kiểm tra lỗi chính tả với từ khoá đã nhập
                              </li>
                              <li>
                                Trong trường hợp cần hỗ trợ, hãy gọi
                                <a
                                  href="/"
                                  className="font-[600] text-[14px] leading-5 text-[#dc2626]"
                                >
                                  {" "}
                                  0703162730{" "}
                                </a>
                                để được tư vấn mua hàng
                                <span className="font-[500] text-[14px] leading-5">
                                  {" "}
                                  (Miễn phí)
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </form>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center ">
              {isAuthenticated ? (
                <div
                  className="hidden md:flex relative cursor-pointer mr-2"
                  onMouseEnter={handleUserMouseEnter}
                  onMouseLeave={handleUserMouseLeave}
                >
                  <div className="flex items-center py-2">
                    <svg
                      width="44"
                      height="44"
                      viewBox="0 0 44 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="inline-flex h-11 w-11 select-none items-center justify-center overflow-hidden rounded-[100%] bg-[color:var(--black-a3)] align-middle"
                    >
                      <rect
                        width="44"
                        height="44"
                        rx="22"
                        fill="#FECAB5"
                      ></rect>
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
                  {isUserFormVisible && (
                    <div className="absolute top-12 left-[-120px] md:left-0 bg-white shadow-md p-4 mt-2 rounded-md z-20 w-[220px]">
                      <ul>
                        <li className="py-2 transition-transform duration-400 ease-in-out hover:translate-x-1">
                          <Link to={`/tai-khoan`}>
                            <div className="flex gap-2 items-center">
                              <i className="bx bx-user text-[22px]"></i>
                              Thông tin cá nhân
                            </div>
                          </Link>
                        </li>
                        <li className="py-2 transition-transform duration-400 ease-in-out hover:translate-x-1">
                          <Link to={`/tai-khoan/tai-don-hang-cua-toi`}>
                            <div className="flex gap-2 items-center">
                              <i className="bx bx-package text-[22px]"></i>
                              Đơn hàng của tôi
                            </div>
                          </Link>
                        </li>
                        <li className="py-2 transition-transform duration-400 ease-in-out hover:translate-x-1">
                          <Link to={`/tai-khoan/quan-ly-so-dia-chi`}>
                            <div className="flex gap-2 items-center">
                              <i className="bx bx-map text-[22px]"></i>
                              Sổ địa chỉ nhận hàng
                            </div>
                          </Link>
                        </li>
                        <li className="py-2 transition-transform duration-400 ease-in-out hover:translate-x-1">
                          <button onClick={() => dispatch(logout())}>
                            <div className="flex gap-2 items-center">
                              <i className="bx bx-exit text-[22px]"></i>
                              Đăng xuất
                            </div>
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative cursor-pointer mr-2">
                  <div className="hidden md:flex relative items-center py-2">
                    <Link to={"/dang-nhap"}>
                      <button className="bg-gray-600 border-0 rounded-full p-2.5">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="white"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.7545 13.9999C18.9966 13.9999 20.0034 15.0068 20.0034 16.2488V17.1673C20.0034 17.7406 19.8242 18.2997 19.4908 18.7662C17.9449 20.9294 15.4206 22.0011 12.0004 22.0011C8.5794 22.0011 6.05643 20.9289 4.51427 18.7646C4.18231 18.2987 4.00391 17.7409 4.00391 17.1688V16.2488C4.00391 15.0068 5.01076 13.9999 6.25278 13.9999H17.7545ZM12.0004 2.00464C14.7618 2.00464 17.0004 4.24321 17.0004 7.00464C17.0004 9.76606 14.7618 12.0046 12.0004 12.0046C9.23894 12.0046 7.00036 9.76606 7.00036 7.00464C7.00036 4.24321 9.23894 2.00464 12.0004 2.00464Z"
                            fill="inherit"
                          ></path>
                        </svg>
                      </button>
                    </Link>
                  </div>
                </div>
              )}
              <div className="text-white flex-grow">
                <Link
                  to="/gio-hang"
                  className="flex items-center gap-2 px-2 md:px-4 py-1.5 bg-red-700 rounded-full relative"
                >
                  <span className="relative">
                    <i className="bx bxs-cart text-[22px]"></i>
                    <span className="absolute top-[-2px] right-[-6px] bg-orange-600 h-4 w-4 flex items-center justify-center rounded-full text-white text-[12px]">
                      {totalQuantity}
                    </span>
                  </span>
                  <span className="hidden md:flex font-[500] text-[15px]">
                    Giỏ hàng
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
