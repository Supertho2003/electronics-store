import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { useLoginUserMutation } from "../../redux/auth/auth.service";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { setCredentials } from "../../redux/auth.slice";

const initialState = {
  email: "",
  password: "",
};

interface Errors {
  email?: string;
  password?: string;
}

const SignIn = () => {
  const [formData, setFormData] = useState(initialState);
  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await loginUser(formData).unwrap();
      const { id, accessToken, refreshToken } = result.data;
      const decodedToken = jwtDecode(accessToken) as { roles: string[] };
      const roles = decodedToken.roles;
      dispatch(setCredentials({ id, accessToken, refreshToken, roles }));
      if (roles.includes("ADMIN")) {
        navigate("/admin/rocker-shop");
      } else if (roles.includes("MANAGER")) {
        navigate("/manager/rocker-shop");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      if (error.data) {
        setErrors(error.data);
      }
      toast.error(error.data.message || "Có lỗi xảy ra");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  return (
    <div className="flex justify-center items-center w-full h-[100vh]">
      <motion.div
        className="w-[636px]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="my-4">
          <img
            src="assets/images/logo-icon.png"   
            className="mx-auto block w-[120px] md:w-[150px]"
            alt=""
          />
        </div>
        <div className="bg-white mx-6 p-4 flex-1 rounded-lg shadow-lg">
          <div className="p-6 rounded-lg">
            <div className="text-center">
              <h3 className="text-[#32393f] font-[500] text-xl md:text-2xl lg:text-[1.75rem]">
                Đăng nhập
              </h3>
              <p className="mb-6 mt-2">
                Bạn đã có tài khoản?{" "}
                <Link to="/dang-ky" className="text-[#008cff]">
                  Đăng ký tại đây
                </Link>
              </p>
            </div>
            <div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3 px-2">
                  <div>
                    <label htmlFor="email" className="mb-2 inline-block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${
                        errors.email ? "border-[#dc2626]" : "border-[#ced4da]"
                      } block w-full py-1.5 px-3 font-normal text-[#212529] border border-solid bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50`}
                    />
                    {errors.email && (
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
                        <span className="text-[#dc2626]">{errors.email}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-3 px-2 relative">
                  <div>
                    <label htmlFor="password" className="mb-2 inline-block">
                      Password
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`${
                        errors.password
                          ? "border-[#dc2626]"
                          : "border-[#ced4da]"
                      } block w-full py-1.5 px-3 font-normal text-[#212529] border border-solid  bg-[#fff] rounded-md transition duration-150 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50`}
                    />
                  </div>
                  {errors.password && (
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
                      <span className="text-[#dc2626]">{errors.password}</span>
                    </div>
                  )}
                  <motion.i
                    className={`bx ${
                      showPassword ? "bx-show" : "bx-hide"
                    } absolute right-2 py-2.5 cursor-pointer px-3 top-7`}
                    onClick={() => setShowPassword((prev) => !prev)}
                    animate={{ rotate: showPassword ? 0 : 180 }}
                    transition={{ duration: 0.2 }}
                  ></motion.i>
                </div>

                <div className="flex justify-center items-center px-2">
                  <motion.button
                    type="submit"
                    className="w-full md:w-[50%] flex justify-center py-1.5 items-center cursor-pointer focus:shadow-md border-[#008cff] mt-2 text-base font-medium leading-6 px-3 bg-[#008cff] text-white rounded-md"
                    whileHover={{ backgroundColor: "#0b5ed7", scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <i className="bx bx-user mr-1 text-[1.3rem]"></i>
                    Đăng nhập
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
