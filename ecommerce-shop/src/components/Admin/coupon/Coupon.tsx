import React, { Fragment, useEffect, useState } from "react";
import { Coupon } from "../../../redux/coupon/coupon.type"; // Đảm bảo đường dẫn đúng
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { cancelEdit, startEdit } from "../../../redux/id.slice";
import SkeletonPost from "../../../SkeletonPost";
import {
  useAddCouponMutation,
  useDeleteCouponMutation,
  useGetAllCouponsQuery,
  useGetCouponByIdQuery,
  useSetActiveStatusMutation,
  useUpdateCouponMutation,
} from "../../../redux/coupon/coupon.service";
import { motion } from "framer-motion";

const initialState: Omit<Coupon, "id"> = {
  code: "",
  discountPercentage: 0,
  expirationDate: "",
  active: true,
};

export interface Errors {
  code?: string;
  discountPercentage?: string;
  expirationDate?: string;
  active?: string;
}

const CouponComponent = () => {
  const [formData, setFormData] = useState<Omit<Coupon, "id"> | Coupon>(
    initialState
  );
  const {
    data: coupons = { data: [] },
    isFetching,
    refetch,
  } = useGetAllCouponsQuery();
  const [addCoupon] = useAddCouponMutation();
  const couponId = useSelector((state: RootState) => state.id.id);
  const [deleteCoupon] = useDeleteCouponMutation();
  const { data } = useGetCouponByIdQuery(couponId, {
    skip: !couponId,
  });
  console.log(data);
  const [updateCoupon] = useUpdateCouponMutation();
  const [setActiveStatus] = useSetActiveStatusMutation();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (data && data.data) {
      setFormData({
        code: data.data.code,
        discountPercentage: data.data.discountPercentage,
        expirationDate: data.data.expirationDate,
        active: data.data.active,
      });
    }
  }, [data]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (couponId) {
        const response = await updateCoupon({
          body: formData as Coupon,
          id: couponId,
        }).unwrap();
        toast.success(response.message);
      } else {
        const response = await addCoupon(formData).unwrap();
        toast.success(response.message);
      }
      setFormData(initialState);
      refetch();
    } catch (error: any) {
      if (error.data) {
        setErrors(error.data);
      }
      toast.error(error.data.message);
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

  const handleDelete = async (id: number) => {
    const response = await deleteCoupon(id).unwrap();
    if (response.message) {
      toast.success(response.message);
      refetch();
    }
  };

  const handleCancel = () => {
    dispatch(cancelEdit(0));
    setFormData(initialState);
  };

  const handleEdit = (id: number) => {
    console.log(id);
    dispatch(startEdit(id));
  };

  const handleActiveChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
    id: number
  ) => {
    const isActive = event.target.value === "1";
    try {
      const response = await setActiveStatus({ id, isActive }).unwrap();
      toast.success(response.message);
      refetch();
    } catch (error: any) {
      toast.error(error.data.message);
    }
  };

  return (
    <div>
      <motion.div
        className="mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white  rounded-md flex items-center mb-3 p-2 gap-1 border-b text-[18px] md:text-[22px]">
          <span>
            <i
              className={`${couponId ? "bx bx-edit" : "bx bx-add-to-queue"}`}
            ></i>
          </span>
          <h5 className="text-[#32393f]">
            {couponId ? "Sửa mã giảm giá" : "Thêm mã giảm giá"}
          </h5>
        </div>
        <div>
          <div className="p-6 bg-white  rounded-lg border border-3 ">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <div>
                  <label htmlFor="code" className="mb-2 inline-block">
                    Mã giảm giá
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code || ""}
                    onChange={handleChange}
                    placeholder="Nhập mã giảm giá..."
                    className={`${
                      errors.code ? "border-[#dc2626]" : "border-[#ced4da]"
                    } block w-full py-1.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50`}
                  />
                  {errors.code && (
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
                      <span className="text-[#dc2626]">{errors.code}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div>
                  <label
                    htmlFor="discountPercentage"
                    className="mb-2 inline-block"
                  >
                    Tỷ lệ phần trăm giảm giá
                  </label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage || ""}
                    onChange={handleChange}
                    placeholder="Nhập tỷ lệ phần trăm..."
                    className={`${
                      errors.discountPercentage
                        ? "border-[#dc2626]"
                        : "border-[#ced4da]"
                    } block w-full py-1.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50`}
                  />
                </div>
                {errors.discountPercentage && (
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
                    <span className="text-[#dc2626]">{errors.code}</span>
                  </div>
                )}
              </div>

              <div className="mb-5">
                <div>
                  <label htmlFor="expirationDate" className="mb-2 inline-block">
                    Ngày hết hạn
                  </label>
                  <input
                    type="date"
                    name="expirationDate"
                    value={formData.expirationDate || ""}
                    onChange={handleChange}
                    className={`${
                      errors.expirationDate
                        ? "border-[#dc2626]"
                        : "border-[#ced4da]"
                    } block w-full py-1.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50`}
                  />
                </div>
                {errors.expirationDate && (
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
                      {errors.expirationDate}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-4 flex items-start gap-2">
                <div>
                  <label htmlFor="active" className="mb-2">
                    Trạng thái hoạt động
                  </label>
                  <input
                    type="checkbox"
                    name="active"
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded-full transition duration-150 ease-in-out focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 focus:outline-none"
                    checked={formData.active}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-2 w-full">
                {Boolean(couponId) && (
                  <Fragment>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 min-w-[120px] md:w-[30%] flex justify-center items-center py-2.5 h-12 cursor-pointer focus:shadow-md border-[#008cff] mt-2 text-base font-medium leading-none px-3 bg-[#008cff] hover:bg-[#0b5ed7] hover:border-[#0a58ca] text-white rounded-md"
                    >
                      Hủy cập nhật
                    </button>
                    <button
                      type="submit"
                      className="flex-1 min-w-[120px] md:w-[30%] flex justify-center items-center py-2.5 h-12 cursor-pointer focus:shadow-md border-[#008cff] mt-2 text-base font-medium leading-none px-3 bg-[#008cff] hover:bg-[#0b5ed7] hover:border-[#0a58ca] text-white rounded-md"
                    >
                      Cập nhật mã giảm giá
                    </button>
                  </Fragment>
                )}
                {!Boolean(couponId) && (
                  <button
                    type="submit"
                    className="w-full md:w-[30%] flex justify-center py-2.5 items-center cursor-pointer focus:shadow-md border-[#008cff] mt-2 text-base font-medium leading-6 px-3 bg-[#008cff] hover:bg-[#0b5ed7] hover:border-[#0a58ca] text-white rounded-md"
                  >
                    Lưu mã giảm giá
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="mt-4 bg-white md:w-full w-[360px]">
            {isFetching && <SkeletonPost />}
            {!isFetching && (
              <div className="mx-auto px-6 py-4 border border-3 rounded-lg">
                <div className="max-h-96 overflow-y-auto ">
                  <table className="border-collapse w-full table-auto mb-4 border-b border-[#dee2e6] text-[#212529] hover:bg-[#f8f9fa] hover:text-[#212529]">
                    <thead className="table-header-group table-light text-black bg-[#f8f9fa] hover:bg-[#e5e6e7] hover:text-black active:bg-[#dfe0e1] active:text-black">
                      <tr>
                        <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                          ID
                        </th>
                        <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                          Mã giảm giá
                        </th>
                        <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                          Tỷ lệ giảm giá
                        </th>
                        <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                          Ngày hết hạn
                        </th>
                        <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                          Trạng thái
                        </th>
                        <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    {coupons.data.length > 0 ? (
                      coupons.data.map((coupon: any) => (
                        <tbody key={coupon.id}>
                          <tr>
                            <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                              {coupon.id}
                            </td>
                            <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                              {coupon.code}
                            </td>
                            <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                              {coupon.discountPercentage}%
                            </td>
                            <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                              {new Date(
                                coupon.expirationDate
                              ).toLocaleDateString("vi-VN")}
                            </td>
                            <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                              <select
                                value={coupon.active ? "1" : "0"}
                                onChange={(event) =>
                                  handleActiveChange(event, coupon.id)
                                }
                                className="border border-[#ced4da] rounded-md p-2"
                              >
                                <option value="1">Hoạt động</option>
                                <option value="0">Kết thúc</option>
                              </select>
                            </td>
                            <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                              <div className="flex items-center gap-2">
                                <div>
                                  <button
                                    onClick={() => handleEdit(coupon.id)}
                                    className="hover:text-blue-600 cursor-pointer text-[18px] w-[34px] h-[34px] flex justify-center border border-[#eeecec] items-center bg-[#f1f1f1]"
                                  >
                                    <i className="bx bx-edit"></i>
                                  </button>
                                </div>
                                <div>
                                  <button
                                    onClick={() => handleDelete(coupon.id)}
                                    className="hover:text-red-600 cursor-pointer text-[18px] w-[34px] h-[34px] flex justify-center border border-[#eeecec] items-center bg-[#f1f1f1]"
                                  >
                                    <i className="bx bxs-trash"></i>
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center p-2 border-b">
                          Không có mã giảm giá nào
                        </td>
                      </tr>
                    )}
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CouponComponent;
