import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { getHistory } from "../../../../../Service/Api";

const NotifTest = () => {
  const [notifications, setNotifications] = useState([]);
  const [orderIdFromHistory, setOrderIdFromHistory] = useState([]);

  console.log(orderIdFromHistory);
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyData = await getHistory();
        // Extracting order IDs from the historical data
        const orderIds = historyData.map(
          (historyItem) => historyItem.orderDetails.orderId
        );
        setOrderIdFromHistory(orderIds);
        console.log("Order IDs:", orderIds);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firebaseConfig = {
          apiKey: "AIzaSyByA2NbnXpFg4yM_h8pug8WgD9hnLyQv4g",
          authDomain: "ac-service-34683.firebaseapp.com",
          databaseURL: "https://ac-service-34683-default-rtdb.firebaseio.com",
          projectId: "ac-service-34683",
          storageBucket: "ac-service-34683.appspot.com",
          messagingSenderId: "372535984207",
          appId: "1:372535984207:web:0dcbc759cee5f2a85aea3a",
          measurementId: "G-1XH4ZTDPQG",
        };
        const firebaseApp = initializeApp(firebaseConfig);
        const database = getDatabase(firebaseApp);
        const notificationsRef = ref(database, "notifications");

        const unsubscribe = onValue(notificationsRef, (snapshot) => {
          const notificationsData = snapshot.val();
          console.log("Notifications data from Firebase:", notificationsData);

          if (notificationsData) {
            const filteredNotifications = Object.entries(notificationsData)
              .filter(([orderId]) =>
                orderIdFromHistory.includes(Number(orderId))
              )
              .map(([orderId, orderDetails]) => ({
                orderId: Number(orderId),
                message: orderDetails.message || "",
              }));

            console.log("Filtered notifications:", filteredNotifications);

            setNotifications(filteredNotifications);
          } else {
            setNotifications([]);
          }
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Error fetching notifications:", error.message);
      }
    };

    fetchData();
  }, [orderIdFromHistory]);

  useEffect(() => {
    console.log(notifications);
  }, [notifications]);

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.orderId}>{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotifTest;
