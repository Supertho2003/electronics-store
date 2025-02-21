import React, { useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/auth.slice";
import {
  useGetUserByIdQuery,
  useUpdateUsernameMutation,
} from "../../redux/user/user.service";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useLogoutUserMutation } from "../../redux/auth/auth.service";

const UserManagementForm = () => {
  const dispatch = useDispatch();
  const { data: user, error, isLoading } = useGetUserByIdQuery();
  const [newUserName, setNewUserName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updateUsername] = useUpdateUsernameMutation();
  const [logoutUser] = useLogoutUserMutation();

  const handleUpdateUsername = async () => {
    try {
      const response = await updateUsername({ newUserName }).unwrap();
      toast.success(response.message);
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.data.message);
    }
  };

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
        className="mt-[100px] md:mt-[120px] md:pl-20 md:pr-20 h-[100%] mb-[#30px] 2xl:mx-[360px]"
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
              <span className="text-[#090d14] font-[500]">Tài khoản</span>
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
                      d="M22.0086 10C23.3144 10 24.5909 10.3871 25.6767 11.1123C26.7624 11.8375 27.6087 12.8683 28.1084 14.0743C28.6081 15.2803 28.7389 16.6073 28.4841 17.8876C28.2294 19.1679 27.6006 20.3439 26.6772 21.2669C25.7538 22.1899 24.5774 22.8185 23.2967  23.0732C22.0159 23.3278 20.6884 23.1971 19.482 22.6976C18.2756 22.1981 17.2444 21.3521 16.519 20.2668C15.7935 19.1814 15.4063 17.9054 15.4062 16.6C15.4115 14.8512 16.1088 13.1755 17.3458 11.9389C18.5829 10.7023 20.2592 10.0052 22.0086 10Z"
                      fill="#F37021"
                    ></path>
                    <path
                      opacity="0.95"
                      d="M22.0049 39.6009C17.4561 39.5967 13.0859 37.8304 9.8125 34.6729C10.7861 32.2356 12.4672 30.1453 14.6394 28.6713C16.8117 27.1973 19.3756 26.4071 22.001 26.4024C24.6264 26.3976 27.1931 27.1786 29.3707 28.6448C31.5482 30.1109 33.2369 32.1951 34.2192 34.6289C30.9533 37.8169 26.5696 39.6013 22.0049 39.6009Z"
                      fill="#13001E"
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
                    className="relative block py-2.5 pl-6 pr-2 transition-all duration-400 ease-in-out hover:bg-gradient-to-r bg-gradient-to-r from-red-100 hover:from-red-100"
                  >
                    <div className="flex gap-2 items-center transition-all duration-400 ease-in-out text-[#dc2626] group-hover:translate-x-1 group-hover:text-[#dc2626]">
                      <i className="bx bx-user text-[22px]"></i>
                      Thông tin cá nhân
                    </div>
                  </Link>
                  <div className="absolute left-0 top-0 h-full w-1 bg-red-500 transition-opacity duration-400 group-hover:opacity-100 opacity-100"></div>
                </li>
                <li className="relative group">
                  <Link
                    to={`/tai-khoan/tai-don-hang-cua-toi`}
                    className="relative block py-2.5 pl-6 pr-2 transition-all duration-400 ease-in-out hover:bg-gradient-to-r hover:from-red-100"
                  >
                    <div className="flex gap-2 items-center transition-all duration-400 ease-in-out group-hover:translate-x-1 group-hover:text-[#dc2626]">
                      <i className="bx bx-package text-[22px]"></i>
                      Đơn hàng của tôi
                    </div>
                  </Link>
                  <div className="absolute left-0 top-0 h-full w-1 bg-red-500 opacity-0 transition-opacity duration-400 group-hover:opacity-100"></div>
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
            <div className="flex w-full flex-col gap-4">
              <h3 className="font-[500] py-4 md:py-0 text-[18px] md:text-[22px] leading-8 text-[#090d14]">
                Thông tin cá nhân
              </h3>
              <div className="mb-6 flex flex-col items-center gap-3 rounded-lg bg-white px-4 py-6">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 44 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="page_AvatarImage__z6O0X"
                >
                  <rect width="44" height="44" rx="22" fill="#FECAB5"></rect>
                  <path
                    d="M22.0086 10C23.3144 10 24.5909 10.3871 25.6767 11.1123C26.7624 11.8375 27.6087 12.8683 28.1084 14.0743C28.6081 15.2803 28.7389 16.6073 28.4841 17.8876C28.2294 19.1679 27.6006 20.3439 26.6772 21.2669C25.7538 22.1899 24.5774 22.8185 23.2967 23.0732C22.0159 23.3278 20.6884 23.1971 19.482 22.6976C18.2756 22.1981 17.2444 21.3521 16.519 20.2668C15.7935 19.1814 15.4063 17.9054 15.4062 16.6C15.4115 14.8512 16.108 8 13.1755 17.3458 11.9389C18.5829 10.7023 20.2592 10.0052 22.0086 10Z"
                    fill="#F37021"
                  ></path>
                  <path
                    opacity="0.95"
                    d="M22.0049 39.6009C17.4561 39.5967 13.0859 37.8304 9.8125 34.6729C10.7861 32.2356 12.4672 30.1453 14.6394 28.6713C16.8117 27.1973 19.3756 26.4071 22.001 26.4024C24.6264 26.3976 27.1931 27.1786 29.3707 28.6448C31.5482 30.1109 33.2369 32.1951 34.2192 34.6289C30.9533 37.8169 26.5696 39.6013 22.0049 39.6009Z"
                    fill="#13001E"
                  ></path>
                </svg>
                <div className="flex w-[25rem] max-w-full flex-col gap-4 py-2 text[16px] leading-6">
                  <div className="flex justify-between border-b border-solid pb-3">
                    <p className="text-[#6b7280]">Họ và tên</p>
                    <p>{user?.data.username}</p>
                  </div>
                </div>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Nhập tên mới"
                      className="block w-[45%] border-[#ced4da] py-2.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5"
                    />
                    <button
                      onClick={handleUpdateUsername}
                      className="mt-2 bg-[#dc2626] text-white px-4 py-2.5 rounded text-[14px] leading-6"
                    >
                      Đổi tên
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 bg-[#dc2626] text-white px-4 py-2.5 rounded text-[14px] leading-6"
                  >
                    Chỉnh sửa
                  </button>
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

export default UserManagementForm;
