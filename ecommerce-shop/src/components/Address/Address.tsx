import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { useSelector } from "react-redux";

import { toast } from "react-toastify";
import { useGetUserByIdQuery } from "../../redux/user/user.service";
import {
  useAddAddressMutation,
  useDeleteAddressMutation,
  useGetAddressByIdQuery,
  useGetAddressesQuery,
  useUpdateAddressMutation,
} from "../../redux/address/address.service";
import { RootState } from "../../redux/store";
import { AddAddressRequest } from "../../redux/address/address.type";
import Header from "../Header";
import Footer from "../Footer";
import { useDispatch } from "react-redux";
import { cancelEdit, startEdit } from "../../redux/id.slice";
import { motion } from "framer-motion";
import { useLogoutUserMutation } from "../../redux/auth/auth.service";
import { logout } from "../../redux/auth.slice";

const initialState: Omit<AddAddressRequest, "id"> = {
  userName: "",
  streetAddress: "",
  province: "",
  district: "",
  ward: "",
  mobile: "",
};

interface Errors {
  userName?: string;
  mobile?: string;
  province?: string;
  district?: string;
  ward?: string;
  streetAddress?: string;
}

const Address = () => {
  const [isFormVisible, setFormVisible] = useState(false);
  const { data: user } = useGetUserByIdQuery();
  console.log(user);
  const { data: addresses = [], isLoading: isLoadingAddresses } =
    useGetAddressesQuery();
  const [formData, setFormData] =
    useState<Omit<AddAddressRequest, "id">>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [addAddress] = useAddAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const dispatch = useDispatch();
  const addressId = useSelector((state: RootState) => state.id.id);
  const [deleteAddress] = useDeleteAddressMutation();
  const { data, error } = useGetAddressByIdQuery(addressId, {
    skip: !addressId,
  });
   const [logoutUser] = useLogoutUserMutation();

  useEffect(() => {
    if (data && data.data) {
      setFormData({
        userName: data.data.userName,
        streetAddress: data.data.streetAddress,
        province: data.data.province,
        district: data.data.district,
        ward: data.data.ward,
        mobile: data.data.mobile,
      });
    }
  }, [data]);

  const toggleForm = () => {
    if (isFormVisible) {
      handleCancel();
    }
    setFormVisible(!isFormVisible);
  };

  useEffect(() => {
    if (isFormVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFormVisible]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (addressId) {
        const response = await updateAddress({
          addressId,
          body: formData,
        }).unwrap();
        toast.success(response.message);
      } else {
        const response = await addAddress(formData).unwrap();
        toast.success(response.message);
      }
      setFormVisible(false);
      setFormData(initialState);
    } catch (error: any) {
      if (error.data) {
        setErrors(error.data);
      } else {
        toast.error(error.data.message);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAddress(id).unwrap();
      toast.success("Xóa địa chỉ thành công!");
    } catch (error) {
      toast.error("Xóa địa chỉ thất bại!");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleEdit = (id: number) => {
    dispatch(startEdit(id));
  };

  const handleCancel = () => {
    dispatch(cancelEdit(0));
    setFormData(initialState);
    setErrors({});
    setFormVisible(false);
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
        className={`mt-[120px] h-[100%] px-4 xl:mx-[67px] 2xl:mx-[360px] ${
          isFormVisible ? "overflow-hidden" : ""
        }`}
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
                Sổ địa chỉ nhận hàng
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
                      d="M29 6.95455C29.6364 6.90909 30.8182 6.18182 31 5C31 5.95455 32.1818 6.86364 33 6.95455C32.3333 7.09091 31 8.12727 31 9C31 7.909 31 7.09091 29 6.95455Z"
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
                <div></div>
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
                    className="relative block py-2.5 pl-6 pr-2 transition-all duration-400 ease-in-out hover:bg-gradient-to-r bg-gradient-to-r from-red-100  hover:from-red-100"
                  >
                    <div className="flex gap-2 items-center transition-all duration-400 ease-in-out text-[#dc2626] group-hover:translate-x-1 group-hover:text-[#dc2626]">
                      <i className="bx bx-map text-[22px]"></i>
                      Sổ địa chỉ nhận hàng
                    </div>
                  </Link>
                  <div className="absolute left-0 top-0 h-full w-1 bg-red-500 transition-opacity duration-400 group-hover:opacity-100 opacity-100"></div>
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
              <div className="flex items-center justify-between py-4 md:py-0">
                <h3 className="font-[500] text-[20px] md:text-[24px] leading-8 text-[#090d14]">
                  Sổ địa chỉ nhận hàng
                </h3>
                <button
                  onClick={toggleForm}
                  className="mt-2 bg-[#dc2626] transition duration-300 ease-in-out hover:bg-red-700 text-white px-4 py-2.5 rounded-full text-[14px] leading-6"
                >
                  <span>Thêm địa chỉ mới</span>
                </button>
              </div>

              {isFormVisible && (
                <>
                  <motion.div
                    className="fixed inset-0 bg-black opacity-50 z-10"
                    onClick={toggleForm}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                  ></motion.div>

                  <motion.div
                    className="fixed inset-y-0 right-0 w-2/3 md:w-1/3 bg-white shadow-md z-20"
                    initial={{ x: "100%" }}
                    animate={{ x: "0%" }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="max-h-[40px] min-h-10 relative">
                      <div className="p-5">
                        <h2 className="font-[500] text-[16px] leading-6 text-[#090d14]">
                          {addressId ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
                        </h2>
                      </div>

                      <svg
                        onClick={toggleForm}
                        width="24"
                        height="24"
                        viewBox="0 0 28 28"
                        fill="#090d14"
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute bottom-0 right-[8px] top-0 m-auto cursor-pointer"
                      >
                        <path d="M6.2097 6.3871L6.29289 6.29289C6.65338 5.93241 7.22061 5.90468 7.6129 6.2097L7.70711 6.29289L14 12.585L20.2929 6.29289C20.6834 5.90237 21.3166 5.90237 21.7071 6.29289C22.0976 6.68342 22.0976 7.31658 21.7071 7.70711L15.415 14L21.7071 20.2929C22.0676 20.6534 22.0953 21.2206 21.7903 21.6129L21.7071 21.7071C21.3466 22.0676 20.7794 22.0953 20.3871 21.7903L20.2929 21.7071L14 15.415L7.70711 21.7071C7.31658 22.0976 6.68342 22.0976 6.29289 21.7071C5.90237 21.3166 5.90237 20.6834 6.29289 20.2929L12.585 14L6.29289 7.70711C5.93241 7.34662 5.90468 6.77939 6.2097 6.3871L6.29289 6.29289L6.2097 6.3871Z"></path>
                      </svg>
                    </div>
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-3 h-full min-h-[100px]"
                    >
                      <div className="flex h-full w-full flex-col gap-2 pt-4 bg-[#f3f4f6]">
                        <div className="flex flex-col gap-4 overflow-y-auto p-4">
                          <div className="border-b border-solid border-b-gray-200 pb-4">
                            <p className="mb-2 text-[#657384] text-[14px] leading-6">
                              Thông tin người nhận
                            </p>
                            <div className="mb-3">
                              <div>
                                <input
                                  type="text"
                                  name="userName"
                                  placeholder="Nhập họ và tên"
                                  value={formData.userName}
                                  className={`${
                                    errors.userName
                                      ? "border-[#dc2626]"
                                      : "border-[#ced4da]"
                                  } block w-full py-2.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5`}
                                  onChange={handleChange}
                                />
                              </div>
                              {errors.userName && (
                                <div className="mt-1 flex items-center text-[12px] font-[400] leading-[18px] gap-1">
                                  <span className="flex items-center justify-center h-4">
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <g id="Question Circle">
                                        <path
                                          id="Shape"
                                          d="M8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2ZM8 10.5C7.58579 10.5 7.25 10.8358 7.25 11.25C7.25 11.6642 7.58579 12 8 12C8.41421 12 8.75 11.6642 8.75 11.25C8.75 10.8358 8.41421 10.5 8 10.5ZM8 4.5C6.89543 4.5 6 5.39543 6 6.5C6 6.77614 6.22386 7 6.5 7C6.77614 7 7 6.77614 7 6.5C7 5.94772 7.44772 5.5 8 5.5C8.55228 5.5 9 5.94772 9 6.5C9 6.87058 8.91743 7.07932 8.63398 7.39755L8.51804 7.52255L8.25395 7.79209C7.71178 8.36031 7.5 8.76947 7.5 9.5C7.5 9.77614 7.72386 10 8 10C8.27614 10 8.5 9.77614 8.5 9.5C8.5 9.12942 8.58257 8.92068 8.86602 8.60245L8.98196 8.47745L9.24605 8.20791C9.78822 7.63969 10 7.23053 10 6.5C10 5.39543 9.10457 4.5 8 4.5Z"
                                          fill="#DC2626"
                                        ></path>
                                      </g>
                                    </svg>
                                  </span>
                                  <span className="text-[#dc2626]">
                                    {errors.userName}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="mb-3">
                              <div>
                                <input
                                  type="text"
                                  name="mobile"
                                  placeholder="Nhập số điện thoại"
                                  value={formData.mobile}
                                  className={`${
                                    errors.mobile
                                      ? "border-[#dc2626]"
                                      : "border-[#ced4da]"
                                  } block w-full py-2.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5`}
                                  onChange={handleChange}
                                />
                                {errors.mobile && (
                                  <div className="mt-1 flex items-center text-[12px] font-[400] leading-[18px] gap-1">
                                    <span className="flex items-center justify-center h-4">
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <g id="Question Circle">
                                          <path
                                            id="Shape"
                                            d="M8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2ZM8 10.5C7.58579 10.5 7.25 10.8358 7.25 11.25C7.25 11.6642 7.58579 12 8 12C8.41421 12 8.75 11.6642 8.75 11.25C8.75 10.8358 8.41421 10.5 8 10.5ZM8 4.5C6.89543 4.5 6 5.39543 6 6.5C6 6.77614 6.22386 7 6.5 7C6.77614 7 7 6.77614 7 6.5C7 5.94772 7.44772 5.5 8 5.5C8.55228 5.5 9 5.94772 9 6.5C9 6.87058 8.91743 7.07932 8.63398 7.39755L8.51804 7.52255L8.25395 7.79209C7.71178 8.36031 7.5 8.76947 7.5 9.5C7.5 9.77614 7.72386 10 8 10C8.27614 10 8.5 9.77614 8.5 9.5C8.5 9.12942 8.58257 8.92068 8.86602 8.60245L8.98196 8.47745L9.24605 8.20791C9.78822 7.63969 10 7.23053 10 6.5C10 5.39543 9.10457 4.5 8 4.5Z"
                                            fill="#DC2626"
                                          ></path>
                                        </g>
                                      </svg>
                                    </span>
                                    <span className="text-[#dc2626]">
                                      {errors.mobile}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-3">
                            <p className="mb-2 text-[#657384] text-[14px] leading-6">
                              Địa chỉ nhận hàng
                            </p>
                            <div className="mb-3">
                              <div>
                                <input
                                  type="text"
                                  name="province"
                                  placeholder="Tỉnh/Thành Phố"
                                  value={formData.province}
                                  className={`${
                                    errors.province
                                      ? "border-[#dc2626]"
                                      : "border-[#ced4da]"
                                  } block w-full py-2.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5`}
                                  onChange={handleChange}
                                />
                                {errors.province && (
                                  <div className="mt-1 flex items-center text-[12px] font-[400] leading-[18px] gap-1">
                                    <span className="flex items-center justify-center h-4">
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <g id="Question Circle">
                                          <path
                                            id="Shape"
                                            d="M8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2ZM8 10.5C7.58579 10.5 7.25 10.8358 7.25 11.25C7.25 11.6642 7.58579 12 8 12C8.41421 12 8.75 11.6642 8.75 11.25C8.75 10.8358 8.41421 10.5 8 10.5ZM8 4.5C6.89543 4.5 6 5.39543 6 6.5C6 6.77614 6.22386 7 6.5 7C6.77614 7 7 6.77614 7 6.5C7 5.94772 7.44772 5.5 8 5.5C8.55228 5.5 9 5.94772 9 6.5C9 6.87058 8.91743 7.07932 8.63398 7.39755L8.51804 7.52255L8.25395 7.79209C7.71178 8.36031 7.5 8.76947 7.5 9.5C7.5 9.77614 7.72386 10 8 10C8.27614 10 8.5 9.77614 8.5 9.5C8.5 9.12942 8.58257 8.92068 8.86602 8.60245L8.98196 8.47745L9.24605 8.20791C9.78822 7.63969 10 7.23053 10 6.5C10 5.39543 9.10457 4.5 8 4.5Z"
                                            fill="#DC2626"
                                          ></path>
                                        </g>
                                      </svg>
                                    </span>
                                    <span className="text-[#dc2626]">
                                      {errors.province}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mb-3">
                              <div>
                                <input
                                  type="text"
                                  name="district"
                                  placeholder="Quận/Huyện"
                                  value={formData.district}
                                  className={`${
                                    errors.district
                                      ? "border-[#dc2626]"
                                      : "border-[#ced4da]"
                                  } block w-full py-2.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5`}
                                  onChange={handleChange}
                                />
                                {errors.district && (
                                  <div className="mt-1 flex items-center text-[12px] font-[400] leading-[18px] gap-1">
                                    <span className="flex items-center justify-center h-4">
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <g id="Question Circle">
                                          <path
                                            id="Shape"
                                            d="M8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2ZM8 10.5C7.58579 10.5 7.25 10.8358 7.25 11.25C7.25 11.6642 7.58579 12 8 12C8.41421 12 8.75 11.6642 8.75 11.25C8.75 10.8358 8.41421 10.5 8 10.5ZM8 4.5C6.89543 4.5 6 5.39543 6 6.5C6 6.77614 6.22386 7 6.5 7C6.77614 7 7 6.77614 7 6.5C7 5.94772 7.44772 5.5 8 5.5C8.55228 5.5 9 5.94772 9 6.5C9 6.87058 8.91743 7.07932 8.63398 7.39755L8.51804 7.52255L8.25395 7.79209C7.71178 8.36031 7.5 8.76947 7.5 9.5C7.5 9.77614 7.72386 10 8 10C8.27614 10 8.5 9.77614 8.5 9.5C8.5 9.12942 8.58257 8.92068 8.86602 8.60245L8.98196 8.47745L9.24605 8.20791C9.78822 7.63969 10 7.23053 10 6.5C10 5.39543 9.10457 4.5 8 4.5Z"
                                            fill="#DC2626"
                                          ></path>
                                        </g>
                                      </svg>
                                    </span>
                                    <span className="text-[#dc2626]">
                                      {errors.district}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mb-3">
                              <input
                                type="text"
                                name="ward"
                                placeholder="Phường/Xã"
                                value={formData.ward}
                                className={`${
                                  errors.ward
                                    ? "border-[#dc2626]"
                                    : "border-[#ced4da]"
                                } block w-full py-2.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5`}
                                onChange={handleChange}
                              />
                              {errors.ward && (
                                <div className="mt-1 flex items-center text-[12px] font-[400] leading-[18px] gap-1">
                                  <span className="flex items-center justify-center h-4">
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <g id="Question Circle">
                                        <path
                                          id="Shape"
                                          d="M8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2ZM8 10.5C7.58579 10.5 7.25 10.8358 7.25 11.25C7.25 11.6642 7.58579 12 8 12C8.41421 12 8.75 11.6642 8.75 11.25C8.75 10.8358 8.41421 10.5 8 10.5ZM8 4.5C6.89543 4.5 6 5.39543 6 6.5C6 6.77614 6.22386 7 6.5 7C6.77614 7 7 6.77614 7 6.5C7 5.94772 7.44772 5.5 8 5.5C8.55228 5.5 9 5.94772 9 6.5C9 6.87058 8.91743 7.07932 8.63398 7.39755L8.51804 7.52255L8.25395 7.79209C7.71178 8.36031 7.5 8.76947 7.5 9.5C7.5 9.77614 7.72386 10 8 10C8.27614 10 8.5 9.77614 8.5 9.5C8.5 9.12942 8.58257 8.92068 8.86602 8.60245L8.98196 8.47745L9.24605 8.20791C9.78822 7.63969 10 7.23053 10 6.5C10 5.39543 9.10457 4.5 8 4.5Z"
                                          fill="#DC2626"
                                        ></path>
                                      </g>
                                    </svg>
                                  </span>
                                  <span className="text-[#dc2626]">
                                    {errors.ward}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="mb-3">
                              <div>
                                <input
                                  type="text"
                                  name="streetAddress"
                                  placeholder="Địa chỉ cụ thể"
                                  value={formData.streetAddress}
                                  className={`${
                                    errors.streetAddress
                                      ? "border-[#dc2626]"
                                      : "border-[#ced4da]"
                                  } block w-full py-2.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5`}
                                  onChange={handleChange}
                                />
                                {errors.streetAddress && (
                                  <div className="mt-1 flex items-center text-[12px] font-[400] leading-[18px] gap-1">
                                    <span className="flex items-center justify-center h-4">
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <g id="Question Circle">
                                          <path
                                            id="Shape"
                                            d="M8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2ZM8 10.5C7.58579 10.5 7.25 10.8358 7.25 11.25C7.25 11.6642 7.58579 12 8 12C8.41421 12 8.75 11.6642 8.75 11.25C8.75 10.8358 8.41421 10.5 8 10.5ZM8 4.5C6.89543 4.5 6 5.39543 6 6.5C6 6.77614 6.22386 7 6.5 7C6.77614 7 7 6.77614 7 6.5C7 5.94772 7.44772 5.5 8 5.5C8.55228 5.5 9 5.94772 9 6.5C9 6.87058 8.91743 7.07932 8.63398 7.39755L8.51804 7.52255L8.25395 7.79209C7.71178 8.36031 7.5 8.76947 7.5 9.5C7.5 9.77614 7.72386 10 8 10C8.27614 10 8.5 9.77614 8.5 9.5C8.5 9.12942 8.58257 8.92068 8.86602 8.60245L8.98196 8.47745L9.24605 8.20791C9.78822 7.63969 10 7.23053 10 6.5C10 5.39543 9.10457 4.5 8 4.5Z"
                                            fill="#DC2626"
                                          ></path>
                                        </g>
                                      </svg>
                                    </span>
                                    <span className="text-[#dc2626]">
                                      {errors.streetAddress}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="rounded-t-3xl border-t border-[#e4e8ed] px-6 py-4 bg-white">
                          <button
                            type="submit"
                            className="bg-[#dc2626] transition duration-300 ease-in-out hover:bg-red-700 w-full h-11 mb-3 text-white rounded-3xl font-[500] text-[14px] leading-5"
                          >
                            <span>Xác nhận</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </motion.div>
                </>
              )}

              <div className="flex flex-col items-center gap-3 rounded-lg md:px-4 ">
                {addresses.map((address: any) => (
                  <div
                    key={address.id}
                    className="flex w-full items-center gap-2 border-b border-solid border-b-[#e4e8ed] p-4 hover:bg-[#fafafa]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-[50%] bg-[#fee2e2]">
                      <i className="bx bx-map text-[22px] text-red-800"></i>
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="flex items-center">
                        <span className="break-all border-r-2 border-solid border-l-[#e4e8ed] pr-1.5 font-[500]">
                          {address.userName}
                        </span>
                        <span className="pl-1.5 text -[14px] leading-6">
                          {address.mobile}
                        </span>
                      </p>
                      <label className="text-[14px] leading-6">
                        {address.streetAddress}
                      </label>
                    </div>
                    <div className="flex w-20">
                      <span
                        className="flex-1 cursor-pointer p-0 font-[500] text-[#dc2626]"
                        onClick={() => {
                          setFormData(address);
                          handleEdit(address.id);
                          toggleForm();
                        }}
                      >
                        Sửa
                      </span>
                      <span className="flex-1 cursor-pointer border-l-2 border-solid border-l-[#e4e8ed] opacity-40 p-0 text-right font-[500] disabled">
                        Xoá
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default Address;
