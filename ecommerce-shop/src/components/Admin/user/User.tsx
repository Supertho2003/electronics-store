import React, { useState } from "react";
import {
  useAddRoleToUserMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useToggleUserStatusMutation,
} from "../../../redux/user/user.service";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import SkeletonPost from "../../../SkeletonPost";
import { useDispatch } from "react-redux";

export enum RoleEnum {
  USER = "USER",
  MANAGER = "MANAGER",
  ADMIN = "ADMIN",
}

const User = () => {
  const { data, error, isLoading } = useGetAllUsersQuery();
  const [toggleUserStatus] = useToggleUserStatusMutation();
  const [addRoleToUser] = useAddRoleToUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState<{ [key: number]: string }>(
    {}
  );
  if (isLoading)
    return (
      <p>
        <SkeletonPost />
      </p>
    );
  if (error) return <p>Có lỗi xảy ra!</p>;

  const handleChangeStatus = async (userId: number) => {
    try {
      const response = await toggleUserStatus(userId);
      toast.success(response.data.message)
    } catch (error: any) {
      console.error(error.data.message);
    }
  };

  const handleDelete = async (id: number) => {
    const response = await deleteUser(id).unwrap();
    if (response.message) {
      toast.success(response.message);
    }
  };

  const handleAddRole = async (userId: number) => {
    try {
      const role = selectedRole[userId];
      if (role) {
        const response = await addRoleToUser({ userId, role });
        toast.success(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.data.message);
    }
  };

  return (
    <motion.div
      className="mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-[18px] text-black md:text-xl bg-white p-4 rounded-md font-[500] mb-4">
        Danh sách người dùng
      </h2>
      <div className="mt-4 bg-white w-[360px] md:w-full ">
        <div className="mx-auto px-6 py-4 border border-3 rounded-lg">
          <div className="max-h-96 overflow-y-auto">
            <table className="border-collapse w-full table-auto mb-4 border-b border-[#dee2e6] text-[#212529] hover:bg-[#f8f9fa] hover:text-[#212529]">
              <thead className="table-header-group table-light text-black bg-[#f8f9fa] hover:bg-[#e5e6e7] hover:text-black active:bg-[#dfe0e1] active:text-black">
                <tr>
                  <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                    ID
                  </th>
                  <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                    Tên người dùng
                  </th>
                  <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                    Email
                  </th>
                  <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                    Trạng thái
                  </th>
                  <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                    Quyền
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.data.length > 0 ? (
                  data.data.map((user: any) => (
                    <tr key={user.id}>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        {user.id}
                      </td>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        {user.username}
                      </td>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        {user.email}
                      </td>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        <select
                          value={user.active ? "active" : "inactive"}
                          onChange={() => handleChangeStatus(user.id)}
                          className="border px-2 py-1 rounded"
                        >
                          <option value="active">Kích hoạt</option>
                          <option value="inactive">Vô hiệu hóa</option>
                        </select>
                      </td>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        <select
                          value={user.roles || selectedRole[user.id]} // Hiển thị quyền hiện tại
                          onChange={(e) =>
                            setSelectedRole((prev) => ({
                              ...prev,
                              [user.id]: e.target.value,
                            }))
                          }
                          className="border rounded p-1"
                        >
                          {Object.values(RoleEnum).map((role) => (
                            <option key={role} value={role}>
                              {role.replace("ROLE_", "")}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAddRole(user.id)}
                          className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                        >
                          Cập nhật
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center p-2 border">
                      Không có người dùng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default User;
