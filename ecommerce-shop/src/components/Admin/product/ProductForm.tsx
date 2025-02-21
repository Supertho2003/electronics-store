import React, { Fragment, useEffect, useState } from "react";
import { Product } from "../../../redux/product/product.type";
import {
  useAddProductMutation,
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useGetProductQuery,
  useUpdateProductMutation,
} from "../../../redux/product/product.service";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { cancelEdit, startEdit } from "../../../redux/id.slice";
import { useGetAllCategoriesQuery } from "../../../redux/category/category.service";
import { useGetAllColorsQuery } from "../../../redux/color/colorProduct.service";
import { useGetAllAttributesQuery } from "../../../redux/attribute/attribute.service";
import SkeletonPost from "../../../SkeletonPost";
import { colorProduct } from "./../../../redux/color/colorProduct.type";
import { motion } from "framer-motion";

const initialState: Omit<Product, "id"> = {
  name: "",
  brand: "",
  price: 0,
  isAvailable: true,
  colors: [],
  attributes: "",
  stock: 0,
  description: "",
  categoryName: "",
  imageUrl: null,
};

interface Errors {
  name?: string;
  brand?: string;
  price?: string;
  stock?: string;
  categoryName?: string;
}

export interface Attribute {
  attributeId: number;
  name: string;
  value: string;
}

const ProductForm = () => {
  const [formData, setFormData] = useState<Omit<Product, "id"> | Product>(
    initialState
  );
  const {
    data: products = { data: [] },
    isFetching,
    refetch,
  } = useGetAllProductsQuery();
  const { data: categories = { data: [] } } = useGetAllCategoriesQuery();
  const { data: colors = { data: [] } } = useGetAllColorsQuery();
  const { data: attributes = { data: [] } } = useGetAllAttributesQuery();
  const [addProduct] = useAddProductMutation();
  const productId = useSelector((state: RootState) => state.id.id);
  const [deleteProduct] = useDeleteProductMutation();
  const { data } = useGetProductQuery(productId, {
    skip: !productId,
  });
  const [updateProduct] = useUpdateProductMutation();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<Errors>({});

  const formatCurrency = (amount: any) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };

  useEffect(() => {
    if (data && data.data) {
      const productData = data.data;
      setFormData({
        name: productData.name,
        brand: productData.brand,
        price: productData.price,
        attributes: JSON.stringify(productData.attributes),
        isAvailable: productData.isAvailable,
        stock: productData.stock,
        description: productData.description,
        categoryName: productData.categoryName,
        colors: productData.colors.map((color: colorProduct) => color.id),
        imageUrl: productData.imageUrl || null,
      });
    }
  }, [data]);

  const handleColorChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    colorId: number
  ) => {
    setFormData((prev) => {
      const isChecked = e.target.checked;
      let updatedColors;

      if (isChecked) {
        updatedColors = [...prev.colors, colorId];
      } else {
        updatedColors = prev.colors.filter((id) => id !== colorId);
      }
      return { ...prev, colors: updatedColors };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.imageUrl) {
      setErrors((prev) => ({
        ...prev,
        imageUrl: "Ảnh danh mục không được để trống",
      }));
      return;
    }

    try {
      const attributesArray: Attribute[] = [];
      if (formData.attributes) {
        const parsedAttributes = JSON.parse(formData.attributes);
        Object.keys(parsedAttributes).forEach((key) => {
          const attribute = parsedAttributes[key];
          if (
            attribute.attributeId !== 0 &&
            attribute.name &&
            attribute.value
          ) {
            attributesArray.push({
              attributeId: Number(attribute.attributeId),
              name: attribute.name,
              value: attribute.value,
            });
          }
        });
      }
      const attributesJson = JSON.stringify(attributesArray);
      if (productId) {
        const response = await updateProduct({
          id: productId,
          name: formData.name,
          brand: formData.brand,
          price: formData.price,
          isAvailable: formData.isAvailable,
          attributes: attributesJson,
          stock: formData.stock,
          description: formData.description,
          categoryName: formData.categoryName,
          colors: formData.colors,
          file: formData.imageUrl,
        }).unwrap();
        dispatch(cancelEdit(0));
        toast.success(response.message);
        setFormData(initialState);
      } else {
        const response = await addProduct({
          name: formData.name,
          brand: formData.brand,
          price: formData.price,
          isAvailable: formData.isAvailable,
          attributes: attributesJson,
          stock: formData.stock,
          description: formData.description,
          categoryName: formData.categoryName,
          colors: formData.colors,
          file: formData.imageUrl,
        }).unwrap();
        toast.success(response.message);
        setFormData(initialState);
      }
      refetch();
    } catch (error: any) {
      if (error.data) {
        setErrors(error.data);
      }
      toast.error(error.data.message);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setFormData((prev) => ({
        ...prev,
        imageUrl: file,
      }));
    }
  };

  const handleAttributeChange = (
    attributeId: number,
    value: string,
    attributeName: string
  ) => {
    setFormData((prev) => {
      const currentAttributes = prev.attributes
        ? JSON.parse(prev.attributes)
        : [];
      const existingIndex = currentAttributes.findIndex(
        (attr: any) => attr.attributeId === attributeId
      );

      if (existingIndex !== -1) {
        currentAttributes[existingIndex].value = value;
      } else {
        currentAttributes.push({ attributeId, value, name: attributeName });
      }
      return {
        ...prev,
        attributes: JSON.stringify(currentAttributes),
      };
    });
  };

  const handleDelete = async (id: number) => {
    const response = await deleteProduct(id).unwrap();
    if (response.message) {
      toast.success(response.message);
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
        <div className="flex items-center rounded-lg bg-white mb-3 p-2 gap-1 border-b text-[22px]">
          <span>
            <i
              className={`${productId ? "bx bx-edit" : "bx bx-add-to-queue"}`}
            ></i>
          </span>
          <h5 className="text-[#32393f] ">
            {productId ? "Sửa sản phẩm" : "Thêm sản phẩm"}
          </h5>
        </div>
        <div className="bg-white rounded-lg md:bg-transparent">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="p-4 md:p-6 md:border md:border-3 md:rounded bg-white md:w-full">
                <div className="mb-4">
                  <div>
                    <label htmlFor="" className="mb-2 inline-block">
                      Tên sản phẩm
                    </label>
                    <input
                      type="text"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="block w-full py-1.5 px-3 font-normal text-[#212529] border border-solid border-[#ced4da] bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
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
                  <label htmlFor="" className="mb-2 inline-block">
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="block w-full py-1.5 px-3 font-normal text-[#212529] border border-solid border-[#ced4da] bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
                  />
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
              </div>
              <div className="p-4 md:p-6 md:border md:border-3 md:rounded bg-white md:w-full">
                <div className="mb-4">
                  <label htmlFor="" className="mb-2 inline-block">
                    Hãng sản xuất
                  </label>
                  <input
                    type="text"
                    value={formData.brand || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        brand: e.target.value,
                      }))
                    }
                    className="block w-full py-1.5 px-3 font-normal text-[#212529] border border-solid border-[#ced4da] bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
                  />
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center gap-2">
                    <div>
                      <label htmlFor="" className="mb-2 inline-block">
                        Giá
                      </label>
                      <input
                        type="number"
                        value={formData.price || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            price: Number(e.target.value),
                          }))
                        }
                        className="block w-full py-1.5 px-3 font-normal text-[#212529] border border-solid border-[#ced4da] bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label htmlFor="" className="mb-2 inline-block">
                        Số lượng
                      </label>
                      <input
                        type="number"
                        value={formData.stock || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            stock: Number(e.target.value),
                          }))
                        }
                        className="block w-full py-1.5 px-3 font-normal text-[#212529] border border-solid border-[#ced4da] bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="" className="mb-2 inline-block">
                    Chọn danh mục
                  </label>
                  <select
                    name=""
                    id=""
                    value={formData.categoryName}
                    className="block w-full py-1.5 px-3 font-normal text-[#212529] border border-solid border-[#ced4da] bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        categoryName: e.target.value,
                      }))
                    }
                  >
                    <option value="" disabled selected>
                      Chọn danh mục
                    </option>
                    {categories.data.length > 0 ? (
                      categories.data.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>Không có danh mục nào</option>
                    )}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="" className="mb-2 inline-block">
                    Chọn màu sắc
                  </label>
                  <div>
                    {colors.data.length > 0 ? (
                      colors.data.map((color) => (
                        <div
                          className="flex items-center gap-2 mb-1"
                          key={color.id}
                        >
                          <label
                            htmlFor={`color-${color.id}`}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              id={`color-${color.id}`}
                              type="checkbox"
                              value={color.id}
                              checked={formData.colors.includes(color.id)}
                              onChange={(e) => handleColorChange(e, color.id)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full transition duration-150 ease-in-out focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 focus:outline-none"
                            />
                            <span
                              className="h-[0.875rem] w-[0.875rem] border border-[#090d141a] rounded-full block m-[0.125rem]"
                              style={{ backgroundColor: color.code }}
                            ></span>
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center">
                        Không có màu nào
                      </div>
                    )}
                  </div>
                </div>
                {attributes.data.length > 0 ? (
                  attributes.data.map((attribute, index) => {
                    const selectedAttributes = formData.attributes
                      ? typeof formData.attributes === "string"
                        ? JSON.parse(formData.attributes)
                        : formData.attributes
                      : [];

                    const selectedAttribute = selectedAttributes.find(
                      (attr: { attributeId: number }) =>
                        attr.attributeId === attribute.id
                    );

                    return (
                      <div
                        key={attribute.id}
                        className="mb-4 border px-4 py-2 rounded-md"
                      >
                        <label className="mb-2 inline-block">
                          {attribute.attributeName}
                        </label>
                        <div>
                          {attribute.values.map((value, valueIndex) => {
                            const isChecked =
                              selectedAttribute?.value === value.toString();

                            return (
                              <div
                                key={valueIndex}
                                className="flex items-center"
                              >
                                <input
                                  id={`radio-${index}-${valueIndex}`}
                                  type="radio"
                                  name={`attribute-${index}`}
                                  value={value.toString()}
                                  checked={isChecked}
                                  onChange={() => {
                                    handleAttributeChange(
                                      attribute.id,
                                      value.toString(),
                                      attribute.attributeName // Truyền attributeName
                                    );
                                  }}
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                />
                                <label
                                  htmlFor={`radio-${index}-${valueIndex}`}
                                  className="ms-2 text-sm font-medium text-gray-900"
                                >
                                  {value.toString()}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 text-center">
                    Không có thuộc tính nào
                  </div>
                )}

                <div className="flex flex-wrap justify-center items-center gap-2 w-full">
                  {Boolean(productId) && (
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
                        Cập nhập danh mục
                      </button>
                    </Fragment>
                  )}
                  {!Boolean(productId) && (
                    <button
                      type="submit"
                      className="w-full md:w-[30%] flex justify-center py-2.5 items-center cursor-pointer focus:shadow-md border-[#008cff] mt-2 text-base font-medium leading-6 px-3 bg-[#008cff] hover:bg-[#0b5ed7] hover:border-[#0a58ca] text-white rounded-md"
                    >
                      Lưu danh mục
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="mt-4 bg-white w-[360px] md:w-full">
          {isFetching && <SkeletonPost />}
          {!isFetching && (
            <div className="mx-auto px-6 py-4 border border-3 rounded-lg ">
              <div className="max-h-96 overflow-y-auto">
                <table className="border-collapse w-full table-auto mb-4 border-b border-[#dee2e6] text-[#212529] hover:bg-[#f8f9fa] hover:text-[#212529]">
                  <thead className="table-header-group table-light text-black bg-[#f8f9fa] hover:bg-[#e5e6e7] hover:text-black active:bg-[#dfe0e1] active:text-black">
                    <tr>
                      <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        ID
                      </th>
                      <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        Ảnh sản phẩm
                      </th>
                      <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        Tên sản phẩm
                      </th>
                      <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        Hãng sản xuất
                      </th>
                      <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        Loại danh mục
                      </th>
                      <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        Đánh giá
                      </th>
                      <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        Số lượng
                      </th>
                      <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        Giá
                      </th>
                      <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  {products.data.length > 0 ? (
                    products.data.map((product: any) => (
                      <tbody key={product.id}>
                        <tr>
                          <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                            {product.id}
                          </td>
                          <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                            <div className="w-20 bg-opacity-10 text-[10px] text-center p-2 font-semibold rounded-full">
                              <img
                                src={`${product.imageUrl}`}
                                className="rounded-md"
                                alt={product.name}
                              />
                            </div>
                          </td>
                          <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                            {product.name}
                          </td>
                          <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                            {product.brand}
                          </td>
                          <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                            {product.categoryName}
                          </td>
                          <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                            <i className="bx bxs-star text-yellow-500"></i>{" "}
                            {product.rating}
                          </td>
                          <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                            {product.stock}
                          </td>
                          <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                            {formatCurrency(product.price)}
                          </td>
                          <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                            <div className="flex items-center gap-2">
                              <div>
                                <button
                                  onClick={() => handleEdit(product.id)}
                                  className="hover:text-blue-600 cursor-pointer text-[18px] w-[34px] h-[34px] flex justify-center border border-[#eeecec] items-center bg-[#f1f1f1]"
                                >
                                  <i className="bx bx-edit"></i>
                                </button>
                              </div>
                              <div>
                                <button
                                  onClick={() => handleDelete(product.id)}
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
                      <td colSpan={6} className="text-center p-2 border-b">
                        Không có sản phẩm nào
                      </td>
                    </tr>
                  )}
                </table>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductForm;
