import React from "react";
import {
  useGetAllReviewsQuery,
  useHideReviewMutation,
  useUnhideReviewMutation,
} from "../../../redux/review/review.service";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import SkeletonPost from "../../../SkeletonPost";

const Review = () => {
  const { data, error, isLoading } = useGetAllReviewsQuery();
  const [hideReview] = useHideReviewMutation();
  const [unhideReview] = useUnhideReviewMutation();

  if (isLoading)
    return (
      <p>
        <SkeletonPost />
      </p>
    );
  if (error) return <p>Không thể tải đánh giá.</p>;
  const handleHideReview = async (reviewId: number) => {
    try {
      const response = await hideReview({ reviewId }).unwrap();
      toast.success(response.message);
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  const handleUnhideReview = async (reviewId: number) => {
    try {
      const response = await unhideReview({ reviewId }).unwrap();
      toast.success(response.message);
    } catch (err: any) {
      toast.error(err.data.message);
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
        Danh sách đánh giá
      </h2>
      <div className="mt-4 bg-white md:w-full w-[360px]">
        <div className="mx-auto px-6 py-4 border border-3 rounded-lg">
          <div className="max-h-96 overflow-y-auto">
            <table className="border-collapse w-full table-auto mb-4 border-b border-[#dee2e6] text-[#212529] hover:bg-[#f8f9fa] hover:text-[#212529]">
              <thead className="table-header-group table-light text-black bg-[#f8f9fa] hover:bg-[#e5e6e7] hover:text-black active:bg-[#dfe0e1] active:text-black">
                <tr>
                  <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                    ID
                  </th>
                  <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                    Tên sản phẩm
                  </th>
                  <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                    Người dùng
                  </th>
                  <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                    Thời gian
                  </th>
                  <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                    Đánh giá
                  </th>
                  <th className="text-start border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                    Bình luận
                  </th>
                  <th className="text-center border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                    Trạng thái
                  </th>
                  <th className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2 text-center">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.data.length > 0 ? (
                  data.data.map((review: any) => (
                    <tr key={review.id}>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        {review.id}
                      </td>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        {review.name}
                      </td>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        {review.user.username}
                      </td>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        {new Date(review.dateCreated).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        <i className="bx bxs-star text-yellow-500"></i>{" "}
                        {review.rating}
                      </td>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2">
                        {review.comment}
                      </td>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] p-2 text-center">
                        {review.hidden ? "Đã ẩn" : "Hiển thị"}
                      </td>
                      <td className="border-b border-[#dee2e6] bg-[#f8f9fa] text-center">
                        {review.hidden ? (
                          <button
                            onClick={() => handleUnhideReview(review.id)}
                            className="bg-green-500 text-white px-3 py-1 rounded "
                          >
                            Hiện
                          </button>
                        ) : (
                          <button
                            onClick={() => handleHideReview(review.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Ẩn
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-2 border-b">
                      Không có đánh giá nào
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

export default Review;
