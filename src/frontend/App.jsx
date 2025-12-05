import React, { useEffect, useState } from "react";
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
import { forAdminOnly } from "./components/ForAdminOnly";

import Bids from "./pages/Bids";
import Item from "./pages/Item";
import { store } from "./store";
import { Provider, useDispatch } from "react-redux";
import { setUser } from "./store";



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
      { path: "admin", element:  <Admin /> },
      { path: "admin_category/:category_id", element: <AdminCategory /> },
      { path: "bids", element: <Bids /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

function AppImp({children}){
  const dispatch = useDispatch();
  async function refreshSession() {
    const result = await fetch('/api/refresh-session');
    const data = await result.json();
    dispatch(setUser(data.user))
    
    
  }
  useEffect(
    ()=>{
       refreshSession(); 
    },[]
  )
  return children
}

function App() {
  

  return (
    <Provider store={store}>
      <AppImp>
        <RouterProvider router={router} />
      </AppImp>
    </Provider>
  )

}

export default App;
