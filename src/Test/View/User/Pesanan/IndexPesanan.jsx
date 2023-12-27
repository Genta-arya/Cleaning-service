import React from "react";
import { Helmet } from "react-helmet";
import MainOrder from "./Component/MainOrder";

const IndexPesanan = () => {
  return (
    <div>
      <Helmet>
        <title>Tangkas Jaya Teknik - Order Service </title>
      </Helmet>
      <MainOrder />
    </div>
  );
};

export default IndexPesanan;
