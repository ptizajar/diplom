import React, { useEffect, useState } from "react";
import { backend } from "../api-globals";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import f from "../css/.module/form.module.css"
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
            <div className={f.form} style={{ width: "280px", padding: "30px 25px" }}>
                <p className={f.title} style={{ fontSize: "20px" }}>Заказ №{order_id}</p>

                {currentUser?.is_admin && (
                    <div className={f.inputHolder}>
                        <span className={f.label}>Email</span>
                        <p className={f.field}>{email} </p>
                    </div>
                )}

                <div className={f.inputHolder}>
                    <span className={f.label}>Имя</span>
                    <p className={f.field} > {user_name} </p>
                </div>

                <div className={f.inputHolder}>
                    <span className={f.label}>Номер телефона</span>
                    <p className={f.field} >{phone} </p>
                </div>

                <div className={f.inputHolder}>
                    <span className={f.label}>Товар</span>
                    <Link to={`/item/${item_id}`} className={f.field} style={{ display: "block", color: "black" }}>
                        {article}
                    </Link>
                </div>

                <div className={f.inputHolder}>
                    <span className={f.label}>Цена</span>
                    <p className={f.field} >{price}</p>
                </div>

                <div className={f.inputHolder}>
                    <span className={f.label}>Когда перезвонить</span>
                    <p className={f.field} > {recall}  </p>
                </div>

                <div className={f.inputHolder}>
                    <span className={f.label}>Статус</span>
                    <p className={f.field} >  {status}  </p>
                </div>

                {/* Блок кнопок управления для админа */}
                {currentUser?.is_admin && (
                    <div className={f.buttonHolder} >
                        {status === 'Оформлен' && (
                            <>
                                <button className={f.button} style={{width: "fit-content"}} onClick={confirmed}>Подтвердить</button>
                                <button className={f.button} onClick={canceled}>Отменить</button>
                            </>
                        )}
                        {status === 'Подтвержден' && (
                            <button className={f.button} onClick={canceled}>Отменить </button>
                        )}
                    </div>
                )}
            </div>
            {/* <div className={i.card} >
                {currentUser?.is_admin && <><span>Email</span>
                    <p className={i.name}>{email}</p></>}
                <span>Имя</span>
                <p className={i.name}>{user_name}</p>
                <span>Номер телефона</span>
                <p className={i.name}>{phone}</p>
                <span>Товар</span>
                <Link to={`/item/${item_id}`} className={i.name}>{article}</Link>
                <span>Цена</span>
                <p className={i.name}>{price}</p>
                <span>Когда перезвонить</span>
                <p className={i.name}>{recall}</p>
                <span>Статус</span>
                <p className={i.name}>{status}</p>
                {currentUser?.is_admin && status === 'Оформлен' &&
                    <>
                        <button onClick={confirmed}>Подтверждено</button>
                        <button onClick={canceled}>Отменено</button>
                    </>}
                {currentUser?.is_admin && status === 'Подтвержден' && <button onClick={canceled}>Отменено</button>}
            </div> */}

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


