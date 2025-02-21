import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <motion.div
      className="mt-[60px] h-full bg-[#090d14] relative text-white p-4 md:px-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="xl:mx-[67px] 2xl:mx-[360px]">
        <div className="md:text-left text-center md:px-5">
          <div className="border-b pb-3 md:py-10">
            <p className="text-[16px] font-semibold leading-6 text-[#fff] pb-2">
              Hệ thống Rocker trên toàn quốc
            </p>
            <p className="text-sm leading-5 font-normal text-[#ffffffb2]">
              Bao gồm Cửa hàng Rocker, Trung tâm Laptop, F.Studio, S.Studio,
              Garmin Brand Store{" "}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap px-0 md:px-5 md:py-10 ">
          <div className="grid grid-cols-2 w-full p-4 md:p-0 mx:auto md:grid-cols-4 md:gap-3">
            <div className="mb-4 md:mb-0">
              <p className="font-[600] text-[14px] md:text-[16px] md:leading-6 md:px-0 pb-1.5">
                KẾT NỐI VỚI ROCKER
              </p>
              <ul className="flex md:px-0 pb-2.5 px-4">
                <li className="flex py-1.5">
                  <Link  to="https://www.facebook.com/imtho03/" className="mr-3">
                    <img
                      src="https://cdn2.fptshop.com.vn/svg/facebook_icon_8543190720.svg?w=32&q=100"
                      width="28"
                      height="28"
                      alt=""
                    />
                  </Link>
                </li>
                <li className="flex py-1.5">
                  <a href="/" className="mr-3">
                    <img
                      src="https://cdn2.fptshop.com.vn/svg/zalo_icon_8cbef61812.svg?w=32&q=100"
                      width="28"
                      height="28"
                      alt=""
                    />
                  </a>
                </li>
                <li className="flex py-1.5">
                  <a href="/" className="mr-3">
                    <img
                      src="https://cdn2.fptshop.com.vn/svg/youtube_icon_b492d61ba5.svg?w=32&q=100"
                      width="28"
                      height="28"
                      alt=""
                    />
                  </a>
                </li>
                <li className="flex py-1.5">
                  <a href="/" className="mr-3">
                    <img
                      src="https://cdn2.fptshop.com.vn/svg/tiktok_icon_faabbeeb61.svg?w=32&q=100"
                      width="28"
                      height="28"
                      alt=""
                    />
                  </a>
                </li>
              </ul>
              <div>
                <div>
                  <p className="md:mb-1.5 md:mt-3 font-[600] text-[14px]">
                    TỔNG ĐÀI MIỄN PHÍ
                  </p>
                </div>
                <div>
                  <div>
                    <ul className="mt-1.5 md:mt-0">
                      <li className="py-1.5">
                        <span className="block mb-1 font-medium text-sm leading-5">
                          Tư vấn mua hàng (Miễn phí)
                        </span>
                        <a href="/" className="table text-inherit no-underline">
                          <b className="font-bold">0703162730</b> (Nhánh 1)
                        </a>
                      </li>
                      <li className="py-1.5">
                        <span className="block mb-1 font-medium text-sm leading-5">
                          Góp ý, khiếu nại
                        </span>
                        <a href="/" className="table text-inherit no-underline">
                          <b className="font-bold">anhthobeo1006@gmail.com</b> (8h00 - 22h00)
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-6 md:mb-0">
              <div>
                <p className="font-[600] md:text-[16px] md:leading-6 md:px-0 pb-1.5">
                  VỀ CHÚNG TÔI
                </p>
              </div>
              <div>
                <ul>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Giới thiệu về công ty
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Quy chế hoạt động
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      F.Friends - Bạn đồng hành
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Tin tức khuyến mại
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Giới thiệu máy đổi trả
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Tra cứu hoá đơn điện tử
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Tra cứu bảo hành
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Câu hỏi thường gặp
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mb-4 md:mb-0">
              <div>
                <p className="font-[600] text-[14px] md:text-[16px] md:leading-6 md:px-0 pb-1.5">
                  CHÍNH SÁCH
                </p>
              </div>
              <div>
                <ul>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Chính sách bảo hành
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Chính sách đổi trả
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Chính sách bảo mật
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Chính sách trả góp
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Chính sách khui hộp sản phẩm
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Chính sách giao hàng & lắp đặt
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Chính sách mạng di động FPT
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mb-4 md:mb-0">
              <div>
                <p className="font-[600] text-[14px] md:text-[16px] md:leading-6 md:px-0 pb-1.5">
                  HỖ TRỢ
                </p>
              </div>
              <div>
                <ul>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Giới thiệu về công ty
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Quy chế hoạt động
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      F.Friends - Bạn đồng hành
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Tin tức khuyến mại
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Giới thiệu máy đổi trả
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Tra cứu hoá đơn điện tử
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Tra cứu bảo hành
                    </a>
                  </li>
                  <li className="py-1.5">
                    <a
                      className="cursor-pointer relative text-inherit hover:underline"
                      href="/"
                    >
                      Câu hỏi thường gặp
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Footer;
