import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useGetProductQuery } from "../../redux/product/product.service";
import { useAddCartMutation } from "../../redux/cartItem/cartItem.service";
import { toast } from "react-toastify";
import Review from "../Review";
import Header from "../Header";
import Footer from "../Footer";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "0 ₫"; // Default value if amount is undefined
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };

  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const { data: productResponse, isFetching } = useGetProductQuery(Number(id), {
    skip: !id,
  });
  const [addToCart] = useAddCartMutation();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (selectedColorId === null) {
      toast.error("Vui lòng chọn màu sắc trước khi thêm vào giỏ hàng!");
      return;
    }
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập trước khi thêm vào giỏ hàng!");
      return;
    }
    try {
      const result = await addToCart({
        productId,
        quantity,
        colorId: selectedColorId,
      }).unwrap();
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.data.message);
    }
  };

  const product = productResponse?.data;

  return (
    <div className="overflow-x-hidden">
      <Header />
      <motion.div
        className="mt-[100px] md:mt-[120px] md:pl-20 md:pr-20 h-[100%] mb-[#30px] 2xl:mx-[360px]"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: 20 }} 
        transition={{ duration: 0.3 }} 
      >
        <div className="md:py-2">
          <ol className="flex flex-wrap md:my-3 my-2 px-4">
            <li className="inline-flex items-center">
              <Link to={`/`} className="text-[#1250dc]">
                Trang chủ
              </Link>
              <span className="ml-2 mr-1 text-sm font-medium text-[#1250dc]">
                /
              </span>
            </li>
            <li className="inline-flex items-center">
              <Link to={`/${product?.categoryName}`} className="text-[#1250dc]">
                {product?.categoryName}
              </Link>
              <span className="ml-2 mr-1 text-sm font-medium text-[#1250dc]">
                /
              </span>
            </li>
            <li>
              <a href="/" className="text-black">
                {product?.name}
              </a>
            </li>
          </ol>
        </div>

        <div className="px-4 md:px-0 md:flex justify-between md:mb-[140px]">
          <div className="md:w-[653px]">
            <div className="h-[230px] w-[250px] mx-auto md:w-full md:h-full flex justify-center items-center">
              <img
                src={`${product?.imageUrl}`}
                alt=""
                className="mix-blend-multiply"
              />
            </div>
            <div className="flex min-h-max border-gray-300 flex-shrink-0 flex-col gap-3 rounded-md border p-3 pb-4 pt-3">
              <div>
                <p className="md:font-medium font-normal text-[16px] leading-6 text-black">
                  Thông số nổi bật
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                {product?.attributes.map((attribute: any) => (
                  <div key={attribute.id}>
                    <p className="text-sm leading-[12px] text-gray-500 text-opacity-100 mb-1">
                      {attribute.attributeName}
                    </p>
                    <p className="font-medium leading-5 text-sm text-black">
                      {attribute.values.join(", ")} {/* Hiển thị các giá trị */}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="md:w-[507px] mt-6 md:mt-0">
            <div className="">
              <div className="flex justify-between items-center">
                <h1 className="text-[18px] leading-5">
                  {product?.name}
                </h1>
                <div className="flex items-center mt-1">
                  <i className="bx bxs-star text-[#FCD34D]"></i>
                  <div className="ml-1">{product?.rating.toFixed(1)}</div>
                </div>
              </div>
              
              <div className="mt-3">
                <span className="text-[#32393f] font-medium text-[16px]">
                  {formatCurrency(product?.price)}
                </span>
              </div>
              <p className="text-[16px] mt-3 ">
                {product?.description}
              </p>
              <div className="flex pt-5">
                <span className="text-sm font-normal leading-5 min-w-28 md:w-22 text-[#090d14]">
                  Màu sắc
                </span>
                <ul className="flex items-center list-none w-[100%]">
                  {product?.colors && product.colors.length > 0 ? (
                    product.colors.map((color: any) => (
                      <li
                        key={color.id} // Use color ID as the key
                        className={`h-[0.875rem] w-[0.875rem] border border-[#090d141a] rounded-full cursor-default block m-[0.125rem] ${
                          selectedColorId === color.id
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        style={{ backgroundColor: color.code }} // Use color code for background
                        onClick={() => setSelectedColorId(color.id)} // Set selected color ID on click
                      ></li>
                    ))
                  ) : (
                    <li className="text-gray-500">Không có màu</li>
                  )}
                </ul>
              </div>
              <div className="mt-3 ">
                <div className="inline-flex justify-center border w-full md:w-auto rounded-md border-solid items-center">
                  <span
                    className="flex items-center justify-center px-1.5 py-0 relative h-8 w-8"
                    onClick={decreaseQuantity}
                  >
                    <i className="bx bx-minus"></i>
                  </span>
                  <input
                    className="appearance-none border-l w-full md:w-auto border-r border-neutral-gray-3 font-medium leading-6 outline-transparent outline-offset-2 px-1 text-center"
                    type="number"
                    value={quantity}
                    readOnly
                  />
                  <span
                    className="flex items-center justify-center px-1.5 py-0 relative h-8 w-8"
                    onClick={increaseQuantity}
                  >
                    <i className="bx bx-plus"></i>
                  </span>
                </div>
              </div>
              <div className="flex justify-center md:justify-start">
                <button
                  onClick={handleAddToCart}
                  className="mt-4 flex justify-center w-full items-center text-base font-medium h-14 leading-6  px-14 md:px-3 bg-[#0d6efd]  md:w-full text-white rounded-md"
                >
                  <i className="bx bx-cart-add text-xl"></i>
                  <span className="ml-2">Thêm vào giỏ hàng</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-md md:p-6 mt-7 p-4 ">
          <Review productId={productId} />
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default ProductDetail;