import React, { useState } from "react"
import "../css/form.css"
import "../api-globals"


import { backend } from "../api-globals";

import "../css/toast.css"


export function ChangePassword({ onCloseClick }) {
    const [error, setError] = useState('');

    async function save(e) {
        e.preventDefault();


        if (!res.ok) {
            const err = await res.json();
            setError(err.error);
            return;
        }
        const result = await res.json();

        onCloseClick();
    }

    
    return (
        <>
            <form className="form" onSubmit={save} id="changePassword" method="POST" encType="multipart/form-data">
                <p>Мы выслали Вам код на email</p>
                <input type="text" className="form-field" placeholder="Код" name="code" required />
                <input type="password" className="form-field" placeholder="Пароль" name="password" required />

                <div className='button-holder'>
                    <button className='form-button' type="submit">Подтвердить</button>
                    <button className='form-button' onClick={() => { onCloseClick('navigate') }}>Отмена</button>
                </div>
            </form>
            {error && (
                <div className="toast-notification">
                    <div className="toast-content">
                        <span className="toast-message">{error}</span>
                        <button onClick={() => setError("")} className="toast-close">×</button>
                    </div>
                    {/* Прогресс-бар для автоскрытия */}
                    <div className="toast-progress"></div>
                </div>
            )}</>
    )
}
