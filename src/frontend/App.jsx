import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Politics from "./pages/Politics";
import Catalog from "./pages/Catalog";
import Category from "./pages/Category";
import Favourites from "./pages/Favourites";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Admin from "./pages/Admin";
import AdminCategory from "./pages/AdminCategory";

import Bids from "./pages/Bids";
import Item from "./pages/Item";

const router = createBrowserRouter([
  {
    path: "/", //index:true указывает на этот путь
    element: <Layout />,
    children: [
      { index: true, element: <Home /> }, // тоже самое что и path:""
      { path: "favourites", element: <Favourites /> },
      { path: "politics", element: <Politics /> },
      { path: "catalog", element: <Catalog /> },
      { path: "category/:category_id", element: <Category /> },
      { path: "item/:item_id", element: <Item /> },
      { path: "admin", element: <Admin /> },
      { path: "admin_category/:category_id", element: <AdminCategory /> },
      { path: "bids", element: <Bids /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
