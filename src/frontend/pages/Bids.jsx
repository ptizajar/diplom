import { forAdminOnly } from "../components/ForAdminOnly";
import React, { useEffect, useState } from "react";
import { backend } from "../api-globals";
import "../css/toast.css"
import { OrderCard } from "../components/OrderCard";
import l from "../css/.module/layout.module.css";
import a from "../css/.module/admin.module.css";
import i from "../css/.module/itemCard.module.css";

function Bids() {
  const [bids, setBids] = useState([]);
  const [error, setError] = useState("");

  async function filterOrders(status) {
    const res = await fetch(`${backend}/api/admin/filterOrders?status=${status}`, {
      method: 'GET',
    });
    if (!res.ok) {
      const err = await res.json();
      setError(err.error);
      setTimeout(() => setError(""), 5000);
      return;
    }
    const data = await res.json();
    setBids(data);
  }

  useEffect(() => {
    filterOrders('Оформлен');
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };




  return (
    <>
      <h1 className={l.title}>Заявки</h1>
      <div className={a.adminButtonContainer}>
        <button className={a.adminButton} onClick={() => filterOrders('Оформлен')}>Оформленные</button>
        <button className={a.adminButton} onClick={() => filterOrders('Подтвержден')}>Подтвержденные</button>
        <button className={a.adminButton} onClick={() => filterOrders('Отменен')}>Отмененные</button>
        <button className={a.adminButton} onClick={() => filterOrders('Все')}>Все</button>
      </div>
      {bids.length === 0 && <div>Заказов нет</div>}
      <div className={i.cardHolder}>
        {bids.map((bid) => (
          <OrderCard
            key={bid.order_id}
            order_id={bid.order_id}
            email={bid.email}
            user_name={bid.user_name}
            item_id={bid.item_id}
            article={bid.article}
            price={bid.price}
            recall={formatDate(bid.recall_date)}
            phone={bid.phone}
            status={bid.status}
            onStatusChange={() => filterOrders('Оформлен')}
          ></OrderCard>
        ))}
      </div>
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


export default forAdminOnly(Bids);
