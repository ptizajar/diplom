import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { backend } from "../api-globals";
import { forAdminOnly } from "../components/ForAdminOnly";
import l from "../css/.module/layout.module.css";
import t from "../css/.module/priceHistory.module.css";
 function PriceHistory() {
    const { item_id } = useParams();
    const [error, setError] = useState("");
    const [prices, setPrices] = useState([]);

    async function loadPrices() {
        const res = await fetch(`${backend}/api/admin/price_history/${item_id}`, {
            method: 'GET',
        });
        if (!res.ok) {
            const err = await res.json();
            setError(err.error);
            setTimeout(() => setError(""), 5000);
            return;
        }
        const data = await res.json();
        setPrices(data);
    }

    useEffect(() => { loadPrices() }, []);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };
    const itemName = prices[0]?.item_name;
    return <>
     <h1 className={l.title}> {itemName}</h1> 
            <table className={t.table}>
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Цена</th>
                    </tr>
                </thead>
                <tbody>
                    {prices.map((price) => (
                        <tr key={price.item_name + price.moscow_time}>
                            <td>{formatDate(price?.moscow_time)}</td>
                             <td>{price?.price} ₽</td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
    </>;
}

export default forAdminOnly(PriceHistory);