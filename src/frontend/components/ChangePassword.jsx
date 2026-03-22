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
    const { errors, checkField, checkForm, clearErrors } = useValidation('registration');
    const handleChange = (fieldName, value) => {
        if (fieldName !== 'password2') {
            checkField(fieldName, value);
        }
    };

    const handleBlur = (fieldName, value) => {
        if (fieldName !== 'password2') {
            checkField(fieldName, value);
        }
    };
    async function confirm(e) {
        e.preventDefault();
        setError("");
        const formData = new FormData(document.getElementById('changePassword'));
        const validationData = {
            password: formData.get('password') || ''
        };

        const isValid = checkForm(validationData);

        if (!isValid) {
            return;
        }
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
         clearErrors();
        const formData = new FormData(document.getElementById('changePassword'));
        const res = await fetch(`${backend}/api/send_code`, {
            method: 'POST',
            body: formData
        });
        if (!res.ok) {
            const err = await res.json();
            setError(err.error);
            setTimeout(() => setError(""), 5000);
            return;
        }
        await res.json();
        setSent(true);
    }

    return (
        <>
            <form className={f.form} onSubmit={confirm} id="changePassword" method="POST" encType="multipart/form-data">
                {sent ? <p>Мы выслали Вам код на email</p> : <p>Подтверждение по email</p>}
                <input type="text" className={f.field} placeholder="email" name="email" required hidden={sent} />
                {sent && <>
                    <input type="text" className={f.field} placeholder="Код" name="code" required />
                    <input type={showPasswords ? "text" : "password"} className={f.field} placeholder="Пароль" name="password" required
                        onChange={(e) => handleChange('password', e.target.value)}
                        onBlur={(e) => handleBlur('password', e.target.value)}
                    />
                    {errors.password?.length > 0 && (
                        <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                            {errors.password[0]}
                        </div>
                    )}
                    <input type={showPasswords ? "text" : "password"} className={f.field} placeholder="Повторите пароль" name="password2" required />

                    <div style={{
                        margin: '15px 0',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={showPasswords}
                                onChange={(e) => setShowPasswords(e.target.checked)}
                                disabled={isSubmitting}
                                style={{ marginRight: '8px', width: 'auto' }}
                            />
                            <span>Показать пароли</span>
                        </label>
                    </div>
                </>}

                <div className={f.buttonHolder}>
                    {sent ?
                        <button className={f.formButton} type="submit" onClick={confirm}>Подтвердить</button>
                        : <button className={f.formButton} type="submit" onClick={send}>Выслать код</button>}
                    <button className={f.formButton} onClick={() => { onCloseClick('navigate') }}>Отмена</button>
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
