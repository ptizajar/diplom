import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { backend } from "../api-globals";
import "../css/toast.css"
import { OrderForm } from "../components/OrderForm";
import { showDialog } from "../components/Dialog";
import { setUser } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { LoginForm } from "../components/LoginForm";
import l from "../css/.module/layout.module.css";
import i from "../css/.module/itemPage.module.css";
import a from "../css/.module/admin.module.css";
import h from "../css/.module/home.module.css"

export function ItemPage() {
  const { item_id } = useParams();
  const [item, setItem] = useState();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  async function load() {
    const res = await fetch(`${backend}/api/item/${item_id}`);
    if (!res.ok) {
      const err = await res.json();
      setError(err.error);
      setTimeout(() => setError(""), 5000);
      return;
    }
    const data = await res.json();
    setItem(data);
  }

  function handleOrderClick() {
    if (!currentUser) {
      showDialog(LoginForm, undefined, load);
      return;
    }
    showDialog(OrderForm, { item_id }, load);
  }

  useEffect(() => {
    load();
  }, [])



  return (
    <>
      <h1 className={l.title}>{item?.item_name}</h1>
      <div className={i.itemHolder}>
        <div className={i.image} style={{ backgroundImage: `url('${backend}/api/item/image/${item_id}')` }}></div>
        <div className={i.tableHolder}>
          <table className={i.table}>
            <tbody>
              <tr>
                <td>Артикул</td>
                <td>{item?.article}</td>
              </tr>
              <tr>
                <td>Название</td>
                <td>{item?.item_name}</td>
              </tr>
              <tr>
                <td>Длина</td>
                <td>{item?.length} см</td>
              </tr>
              <tr>
                <td>Ширина</td>
                <td>{item?.width} см</td>
              </tr>
              <tr>
                <td>Высота</td>
                <td>{item?.height} см</td>
              </tr>
              <tr>
                <td>Заказ от</td>
                <td>{item?.quantity} шт</td>
              </tr>
            </tbody>
          </table>
          <div className={i.priceHolder}>
            <p className={i.price}>{item?.price} ₽</p>
            <button className={a.adminButton} onClick={handleOrderClick}>Заказать</button>
          </div>
        </div>
      </div>

      <div className={h.info} style={{marginLeft:"5%", width:"90%", marginTop:"35px"}}>{item?.description}</div>


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


