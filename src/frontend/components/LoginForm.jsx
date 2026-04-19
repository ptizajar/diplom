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
import { Eye, EyeOff } from "lucide-react";


export function LoginForm({ onCloseClick }) {
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
            setIsSubmitting(false);
            setError(err.error);
            setTimeout(() => setError(""), 5000);
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
                <p className={f.title}>Войти</p>
                <div className={f.inputHolder}>
                    <label className={f.label}>Email</label>
                    <input type="text" className={f.field} name="email" required />
                </div>

                {/* Поле Пароль с глазиком */}
                <div className={`${f.inputHolder} ${f.passwordWrapper}`}>
                    <label className={f.label}>Пароль</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        className={`${f.field} ${f.fieldPassword}`}
                        name="password"
                        required
                        disabled={isSubmitting}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
                        className={f.togglePasswordBtn}
                        aria-label={showPassword ? "Показать пароль" : "Скрыть пароль"}
                    >
                        {showPassword ?
                            <Eye size={18} strokeWidth={2.5} /> :
                            <EyeOff size={18} strokeWidth={2.5} />
                        }
                    </button>
                </div>
                {/* <div className={f.inputHolder}>
                    <label className={f.label}>Пароль</label>
                    <input type={showPasswords ? "text" : "password"} className={f.field}  name="password" required />
                </div>

                <div className={f.checkboxHolder}>
                    <label className={f.label} htmlFor="checkbox">Показать пароль </label>
                    <input
                        type="checkbox"
                        id="checkbox"
                        checked={showPasswords}
                        onChange={(e) => setShowPasswords(e.target.checked)}
                        disabled={isSubmitting}
                        style={{ marginRight: '8px', width: 'auto' }}
                    />
                </div> */}
                <div className={f.buttonHolder}>
                    <button className={f.button} type="submit">ОК</button>
                    <button className={f.button} onClick={onCloseClick}>Отмена</button>
                </div>
                <div className={f.buttonHolder} style={{ justifyContent: "center" }}>
                    <button className={f.button} style={{ width: "60%" }} onClick={() => switchForm(ChangePassword)}>Забыли пароль?</button>
                </div>

                <p className={f.label} style={{ marginTop: "10px" }}>Ещё нет аккаунта?</p>
                <div className={f.buttonHolder} style={{ justifyContent: "center" }}>
                    <button className={f.button} style={{ width: "60%" }} onClick={() => switchForm(RegistrationForm)}>Зарегестрироваться</button>
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
