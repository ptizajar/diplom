import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { backend } from "../api-globals";
import "../css/itemCard.css"
import "../css/toast.css"
import { OrderCard } from "../components/OrderCard";
import { showDialog } from "../components/Dialog";
import { EditUserForm } from "../components/EditUserForm";

export function Account() {
  const [bids, setBids] = useState([]);
  const [userData, setUserData] = useState({});
  const [error, setError] = useState("");

  async function loadBids() {
    const res = await fetch(`${backend}/api/bids`, {
      method: 'GET'
    });
    if (!res.ok) {
      const err = await res.json();
      setError(err.error);
      return;
    }
    const data = await res.json();
    setBids(data);
  }

  async function loadData() {
    const res = await fetch(`${backend}/api/user_data`, {
      method: 'GET'
    });
    if (!res.ok) {
      const err = await res.json();
      setError(err.error);
      return;
    }
    const data = await res.json();
    setUserData(data);
  }

  useEffect(() => {
    loadBids();
    loadData();
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
      <p>Account</p>
      <div>{userData.user_name} </div>
      <div>{userData.phone} </div>
      <button onClick={() => showDialog(EditUserForm, undefined, loadData)}>Редактировать</button>
      <div className="card-holder">
        {bids.map((bid) => (
          <OrderCard
            key={bid.order_id}
            order_id={bid.order_id}
            user_name={bid.user_name}
            item_id={bid.item_id}
            article={bid.item_name}
            price={bid.price}
            recall={formatDate(bid.recall_date)}
            phone={bid.phone}
            status={bid.status}
            onClose={loadBids}
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



