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

  async function load() {
    const res = await fetch(`${backend}/api/admin/bids`);
    if (!res.ok) {
      const err = await res.json();
      setError(err.error);
      return;
    }
    const data = await res.json();
    console.log(bids);
    setBids(data);
  }

  useEffect(() => {
    load();
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
      <p>Заявки</p>
      <Link to="/bids">Заявки</Link>
      <div className="card-holder">
        {bids.map((bid) => (
          <OrderCard
            key={bid.order_id}
            order_id={bid.order_id}
            login={bid.login}
            user_name={bid.user_name}
            item_id={bid.item_id}
            article={bid.article}
            price={bid.price}
            recall={formatDate(bid.recall_date)}
            phone={bid.phone}
            onClose={load}

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
