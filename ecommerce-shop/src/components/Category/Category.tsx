import React from "react";
import { useGetAllCategoriesQuery } from "../../redux/category/category.service";
import { Link } from "react-router-dom";
import SkeletonPost from "../../SkeletonPost";
import { motion } from "framer-motion";

const Category = () => {
  const { data: categories = { data: [] }, isFetching } =
    useGetAllCategoriesQuery();

  return (
    <div className="mt-[40px] h-[100%] mx-4 md:mx-[67px] 2xl:mx-[360px]">
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        {isFetching ? (
          <div className="col-span-5 text-center">
            <SkeletonPost />
          </div>
        ) : categories.data.length > 0 ? (
          categories.data.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to={`/${category.name}`}
                className="mb-4 md:mb-0 flex flex-row items-center gap-2 px-1 md:px-0 transition duration-350 hover:cursor-pointer hover:shadow-lg xl:gap-3 rounded bg-white xl:p-2"
              >
                <img
                  src={`${category.imageUrl}`}
                  alt=""
                  loading="lazy"
                  width="60"
                  height="60"
                  decoding="async"
                  className="h-12 w-13 rounded xl:h-15 xl:w-15"
                />
                <h2 className="cursor-pointer text-[#090d14] text-base font-[500]">
                  {category.name}
                </h2>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-5 text-center bg-white p-4 md:p-6"><SkeletonPost/></div>
        )}
      </div>
    </div>
  );
};

export default Category;
