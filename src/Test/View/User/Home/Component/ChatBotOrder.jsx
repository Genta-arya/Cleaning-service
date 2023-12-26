import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const ChatBot = ({ onClose }) => {
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [options, setOptions] = useState([
    "Apa fungsi Tombol cek lokasi ?",
    "Saya Ingin Mengubah Paket Service, Bagaimana Caranya ?",
    "Bagaimana sistem pembayaran di Tangkas Jaya Teknik ? ",
  ]);

  const username = localStorage.getItem("username");
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setMessages([
      {
        text: `Hai ${username}, ada yang bisa saya bantu untukmu hari ini ?`,
        sender: "bot",
      },
    ]);
  }, []);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      const newMessage = {
        text: inputMessage,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");

      if (selectedOption !== null) {
        setMessages([
          ...messages,
          {
            text: `Here's some information about "${options[selectedOption]}":`,
            sender: "bot",
          },
        ]);

        switch (selectedOption) {
          case 0:
            setMessages([
              ...messages,
              {
                text: "Tombol Lokasi berfungsi untuk mengetahui Lokasi kamu , karena pemesanan maksimal hanya 25km dari Lokasimu",
              },
            ]);
            break;
          case 1:
            setMessages([
              ...messages,
              {
                text: "Untuk Mengubah Paket Service, Kamu harus klik tombol kembali lalu akan diarahkan kehalaman menu utama dan lakukan kembali pemesanan.",
              },
            ]);
            break;
          case 2:
            setMessages([
              ...messages,
              {
                text: "Untuk saat ini pembayaran Service Tangkas Jaya Teknik dilakukan secara COD .",
              },
            ]);
            break;
          default:
            setMessages([
              ...messages,
              {
                text: "I'm sorry, I'm just a demo bot and can't provide specific information. You can choose from the following options:",
                sender: "bot",
              },
            ]);
        }
        setSelectedOption(null);
        setOptions([
          "Apa fungsi Tombol cek lokasi ?",
          "Saya Ingin Mengubah Paket Service, Bagaimana Caranya ?",
          "Bagaimana sistem pembayaran di Tangkas Jaya Teknik ? ",
        ]);
      } else {
        setMessages([
          ...messages,
          {
            text: "I'm sorry, I'm just a demo bot and can't provide specific information. You can choose from the following options:",
            sender: "bot",
          },
        ]);
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(timestamp);
  };

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    setInputMessage(options[index]);
  };

  return (
    <>
      {isChatVisible && (
        <div className="fixed bottom-16 lg:right-8 md:right-8  bg-white w-80 p-4 rounded-lg shadow-md drop-shadow-2xl z-auto">
          <h2 className="text-xl font-bold mb-4">F&Q</h2>
          <div className="flex justify-end mb-2">
            <button
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={() => {
                setIsChatVisible(false);
                onClose();
              }}
            >
              <FontAwesomeIcon icon={faTimes} className="text-lg" />
            </button>
          </div>
          <div className="border border-gray-300 p-2 h-48 overflow-y-auto mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div className="flex justify-between">
                  <p
                    className={`mt-5 rounded-lg p-2 inline-block ${
                      message.sender === "user"
                        ? "bg-blue-200 text-gray-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {message.text}
                    {message.sender === "bot" && (
                      <span className="text-xs text-gray-400 ml-2 ">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              className="flex-grow border border-gray-300 rounded-l-md p-2"
              placeholder="Tanyakan Sesuatu"
              value={inputMessage}
              readOnly={true}
            />
            <button
              className="bg-gray-800 text-white rounded-r-md px-4 py-2 hover:bg-gray-600"
              onClick={handleSendMessage}
            >
              <FontAwesomeIcon icon={faPaperPlane} className="text-lg" />
            </button>
          </div>
          <div className="mt-4">
            <p className="font-semibold">pilih pertanyaan:</p>
            <ul>
              {options.map((option, index) => (
                <li
                  key={index}
                  className="cursor-pointer text-blue-500 hover:underline"
                  onClick={() => handleOptionClick(index)}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
