import Lottie from "lottie-react";
import React from "react";
import animationData from "../../../../../Asset/Loading.json"
const SkeletonProduct = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Lottie
            animationData={animationData}
            loop={true}
            autoplay
            className="-mb-16 "
          />
    </div>
  );
};

export default SkeletonProduct;
