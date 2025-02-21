import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../../redux/order/order.service"; // Đảm bảo đường dẫn đúng
import Header from "../Header";
import { useGetCartQuery } from "../../redux/cart/cart.service";
import Footer from "../Footer";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import {
  useAddAddressMutation,
  useGetAddressByIdQuery,
  useGetAddressesQuery,
  useUpdateAddressMutation,
} from "../../redux/address/address.service";
import { AddAddressRequest } from "../../redux/address/address.type";
import { toast } from "react-toastify";
import { cancelEdit, startEdit } from "../../redux/id.slice";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

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

const Payment = () => {
  const formatCurrency = (amount: number) => {
    return amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };

  const PaymentMethod = {
    VNPAY: "VNPAY",
    COD: "COD",
  };
  const navigate = useNavigate();
  const [placeOrder] = useCreateOrderMutation();
  const { data: cart = { data: [] }, isFetching, refetch } = useGetCartQuery();
  const { data: addresses = [], isLoading: isLoadingAddresses } =
    useGetAddressesQuery();
  const [address, setAddress] = useState<
    Omit<AddAddressRequest, "id"> | AddAddressRequest
  >(initialState);
  const [formData, setFormData] =
    useState<Omit<AddAddressRequest, "id">>(initialState);
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.COD);
  const [deliveryMethod, setDeliveryMethod] = useState("HOME_DELIVERY");
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [addAddress] = useAddAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const addressId = useSelector((state: RootState) => state.id.id);
  console.log(addressId);
  const { data, error } = useGetAddressByIdQuery(addressId, {
    skip: !addressId,
  });
  const [errors, setErrors] = useState<Errors>({});
  console.log(data);
  const dispatch = useDispatch();
  const discountAmount = useSelector(
    (state: RootState) => state.discount.amount
  );

  const totalAmount = cart.data.totalAmount;
  const totalPayable = totalAmount - discountAmount;

  const handleAddAddress = () => {
    dispatch(cancelEdit(0));
    setIsAddingNewAddress(true);
  };

  useEffect(() => {
    if (addresses.length > 0) {
      const oldAddress = addresses[0];
      setAddress({
        userName: oldAddress.userName,
        streetAddress: oldAddress.streetAddress,
        province: oldAddress.province,
        district: oldAddress.district,
        ward: oldAddress.ward,
        mobile: oldAddress.mobile,
      });
    }
  }, [addresses]);

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

  useEffect(() => {
    if (isEditing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isEditing]);

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
      setIsEditing(false);
      dispatch(cancelEdit(0));
      setFormData(initialState);
    } catch (error: any) {
      if (error.data) {
        setErrors(error.data);
      } else {
        toast.error(error.data.message);
      }
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await placeOrder({
        address,
        note,
        paymentMethod,
        deliveryMethod,
        discountAmount,
        totalPayable,
      }).unwrap();

      if (paymentMethod === PaymentMethod.VNPAY && response.data) {
        window.location.href = response.data;
      } else {
        navigate("/dat-hang/thanh-cong");
      }
    } catch (error: any) {
      if (error.data) {
        setErrors(error.data);
      } else {
        toast.error(error.data.message);
      }
    }
  };

  const handleChange = () => {
    setIsEditing(!isEditing);
    dispatch(cancelEdit(0));
    setErrors({});
    setIsAddingNewAddress(false);
    setFormData(initialState);
  };

  const handleAddressChange = (index: any) => {
    setSelectedAddress(index);
    const selectedAddr = addresses[index];
    setAddress({
      userName: selectedAddr.userName,
      streetAddress: selectedAddr.streetAddress,
      province: selectedAddr.province,
      district: selectedAddr.district,
      ward: selectedAddr.ward,
      mobile: selectedAddr.mobile,
    });
  };

  const handleConfirmAddress = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (addresses.length > 0 && selectedAddress === null) {
      setSelectedAddress(0); // Chọn địa chỉ đầu tiên nếu chưa có địa chỉ nào được chọn
    }
  }, [addresses, selectedAddress]);

  const handleEdit = (id: number) => {
    dispatch(startEdit(id));
    setIsAddingNewAddress(true);
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
        {cart.data ? (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-[60%]">
              {cart.data.items ? (
                <div className="bg-white px-4 py-3 rounded-lg ">
                  <div className="font-[500] text-[16px] leading-6 text-[#090d14] mb-4">
                    Sản phẩm trong đơn ({cart.data.items.length})
                  </div>
                  {cart.data.items.map((e: any) => (
                    <div key={e.product.id}>
                      <div className="flex justify-between mb-6 border-b pb-6">
                        <div className="flex items-center gap-3">
                          <div className="md:p-2 p-1.5 flex items-center border border-solid rounded-[0.5rem] h-16 w-16 ">
                            <img
                              width="50"
                              height="50"
                              src={`${e.product.imageUrl}`}
                              alt=""
                            />
                          </div>
                          <div>
                            <div className="max-w-[25rem]">
                              <span className="text-[14px] md:text-[16px] text-black font-[500] leading-5">
                                {e.product.name}
                              </span>
                            </div>
                            <div className="flex w-[85px] items-center rounded-[4px] px-2.5 py-1.5 bg-[#f3f4f6] cursor-pointer">
                              <span>Màu: {e.color.name}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex md:items-center md:gap-6">
                          <div className="whitespace-nowrap">
                            <span className="font-[500] text-[#dc2626]">
                              {formatCurrency(e.unitPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="col-span-2 text-center">
                  Không có sản phẩm nào
                </div>
              )}
              <div className="bg-white px-4 py-3 mt-4 rounded-lg">
                <div className="font-[500] text-[16px] leading-6 text-[#090d14] mb-4">
                  Người đặt hàng
                </div>
                {addresses.length > 0 ? (
                  <div className="flex flex-col rounded-md border border-gray-300 p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-[500] text-[12px] leading-[18px] text-[#6b7280]">
                        Giao tới
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {selectedAddress !== null ? (
                        <>
                          <span className="font-[500] text-[14px] leading-5 text-[#090d14]">
                            {addresses[selectedAddress].userName}
                          </span>
                          <span className="text-[12px] font-[500] leading-[18px] text-[#090d14]">
                            {addresses[selectedAddress].mobile}
                          </span>
                        </>
                      ) : (
                        <span className="text-[12px] font-[500] leading-[18px] text-[#090d14]">
                          Chưa chọn địa chỉ
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <div>
                        <input
                          type="text"
                          name="userName"
                          placeholder="Họ và tên"
                          className={`${
                            errors.userName
                              ? "border-[#dc2626]"
                              : "border-[#ced4da]"
                          } block w-full py-2.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5`}
                          onChange={(e) =>
                            setAddress({ ...address, userName: e.target.value })
                          }
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
                    <div className="mb-4">
                      <div>
                        <input
                          type="text"
                          name="mobile"
                          placeholder="Số điện thoại"
                          className={`${
                            errors.mobile
                              ? "border-[#dc2626]"
                              : "border-[#ced4da]"
                          } block w-full py-2.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5`}
                          onChange={(e) =>
                            setAddress({ ...address, mobile: e.target.value })
                          }
                        />
                      </div>
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
                )}
              </div>
              <div className="mt-4 bg-white px-4 py-3 rounded-lg">
                <div className="font-[500] text-[16px] leading-6 text-[#090d14] mb-4">
                  Hình thức nhận hàng
                </div>
                <div>
                  <div className="flex gap-6 ">
                    <div className="flex items-center mb-2">
                      <label className="flex items-center cursor-pointer gap-2">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="HOME_DELIVERY"
                          checked={deliveryMethod === "HOME_DELIVERY"}
                          onChange={() => setDeliveryMethod("HOME_DELIVERY")}
                          className="hidden"
                        />
                        <div
                          className={`w-4 h-4 border-2 rounded-full flex items-center justify-center mr-2 transition-colors duration-300 ease-in-out ${
                            deliveryMethod === "HOME_DELIVERY"
                              ? "border-red-500"
                              : "border-gray-300 hover:border-red-400"
                          }`}
                        >
                          {deliveryMethod === "HOME_DELIVERY" && (
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full transition-all duration-300 ease-in-out"></div>
                          )}
                        </div>
                        <span className="text-[14px] text-[#090d14]">
                          Giao hàng tận nơi
                        </span>
                      </label>
                    </div>
                    <div className="flex items-center mb-2">
                      <label className="flex items-center cursor-pointer gap-2">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value="STORE_PICKUP"
                          checked={deliveryMethod === "STORE_PICKUP"}
                          onChange={() => setDeliveryMethod("STORE_PICKUP")}
                          className="hidden"
                        />
                        <div
                          className={`w-4 h-4 border-2 rounded-full flex items-center justify-center mr-2 transition-colors duration-300 ease-in-out ${
                            deliveryMethod === "STORE_PICKUP"
                              ? "border-red-500"
                              : "border-gray-300 hover:border-red-400"
                          }`}
                        >
                          {deliveryMethod === "STORE_PICKUP" && (
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full transition-all duration-300 ease-in-out"></div>
                          )}
                        </div>
                        <span className="text-[14px] text-[#090d14]">
                          Nhận tại cửa hàng
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white px-4 py-3 rounded-lg">
                {addresses.length > 0 ? (
                  <div className="flex flex-col rounded-md border border-gray-300 p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-[500] text-[12px] leading-[18px] text-[#6b7280]">
                        Giao tới
                      </span>
                      <span
                        onClick={handleChange}
                        className="cursor-pointer font-[500] text-[14px] leading-5 text-[#1250dc]"
                      >
                        Thay đổi
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {selectedAddress !== null ? (
                        <>
                          <span className="font-[500] text-[14px] leading-5 text-[#090d14]">
                            {`${addresses[selectedAddress].ward}, ${addresses[selectedAddress].district}, ${addresses[selectedAddress].province}`}
                          </span>
                          <span className="text-[12px] font-[500] leading-[18px] text-[#090d14]">
                            {addresses[selectedAddress].streetAddress}
                          </span>
                        </>
                      ) : (
                        <span className="text-[12px] font-[500] leading-[18px] text-[#090d14]">
                          Chưa chọn địa chỉ
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <input
                        type="text"
                        name="province"
                        placeholder="Tỉnh/Thành Phố"
                        className={`${
                          errors.province
                            ? "border-[#dc2626]"
                            : "border-[#ced4da]"
                        } block w-full py-2.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5`}
                        onChange={(e) =>
                          setAddress({ ...address, province: e.target.value })
                        }
                      />
                      <div>
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
                              {errors.province}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mb-4">
                      <div>
                        <input
                          type="text"
                          name="district"
                          placeholder="Quận/Huyện"
                          className={`${
                            errors.district
                              ? "border-[#dc2626]"
                              : "border-[#ced4da]"
                          } block w-full py-2.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5`}
                          onChange={(e) =>
                            setAddress({ ...address, district: e.target.value })
                          }
                        />
                      </div>
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
                    <div className="mb-4">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Phường/Xã"
                          className={`${
                            errors.ward
                              ? "border-[#dc2626]"
                              : "border-[#ced4da]"
                          } block w-full py-2.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5`}
                          onChange={(e) =>
                            setAddress({ ...address, ward: e.target.value })
                          }
                        />
                      </div>
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
                          <span className="text-[#dc2626]">{errors.ward}</span>
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <div>
                        <input
                          type="text"
                          name="streetAddress"
                          placeholder="Địa chỉ cụ thể"
                          className="block w-full py-2.5 px-3 font-normal text-[#212529] border border-solid border-[#ced4da] bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5"
                          onChange={(e) =>
                            setAddress({
                              ...address,
                              streetAddress: e.target.value,
                            })
                          }
                        />
                      </div>

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
                )}

                <div className="mb-4">
                  <textarea
                    placeholder="Ghi chú (Ví dụ: Hãy gọi cho tôi khi chuẩn bị hàng xong)"
                    className="block w-full py-2.5 px-3 font-normal text-[#212529] border border-solid border-[#ced4da] bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5"
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black opacity-50 z-10"
                  onClick={handleChange}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                ></motion.div>

                {/* Form địa chỉ */}
                <motion.div
                  className="fixed inset-y-0 right-0 md:w-1/3 h-full z-20 bg-white border border-gray-300 rounded-md shadow-lg"
                  initial={{ x: "100%" }}
                  animate={{ x: "0%" }}
                  exit={{ x: "100%" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="flex justify-between items-center py-3 px-4 border-b">
                    <h2 className="font-[400] text-[14px] text-[#090d14] leading-4">
                      Chọn địa chỉ nhận hàng
                    </h2>
                    <button
                      onClick={handleChange} // Gọi hàm để đóng form
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 28 28"
                        fill="#090d14"
                        xmlns="http://www.w3.org/2000/svg"
                        className="Sheet_icon__RnybF cursor-pointer"
                      >
                        <path d="M6.2097 6.3871L6.29289 6.29289C6.65338 5.93241 7.22061 5.90468 7.6129 6.2097L7.70711 6.29289L14 12.585L20.2929 6.29289C20.6834 5.90237 21.3166 5.90237 21.7071 6.29289C22.0976 6.68342 22.0976 7.31658 21.7071 7.70711L15.415 14L21.7071 20.2929C22.0676 20.6534 22.0953 21.2206 21.7903 21.6129L21.7071 21.7071C21.3466 22.0676 20.7794 22.0953 20.3871 21.7903L20.2929 21.7071L14 15.415L7.70711 21.7071C7.31658 22.0976 6.68342 22.0976 6.29289 21.7071C5.90237 21.3166 5.90237 20.6834 6.29289 20.2929L12.585 14L6.29289 7.70711C5.93241 7.34662 5.90468 6.77939 6.2097 6.3871L6.29289 6.29289L6.2097 6.3871Z"></path>
                      </svg>
                    </button>
                  </div>
                  <div className="h-full w-full">
                    {!isAddingNewAddress ? (
                      <div className="relative">
                        <div
                          className="flex w-full flex-col overflow-y-auto"
                          style={{ height: `calc(-169px + 100vh)` }}
                        >
                          {addresses.length > 0 ? (
                            addresses.map((addr: any, index: any) => (
                              <div
                                key={addr.id}
                                className="flex cursor-pointer border-b p-4 border-[#e5e7eb]"
                              >
                                <label
                                  className="flex items-center w-full gap-2"
                                  onClick={() => handleAddressChange(index)}
                                >
                                  <input
                                    type="radio"
                                    name="savedAddress"
                                    value={index}
                                    checked={selectedAddress === index}
                                    onChange={() => handleAddressChange(index)}
                                    className="hidden" // Ẩn radio button mặc định
                                  />
                                  <div
                                    className={`w-4 h-4 border-2 rounded-full flex items-center justify-center mr-2 ${
                                      selectedAddress === index
                                        ? "border-red-500"
                                        : "border-gray-300"
                                    }`}
                                  >
                                    {selectedAddress === index && (
                                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                                    )}
                                  </div>
                                  <div className="flex flex-grow flex-col gap-1">
                                    <div className="flex gap-2">
                                      <div className="font-[500] md:text-[16px] md:leading-6 text-[#090d14]">
                                        {addr.userName}
                                      </div>
                                      <div className="block border-gray-300 after:content-[''] border-l h-4"></div>
                                      <div className="text-[14px] leading-5 font-[500] text-[#090d14]">
                                        {addr.mobile}
                                      </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      <p className="text-[16px] leading-6 font-[400] text-[#6b7280]">{`${addr.streetAddress}, ${addr.ward}, ${addr.district}, ${addr.province}`}</p>
                                    </div>
                                  </div>
                                </label>
                                <div
                                  onClick={() => handleEdit(addr.id)}
                                  className="font-[500] text-[14px] leading-5 text-[#1250dc]"
                                >
                                  Sửa
                                </div>
                              </div>
                            ))
                          ) : (
                            <div>Không có địa chỉ nào đã lưu.</div>
                          )}
                        </div>
                        <div className="bottom-0 right-0 flex w-full flex-col gap-3 bg-white p-4 shadow-lg">
                          <button
                            type="button"
                            onClick={handleConfirmAddress}
                            className="text-base font-medium h-14 py-0 px-3 bg-[#dc2626] rounded-md text-white hover:bg-[#b91c1c] transaction-all duration-300 ease-in-out"
                          >
                            <span>Xác nhận</span>
                          </button>
                          <div
                            onClick={handleAddAddress}
                            className="mx-auto cursor-pointer font-[500] text-[#dc2626] text-[16px]"
                          >
                            Thêm địa chỉ
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 py-3">
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
                                      placeholder="Nhập họ và tên"
                                      value={formData.userName}
                                      className={`${
                                        errors.userName
                                          ? "border-[#dc2626]"
                                          : "border-[#ced4da]"
                                      } block w-full py-2.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5`}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          userName: e.target.value,
                                        })
                                      }
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
                                      placeholder="Nhập số điện thoại"
                                      value={formData.mobile}
                                      className={`${
                                        errors.mobile
                                          ? "border-[#dc2626]"
                                          : "border-[#ced4da]"
                                      } block w-full py-2.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5`}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          mobile: e.target.value,
                                        })
                                      }
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
                                      placeholder="Tỉnh/Thành Phố"
                                      value={formData.province}
                                      className={`${
                                        errors.province
                                          ? "border-[#dc2626]"
                                          : "border-[#ced4da]"
                                      } block w-full py-2.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5`}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          province: e.target.value,
                                        })
                                      }
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
                                                d="M8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2ZM8 10.5C7.58579 10.5 7.25 10.8358 7.25 11.25C7.25 11.6642 7.58579 12 8 12C8.41421 12 8.75 11.6642 8.75 11.25C8.75 10.8358 8.41421 10.5 8 10.5ZM8 4.5C6.89543 4.5 6 5.39543 6 6.5C6 6.77614 6.22386 7 6.5 7C6.77614 7 7  6.77614 7 6.5C7 5.94772 7.44772 5.5 8 5.5C8.55228 5.5 9 5.94772 9 6.5C9 6.87058 8.91743 7.07932 8.63398 7.39755L8.51804 7.52255L8.25395 7.79209C7.71178 8.36031 7.5 8.76947 7.5 9.5C7.5 9.77614 7.72386 10 8 10C8.27614 10 8.5 9.77614 8.5 9.5C8.5 9.12942 8.58257 8.92068 8.86602 8.60245L8.98196 8.47745L9.24605 8.20791C9.78822 7.63969 10 7.23053 10 6.5C10 5.39543 9.10457 4.5 8 4.5Z"
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
                                      placeholder="Quận/Huyện"
                                      value={formData.district}
                                      className={`${
                                        errors.district
                                          ? "border-[#dc2626]"
                                          : "border-[#ced4da]"
                                      } block w-full py-2.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5`}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          district: e.target.value,
                                        })
                                      }
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
                                                d="M8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2ZM8 10.5C7.58579 10.5 7.25 10.8358 7.25 11.25C7.25 11.6642 7.58579 12 8 12C8.41421 12 8.75 11.6642 8.75 11.25C8.75 10.8358 8.41421 10.5 8 10.5ZM8 4.5C6.89543 4.5 6 5.39543 6 6.5C6 6.77614 6.22386 7 6.5 7C6.77614 7 7 6.77614 7 6.5C7 5.94772 7.44772 5.5 8 5.5C8.55228 5.5 9 5.94772 9 6.5C9 6.87058 8.91743 7.07932 8.63398 7.39755L8.51804 7.52255L8.25395 7.79209C7.71178 8.36031 7.5 8.76947 7.5 9.5C7.5 9.77614 7.72386 10 8 10C8.27614 10 8.5 9.77614 8.5  9.5C8.5 9.12942 8.58257 8.92068 8.86602 8.60245L8.98196 8.47745L9.24605 8.20791C9.78822 7.63969 10 7.23053 10 6.5C10 5.39543 9.10457 4.5 8 4.5Z"
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
                                  <div>
                                    <input
                                      type="text"
                                      placeholder="Phường/Xã"
                                      value={formData.ward}
                                      className={`${
                                        errors.ward
                                          ? "border-[#dc2626]"
                                          : "border-[#ced4da]"
                                      } block w-full py-2.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5`}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          ward: e.target.value,
                                        })
                                      }
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
                                </div>
                                <div className="mb-3">
                                  <div>
                                    <input
                                      type="text"
                                      placeholder="Địa chỉ cụ thể"
                                      value={formData.streetAddress}
                                      className={`${
                                        errors.streetAddress
                                          ? "border-[#dc2626]"
                                          : "border-[#ced4da]"
                                      } block w-full py-2.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-black focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-20 hover:border-black hover:outline-none hover:ring-0.5 hover:ring-black hover:ring-opacity-5`}
                                      onChange={(e) =>
                                        setFormData({
                                          ...formData,
                                          streetAddress: e.target.value,
                                        })
                                      }
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
                            <div className="absolute bottom-0 right-0 flex w-full flex-col gap-3 bg-white p-4 shadow-lg">
                              <button
                                type="submit"
                                className="text-base font-medium h-14 py-0 px-3 bg-[#dc2626] rounded-md text-white hover:bg-[#b91c1c] transaction-all duration-300 ease-in-out"
                              >
                                <span>Xác nhận</span>
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}

            <div className="bg-white w-full md:w-[40%] rounded-lg px-4 ">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePlaceOrder();
                }}
              >
                <div className="bg-white md:px-4 md:py-3 mt-4 rounded-lg">
                  <div className="font-[500] text-[16px] leading-6 text-[#090d14] mb-2">
                    Chọn phương thức thanh toán:
                  </div>
                  <div>
                    <div className="flex items-center ">
                      <label className="flex items-center cursor-pointer gap-2">
                        <input
                          type="radio"
                          value={PaymentMethod.COD}
                          checked={paymentMethod === PaymentMethod.COD}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="hidden"
                        />
                        <div
                          className={`w-4 h-4 border-2 rounded-full flex items-center justify-center mr-2 ${
                            paymentMethod === PaymentMethod.COD
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          {paymentMethod === PaymentMethod.COD && (
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <img
                            width={40}
                            height={40}
                            src="https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/cod.png?w=96&q=100"
                            alt=""
                          />
                        </div>
                        <div>
                          <span className="text-xs text-[#090d14]">
                            COD - Thanh toán khi nhận hàng
                          </span>
                        </div>
                      </label>
                    </div>
                    <div className="flex items-center ">
                      <label className="flex items-center cursor-pointer gap-2">
                        <input
                          type="radio"
                          value={PaymentMethod.VNPAY} // Sử dụng enum
                          checked={paymentMethod === PaymentMethod.VNPAY}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="hidden"
                        />
                        <div
                          className={`w-4 h-4 border-2 rounded-full flex items-center justify-center mr-2 ${
                            paymentMethod === PaymentMethod.VNPAY
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          {paymentMethod === PaymentMethod.VNPAY && (
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <img
                            width={40}
                            height={40}
                            src="https://s3-sgn09.fptcloud.com/ict-payment-icon/payment/vnpay.png?w=96&q=100"
                            alt=""
                          />
                        </div>
                        <div>
                          <span className="text-xs text-[#090d14]">
                            Thanh toán bằng thẻ ATM nội địa (Qua VNPay)
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="font-[500] text-[16px] leading-6 text-[#090d14] mb-2 mt-4">
                    Thông tin đơn hàng
                  </div>
                  <div>
                    <div className="flex justify-between mt-2 border-b pb-2">
                      <span>Tổng tiền:</span>
                      <span className="font-[500] text-[#090d14]">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2 border-b pb-2">
                      <span>Tổng khuyến mãi:</span>
                      <span className="font-[500] text-[#090d14]">
                        {formatCurrency(discountAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2 border-b pb-2">
                      <span>Cần thanh toán:</span>
                      <span className="font-[500] text-[#dc2626]">
                        {formatCurrency(totalPayable)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 md:mt-2 text-base font-medium h-14 leading-6 px-3 bg-[#dc2626] w-full text-white rounded-md"
                >
                  <span>Đặt hàng</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div>Không có đơn hàng nào</div>
        )}
      </motion.div>
      <Footer />
    </div>
  );
};

export default Payment;
