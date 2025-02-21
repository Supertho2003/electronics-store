import React, { Fragment, useEffect, useState } from "react";
import { colorProduct } from "../../../redux/color/colorProduct.type";
import {
  useAddColorMutation,
  useDeleteColorMutation,
  useGetAllColorsQuery,
  useGetColorQuery,
  useUpdateColorMutation,
} from "../../../redux/color/colorProduct.service";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { cancelEdit, startEdit } from "../../../redux/id.slice";
import SkeletonPost from "../../../SkeletonPost";
import { motion } from "framer-motion";

const initialState: Omit<colorProduct, "id"> = {
  name: "",
  code: "",
};

interface Errors {
  name?: string;
  code?: string;
}

const Color = () => {
  const [formData, setFormData] = useState<Omit<colorProduct, "id"> | colorProduct>(initialState);
  const { data: colors = { data: [] }, isFetching } = useGetAllColorsQuery();
  const [addColor] = useAddColorMutation();
  const colorId = useSelector((state: RootState) => state.id.id);
  const [deleteColor] = useDeleteColorMutation();
  const { data } = useGetColorQuery(colorId, { skip: !colorId });
  const [updateColor] = useUpdateColorMutation();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<Errors>({});

  // State for confirmation dialog
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (data && data.data) {
      setFormData({ name: data.data.name, code: data.data.code });
    }
  }, [data]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (colorId) {
        const response = await updateColor({
          body: formData as colorProduct,
          id: colorId,
        }).unwrap();
        toast.success(response.message);
        setFormData(initialState);
      } else {
        const response = await addColor(formData).unwrap();
        toast.success(response.message);
        setFormData(initialState);
      }
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
    try {
      const response = await deleteColor(id).unwrap();
      if (response.message) {
        toast.success(response.message);
      }
      setConfirmDeleteId(null); // Close the confirmation dialog
    } catch (error: any) {
      toast.error("Tạm thời chức năng này bị lỗi!");
    }
  };

  const handleCancel = () => {
    dispatch(cancelEdit(0));
    setFormData(initialState);
  };

  const handleEdit = (id: number) => {
    dispatch(startEdit(id));
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
        <div className="flex bg-white rounded-md items-center mb-3 p-2 gap-1 border-b text-[18px] md:text-[22px]">
          <span>
            <i className={`${colorId ? "bx bx-edit" : "bx bx-add-to-queue"}`}></i>
          </span>
          {colorId ? "Sửa thuộc tính" : "Thêm thuộc tính"}
        </div>
        <div>
          <div>
            <div>
              <div className="p-6 border border-3 rounded-md bg-white">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <div>
                      <label htmlFor="name" className="mb-2 inline-block">
                        Tên màu
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        placeholder="Nhập tên màu..."
                        className={`block w-full py-1.5 px-3 font-normal text-[#212529] border border-solid ${
                          errors.name ? "border-[#dc2626]" : "border-[#ced4da]"
                        } bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50`}
                      />
                    </div>
                    {errors.name && (
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
                        <span className="text-[#dc2626]">{errors.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div>
                      <label htmlFor="code" className="mb-2 inline-block">
                        Mã màu
                      </label>
                      <input
                        type="text"
                        name="code"
                        value={formData.code || ""}
                        onChange={handleChange}
                        placeholder="Nhập mã màu..."
                        className={`block w-full py-1.5 px-3 font-normal text-[#212529] border border-solid ${
                          errors.code ? "border-[#dc2626]" : "border-[#ced4da]"
                        } bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50`}
                      />
                    </div>

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

                  <div className="flex flex-wrap justify-center items-center gap-2 w-full">
                    {Boolean(colorId) && (
                      <Fragment>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="flex-1 min-w-[120px] md:w-[30%] flex justify-center items-center py-2.5 h-12 cursor-pointer focus:shadow-md border-[#008cff] mt-2 text-base font-medium leading-none px-3 bg-[#008cff] hover:bg-[#0b5ed7] hover:border-[#0a58ca] text-white rounded-md"
                        >
                          Hủy cập nhập
                        </button>
                        <button
                          type="submit"
                          className="flex-1 min-w-[120px] md:w-[30%] flex justify-center items-center py-2.5 h-12 cursor-pointer focus:shadow-md border-[#008cff] mt-2 text-base font-medium leading-none px-3 bg-[#008cff] hover:bg-[#0b5ed7] hover:border-[#0a58ca] text-white rounded-md"
                        >
                          Cập nhập màu sắc
                        </button>
                      </Fragment>
                    )}
                    {!Boolean(colorId) && (
                      <button
                        type="submit"
                        className="w-full md:w-[30%] flex justify-center py-2.5 items-center cursor-pointer focus:shadow-md border-[#008cff] mt-2 text-base font-medium leading-none px-3 bg-[#008cff] hover:bg-[#0b5 ed7] hover:border-[#0a58ca] text-white rounded-md"
                      >
                        Lưu màu sắc
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
            <div className="mt-4">
              {isFetching && (
                <Fragment>
                  <SkeletonPost />
                </Fragment>
              )}
              {!isFetching && (
                <motion.div
                  className="mx-auto px-6 py-4 border border-3 rounded-md bg-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="max-h-96 overflow-y-auto">
                    <table className="border-collapse w-full table-auto mb-4 border-b border-[#dee2e6] text-[#212529] hover:bg-[#f8f9fa] hover:text-[#212529]">
                      <thead className="table-header-group table-light text-black bg-[#f8f9fa] hover:bg-[#e5e6e7] hover:text-black active:bg-[#dfe0e1] active:text-black">
                        <tr>
                          <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                            ID
                          </th>
                          <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                            Tên màu
                          </th>
                          <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                            Mã màu
                          </th>
                          <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      {colors.data.length > 0 ? (
                        colors.data.map((color) => (
                          <tbody key={color.id}>
                            <tr>
                              <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                                {color.id}
                              </td>
                              <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                                {color.name}
                              </td>
                              <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                                <div
                                  style={{ backgroundColor: color.code }}
                                  className="w-20 uppercase bg-opacity-10 text-[10px] text-center p-2 font-semibold rounded-full"
                                >
                                  {color.code}
                                </div>
                              </td>
                              <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                                <div className="flex items-center gap-2">
                                  <div>
                                    <button
                                      onClick={() => handleEdit(color.id)}
                                      className="hover:text-blue-600 cursor-pointer text-[18px] w-[34px] h-[34px] flex justify-center border border-[#eeecec] items-center bg-[#f1f1f1]"
                                    >
                                      <i className="bx bx-edit"></i>
                                    </button>
                                  </div>
                                  <div>
                                    <button
                                      onClick={() => setConfirmDeleteId(color.id)}
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
                          <td colSpan={4} className="text-center p-2 border-b">
                            Không có màu nào
                          </td>
                        </tr>
                      )}
                    </table>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {confirmDeleteId !== null && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <h3 className="text -lg font-[500] text-black mb-2">Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa màu này?</p>
            <div className="mt-4">
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="mr-2 px-4 py-2 bg-red-500 text-white rounded"
              >
                Xóa
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)} // Close the dialog
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Hủy
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Color;