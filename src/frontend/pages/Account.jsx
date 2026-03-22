import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { backend } from "../api-globals";
import "../css/toast.css"
import i from  "../css/.module/itemCard.module.css"
import { OrderCard } from "../components/OrderCard";
import { showDialog } from "../components/Dialog";
import { EditUserForm } from "../components/EditUserForm";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store";
import { SessionExpired } from "../components/SessionExpired";


export function Account() {
  const [bids, setBids] = useState([]);
  const [userData, setUserData] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const error401 = useRef(false);

  async function loadBids() {
    setError("");
    if (!currentUser) {
      return;
    }
    const res = await fetch(`${backend}/api/bids`, {
      method: 'GET'
    });
    if (res.status === 401 && !error401.current) {
      error401.current = true;
      showDialog(SessionExpired, undefined, () => {
        error401.current = false; dispatch(setUser(null)); navigate('/')
      });
      return;
    }
    if (!res.ok && res.status !== 401) {
      const err = await res.json();
      setError(err.error);
      setTimeout(() => setError(""), 5000);
      return;
    }
    const data = await res.json();
    setBids(data);
  }

  async function loadData() {
    setError("");
    if (!currentUser) {
      return;
    }
    const res = await fetch(`${backend}/api/user_data`, {
      method: 'GET'
    });
    if (res.status === 401 && !error401.current) {
      error401.current = true;
      showDialog(SessionExpired, undefined, () => {
        error401.current = false; dispatch(setUser(null)); navigate('/')
      });
      return;
    }
    if (!res.ok && res.status !== 401) {
      const err = await res.json();
      setError(err.error);
      setTimeout(() => setError(""), 5000);
      return;
    }
    const data = await res.json();
    setUserData(data);
  }


  async function logout() {
    setError("");

    const res = await fetch(`${backend}/api/logout`, {
      method: 'POST'
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error);
      setTimeout(() => setError(""), 5000);
      return;
    }
    navigate('/');
    dispatch(setUser(null))
  }

  async function deleteAcc() {
    setError("");
    const res = await fetch(`${backend}/api/delete_acc`, {
      method: 'DELETE'
    });
    if (res.status === 401 && !error401.current) {
      error401.current = true;
      showDialog(SessionExpired, undefined, () => {
        error401.current = false; dispatch(setUser(null)); navigate('/')
      });
      return;
    }
    if (!res.ok && res.status !== 401) {
      const err = await res.json();
      setError(err.error);
      setTimeout(() => setError(""), 5000);
      return;
    }
    navigate('/');
    dispatch(setUser(null))

  }

  function loadOrNavigate(action) {
    if (action === 'navigate') {
      dispatch(setUser(null));
      navigate('/')
    } else {
      loadData();
    }

  }
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
    loadBids();
    loadData();
    return () => {
      error401.current = false;
    };
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
      <button onClick={logout}>Logout</button>
      <button style={{ color: "red" }} onClick={deleteAcc}>Delete account</button>
      <div>{userData.user_name} </div>
      <div>{userData.phone} </div>
      <div>{userData.email}</div>
      <button onClick={() => showDialog(EditUserForm, undefined, loadOrNavigate)}>Редактировать</button>
      <div className={i.cardHolder}>
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



