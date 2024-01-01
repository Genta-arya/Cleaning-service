import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Maps from "./Maps";
import { useMapEvents } from "react-leaflet";
import { ToastContainer, toast } from "react-toastify";
import { Icon } from "leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleLeft,
  faCommentAlt,
} from "@fortawesome/free-solid-svg-icons";
import { submitOrder } from "../../../../../Service/Api";
import ChatBotOrder from "./ChatBotOrder";
import SuccessModal from "./SuccesModal";

const OrderForm = () => {
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { productData } = state || {};
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0 });
  const [isChatBotOpen, setChatBotOpen] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const [mapVisible, setMapVisible] = useState(false);
  const [mapdetail, setMapdetail] = useState("");
  const [isOrderSuccess, setOrderSuccess] = useState(false);
  const username = localStorage.getItem("username");
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
    const newQuantity = parseInt(e.target.value);

    if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= 3) {
      setQuantity(newQuantity);
    }
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
    setIsLoading(true);

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
        username: username,
        orderDetails: {
          nm_product: productData?.nm_product || "",
          qty: parseInt(quantity) || 1,
          price: (productData?.price || 0) * (quantity || 1),
          name: name,
          telp: phoneNumber,
          url: productData.url,
        },
        location: {
          address: address || "",
          koordinat: selectedLocation || { lat: 0, lng: 0 },
        },
      };

      try {
        const response = await submitOrder(orderData);

        setOrderSuccess(true);
        setIsLoading(false);
      } catch (error) {
        console.log("Error submitting order:", error);
        setOrderSuccess(false);
        setIsLoading(false);

        toast.error(
          "Sepertinya Server kami sedang dalam masalah , harap coba lagi ya ",
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
          }
        );
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

  const toggleChatBot = () => {
    setChatBotOpen((prev) => !prev);
  };
  const handleCloseChat = () => {
    setChatBotOpen(false);
  };

  const handleCloseModal = () => {
    setOrderSuccess(false);
  };
  const handleHistory = () => {
    navigate("/history");
  };

  return (
    <div className="flex items-center justify-center mt-8 py-8 p-4 h-full ">
      <ToastContainer />
      <div className="w-96  lg:w-[70%] md:w-[95%] mx-auto p-6 bg-white rounded-xl shadow-md  h-full">
        <div>
          <FontAwesomeIcon
            icon={faArrowCircleLeft}
            className=" cursor-pointer "
            size="2x"
            color="#5F93C0"
            onClick={handleBack}
          />
        </div>
        <h2 className="text-2xl lg:text-3xl border-b-4 p-1 border-gelap font-bold mb-6 mt-4 text-biru font-sans">
          Isi Data Pesanan
        </h2>

        {productData && (
          <div className="mb-6">
            <div className="lg:flex grid grid-cols-1 items-center mb-4   border-b-4   border-gelap p-2 lg:space-x-4">
              <div className=" overflow-hidden mr-4">
                <img
                  src={
                    productData.url ||
                    "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
                  }
                  alt={productData.title}
                  className="w-full h-full object-cover  border-black border rounded-xl p-2 mb-4"
                />
              </div>
              <div>
                <p className="text-xl font-semibold">
                  {decodeURIComponent(productData.nm_product)}
                </p>
                <p className="text-sm mt-2 text-gray-500 font-semibold">
                  Deskripsi :
                </p>

                <p className="text-sm mb-4 text-gray-500 ">
                  {productData.desc}
                </p>
                <p className="text-sm text-gray-600">
                  Jumlah:
                  <input
                    type="number"
                    min="1"
                    max="3"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="border text-center  mb-4 rounded-2xl p-1 w-16 ml-2 "
                  />
                </p>
                <div className="lg:block md:hidden hidden ">
                  <p className="text-lg font-semibold">Total Biaya :</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(productData.price * quantity)}
                  </p>
                </div>

                <div className="flex justify-end lg:hidden gap-4 ">
                  <p className="text-lg font-semibold">Total Biaya :</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(productData.price * quantity)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-bold text-blue-300  "
            >
              Nama
            </label>
            <input
              type="text"
              id="name"
              value={name}
              placeholder="ketikan namamu disini ya"
              onChange={handleNameChange}
              className="mt-1 p-2 w-full border   input-info rounded-full px-5"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-bold text-blue-300 "
            >
              WhatsApp
            </label>
            <input
              type="number"
              placeholder="+6212345678910"
              id="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="mt-1 p-2 w-full border      input-info rounded-full px-5"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-sm font-bold text-blue-300"
            >
              Alamat
            </label>
            <textarea
              id="address"
              placeholder="Alamat Lengkap"
              value={address}
              onChange={handleAddressChange}
              className="mt-1 p-2 w-full border  textarea textarea-info rounded-xl px-5"
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
            className="bg-biru text-white py-2 px-4 rounded-md hover:bg-blue-400 min-w-full font-bold"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span className="ml-2">Tunggu sebentar ya...</span>
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>

      <div
        className="fixed bottom-32 right-8 bg-blue-500 text-white p-4 rounded-full cursor-pointer"
        onClick={toggleChatBot}
      >
        <FontAwesomeIcon icon={faCommentAlt} size="sm" />
      </div>
      {isChatBotOpen && <ChatBotOrder onClose={handleCloseChat} />}
      {isOrderSuccess && (
        <SuccessModal showModal={isOrderSuccess} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default OrderForm;
