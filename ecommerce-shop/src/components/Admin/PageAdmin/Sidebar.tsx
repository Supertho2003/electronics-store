import React, { useEffect, useState } from "react";
import ColorForm from "../color";
import Order from "../order";
import CategoryForm from "../category";
import AttributeForm from "../attribute";
import ProductForm from "../product";
import Dashboard from "../dashboard";
import User from "../user";
import Review from "../review";
import Coupon from "../coupon";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/auth.slice";
import { motion } from "framer-motion";

const Sidebar = () => {
  const [state, setState] = useState<{
    active: number;
    activeDropdown: number | null;
  }>({
    active: 0,
    activeDropdown: 0,
  });
  const dispatch = useDispatch();
  const [isUserFormVisible, setIsUserFormVisible] = useState(false);
  const toggleDropdown = (index: number) => {
    setState((prevState) => ({
      ...prevState,
      activeDropdown: prevState.activeDropdown === index ? null : index,
    }));
  };

  const setActive = (index: number) => {
    setState((prevState) => ({
      ...prevState,
      active: index,
    }));
  };

  const handleToggleUserMenu = () => {
    setIsUserFormVisible((prev) => !prev);
  };

  return (
    <motion.div
      className="flex relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-[50px] md:w-[260px]  bg-white fixed top-0 left-0 h-full z-50 ">
        <div className="flex items-center justify-between pt-[15px] pl-2">
          <a href="/" className="flex items-center ">
            <div className="block">
              <img
                src="../../assets/images/logo-img.png"
                className="h-[35px]  md:max-w-full"
                alt=""
              />
            </div>
          </a>
          <div className="hidden md:flex">
            <i className="bx bx-chevron-left text-[22px]"></i>
          </div>
        </div>
        <div className="mt-3">
          <ul className="mr-[15px]">
            <li className="">
              <div
                className={`${
                  state.activeDropdown === 0
                    ? "text-[#ffffff] bg-[#6546d2] rounded-tr-lg"
                    : "text-black"
                } transition-all duration-300  ease-in-out cursor-pointer text-sm relative flex items-center justify-between py-[15px] px-1 md:px-5 leading-[18px]`}
                onClick={() => {
                  toggleDropdown(0);
                  setActive(0);
                }}
              >
                <div className="flex items-center">
                  <i className="bx bx-home-alt text-[22px] mr-[10px]"></i>
                  <span className="hidden md:flex text-sm">
                    Trang chủ admin
                  </span>
                </div>
              </div>
            </li>

            <li>
              <div
                className={`${
                  state.activeDropdown === 1
                    ? "text-[#ffffff] bg-[#6546d2] rounded-tr-lg"
                    : "text-black"
                } transition-all duration-300  ease-in-out cursor-pointer text-sm relative flex items-center justify-between py-[15px] px-1 md:px-5 leading-[18px]`}
                onClick={() => {
                  toggleDropdown(1);
                }}
              >
                <div className="flex items-center ">
                  <i className="bx bx-category text-[22px] md:mr-[10px]"></i>
                  <span className="hidden md:flex text-sm">
                    Quản lý danh mục
                  </span>
                </div>

                <i
                  className={`bx ${
                    state.activeDropdown === 1
                      ? "bx-chevron-down"
                      : "bx-chevron-right"
                  } text-[22px] transition-transform duration-300 ease-in-out transform ${
                    state.activeDropdown === 1 ? "rotate-60" : "rotate-0"
                  }`}
                ></i>
              </div>
              <ul
                className={`bg-[#f8f7fd] rounded-br-lg space-y-2 transition-all duration-400 ease-in-out overflow-hidden ${
                  state.activeDropdown === 1
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <li className="">
                  <div
                    className={`${
                      state.active === 1
                        ? "text-[#ffffff] bg-[#9f87f5] "
                        : "text-black"
                    } transition-all duration-300 ease-in-out cursor-pointer text-sm relative flex items-center py-[15px] px-1 md:px-5 leading-[18px]`}
                    onClick={() => setActive(1)}
                  >
                    <i className="bx bx-list-ul text-[18px] mr-[10px]"></i>
                    <span className="hidden md:flex text-sm">
                      Danh sách danh mục
                    </span>
                  </div>
                </li>
              </ul>
            </li>

            <li>
              <div
                className={`${
                  state.activeDropdown === 2
                    ? "text-[#ffffff] bg-[#6546d2] rounded-tr-lg"
                    : "text-black"
                } transition-all duration-300  ease-in-out cursor-pointer text-sm relative flex items-center justify-between py-[15px] px-1 md:px-5 leading-[18px]`}
                onClick={() => {
                  toggleDropdown(2);
                }}
              >
                <div className="flex items-center">
                  <i className="bx bx-palette text-[22px]  md:mr-[10px]"></i>
                  <span className="hidden md:flex text-sm">
                    Quản lý màu sắc
                  </span>
                </div>

                <i
                  className={`bx ${
                    state.activeDropdown === 2
                      ? "bx-chevron-down"
                      : "bx-chevron-right"
                  } text-[22px] transition-transform duration-300 ease-in-out transform ${
                    state.activeDropdown === 2 ? "rotate-60" : "rotate-0"
                  }`}
                ></i>
              </div>
              <ul
                className={`bg-[#f8f7fd] rounded-br-lg space-y-2 transition-all duration-400 ease-in-out overflow-hidden ${
                  state.activeDropdown === 2
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <li className="">
                  <div
                    className={`${
                      state.active === 2
                        ? "text-[#ffffff] bg-[#9f87f5] "
                        : "text-black"
                    } transition-all duration-300 ease-in-out cursor-pointer text-sm relative flex items-center py-[15px] px-1 md:px-5 leading-[18px]`}
                    onClick={() => setActive(2)}
                  >
                    <i className="bx bx-list-ul text-[18px] md:mr-[10px]"></i>
                    <span className="hidden md:flex text-sm">
                      Danh sách màu
                    </span>
                  </div>
                </li>
              </ul>
            </li>

            <li>
              <div
                className={`${
                  state.activeDropdown === 3
                    ? "text-[#ffffff] bg-[#6546d2] rounded-tr-lg"
                    : "text-black"
                } transition-all duration-300  ease-in-out cursor-pointer text-sm relative flex items-center justify-between py-[15px] px-1 md:px-5 leading-[18px]`}
                onClick={() => {
                  toggleDropdown(3);
                }}
              >
                <div className="flex items-center">
                  <i className="bx bx-tag text-[22px]  md:mr-[10px]"></i>
                  <span className="hidden md:flex text-sm">
                    Quản lý thuộc tính
                  </span>
                </div>

                <i
                  className={`bx ${
                    state.activeDropdown === 3
                      ? "bx-chevron-down"
                      : "bx-chevron-right"
                  } text-[22px] transition-transform duration-300 ease-in-out transform ${
                    state.activeDropdown === 3 ? "rotate-60" : "rotate-0"
                  }`}
                ></i>
              </div>
              <ul
                className={`bg-[#f8f7fd] rounded-br-lg space-y-2 transition-all duration-400 ease-in-out overflow-hidden ${
                  state.activeDropdown === 3
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <li className="">
                  <div
                    className={`${
                      state.active === 3
                        ? "text-[#ffffff] bg-[#9f87f5] "
                        : "text-black"
                    } transition-all duration-300 ease-in-out cursor-pointer text-sm relative flex items-center py-[15px] px-1 md:px-5 leading-[18px]`}
                    onClick={() => setActive(3)}
                  >
                    <i className="bx bx-list-ul text-[18px]  md:mr-[10px]"></i>
                    <span className="hidden md:flex text-sm">
                      Danh sách thuộc tính
                    </span>
                  </div>
                </li>
              </ul>
            </li>

            <li>
              <div
                className={`${
                  state.activeDropdown === 4
                    ? "text-[#ffffff] bg-[#6546d2] rounded-tr-lg"
                    : "text-black"
                } transition-all duration-300  ease-in-out cursor-pointer text-sm relative flex items-center justify-between py-[15px] px-1 md:px-5 leading-[18px]`}
                onClick={() => {
                  toggleDropdown(4);
                }}
              >
                <div className="flex items-center">
                  <i className="bx bx-box text-[22px]  md:mr-[10px]"></i>
                  <span className="hidden md:flex text-sm">
                    Quản lý sản phẩm
                  </span>
                </div>

                <i
                  className={`bx ${
                    state.activeDropdown === 4
                      ? "bx-chevron-down"
                      : "bx-chevron-right"
                  } text-[22px] transition-transform duration-300 ease-in-out transform ${
                    state.activeDropdown === 4 ? "rotate-60" : "rotate-0"
                  }`}
                ></i>
              </div>
              <ul
                className={`bg-[#f8f7fd] rounded-br-lg space-y-2 transition-all duration-400 ease-in-out overflow-hidden ${
                  state.activeDropdown === 4
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <li className="">
                  <div
                    className={`${
                      state.active === 4
                        ? "text-[#ffffff] bg-[#9f87f5] "
                        : "text-black"
                    } transition-all duration-300 ease-in-out cursor-pointer text-sm relative flex items-center py-[15px] px-1 md:px-5 leading-[18px]`}
                    onClick={() => setActive(4)}
                  >
                    <i className="bx bx-list-ul text-[18px] mr-[10px] md:mr-[10px]"></i>
                    <span className="hidden md:flex text-sm">
                      Danh sách sản phẩm
                    </span>
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <div
                className={`${
                  state.activeDropdown === 5
                    ? "text-[#ffffff] bg-[#6546d2] rounded-tr-lg"
                    : "text-black"
                } transition-all duration-300  ease-in-out cursor-pointer text-sm relative flex items-center justify-between py-[15px] px-1 md:px-5 leading-[18px]`}
                onClick={() => {
                  toggleDropdown(5);
                }}
              >
                <div className="flex items-center">
                  <i className="bx bx-purchase-tag text-[22px] md:mr-[10px]"></i>
                  <span className="hidden md:flex text-sm">
                    Quản lý giảm giá
                  </span>
                </div>

                <i
                  className={`bx ${
                    state.activeDropdown === 5
                      ? "bx-chevron-down"
                      : "bx-chevron-right"
                  } text-[22px] transition-transform duration-300 ease-in-out transform ${
                    state.activeDropdown === 5 ? "rotate-60" : "rotate-0"
                  }`}
                ></i>
              </div>
              <ul
                className={`bg-[#f8f7fd] rounded-br-lg space-y-2 transition-all duration-400 ease-in-out overflow-hidden ${
                  state.activeDropdown === 5
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <li className="">
                  <div
                    className={`${
                      state.active === 5
                        ? "text-[#ffffff] bg-[#9f87f5] "
                        : "text-black"
                    } transition-all duration-300 ease-in-out cursor-pointer text-sm relative flex items-center py-[15px] px-1 md:px-5 leading-[18px]`}
                    onClick={() => setActive(5)}
                  >
                    <i className="bx bx-list-ul text-[18px]  md:mr-[10px]"></i>
                    <span className="hidden md:flex text-sm">
                      Danh sách mã giảm giá
                    </span>
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <div
                className={`${
                  state.activeDropdown === 6
                    ? "text-[#ffffff] bg-[#6546d2] rounded-tr-lg"
                    : "text-black"
                } transition-all duration-300  ease-in-out cursor-pointer text-sm relative flex items-center justify-between py-[15px] px-1 md:px-5 leading-[18px]`}
                onClick={() => {
                  setActive(6);
                  toggleDropdown(6);
                }}
              >
                <div className="flex items-center">
                  <i className="bx bx-star text-[22px]  md:mr-[10px]"></i>
                  <span className="hidden md:flex text-sm">
                    Quản lý đánh giá
                  </span>
                </div>
              </div>
            </li>

            <li>
              <div
                className={`${
                  state.activeDropdown === 7
                    ? "text-[#ffffff] bg-[#6546d2] rounded-tr-lg"
                    : "text-black"
                } transition-all duration-300  ease-in-out cursor-pointer text-sm relative flex items-center justify-between py-[15px] px-1 md:px-5 leading-[18px]`}
                onClick={() => {
                  setActive(7);
                  toggleDropdown(7);
                }}
              >
                <div className="flex items-center">
                  <i className="bx bx-group text-[22px]  md:mr-[10px]"></i>
                  <span className="hidden md:flex text-sm">
                    Quản lý người dùng
                  </span>
                </div>
              </div>
            </li>

            <li>
              <div
                className={`${
                  state.activeDropdown === 8
                    ? "text-[#ffffff] bg-[#6546d2] rounded-tr-lg"
                    : "text-black"
                } transition-all duration-300  ease-in-out cursor-pointer text-sm relative flex items-center justify-between py-[15px] px-1 md:px-5 leading-[18px]`}
                onClick={() => {
                  toggleDropdown(8);
                }}
              >
                <div className="flex items-center" onClick={() => setActive(8)}>
                  <i className="bx bx-receipt text-[22px]  md:mr-[10px]"></i>
                  <span className="hidden md:flex text-sm">
                    Quản lý đơn hàng
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-grow z-40 ml-[60px] mr-[10px] md:ml-[290px] md:mr-[30px] mt-[90px]">
        <div className="h-[60px]  border-b border-[#e9e9f6] fixed top-0 right-0 bg-white w-full">
          <div className="flex float-end ">
            <div className="flex items-center h-[60px]">
              <div
                className="relative cursor-pointer mr-4 md:mr-16"
                onClick={handleToggleUserMenu}
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
                {isUserFormVisible && (
                  <div className="absolute top-12 left-[-70px] bg-white shadow-md p-2 mt-2 rounded-md z-20 w-[170px]">
                    <ul>
                      <li className="py-2 transition-transform duration-400 ease-in-out hover:translate-x-1">
                        <button onClick={() => dispatch(logout())}>
                          <div className="flex gap-2 justify-center items-center">
                            <i className="bx bx-exit text-[22px]"></i>
                            Đăng xuất
                          </div>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {state.active === 0 ? <Dashboard /> : null}
        {state.active === 1 ? <CategoryForm /> : null}
        {state.active === 2 ? <ColorForm /> : null}
        {state.active === 3 ? <AttributeForm /> : null}
        {state.active === 4 ? <ProductForm /> : null}
        {state.active === 5 ? <Coupon /> : null}
        {state.active === 6 ? <Review /> : null}
        {state.active === 7 ? <User /> : null}
        {state.active === 8 ? <Order /> : null}
      </div>
    </motion.div>
  );
};

export default Sidebar;
