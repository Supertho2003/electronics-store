import React from "react";
import { motion } from "framer-motion"; // Import motion từ framer-motion
import Header from "../Header";
import Footer from "../Footer";

const Success = () => {
  return (
    <div>
      <Header />
      <motion.div
        className="mt-[120px] h-[100%] xl:mx-[67px] 2xl:mx-[360px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="flex w-full h-full flex-col items-center justify-center rounded-xl bg-cover bg-[#fff]"
          style={{
            backgroundImage: "url(/img/payment/bg-pc.png)",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="mb-[20px] flex flex-col items-center gap-1 py-8">
            <div className="text-[20px] leading-7 text-green-600 font-[500]">
              Đặt hàng thành công!
            </div>
            <div className="flex flex-col xl:flex-row text-center font-[400] xl:gap-0.5 gap-0 text-[#090d14] text-[16px] leading-6">
              <span>Nhân viên Rocker sẽ liên hệ với bạn</span>
              <span>trong 5-10 phút để xác nhận đơn hàng.</span>
            </div>
            <img
              alt="Hình ảnh thanh toán thành công"
              loading="lazy"
              width={319}
              height={164}
              decoding="async"
              data-nimg="1"
              className="h-41 object-contain"
              src="https://fptshop.com.vn/img/payment/Ilus-thanhtoan-thanhcong.png?w=640&q=100"
              style={{ color: "transparent" }}
            />
          </div>
        </div>
      </motion.div>
      <Footer />
    </div>
  );
};

export default Success;
