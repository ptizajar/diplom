import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { backend } from "../api-globals";
import "../css/toast.css"
import { OrderForm } from "../components/OrderForm";
import { showDialog } from "../components/Dialog";
import { setUser } from "../store";
import { useDispatch } from "react-redux";

export function ItemPage() {
  const { item_id } = useParams();
  const [item, setItem] = useState();
  const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
  async function load() {
    const res = await fetch(`${backend}/api/item/${item_id}`);
    if (!res.ok) {
      const err = await res.json();
      setError(err.error);
      return;
    }
    const data = await res.json();
    setItem(data);
  }
 function loadOrNavigate(action) {
    if (action === 'navigate') {
      dispatch(setUser(null));
      navigate('/')
    } else {
      load();
    }

  }
  useEffect(() => {
    load();
  }, [])



  return (
    <>
      Артикул {item?.article}
      <br />
      Название {item?.item_name}
      <br />
      Длина {item?.length} см
      <br />
      Ширина {item?.width} см
      <br />
      Высота {item?.height} см
      <br />
      Цена {item?.price} руб
      <br />
      Заказ от {item?.quantity} шт
      <br />
      Описание: {item?.description}
      <br />
      <div style={{ backgroundImage: `url('${backend}/api/item/image/${item_id}')`, width: "300px", height: "300px", backgroundSize: "contain", backgroundRepeat: "no-repeat" }}></div>
      <button style={{width: '100px', height: '20px'}} onClick={() => showDialog(OrderForm,{item_id}, loadOrNavigate)}>Заказать</button>
      {error && (
        <div className="toast-notification">
          <div className="toast-content">
            <span className="toast-message">{error}</span>
            <button onClick={() => setError("")} className="toast-close">×</button>
          </div>
          {/* Прогресс-бар для автоскрытия */}
          <div className="toast-progress"></div>
        </div>
      )}
    </>
  );
}


