import React, { useEffect, useState } from "react";
import { backend } from "../api-globals";
import "../css/itemCard.css"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
export function OrderCard({ order_id, email, user_name, item_id, article, price, recall, phone, status, onStatusChange }) {
    const currentUser = useSelector((state) => state.user.currentUser);
    const [error, setError] = useState("");
    const [currentStatus, setCurrentStatus] = useState(status);
    function confirmed(e) {
        e.preventDefault();
        changeStatus("Подтвержден");
    }
    function canceled(e) {
        e.preventDefault();
        changeStatus("Отменен");
    }

    async function changeStatus(newStatus) {
        const formData = new FormData();
        formData.append("status", newStatus);
        formData.append("id", order_id);
        const res = await fetch(`${backend}/api/admin/changeStatus`, {
            method: 'PUT',
            body: formData
        })
        if (!res.ok) {
            const err = await res.json();
            setError(err.error);
            setTimeout(() => setError(""), 5000);
            return;
        }
        setCurrentStatus(newStatus);
        onStatusChange();
    }


    return (
        <>
            <div className="item-card" >
                {currentUser?.is_admin && <><span>Email</span>
                    <p className="item-name">{email}</p></>}
                <span>Имя</span>
                <p className="item-name">{user_name}</p>
                <span>Номер телефона</span>
                <p className="item-name">{phone}</p>
                <span>Товар</span>
                <Link to={`/item/${item_id}`} className="item-name">{article}</Link>
                <span>Цена</span>
                <p className="item-name">{price}</p>
                <span>Когда перезвонить</span>
                <p className="item-name">{recall}</p>
                <span>Статус</span>
                <p className="item-name">{status}</p>
                {currentUser?.is_admin && status === 'Оформлен' &&
                    <>
                        <button onClick={confirmed}>Подтверждено</button>
                        <button onClick={canceled}>Отменено</button>
                    </>}
                {currentUser?.is_admin && status === 'Подтвержден' && <button onClick={canceled}>Отменено</button>}
            </div>

            {error && (
                <div className="toast-notification">
                    <div className="toast-content">
                        <span className="toast-message">{error}</span>
                        <button onClick={() => setError("")} className="toast-close">×</button>
                    </div>
                    <div className="toast-progress"></div>
                </div>
            )}

        </>
    );
}


