import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const History = () => {
  const { state } = useLocation();
  const { orderData } = state || {};
  const navigate = useNavigate();

  if (!orderData) {
    return <div>No order data available</div>;
  }

  const {
    productData,
    quantity,

    name,
    phoneNumber,
    address,
    selectedLocation,
  } = orderData;

  const formatCurrency = (price) => {
    if (price >= 1000) {
      const truncatedPrice = Math.floor(price / 1000);
      return `Rp ${truncatedPrice}k`;
    } else {
      return `Rp ${price}`;
    }
  };
  const generateGoogleMapsLink = (lat, lng) => {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-8">
      <div>
        <FontAwesomeIcon
          icon={faArrowCircleLeft}
          className="text-lg cursor-pointer"
          onClick={handleBack}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Service</th>
              <th>Addres</th>
              <th>Contact</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Google Maps</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>1</th>
              <td>{name}</td>
              <td>{productData.title}</td>
              <td>{address}</td>
              <td>{phoneNumber}</td>
              <td>{formatCurrency(productData.price * quantity)}</td>
              <td>{quantity}</td>

              <td>
                <a
                  href={generateGoogleMapsLink(
                    selectedLocation.lat,
                    selectedLocation.lng
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500"
                >
                  Click to open maps
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
