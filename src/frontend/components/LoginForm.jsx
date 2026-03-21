import React, { useState } from "react"
import f from "../css/.module/form.module.css"
import "../api-globals"
import { showDialog } from "./Dialog";
import { RegistrationForm } from "./RegistrationForm";
import { backend } from "../api-globals";
import { useDispatch } from "react-redux";
import { setUser } from "../store";
import { ChangePassword } from "./ChangePassword";
import "../css/toast.css"


export function LoginForm({ onCloseClick }) {
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);
    const dispatch = useDispatch();
    function switchForm(newform) {
        showDialog(newform);
        onCloseClick();
    }
    async function save(e) {
        e.preventDefault();
        setIsSubmitting(true);
        const res = await fetch(`${backend}/api/login`, {
            method: 'POST',
            body: new FormData(loginForm)

        });
        if (!res.ok) {
            const err = await res.json();
            setError(err.error);
            return;
        }
        const result = await res.json();



        dispatch(setUser(result));
        setIsSubmitting(false);
        onCloseClick();
    }



    return (
        <>
            <form className={f.form} onSubmit={save} id="loginForm" method="POST" encType="multipart/form-data">
                <p>Войти</p>
                <input type="text" className={f.field} placeholder="Email" name="email" required />
                <input type={showPasswords ? "text" : "password"} className={f.field} placeholder="Пароль" name="password" required />

                <div style={{ margin: '15px 0', textAlign: 'left' }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={showPasswords}
                            onChange={(e) => setShowPasswords(e.target.checked)}
                            disabled={isSubmitting}
                            style={{ marginRight: '8px', width: 'auto' }}
                        />
                        <span>Показать пароль</span>
                    </label>
                </div>

                <p>или</p>
                <button className={f.button} onClick={() => switchForm(RegistrationForm)}>Зарегестрироваться</button>

                <div className={f.buttonHolder}>
                    <button className={f.button} type="submit">ОК</button>
                    <button className={f.button} onClick={onCloseClick}>Отмена</button>
                    <button className={f.button} onClick={() => switchForm(ChangePassword)}>Забыли пароль?</button>
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
