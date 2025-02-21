import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  useAddReviewMutation,
  useGetVisibleReviewsByProductQuery,
} from "../../redux/review/review.service";
import dayjs from "dayjs";
import SkeletonPost from "../../SkeletonPost";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

interface ReviewProps {
  productId: number;
}

const Review: React.FC<ReviewProps> = ({ productId }) => {
  const userId = useSelector((state: RootState) => state.auth.id);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [addReview] = useAddReviewMutation();

  const {
    data: reviewsData,
    error,
    isLoading,
    refetch,
  } = useGetVisibleReviewsByProductQuery({ productId });

  const handleAddReview = async () => {
    if (userId === null) {
      toast.error("Bạn cần đăng nhập để thêm đánh giá!");
      return;
    }

    if (rating === null || comment.trim() === "") {
      toast.error("Vui lòng chọn đánh giá và nhập bình luận!");
      return;
    }

    try {
      const response = await addReview({
        productId,
        userId: userId,
        rating,
        comment,
      }).unwrap();
      setComment("");
      setRating(null);
      refetch();
    } catch (error: any) {
      const errorMessage = error?.data?.message || "Đã xảy ra lỗi khi thêm đánh giá!";
      toast.error(errorMessage);
    }
  };

  const timeAgo = (date: string) => {
    const now = dayjs();
    const createdAt = dayjs(date);
    const secondsDiff = now.diff(createdAt, "second");
    const minutesDiff = now.diff(createdAt, "minute");
    const hoursDiff = now.diff(createdAt, "hour");
    const daysDiff = now.diff(createdAt, "day");
    const monthsDiff = now.diff(createdAt, "month");
    const yearsDiff = now.diff(createdAt, "year");

    if (yearsDiff > 0) {
      return `${yearsDiff} năm trước`;
    } else if (monthsDiff > 0) {
      return `${monthsDiff} tháng trước`;
    } else if (daysDiff > 0) {
      return `${daysDiff} ngày trước`;
    } else if (hoursDiff > 0) {
      return `${hoursDiff} giờ trước`;
    } else if (minutesDiff > 0) {
      return `${minutesDiff} phút trước`;
    } else {
      return `vài giây trước`;
    }
  };

  return (
    <div className="md:w-[80%]">
      <div className="text-[20px] mb-2 md:mb-0 md:text-[28px] leading-9 text-black font-medium ">
        Khách hàng nói về sản phẩm
      </div>
      <div className="md:flex items-center justify-between">
        <div>{reviewsData?.data.length} Bình luận</div>
        <div className="flex gap-2 mt-2 md:mt-0 ">
          {[5, 4, 3, 2, 1].map((star) => (
            <div
              key={star}
              className={`flex w-fit text-[#090d14] cursor-pointer items-center gap-[5px] rounded-[40px] border border-solid px-2.5 py-1.5 font-normal ${
                rating === star ? "bg-[#FCD34D]" : ""
              }`}
              onClick={() => setRating(star)}
            >
              {star} <i className="bx bxs-star"></i>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div>
          <div className="md:flex items-center border-b md:gap-4">
            <div className="flex-grow mt-4 md:mt-0">
              <input
                className="rounded-lg text-sm font-normal h-10 leading-5 py-2.5 px-3 flex items-center bg-white border border-neutral-300 gap-1 w-full"
                placeholder="Nhập nội dung bình luận"
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div className="rounded-t-2xl my-3">
              <button
                className="font-medium text-sm leading-5 w-full md:px-6 text-white py-3 rounded-lg h-full bg-[#090d14]"
                onClick={handleAddReview}
              >
                Gửi bình luận
              </button>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div>
            <SkeletonPost />
          </div>
        ) : error ? (
          <div className="text-red-500">Đã xảy ra lỗi khi tải bình luận!</div>
        ) : reviewsData && reviewsData.data && reviewsData.data.length > 0 ? (
          [...reviewsData.data].reverse().map((review: any) => ( // Đảo ngược mảng ở đây
            <motion.div
              className="flex gap-2 mt-5"
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gray-400 bg-opacity-100 text-center font-[500] text-[14px] text-[#fff]">
                  {review.user.username.charAt(0)}
                </div>
              </div>
              <div className="flex flex-col gap-[3px]">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-[#090d14]">
                    {review.user.username}
                  </div>
                  <div className="text-xs font-normal leading-[18px] text-[#6b7280]">
                    •
                  </div>
                  <div className="text-xs leading-[18px] font-normal text-[#6b7280]">
                    {timeAgo(review.dateCreated)}{" "}
                  </div>
                </div>
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, index) => (
                    <i
                      key={index}
                      className={`bx bxs-star ${
                        index < review.rating
                          ? "text-[#FCD34D]"
                          : "text-gray-300"
                      }`}
                    ></i>
                  ))}
                </div>
                <div className="text-sm font-normal leading-5">
                  <span>{review.comment}</span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-2 text-center py-5 flex flex-col gap-4">
            <i className="bx bx-comment-dots text-[70px]"></i>
            <span className="text-[16px] leading-6 text-[#6b7280] font-[400]">
              Chưa có bình luận của khách hàng về bài viết này
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;