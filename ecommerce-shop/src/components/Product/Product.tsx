import React from "react";
import { useGetAllProductsQuery } from "../../redux/product/product.service";
import { Link } from "react-router-dom";
import SkeletonPost from "../../SkeletonPost";
import { motion } from "framer-motion";

const Product = () => {
  const formatCurrency = (amount: any) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };

  const { data: products = { data: [] }, isFetching } =
    useGetAllProductsQuery();

  return (
    <div className="md:mt-[60px] h-[100%]  rounded-md mx-4 md:mx-[67px] 2xl:mx-[360px]">
      <div className="bg-white md:px-6 md:py-4 md:pt-6 grid grid-cols-2 md:grid-cols-5 gap-2">
        {isFetching ? (
          <div className="col-span-5 text-center">
            <SkeletonPost />
          </div>
        ) : products.data.length > 0 ? (
          products.data.map((product: any) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="group transition duration-350 hover:cursor-pointer hover:shadow-md xl:rounded-lg"
            >
              <div className="p-2 flex justify-center items-center">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={`${product.imageUrl}`}
                    alt=""
                    width="200"
                    height="149"
                    className="transition duration-300 group-hover:scale-105"
                  />
                </Link>
              </div>
              <div className="p-2">
                <div className="text-left flex flex-col justify-center ">
                  <p className="text-[#16px] font-semibold leading-[24px] text-[#090d14]">
                    {formatCurrency(product.price)}
                  </p>
                </div>
                <h3 className="text-sm font-normal leading-5 mb-2 mt-2 text-black opacity-100 overflow-hidden">
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>
                <ul className="flex items-center list-none w-[100%] mb-2">
                  {product.colors.length > 0 ? (
                    product.colors.map((color: any) => (
                      <li
                        key={color.id}
                        className="h-[0.875rem] w-[0.875rem] border border-[#090d141a] rounded-full cursor-default block m-[0.125rem]"
                        style={{ backgroundColor: color.code }} // Use the color code directly
                      ></li>
                    ))
                  ) : (
                    <li className="text-gray-500">Không có màu</li>
                  )}
                </ul>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-5 text-center p-4 md:p-0"><SkeletonPost/></div>
        )}
      </div>
    </div>
  );
};

export default Product;
