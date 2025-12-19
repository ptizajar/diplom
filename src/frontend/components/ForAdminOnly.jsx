import { useSelector } from "react-redux";
import React from "react";
import NotFound from "../pages/NotFound";
export function forAdminOnly(WrappedComponent) {//Оборачивает компонент, если админ отдаёт компонент с пропсами, если нет то notFound
    
  return function NewComponent(props) {
   const currentUser = useSelector((state) => state.user.currentUser);
   if(currentUser?.is_admin) return <WrappedComponent {...props} />;
   return <NotFound></NotFound>
  };
}

