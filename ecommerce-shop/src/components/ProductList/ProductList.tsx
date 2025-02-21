import React, { useEffect, useState } from "react";
import {
  useGetProductByCategoryQuery,
  useGetProductsByCategoryAndPriceRangeQuery,
} from "../../redux/product/product.service";
import { Link, useParams } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import SkeletonPost from "../../SkeletonPost";
import { motion } from "framer-motion";

const ProductList = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const { data: products = { data: [] }, isFetching: isFetchingByCategory } =
    useGetProductByCategoryQuery(categoryName!);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const {
    data: productsByPrice,
    isFetching: isFetchingByPrice,
    refetch,
  } = useGetProductsByCategoryAndPriceRangeQuery(
    {
      category: categoryName!,
      minPrice: minPrice || 0,
      maxPrice: maxPrice || 10000000,
    },
    { skip: false }
  );

  const formatCurrency = (amount: any) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };

  const isFetching = isFetchingByCategory || isFetchingByPrice;

  const filteredProducts = productsByPrice?.data || products.data;

  const handlePriceFilterChange = (min: number | null, max: number | null) => {
    setMinPrice(min);
    setMaxPrice(max);
    if (refetch) {
      refetch();
    }
  };

  const handleCheckboxChange = (min: number | null, max: number | null) => {
    if (min !== null || max !== null) {
      setMinPrice(min);
      setMaxPrice(max);
      if (refetch) {
        refetch();
      }
    } else {
      setMinPrice(null);
      setMaxPrice(null);
      if (refetch) {
        refetch();
      }
    }
  };

  return (
    <div>
      <Header />
      <motion.div
        className="mt-[100px] md:mt-[120px] px-4 md:px-0 md:pl-20 md:pr-20 h-[100%] mb-[#30px] 2xl:mx-[360px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex gap-6">
          <div className="w-[40%] md:w-[25%] bg-white md:overflow-y-scroll h-[440px]">
            <p className="flex items-center px-4 py-3 text-[12px] md:text-[20px] leading-8 font-medium text-black gap-2 ">
              <span>
                <i className="bx bx-filter"></i>
              </span>
              <span>Bộ lọc tìm kiếm</span>
            </p>
            <div className="px-4 py-3 border-t border-solid border-[#6b7280]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-[#090d14] leading-5">
                  Mức giá
                </p>
                <span>
                  <i className="bx bx-chevron-up"></i>
                </span>
              </div>
              <div>
                <ul className="flex flex-col gap-2">
                  <li>
                    <div className="flex items-center ">
                      <input
                        type="checkbox"
                        className="h-4 w-4 border hover:cursor-pointer"
                        checked={minPrice === null && maxPrice === null} 
                        onChange={() => handleCheckboxChange(null, null)} 
                      />
                      <label className="text-sm leading-5 font-normal text-black ml-1 ">
                        Tất cả
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center ">
                      <input
                        type="checkbox"
                        className="h-4 w-4 border hover:cursor-pointer"
                        onChange={() => handleCheckboxChange(0, 2000000)}
                      />
                      <label className="text-sm leading-5 font-normal text-black ml-1 ">
                        Dưới 2 triệu
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center ">
                      <input
                        type="checkbox"
                        className="h-4 w-4 border hover:cursor-pointer"
                        onChange={() => handleCheckboxChange(1000000, 2000000)} 
                      />
                      <label className="text-sm leading-5 font-normal text-black ml-1 ">
                        Từ 1 - 2 triệu
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center ">
                      <input
                        type="checkbox"
                        className="h-4 w-4 border hover:cursor-pointer"
                        onChange={() => handleCheckboxChange(2000000, 4000000)} 
                      />
                      <label className="text-sm leading-5 font-normal text-black ml-1 ">
                        Từ 2 - 4 triệu
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center ">
                      <input
                        type="checkbox"
                        className="h-4 w-4 border hover:cursor-pointer"
                        onChange={() => handleCheckboxChange(4000000, 6000000)}
                      />
                      <label className="text-sm leading-5 font-normal text-black ml-1 ">
                        Từ 4 - 6 triệu
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center ">
                      <input
                        type="checkbox"
                        className="h-4 w-4 border hover:cursor-pointer"
                        onChange={() => handleCheckboxChange(6000000, 8000000)}
                      />
                      <label className="text-sm leading-5 font-normal text-black ml-1 ">
                        Từ 6 - 8 triệu
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center ">
                      <input
                        type="checkbox"
                        className="h-4 w-4 border hover:cursor-pointer"
                        onChange={() => handleCheckboxChange(10000000, null)}
                      />
                      <label className="text-sm leading-5 font-normal text-black ml-1 ">
                        Trên 10 triệu
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="w-[50%] md:w-[70%] grow">
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-3 gap-4">
              {isFetching ? (
                <div className="col-span-4 text-center">
                  <SkeletonPost />
                </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product: any) => (
                  <div
                    key={product.id}
                    className="group transition duration-350 hover:cursor-pointer hover:shadow-md xl:rounded-lg bg-white"
                  >
                    <div className="p-2 flex justify-center items-center">
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          width="144"
                          height="149"
                          className="transition duration-300 group-hover:scale-105"
                        />
                      </Link>
                    </div>
                    <div className="p-2">
                      <p className="text-[#16px] font-semibold leading-[24px] text-[#090d14]">
                        {formatCurrency(product.price)}
                      </p>
                      <h3 className="text-sm font-normal leading-5 mb-1 mt-2 text-black opacity-100 overflow-hidden">
                        <Link to={`/product/${product.id}`}>
                          {product.name}
                        </Link>
                      </h3>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-4 text-center">
                  Không có sản phẩm nào
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default ProductList;
