import React, { useEffect, useState } from 'react';
import { GridLoader, PulseLoader } from 'react-spinners';

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
          <PulseLoader size={12} color="#007BFF" loading={loading} />
        
        </div>
      ) : null}
    </div>
  );
};

export default SplashScreen;
