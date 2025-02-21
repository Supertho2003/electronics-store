import React from "react";
import { Link } from "react-router-dom";

const VerifySuccess = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
      <div >
        <div className="w-[350px] md:w-[400px] bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Hoàn Thành !
          </h2>

          <div className="flex justify-center mb-6 transform hover:scale-110 transition-transform duration-300">
            <svg
              className="w-16 h-16 text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 12V16.5M20 12L17 9M20 12L23 9M4 7.8C4 7.8 6 7.8 8 7.8C10 7.8 11 6 13 6C15 6 16 7.8 18 7.8C20 7.8 22 7.8 22 7.8M4 12C4 12 6 12 8 12C10 12 11 10 13 10C15 10 16 12 18 12C20 12 22 12 22 12M4 16.2C4 16.2 6 16.2 8 16.2C10 16.2 11 14.4 13 14.4C15 14.4 16 16.2 18 16.2C20 16.2 22 16.2 22 16.2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 transform hover:scale-[1.02] transition-all duration-200">
            <p className="text-black flex items-center">
              <span className="text-emerald-700 material-symbols-outlined mr-2 animate-bounce">
                <i className="bx bx-check-circle text-[20px]"></i>
              </span>
              Thành công! Email của bạn đã được xác minh.
            </p>
          </div>

          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-[500] py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50">
            <Link to="/dang-nhap">Quay lại đăng nhập</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifySuccess;
