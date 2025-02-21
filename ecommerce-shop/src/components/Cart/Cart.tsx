import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useGetCartQuery } from "../../redux/cart/cart.service";
import { Link, useNavigate } from "react-router-dom";
import {
  useRemoveItemMutation,
  useUpdateItemQuantityMutation,
} from "../../redux/cartItem/cartItem.service";
import Footer from "../Footer";
import Header from "../Header";
import { useApplyDiscountMutation } from "../../redux/coupon/coupon.service";
import { useDispatch } from "react-redux";
import {
  clearDiscountAmount,
  setDiscountAmount,
} from "../../redux/discount.slice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Cart = () => {
  const formatCurrency = (amount: any) => {
    return amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };
  const navigate = useNavigate();
  const { data: cart = { data: [] }, isFetching, refetch } = useGetCartQuery();
  const [updateItemQuantity] = useUpdateItemQuantityMutation();
  const [removeItem] = useRemoveItemMutation();
  const dispatch = useDispatch();
  const [discountCode, setDiscountCode] = useState("");
  const [applyDiscount] = useApplyDiscountMutation();
  const isDiscountApplied = useSelector(
    (state: RootState) => state.discount.isApplied
  );

  const [discountAmountValue, setDiscountAmountValue] = useState(0);
  const [newTotalAmount, setNewTotalAmount] = useState(cart.data.totalAmount);

  useEffect(() => {
    setNewTotalAmount(cart.data.totalAmount);
  }, [cart.data.totalAmount]);

  const handleQuantityChange = async (itemId: number, quantity: number) => {
    if (quantity < 1) {
      toast.error("Số lượng ít nhất phải 1");
      return;
    }
    try {
      await updateItemQuantity({ itemId, quantity }).unwrap();
      refetch();
    } catch (error: any) {
      toast.error(error.data.messge);
    }
  };

  const increaseQuantity = (itemId: number) => {
    const currentQuantity = cart.data.items.find(
      (item: { id: number }) => item.id === itemId
    ).quantity;
    handleQuantityChange(itemId, currentQuantity + 1);
  };

  const decreaseQuantity = (itemId: number) => {
    const currentQuantity = cart.data.items.find(
      (item: { id: number }) => item.id === itemId
    ).quantity;
    if (currentQuantity > 1) {
      handleQuantityChange(itemId, currentQuantity - 1);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeItem({ itemId }).unwrap();
      refetch();
    } catch (error: any) {
      toast.error(error.data.message);
    }
  };

  const handleApplyDiscount = async () => {
    try {
      const response = await applyDiscount(discountCode).unwrap();
      setDiscountAmountValue(response.data.discountAmount);
      setNewTotalAmount(response.data.newTotalAmount);
      dispatch(setDiscountAmount(response.data.discountAmount));
      toast.success(response.message);
      refetch();
    } catch (error: any) {
      toast.error(error?.data.message);
    }
  };

  const handleRemoveDiscount = () => {
    dispatch(clearDiscountAmount());
    setDiscountCode("");
    setDiscountAmountValue(0);
    setNewTotalAmount(cart.data.totalAmount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Header />
      <div className="mt-[120px] px-4 md:px-0 md:mt-[120px] h-[100%] xl:mx-[67px] 2xl:mx-[360px]">
        {cart.data && cart.data.items && cart.data.items.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-4 mb-2">
            <div className="flex-grow bg-white p-4 md:px-0 rounded-lg ">
              {cart.data.items.map((item: any) => (
                <motion.div
                  key={item.id}
                  className="bg-white md:px-4 md:py-3 flex flex-col md:flex-row justify-start md:items-center md:justify-between gap-3 mb-6 rounded-xl"
                  initial={{ opacity: 0, y: 10 }} // Bắt đầu với độ mờ và vị trí
                  animate={{ opacity: 1, y: 0 }} // Hiện ra với độ mờ và vị trí ban đầu
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex gap-2">
                    <div className="md:p-2 p-1.5 flex items-center border border-solid rounded-[0.5rem] h-16 w-16 ">
                      <img
                        className="w-full"
                        src={`${item.product.imageUrl}`}
                        alt={item.product.name}
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="max-w-[25rem] flex-grow">
                        <span className="text-[14px] md:text-[16px] text-black font-medium leading-5">
                          {item.product.name}
                        </span>
                      </div>
                      <div className="flex w-[85px] items-center rounded-[4px] px-2.5 py-1.5 bg-[#f3f4f6] cursor-pointer">
                        <span>Màu: {item.color.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 md:mt-0">
                    <div className="flex items-center gap-4 md:justify-end ">
                      <span className="font-[500] text-[#dc2626] min-w-[100px]">
                        {formatCurrency(item.unitPrice)}
                      </span>
                      <div className="flex items-center gap-4">
                        <div className="inline-flex justify-center border rounded-md border-solid items-center">
                          <span
                            className="flex items-center justify-center px-1.5 py-0 relative h-8 w-8"
                            onClick={() => decreaseQuantity(item.id)}
                          >
                            <i className="bx bx-minus"></i>
                          </span>
                          <input
                            className="appearance-none border-l border-r border-neutral-gray-3 font-medium leading-6 outline-transparent outline-offset-2 px-1 text-center w-12"
                            type="number"
                            value={item.quantity}
                            readOnly
                          />
                          <span
                            className="flex items-center justify-center px-1.5 py-0 relative h-8 w-8"
                            onClick={() => increaseQuantity(item.id)}
                          >
                            <i className="bx bx-plus"></i>
                          </span>
                        </div>
                        <div
                          className="cursor-pointer"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <i className="bx bx-trash text-[18px]"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-white flex-grow px-4 py-2 rounded-lg">
              <div className="mt-4 mb-5">
                <input
                  type="text"
                  placeholder="Nhập mã giảm giá"
                  className="w-full p-2 border rounded"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)} // Cập nhật mã giảm giá
                />
                <button
                  onClick={handleApplyDiscount}
                  className="mt-2 w-full bg-red-500 text-white py-2 rounded"
                >
                  Áp dụng
                </button>
                {isDiscountApplied && (
                  <div className="mt-2">
                    <button
                      onClick={handleRemoveDiscount}
                      className="w-full bg-gray-300 text-black py-2 rounded"
                    >
                      Xóa mã giảm giá
                    </button>
                  </div>
                )}
              </div>
              <h2 className="text-[16px] font-[500] text-[#090d14] mb-4">
                Thông tin đơn hàng
              </h2>
              <div>
                <div className="flex justify-between mt-2 border-b pb-2">
                  <span>Tổng tiền:</span>
                  <span className="font-[500] text-[#090d14]">
                    {formatCurrency(cart.data.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between mt-2 border-b pb-2">
                  <span>Tổng khuyến mãi:</span>
                  <span className="font-[500] text-[#090d14]">
                    {formatCurrency(discountAmountValue)}
                  </span>
                </div>
                <div className="flex justify-between mt-2 border-b pb-2">
                  <span>Cần thanh toán:</span>
                  <span className="font-[500] text-[#dc2626]">
                    {formatCurrency(newTotalAmount)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/xac-nhan-don-hang")}
                className="mt-4 w-full bg-red-500 text-white py-2 rounded"
              >
                Xác nhận đơn
              </button>
            </div>
          </div>
        ) : (
          <div className="flex item-center py-6 rounded-md justify-between bg-white">
            <div className="flex flex-col item-center px-4 md:px-9 md:pb-5 md:pt-6">
              <p className="mt-2 text-[26px] md:text-[32px] font-[500] leading-10 xl:mb-2 text-[#090d14]">
                Chưa có sản phẩm nào trong giỏ hàng.
              </p>
              <p className="mb-3 text-[14px] leading-6 font-[400]">
                Cùng mua sắm hàng ngàn sản phẩm tại Rocker nhé!
              </p>
              <Link
                to="/"
                className="flex items-center justify-center text-white text-base leading-6 relative transition-all duration-300 ease-in-out px-4 py-2.5 rounded-full font-500 bg-[#dc2626] hover:bg-red-700 w-fit"
              >
                Mua hàng
              </Link>
            </div>

            <div className="relative h-[144px] w-[375px] md:h-[202px] md:w-[555px]">
              <img
                sizes="100w"
                className="inset-0 h-full w-full text-transparent"
                src="https://fptshop.com.vn/img/empty_cart.png?w=1920&q=100"
                alt="Giỏ hàng trống"
              />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </motion.div>
  );
};

export default Cart;
