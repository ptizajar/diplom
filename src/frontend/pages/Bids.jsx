import { forAdminOnly } from "../components/ForAdminOnly";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { backend } from "../api-globals";
import "../css/itemCard.css"
import "../css/toast.css"
import { OrderCard } from "../components/OrderCard";

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
      return;
    }
    const data = await res.json();
    setBids(data);
  }
  
  // async function load() {
  //   const res = await fetch(`${backend}/api/bids`);
  //   if (!res.ok) {
  //     const err = await res.json();
  //     setError(err.error);
  //     return;
  //   }
  //   const data = await res.json();
  //   setBids(data);
  // }

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

  function created() {
    filterOrders('Оформлен')
  }
  function confirmed() {
    filterOrders('Подтвержден')
  }
  function canceled() {
    filterOrders('Отменен')
  }
  function all(){
    filterOrders('Все')
  }

 
  return (
    <>
      <p>Заявки</p>
      <button onClick={created}>Оформленные</button>
      <button onClick={confirmed}>Подтвержденные</button>
      <button onClick={canceled}>Отмененные</button>
      <button onClick={all}>Все</button>
      {bids.length===0 && <div>Заказов нет</div>}
      <div className="card-holder">
        {bids.map((bid) => (
          <OrderCard
            key={bid.order_id}
            order_id={bid.order_id}
            email={bid.email}
            user_name={bid.user_name}
            item_id={bid.item_id}
            article={bid.item_name}
            price={bid.price}
            recall={formatDate(bid.recall_date)}
            phone={bid.phone}
            status={bid.status}
            onStatusChange={created}
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
