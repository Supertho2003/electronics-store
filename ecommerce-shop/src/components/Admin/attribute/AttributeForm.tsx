import React, { Fragment, useEffect, useState } from "react";
import { Attribute } from "../../../redux/attribute/attribute.type";
import {
  useAddAttributeMutation,
  useDeleteAttributeMutation,
  useGetAllAttributesQuery,
  useGetAttributeQuery,
  useUpdateAttributeMutation,
} from "../../../redux/attribute/attribute.service";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { cancelEdit, startEdit } from "../../../redux/id.slice";
import SkeletonPost from "../../../SkeletonPost";
import { motion } from "framer-motion";

const initialState: Omit<Attribute, "id"> = {
  attributeName: "",
  values: [],
};

interface Errors {
  attributeName?: string;
  values?: string;
}

const AttributeForm = () => {
  const [formData, setFormData] = useState<Omit<Attribute, "id"> | Attribute>(initialState);
  const { data: attributes = { data: [] }, isFetching } = useGetAllAttributesQuery();
  const [addAttribute] = useAddAttributeMutation();
  const attributeId = useSelector((state: RootState) => state.id.id);
  const [deleteAttribute] = useDeleteAttributeMutation();
  const { data } = useGetAttributeQuery(attributeId, { skip: !attributeId });
  const [updateAttribute] = useUpdateAttributeMutation();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<Errors>({});
  
  
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (data && data.data) {
      setFormData({
        attributeName: data.data.attributeName,
        values: data.data.values,
      });
    }
  }, [data]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (attributeId) {
        const response = await updateAttribute({
          body: formData as Attribute,
          id: attributeId,
        }).unwrap();
        toast.success(response.message);
      } else {
        const response = await addAttribute(formData).unwrap();
        toast.success(response.message);
      }
      setFormData(initialState);
    } catch (error: any) {
      if (error.data) {
        setErrors(error.data);
      }
      toast.error(error.data.message);
    }
  };

  const handleValuesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const valuesArray = inputValue.split(",").map((value) => value.trim());
    setFormData((prev) => ({
      ...prev,
      values: valuesArray as any,
    }));
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteAttribute(id).unwrap();
      if (response.message) {
        toast.success(response.message);
      }
      setConfirmDeleteId(null); 
    } catch (error: any) {
      toast.error("Tạm thời chức năng này bị lỗi!");
    }
  };

  const handleCancel = () => {
    dispatch(cancelEdit(0));
    setFormData(initialState);
    setErrors({});
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
        <div className="flex items-center mb-3 rounded-md bg-white p-2 gap-1 border-b text-[22px]">
          <i className={`${attributeId ? "bx bx-edit" : "bx bx-add-to-queue"}`}></i>
          {attributeId ? "Sửa thuộc tính" : "Thêm thuộc tính"}
        </div>
        <div>
          <div>
            <div>
              <div className="p-6 border border-3 rounded-md bg-white">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <div>
                      <label htmlFor="" className="mb-2 inline-block">
                        Tên thuộc tính
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.attributeName || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            attributeName: e.target.value,
                          }))
                        }
                        placeholder="Nhập tên thuộc tính (ví dụ: CPU, RAM, Kích thước màn hình)"
                        className={`${
                          errors.attributeName
                            ? "border-[#dc2626]"
                            : "border-[#ced4da]"
                        } block w-full py-1.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50`}
                      />
                    </div>
                    {errors.attributeName && (
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
                          {errors.attributeName}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div>
                      <label htmlFor="" className="mb-2 inline-block">
                        Giá trị thuộc tính
                      </label>
                      <input
                        type="text"
                        placeholder="Nhập các giá trị, cách nhau bởi dấu phẩy (ví dụ: Intel, AMD, 4GB, 8GB, 11 inch, 13.3 inch)"
                        value={formData.values.join(", ")}
                        onChange={handleValuesChange}
                        className={`${
                          errors.values
                            ? "border-[#dc2626]"
                            : "border-[#ced4da]"
                        } block w-full py-1.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50`}
                      />
                    </div>
                    {errors.values && (
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
                        <span className="text-[#dc2626]">{errors.values}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-center items-center gap-2 w-full">
                    {Boolean(attributeId) && (
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
                          Cập nhập thuộc tính
                        </button>
                      </Fragment>
                    )}
                    {!Boolean(attributeId) && (
                      <button
                        type="submit"
                        className="w-full md:w-[30%] flex justify-center py-2.5 items-center cursor-pointer focus:shadow-md border-[#008cff] mt-2 text-base font-medium leading-6 px-3 bg-[#008cff] hover:bg -[#0b5ed7] hover:border-[#0a58ca] text-white rounded-md"
                      >
                        Lưu thuộc tính
                      </button>
                    )}
                  </div>
                </form>
              </div>
              <div className="mt-4">
                {isFetching && (
                  <Fragment>
                    <SkeletonPost />
                  </Fragment>
                )}
                {!isFetching && (
                  <div className="mx-auto px-6 py-4 border border-3 rounded-md bg-white">
                    <div className="max-h-96 overflow-y-auto">
                      <table className="border-collapse w-full table-auto mb-4 border-b border-[#dee2e6] text-[#212529] hover:bg-[#f8f9fa] hover:text-[#212529]">
                        <thead className="table-header-group table-light text-black bg-[#f8f9fa] hover:bg-[#e5e6e7] hover:text-black active:bg-[#dfe0e1] active:text-black">
                          <tr>
                            <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">ID</th>
                            <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">Tên thuộc tính</th>
                            <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">Giá trị thuộc tính</th>
                            <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">Hành động</th>
                          </tr>
                        </thead>
                        {attributes.data.length > 0 ? (
                          attributes.data.map((attribute) => (
                            <tbody key={attribute.id}>
                              <tr>
                                <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">{attribute.id}</td>
                                <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">{attribute.attributeName}</td>
                                <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">{attribute.values.join(", ")}</td>
                                <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                                  <div className="flex items-center gap-2">
                                    <div>
                                      <button
                                        onClick={() => handleEdit(attribute.id)}
                                        className="hover:text-blue-600 cursor-pointer text-[18px] w-[34px] h-[34px] flex justify-center border border-[#eeecec] items-center bg-[#f1f1f1]"
                                      >
                                        <i className="bx bx-edit"></i>
                                      </button>
                                    </div>
                                    <div>
                                      <button
                                        onClick={() => setConfirmDeleteId(attribute.id)} // Open confirmation dialog
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
                            <td colSpan={4} className="text-center p-4 border-b">Không có thuộc tính nào</td>
                          </tr>
                        )}
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Dialog */}
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
            <h3 className="text-lg font-[500] text-black mb-2">Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa thuộc tính này?</p>
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

export default AttributeForm;