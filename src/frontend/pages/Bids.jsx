import { forAdminOnly } from "../components/ForAdminOnly";
import React, { useEffect, useState } from "react";
import { backend } from "../api-globals";
import "../css/toast.css"
import { OrderCard } from "../components/OrderCard";
import l from "../css/.module/layout.module.css";
import a from "../css/.module/admin.module.css";
import i from "../css/.module/itemCard.module.css";
import f from "../css/.module/favourites.module.css";
import fm from "../css/.module/form.module.css";


function Bids() {
  const [allBids, setAllBids] = useState([]); // все заявки
  const [bids, setBids] = useState([]);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState('Оформлен');
  // async function filterOrders(status) {
  //   const res = await fetch(`${backend}/api/admin/filterOrders?status=${status}`, {
  //     method: 'GET',
  //   });
  //   if (!res.ok) {
  //     const err = await res.json();
  //     setError(err.error);
  //     setTimeout(() => setError(""), 5000);
  //     return;
  //   }
  //   const data = await res.json();
  //   setBids(data);
  // }
  // useEffect(() => {
  //   filterOrders('Оформлен');
  // }, [])

  async function fetchAllOrders() {
    const res = await fetch(`${backend}/api/admin/bids`);
    if (!res.ok) {
      const err = await res.json();
      setError(err.error);
      setTimeout(() => setError(""), 5000);
      return;
    }
    const data = await res.json();
    setAllBids(data);
    const defaultFiltered = data.filter(bid => bid.status === 'Оформлен');
    setBids(defaultFiltered);
  }

  // function filterOrders(status) {
  //   if (status === 'Все') {
  //     setBids(allBids);
  //   } else {
  //     const filtered = allBids.filter(bid => bid.status === status);
  //     setBids(filtered);
  //   }
  // }
  function applyFilters(status) {
    let filtered = [...allBids];

    if (status !== 'Все') {
      filtered = filtered.filter(bid => bid.status === status);
    }

    if (startDate) {
      const start = new Date(startDate);
      filtered = filtered.filter(bid => new Date(bid.date) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(bid => new Date(bid.date) <= end);
    }

    setBids(filtered);
  }
  function resetFilters() {
    setStartDate("");
    setEndDate("");
    setStatus('Оформлен'); // дефолт
  }
  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    applyFilters(status);
  }, [status, startDate, endDate, allBids]);


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

        <span className={fm.label}>Начало периода</span>
        <input
          className={fm.field}
          style={{ maxWidth: "200px", marginTop: "0" }}
          type="date"
          value={startDate}
          name="startDate"
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span className={fm.label}>Конец периода</span>
        <input
          className={fm.field}
          style={{ maxWidth: "200px", marginTop: "0" }}
          type="date"
          value={endDate}
          name="endDate"
          onChange={(e) => setEndDate(e.target.value)}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={a.adminButton}
          style={{ paddingTop: "5px" }}
          name="dateSelect"
        >
          <option value="Оформлен">Оформленные</option>
          <option value="Подтвержден">Подтвержденные</option>
          <option value="Отменен">Отмененные</option>
          <option value="Выполнен">Выполненные</option>
          <option value="Все">Все</option>
        </select>
        <button className={a.adminButton} onClick={applyFilters}>
          Применить
        </button>
        <button className={a.adminButton} onClick={resetFilters}>
          Сбросить фильтры
        </button>

      </div>
      {bids.length === 0 && <div className={f.noFavourites}>Заказов нет</div>}
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
            company={bid?.company}
            date={formatDate(bid.date)}
            onStatusChange={fetchAllOrders}
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
