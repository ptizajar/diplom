import React, { useState } from "react";
import { backend } from "../api-globals";
import "../css/itemCard.css"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
export function OrderCard({ order_id, login, user_name, item_id, article, price, recall, phone }) {
    const currentUser = useSelector((state) => state.user.currentUser);
    // async function changeStatus(e) {
    //     e.preventDefault();

    //     const formData = new FormData();
    //     formData.append("item_id", item_id);
    //     formData.append("liked", !currentLiked);
    //     const res = await fetch(`${backend}/api/status/${order_id}`, {
    //         method: 'PUT',
    //         body: formData
    //     })
    //     if (!res.ok) {
    //         const err = await res.json();
    //         setError(err.error);
    //         setTimeout(() => setError(""), 5000);
    //         return;
    //     }
    // }
    return (
        <>
            <div className="item-card" >
                {currentUser?.is_admin && <><span>Логин</span>
                    <p className="item-name">{login}</p></>}
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
            </div>

            {/* {error && (
                <div className="toast-notification">
                    <div className="toast-content">
                        <span className="toast-message">{error}</span>
                        <button onClick={() => setError("")} className="toast-close">×</button>
                    </div>
                    <div className="toast-progress"></div>
                </div>
            )} */}

        </>
    );
}


