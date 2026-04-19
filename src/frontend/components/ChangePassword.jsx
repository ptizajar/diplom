import React, { useState } from "react"
import f from "../css/.module/form.module.css"
import "../api-globals"
import { backend } from "../api-globals"
import "../css/toast.css"
import { useValidation } from "../validation/useValidation"



export function ChangePassword({ onCloseClick }) {
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sent, setSent] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);
    const [savedEmail, setSavedEmail] = useState('');
    const { errors, checkField, checkForm, clearErrors } = useValidation('registration');

    async function confirm(e) {
        e.preventDefault();
        setError("");
        const formData = new FormData(document.getElementById('changePassword'));
        formData.append('email', savedEmail);
        const validationData = { password: formData.get('password') || '' };
        const isValid = checkForm(validationData);
        if (!isValid) return;
        const missMatch = formData.get("password") !== formData.get("password2");
        if (missMatch) {
            setError("Пароли не совпадают");
            setTimeout(() => setError(""), 5000);
            return;
        }
        setIsSubmitting(true)
        const res = await fetch(`${backend}/api/change_password`, {
            method: 'POST',
            body: formData
        });
        if (!res.ok) {
            const err = await res.json();
            setError(err.error);
            setTimeout(() => setError(""), 5000);
            setIsSubmitting(false);
            return;
        }
        await res.json();
        clearErrors();
        setIsSubmitting(false);
        onCloseClick();
    }

    async function send(e) {
        e.preventDefault();
        setError("");
        const formData = new FormData(document.getElementById('changePassword'));
        const emailValue = formData.get('email');
        const isValid = checkForm({ email: emailValue });
        if (!isValid) return;
        setIsSubmitting(true);
        const res = await fetch(`${backend}/api/send_code`, {
            method: 'POST',
            body: formData
        });
        if (!res.ok) {
            const err = await res.json();
            setError(err.error);
            setTimeout(() => setError(""), 5000);
            setIsSubmitting(false);
            return;
        }
        await res.json();
        setSavedEmail(emailValue);
        setSent(true);
        clearErrors();
        setIsSubmitting(false);
    }

    return (
        <>
            <form className={f.form} onSubmit={sent ? confirm : send} id="changePassword" method="POST" encType="multipart/form-data">
                {sent ? <p className={f.title}>Мы выслали код на email</p> : <p className={f.title}>Подтверждение</p>}
                {/* <div className={f.inputHolder}>
                    <label className={f.label} hidden={sent}>Email</label>
                    <input type="text" className={f.field} placeholder="email" name="email" required hidden={sent}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={(e) => handleBlur('email', e.target.value)} />
                </div> */}
                {!sent && (
                <div className={f.inputHolder}>
                    <label className={f.label}>Email</label>
                    <input 
                        type="text" 
                        className={f.field} 
                        name="email" 
                        required 
                        onBlur={(e) => checkField('email', e.target.value)} 
                        onChange={(e) => checkField('email', e.target.value)}
                    />
                </div>
            )}
                {errors.email?.length > 0 && (
                    <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                        {errors.email[0]}
                    </div>
                )}
                {sent && <>
                    <div className={f.inputHolder}>
                        <label className={f.label}>Код</label>
                        <input type="text" className={f.field}  name="code" required />
                    </div>
                    <div className={f.inputHolder}>
                        <label className={f.label}>Пароль</label>
                        <input type={showPasswords ? "text" : "password"} className={f.field} name="password" required
                            onChange={(e) => checkField('password', e.target.value)}
                            onBlur={(e) => checkField('password', e.target.value)}
                        />
                    </div>
                    {errors.password?.length > 0 && (
                        <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                            {errors.password[0]}
                        </div>
                    )}
                    <div className={f.inputHolder}>
                        <label className={f.label}>Повторите пароль</label>
                        <input type={showPasswords ? "text" : "password"} className={f.field} name="password2" required />
                    </div>
                    <div className={f.checkboxHolder}>
                        <label className={f.label} htmlFor="checkbox">Показать пароль</label>
                        <input
                            type="checkbox"
                            id="checkbox"
                            checked={showPasswords}
                            onChange={(e) => setShowPasswords(e.target.checked)}
                            disabled={isSubmitting}
                            style={{ marginRight: '8px', width: 'auto' }}
                        />
                    </div>
                </>}

                {/* <div className={f.buttonHolder}>
                    {sent ?
                        <button className={f.button} type="submit" onClick={confirm}>Подтвердить</button>
                        : <button className={f.button} type="submit" onClick={send}>Выслать код</button>
                    }
                    <button className={f.button} onClick={() => { onCloseClick('navigate') }}>Отмена</button>
                </div> */}
                <div className={f.buttonHolder}>
                    <button className={f.button} type="submit">
                        {sent ? "Подтвердить" : "Выслать код"}
                    </button>
                    <button className={f.button} type="button" onClick={() => { onCloseClick('navigate') }}>
                        Отмена
                    </button>
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
