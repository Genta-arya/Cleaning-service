import React, { useEffect, useState } from "react";

import Loading from "../../Admin/Home/Component/Customer/Loading";

const SplashScreen = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {loading ? (
        <div className="text-center">
          <Loading />
        </div>
      ) : null}
    </div>
  );
};

export default SplashScreen;
