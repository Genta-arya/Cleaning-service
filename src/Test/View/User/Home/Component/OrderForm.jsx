import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Maps from "./Maps";
import { useMapEvents } from "react-leaflet";
import { ToastContainer, toast } from "react-toastify";
import { Icon } from "leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

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

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // const referenceCoordinates = { lat: -8.785777, lng: 115.17243 };
    const referenceCoordinates = {
      lat: -6.968173397938472,
      lng: 110.4284581531086,
    };
  
    const distance = calculateHaversineDistance(
      referenceCoordinates,
      selectedLocation
    );
  
    const maxDistance = 25;
  
    if (distance > maxDistance) {
      toast.error(
        `Location is too far ${distance} km . Please choose a closer location.`,
        {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
        }
      );
    } else {
      const orderData = {
        productData,
        quantity,
        name,
        phoneNumber,
        address,
      
        selectedLocation,
      };
  
   
      navigate("/history", { state: { orderData } });
    }
  };
  

  const handleBack = () => {
    navigate("/");
  };

  const calculateHaversineDistance = (coord1, coord2) => {
    const toRadians = (angle) => (Math.PI / 180) * angle;
    const R = 6371;

    const dLat = toRadians(coord2.lat - coord1.lat);
    const dLon = toRadians(coord2.lng - coord1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(coord1.lat)) *
        Math.cos(toRadians(coord2.lat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceInKilometers = Math.round(R * c);

    return distanceInKilometers;
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
