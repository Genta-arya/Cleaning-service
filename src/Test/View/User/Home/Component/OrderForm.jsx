import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Maps from "./Maps";
import { useMapEvents } from "react-leaflet";
import { ToastContainer, toast } from "react-toastify";
import { Icon } from "leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { submitOrder } from "../../../../../Service/Api";

const OrderForm = () => {
  const { state } = useLocation();
  const { productData } = state || {};
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0 });
  const [mapKey, setMapKey] = useState(0);
  const [mapVisible, setMapVisible] = useState(false);
  const [mapdetail, setMapdetail] = useState("");
  // const referenceCoordinates = {
  //   lat: -7.761981,
  //   lng: 110.40567,
  // };
  const referenceCoordinates = {
    lat: -6.977425299234734,
    lng: 110.41103205296062,
  };

  const formatCurrency = (price) => {
    if (price >= 1000) {
      const truncatedPrice = Math.floor(price / 1000);
      return `Rp ${truncatedPrice}k`;
    } else {
      return `Rp ${price}`;
    }
  };

  const handleMapClick = (latlng) => {
    setSelectedLocation(latlng);
    console.log("Clicked coordinates:", latlng);
  };

  const MapClickHandler = () => {
    const map = useMapEvents({
      click: async (e) => {
        setSelectedLocation(e.latlng);

        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${e.latlng.lat}+${e.latlng.lng}&key=e80f453b74fc44c498014ee19ed91bff`
          );
          const data = await response.json();

          if (data.results.length > 0) {
            const components = data.results[0].components;
            console.log("All components:", components);

            const city = components.city_district;
            const road = components.road;
            const state = components.state;
            const addressString = `${road}, ${city}, ${state}`;
            setMapdetail(addressString);
          }
        } catch (error) {
          console.error("Error fetching reverse geocoding data:", error);
        }
      },
    });

    return null;
  };

  const handleGetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        setSelectedLocation({ lat: latitude, lng: longitude });
        setMapKey((prevKey) => prevKey + 1);
        setMapVisible(true);

        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=e80f453b74fc44c498014ee19ed91bff`
          );
          const data = await response.json();

          if (data.results.length > 0) {
            const components = data.results[0].components;
            console.log("All components:", components);

            const city = components.city_district;
            const road = components.road;
            const state = components.state;
            const addressString = `${road}, ${city}, ${state}`;
            setMapdetail(addressString);
          }
        } catch (error) {
          console.error("Error fetching reverse geocoding data:", error);
        }
      },
      (error) => {
        console.error("Error getting current location:", error.message);
      }
    );
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const uid = "123";

    const distance = calculateHaversineDistance(
      selectedLocation,
      selectedLocation
    );

    const maxDistance = 25;

    if (distance > maxDistance) {
      toast.error(`Location is too far ${distance} km. You can't order now!`, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      const orderData = {
        uid,
        username: name,
        orderDetails: {
          nm_product: productData?.title || "",
          qty: quantity || 1,
          price: (productData?.price || 0) * (quantity || 1),
          name: name,
        },
        location: {
          address: address || "",
          koordinat: selectedLocation || { lat: 0, lng: 0 },
        },
      };

      try {
        const response = await submitOrder(orderData);
        alert("Order successful!");
      } catch (error) {
        console.log(orderData);
        console.error("Error submitting order:", error);
        toast.error("Error submitting order. Please try again later.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };
  const handleBack = () => {
    navigate("/");
  };
  const calculateHaversineDistance = (coord1, coord2) => {
    const toRadians = (angle) => (angle * Math.PI) / 180;

    const R = 6371;

    const lat1 = toRadians(coord1.lat);
    const lon1 = toRadians(coord1.lng);
    const lat2 = toRadians(coord2.lat);
    const lon2 = toRadians(coord2.lng);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceInKilometers = R * c;

    const roundedDistance = parseFloat(distanceInKilometers.toFixed(2));

    return roundedDistance;
  };

  useEffect(() => {
    handleGetCurrentLocation();
  }, []);

  return (
    <div className="flex items-center justify-center mt-8 py-8 p-4 h-full ">
      <ToastContainer />
      <div className="w-96  lg:w-[70%] md:w-[95%] mx-auto p-6 bg-white rounded-xl shadow-md  h-full">
        <div>
          <FontAwesomeIcon
            icon={faArrowCircleLeft}
            className="text-lg cursor-pointer"
            onClick={handleBack}
          />
        </div>
        <h2 className="text-2xl font-bold mb-6">Order Form</h2>

        {productData && (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div className="w-20 h-20 overflow-hidden mr-4">
                <img
                  src={productData.image}
                  alt={productData.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div>
                <p className="text-lg font-semibold">
                  {decodeURIComponent(productData.title)}
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(productData.price * quantity)}
                </p>
                <p className="text-gray-600">
                  Quantity:
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="border border-gray-400 py-1 px-2 w-16 ml-2 mt-2"
                  />
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-600"
            >
              Phone Number
            </label>
            <input
              type="number"
              id="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-600"
            >
              Address
            </label>
            <textarea
              id="address"
              value={address}
              onChange={handleAddressChange}
              className="mt-1 p-2 w-full border rounded-md"
              rows="3"
              required
            />
          </div>

          <Maps
            handleGetCurrentLocation={handleGetCurrentLocation}
            handleMapClick={handleMapClick}
            mapKey={mapKey}
            selectedLocation={selectedLocation}
            mapVisible={mapVisible}
            MapClickHandler={MapClickHandler}
            mapdetail={mapdetail}
            referenceCoordinates={selectedLocation}
          />

          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 min-w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
