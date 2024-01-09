import React from "react";
import Sidebar from "./Component/Sidebar";
import Copyright from "../../User/Home/Component/Copyright";

const Main = () => {
  return (
    <div>
      <Sidebar />
      <div className="md:mt-24">


      <div className="fixed -bottom-0 left-0 right-0 -z-0">
        <Copyright />
      </div>
      </div>
    </div>
  );
};

export default Main;
