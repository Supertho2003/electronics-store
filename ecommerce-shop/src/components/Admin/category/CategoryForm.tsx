import React, { Fragment, useEffect, useState } from "react";
import { Category } from "../../../redux/category/category.type";
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} from "../../../redux/category/category.service";
import { RootState } from "../../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { cancelEdit, startEdit } from "../../../redux/id.slice";
import SkeletonPost from "../../../SkeletonPost";
import { motion } from "framer-motion";

const initialState: Omit<Category, "id"> = {
  name: "",
  imageUrl: null,
};

const CategoryForm = () => {
  const [formData, setFormData] = useState<Omit<Category, "id"> | Category>(
    initialState
  );
  const [errors, setErrors] = useState({ name: "", imageUrl: "" });
  const { data: categories = { data: [] }, isFetching } =
    useGetAllCategoriesQuery();
  const [addCategory] = useAddCategoryMutation();
  const categoryId = useSelector((state: RootState) => state.id.id);
  const [deleteCategory] = useDeleteCategoryMutation();
  const { data } = useGetCategoryQuery(categoryId, { skip: !categoryId });
  const [updateCategory] = useUpdateCategoryMutation();
  const dispatch = useDispatch();


  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (data && data.data) {
      setFormData({
        name: data.data.name,
        imageUrl: data.data.imageUrl || null,
      });
    }
  }, [data]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({ name: "", imageUrl: "" });

    if (!formData.name) {
      setErrors((prev) => ({
        ...prev,
        name: "Tên danh mục không được để trống",
      }));
      return;
    }
    if (!formData.imageUrl) {
      setErrors((prev) => ({
        ...prev,
        imageUrl: "Ảnh danh mục không được để trống",
      }));
      return;
    }

    try {
      if (categoryId) {
        const response = await updateCategory({
          name: formData.name,
          file: formData.imageUrl as any,
          id: categoryId,
        }).unwrap();
        dispatch(cancelEdit(0));
        toast.success(response.message);
      } else {
        const response = await addCategory({
          name: formData.name,
          file: formData.imageUrl as any,
        }).unwrap();
        toast.success(response.message);
      }
      setFormData(initialState);
    } catch (error: any) {
      toast.error(error.data.message);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFormData((prev) => ({ ...prev, imageUrl: file }));
      setErrors((prev) => ({ ...prev, imageUrl: "" }));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteCategory(id).unwrap();
      if (response.message) {
        toast.success(response.message);
      }
      setConfirmDeleteId(null);
    } catch (error: any) {
      toast.error("Tạm thời chức năng này bị lỗi!!");
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
      <div className="mx-auto">
        <div className="flex items-center mb-3 p-2 gap-1 border-b text-[22px] rounded-md bg-white">
          <span>
            <i
              className={`${categoryId ? "bx bx-edit" : "bx bx-add-to-queue"}`}
            ></i>
          </span>
          <h5 className="text-[#32393f] ">
            {categoryId ? "Sửa danh mục" : "Thêm danh mục"}
          </h5>
        </div>
        <div>
          <div>
            <div className="p-4 md:p-6 border border-3 rounded-md bg-white ">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <div>
                    <label htmlFor="" className="mb-2 inline-block">
                      Tên danh mục
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
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

                <div className="mb-3">
                  <label htmlFor="" className="mb-2 inline-block">
                    Thêm ảnh danh mục
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-[#007BFF]"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-[#007BFF]">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-[#007BFF]">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  {errors.imageUrl && (
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
                      <span className="text-[#dc2626]">{errors.imageUrl}</span>
                    </div>
                  )}
                  {formData.imageUrl && (
                    <div className="mt-2">
                      {formData.imageUrl instanceof File ? (
                        <img
                          src={URL.createObjectURL(formData.imageUrl)}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-md"
                        />
                      ) : (
                        <img
                          src={formData.imageUrl}
                          alt="Current"
                          className="w-32 h-32 object-cover rounded-md"
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap justify-center items-center gap-2 w-full">
                  {Boolean(categoryId) ? (
                    <>
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
                        Cập nhập danh mục
                      </button>
                    </>
                  ) : (
                    <button
                      type="submit"
                      className="w-full md:w-[30%] flex justify-center items-center py-2.5 h-12 cursor-pointer focus:shadow-md border-[#008cff] mt-2 text-base font-medium leading-none px-3 bg-[#008cff] hover:bg-[#0b5ed7] hover:border-[#0a58ca] text-white rounded-md"
                    >
                      Lưu danh mục
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
                          <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                            ID
                          </th>
                          <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                            Tên danh mục
                          </th>
                          <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                            Ảnh danh mục
                          </th>
                          <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      {categories.data.length > 0 ? (
                        categories.data.map((category) => (
                          <tbody key={category.id}>
                            <tr>
                              <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                                {category.id}
                              </td>
                              <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                                {category.name}
                              </td>
                              <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                                <div className="w-20 uppercase bg-opacity-10 text-[10px] text-center p-2 font-semibold rounded-full">
                                  <img
                                    src={`${category.imageUrl}`}
                                    className="rounded-md"
                                    alt=""
                                  />
                                </div>
                              </td>
                              <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p -2">
                                <div className="flex items-center gap-2">
                                  <div>
                                    <button
                                      onClick={() => handleEdit(category.id)}
                                      className="hover:text-blue-600 cursor-pointer text-[18px] w-[34px] h-[34px] flex justify-center border border-[#eeecec] items-center bg-[#f1f1f1]"
                                    >
                                      <i className="bx bx-edit"></i>
                                    </button>
                                  </div>
                                  <div>
                                    <button
                                      onClick={() =>
                                        setConfirmDeleteId(category.id)
                                      } // Open confirmation dialog
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
                            Không có danh mục nào
                          </td>
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
            <p>Bạn có chắc chắn muốn xóa danh mục này?</p>
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

export default CategoryForm;
