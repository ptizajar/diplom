import {Header} from "./Header";
import {Footer} from "./Footer";
import React from "react";
import { Outlet } from "react-router-dom";
function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
