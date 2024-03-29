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
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { submitOrder, verifVoucher } from "../../../../../Service/Api";
import ChatBotOrder from "./ChatBotOrder";
import SuccessModal from "./SuccesModal";
import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, serverTimestamp } from "firebase/database";
import { firebaseApp } from "../../../../../Feature/Firebase/FirebaseConfig";
import axios from "axios";
import "../../../../../Style/Content.css";
import Loading from "../../../Admin/Home/Component/Customer/Loading";
import ReactQuill from "react-quill";
import ModalError from "./ModalError";
const OrderForm = () => {
  const { state } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [load, setIsload] = useState(false);
  const { productData, productPrice } = state || {};
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [voucher, setVoucher] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState({});
  const [isChatBotOpen, setChatBotOpen] = useState(false);
  const [mapKey, setMapKey] = useState(0);
  const [mapVisible, setMapVisible] = useState(false);
  const [mapdetail, setMapdetail] = useState("");
  const [isOrderSuccess, setOrderSuccess] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [route, setRoute] = useState(null);
  const [discount, setDiscount] = useState(null);
  const [isModalError, setModalError] = useState(false);
  const db = getDatabase(firebaseApp);

  useEffect(() => {
    if (!productData) {
      navigate("/");
    }
  }, [navigate, productData]);

  const checkLocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission(true);
        },
        (error) => {
          setLocationPermission(false);
          toast.error("Please enable location services to submit the order.", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
          });
        }
      );
    } else {
      setLocationPermission(false);
    }
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
  const referenceCoordinates = {
    lat: -8.785069834299154,
    lng: 115.17231948094826,
  };

  const location = {
    lat: -8.547924506814734,
    lng: 115.27673336678515,
  };

  const distance = calculateHaversineDistance(
    selectedLocation,
    referenceCoordinates
  );

  const username = localStorage.getItem("username");

  const formatCurrency = (price) => {
    return `Rp ${price.toLocaleString()}`;
  };

  const fetchRoute = async (location) => {
    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62486b9e5cbb12784e9daa1693e76cfbbce7&start=${location.lng},${location.lat}&end=${referenceCoordinates.lng},${referenceCoordinates.lat}`
      );

      if (response.data && response.data.features) {
        setRoute(response.data.features[0].geometry.coordinates);
      }
    } catch (error) {
      setLoadingLocation(false);
      console.error("Error fetching route data:", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    const handleGetCurrentLocation = async () => {
      try {
        await checkLocationPermission();
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            const location = { lat: latitude, lng: longitude };

            setSelectedLocation(location);

            try {
              const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=60ca4fc1658d48dab960502a905511c8`
              );
              const data = await response.json();

              if (data.results.length > 0) {
                const components = data.results[0].components;

                const city = components.city_district;
                const road = components.road;
                const state = components.state;
                const addressString = `${road}, ${city}, ${state}`;
                setMapdetail(addressString);
              }

              fetchRoute(location);

              setMapKey((prevKey) => prevKey + 1);
              setMapVisible(true);
            } catch (error) {
              console.error("Error fetching reverse geocoding data:", error);
            }
          },
          (error) => {
            console.error("Error getting current location:", error.message);
          }
        );
      } catch (error) {
        console.error("Error checking location permission:", error);
      }
    };

    handleGetCurrentLocation();
  }, []);

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);

    if (!isNaN(newQuantity) && newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleVoucherChange = (e) => {
    setVoucher(e.target.value);
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleKetChange = (e) => {
    setKeterangan(e.target.value);
  };
  const handleCloseModalError = () => {
    setModalError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const uid = "123";

    const maxDistance = 25;
    const id = productData.categoryId;
    if (distance > maxDistance) {
      // toast.error(
      //   `Lokasi kamu terlalu jauh ${distance} km. maksimal 25 km untuk melakukan pesanan`,
      //   {
      //     position: "top-center",
      //     autoClose: 1000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     draggable: true,
      //     progress: undefined,
      //   }
      // );
      setModalError(true);
      setIsLoading(false);
    } else {
      let price = (productPrice || 0) * (quantity || 1);
      let discounts = price - price * discount;
      if (discount) {
        price = discounts;
      }

      const orderData = {
        uid,
        username: username,
        voucherCode: voucher,
        CategoryId: id,
        orderDetails: {
          nm_product: productData?.nm_product || "",
          qty: parseInt(quantity) || 1,
          price: price,
          name: name,
          ket: keterangan,
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

        await push(ref(db, "pesanan"), {
          message: "ada pesanan baru",
          createdAt: serverTimestamp(),
        });

        const apiUrl = process.env.REACT_APP_API_URL;
        const sendEmailResponse = await fetch(`${apiUrl}send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "andiarta150898@gmail.com",
            // email: "mgentaaryap@gmail.com",
            orderData: orderData,
          }),
        });

        if (sendEmailResponse.ok) {
        } else {
          console.error("Failed to send email");
        }
      } catch (error) {
        setOrderSuccess(false);
        setIsLoading(false);

        toast.error(
          "Sepertinya Server kami sedang dalam masalah, harap coba lagi ya ",
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
          }
        );
      } finally {
        setModalError(false);
      }
    }
  };

  const applyVoucher = async () => {
    setIsload(true);
    const voucherCode = voucher;
    const id = productData.categoryId;

    try {
      const response = await verifVoucher(username, voucherCode, id);
      setIsload(true);
      if (response.data && response.data.disc) {
        const discountAmount = response.data.disc;

        const totalCostBeforeDiscount = productPrice * quantity;
        const discountedPrice =
          totalCostBeforeDiscount - totalCostBeforeDiscount * discountAmount;

        setDiscount(discountAmount);

        toast.success(`Voucher ${voucherCode} berhasil digunakan`);
      } else {
        toast.warning(response.message);
        setDiscount(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat memproses voucher!");
    } finally {
      setIsload(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

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

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const routePolyline = route && route.map((coord) => [coord[1], coord[0]]);

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
            <div className="xl:flex grid grid-cols-1 lg:flex  md:flex items-center mb-4   border-b-4   border-gelap p-2 lg:space-x-4">
              <div className=" overflow-hidden mr-4">
                <img
                  src={
                    productData.url ||
                    "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png"
                  }
                  alt={productData.title}
                  className="xl:w-96 w-full sm:w-full  lg:w-64 md:w-64 object-cover xl:h-96 border-black border rounded-xl p-2 mb-4"
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
                  <ReactQuill
                    value={productData.desc}
                    readOnly={true}
                    className="text-gray-600 "
                    theme={"bubble"}
                  />
                </p>
                <p className="mr-4 text-lg font-semibold lg:hidden m ">
                  Jumlah:
                </p>
                <div className="flex items-center justify-start md:justify-start lg:justify-start mb-4 p-4">
                  <p className="mr-4 text-lg font-semibold lg:block hidden ">
                    Jumlah:
                  </p>
                  <div className="flex items-center  border rounded-lg overflow-hidden md:block lg:block hidden ">
                    <button
                      onClick={handleDecrement}
                      className="p-2 cursor-pointer bg-gray-200 hover:bg-gray-300 transition duration-300"
                    >
                      <FontAwesomeIcon icon={faMinus} size="sm" />
                    </button>
                    <input
                      disabled
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="border-none text-center px-3 bg-white text-lg font-semibold w-40"
                    />
                    <button
                      onClick={handleIncrement}
                      className="p-2 cursor-pointer bg-gray-200 hover:bg-gray-300 transition duration-300 "
                    >
                      <FontAwesomeIcon icon={faPlus} size="sm" />
                    </button>
                  </div>

                  <div className="flex  border rounded-lg overflow-hidden md:hidden lg:hidden block ">
                    <button
                      onClick={handleDecrement}
                      className="p-2 cursor-pointer bg-gray-200 hover:bg-gray-300 transition duration-300"
                    >
                      <FontAwesomeIcon icon={faMinus} size="sm" />
                    </button>
                    <input
                      disabled
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="border-none text-center px-3 bg-white text-lg font-semibold w-32"
                    />
                    <button
                      onClick={handleIncrement}
                      className="p-2 cursor-pointer bg-gray-200 hover:bg-gray-300 transition duration-300 "
                    >
                      <FontAwesomeIcon icon={faPlus} size="sm" />
                    </button>
                  </div>
                </div>

                <div className="flex  lg:hidden gap-4 ">
                  <p className="text-sm font-semibold">Total Biaya :</p>
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    {discount ? (
                      <>
                        <div>
                          <div className="flex  gap-4">
                            <p className="text-sm text-gray-500 font-semibold line-through">
                              {formatCurrency(productPrice * quantity)}
                            </p>
                            <p className="text-sm font-bold text-green-500 ">
                              {formatCurrency(
                                productPrice * quantity -
                                  productPrice * discount
                              )}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm font-semibold">
                        {formatCurrency(productPrice * quantity)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="lg:block md:hidden hidden mt-12 border-t-2 p-2 ">
                  <p className="text-lg font-semibold">Total Biaya :</p>
                  <div style={{ display: "flex", alignItems: "baseline" }}>
                    {discount ? (
                      <>
                        <div>
                          <div className="flex  gap-4">
                            <p className="text-lg text-gray-500 font-semibold double-strikethrough">
                              {formatCurrency(productPrice * quantity)}
                            </p>
                            <p className="text-lg font-bold text-green-500 ">
                              {formatCurrency(
                                productPrice * quantity -
                                  productPrice * discount
                              )}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-lg font-semibold">
                        {formatCurrency(productPrice * quantity)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-bold text-blue-300"
                  ></label>
                  <input
                    type="text"
                    id="name"
                    value={voucher}
                    placeholder="Voucher Discount"
                    onChange={handleVoucherChange}
                    className="mt-1 p-2 border rounded-md px-5 lg:w-52 w-44 md:w-72"
                    required
                  />
                  <button
                    onClick={applyVoucher}
                    className="p-2 cursor-pointer  bg-blue-500 hover:bg-blue-600 text-white transition duration-300 ml-2 rounded-md"
                  >
                    Apply
                  </button>
                  {discount && (
                    <>
                      <p className="text-orange-500 text-xs lg:text-sm md:text-sm">
                        Mendapatkan Discount {discount * 100} %
                      </p>
                    </>
                  )}
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

          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-sm font-bold text-blue-300"
            >
              Keterangan
            </label>
            <textarea
              id="deskripsi"
              placeholder="Tuliskan kerusakan Ac nya disini ya"
              value={keterangan}
              onChange={handleKetChange}
              className="mt-1 p-2 w-full border  textarea textarea-info rounded-xl px-5"
              rows="3"
              required
            />
          </div>

          <Maps
            mapKey={mapKey}
            selectedLocation={selectedLocation}
            mapVisible={mapVisible}
            mapdetail={mapdetail}
            referenceCoordinates={referenceCoordinates}
            locationPermission={locationPermission}
            routePolyline={routePolyline}
            distance={distance}
          />

          <button
            type="submit"
            className={`${
              isLoading || !locationPermission
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-biru text-white hover:bg-blue-400"
            } py-2 px-4 rounded-md min-w-full font-bold`}
            disabled={isLoading || !locationPermission}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                <span className="ml-2">Tunggu sebentar ya...</span>
              </div>
            ) : (
              "Pesan sekarang"
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
        <SuccessModal showModal={isOrderSuccess} onClose={handleCloseModal}  />
      )}
      {load && <Loading />}
      {isModalError && <ModalError onClose={handleCloseModalError} isModalOpen={isModalError}/>}
    </div>
  );
};

export default OrderForm;
