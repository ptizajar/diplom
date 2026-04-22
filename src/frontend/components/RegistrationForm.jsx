import React, { useState } from "react"
import f from "../css/.module/form.module.css"
import "../api-globals"
import { showDialog } from "./Dialog";
import { backend } from "../api-globals";
import { LoginForm } from "./LoginForm";
import { useDispatch } from "react-redux";
import { setUser } from "../store";
import { useValidation } from "../validation/useValidation";
import "../css/toast.css"
import { Eye, EyeClosed } from "lucide-react";

export function RegistrationForm({ onCloseClick }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isConsentChecked, setIsConsentChecked] = useState(false);
    const dispatch = useDispatch();

    const { errors, checkField, checkForm, clearErrors } = useValidation('registration');

    async function save(e) {
        e.preventDefault();
        const formData = new FormData(registrationForm);

        const missMatch = formData.get("password") !== formData.get("password2");
        if (missMatch) {
            setError("Пароли не совпадают");
            setTimeout(() => setError(""), 5000);
            return;
        }

        const validationData = {
            user_name: formData.get('user_name') || '',
            phone: formData.get('phone') || '',
            password: formData.get('password') || '',
            email: formData.get('email') || ''
        };

        const isValid = checkForm(validationData);

        if (!isValid) {
            return;
        }

        setIsSubmitting(true);


        const res = await fetch(`${backend}/api/registrate`, {
            method: 'POST',
            body: new FormData(registrationForm)

        });
        if (!res.ok) {
            const err = await res.json();
            setError(err.error);
            setTimeout(() => setError(""), 5000);
            setIsSubmitting(false)
            return;
        }
        const result = await res.json();

        dispatch(setUser(result));
        clearErrors();
        setIsSubmitting(false);
        onCloseClick();

    }

    function switchForm(newform) {
        onCloseClick();
        showDialog(newform);
    }
    return (
        <>
            <form className={f.form} onSubmit={save} id="registrationForm" method="POST" encType="multipart/form-data">
                <p className={f.title}>Зарегестрироваться</p>
                <div className={f.inputHolder}>
                    <label className={f.label}>Имя</label>
                    <input
                        type="text"
                        className={f.field}
                        name="user_name"
                        onChange={(e) => checkField('user_name', e.target.value)}
                        onBlur={(e) => checkField('user_name', e.target.value)}
                        required
                        disabled={isSubmitting} />
                </div>
                {errors.user_name?.length > 0 && (
                    <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                        {errors.user_name[0]}
                    </div>
                )}
                 <div className={f.inputHolder}>
                    <label className={f.label}>Компания</label>
                    <input
                        type="text"
                        className={f.field}
                        name="company"
                        disabled={isSubmitting} />
                </div>
                <div className={f.inputHolder}>
                    <label className={f.label}>Email</label>
                    <input
                        type="text"
                        className={f.field}
                        name="email"
                        onChange={(e) => checkField('email', e.target.value)}
                        onBlur={(e) => checkField('email', e.target.value)}
                        required
                        disabled={isSubmitting} />
                </div>
                {errors.email?.length > 0 && (
                    <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                        {errors.email[0]}
                    </div>
                )}
                <div className={f.inputHolder}>
                    <label className={f.label}>Номер телефона</label>
                    <input
                        type="tel"
                        className={f.field}
                        name="phone"
                        onChange={(e) => checkField('phone', e.target.value)}
                        onBlur={(e) => checkField('phone', e.target.value)}
                        required
                        disabled={isSubmitting} />
                </div>
                {errors.phone?.length > 0 && (
                    <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                        {errors.phone[0]}
                    </div>
                )}
                {/* Пароль с глазиком */}
                <div className={`${f.inputHolder} ${f.passwordWrapper}`}>
                    <label className={f.label}>Пароль</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        className={`${f.field} ${f.fieldPassword}`}
                        name="password"
                        onChange={(e) => checkField('password', e.target.value)}
                        onBlur={(e) => checkField('password', e.target.value)}
                        required
                        disabled={isSubmitting} />
                    
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSubmitting}
                        className={f.togglePasswordBtn}
                        aria-label={showPassword ? "Показать пароль" : "Скрыть пароль" }
                    >
                        {showPassword ? 
                            <Eye size={18} strokeWidth={2.5} /> : 
                            <EyeClosed size={18} strokeWidth={2.5} />
                        }
                    </button>
                </div>
                {errors.password?.length > 0 && (
                    <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                        {errors.password[0]}
                    </div>
                )}

                {/* Повторите пароль */}
                <div className={`${f.inputHolder} ${f.passwordWrapper}`}>
                    <label className={f.label}>Повторите пароль</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        className={`${f.field} ${f.fieldPassword}`}
                        name="password2"
                        required
                        disabled={isSubmitting} />
                </div>

                {/* Новый чекбокс согласия */}
                <div className={f.checkboxConsent}>
                    <input
                        type="checkbox"
                        id="consent"
                        checked={isConsentChecked}
                        onChange={(e) => setIsConsentChecked(e.target.checked)}
                        disabled={isSubmitting}
                        required
                    />
                    <label className={f.label} htmlFor="consent"  style={{ fontSize: "12px", marginTop: "10px", maxWidth:"300px"}}>
                        Я соглашаюсь с{" "}
                        <a href="/public/privacy-policy.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "#2A3E3C" }}>
                            Политикой конфиденциальности
                        </a>
                        {" "}и{" "}
                        <a href="/public/consent.pdf" target="_blank" rel="noopener noreferrer" style={{ color: "#2A3E3C" }}>
                            Согласием на обработку персональных данных
                        </a>
                    </label>
                </div>
                {/* <div className={f.inputHolder}>
                    <label className={f.label}>Пароль</label>
                    <input
                        type={showPasswords ? "text" : "password"}
                        className={f.field}
                        name="password"
                        onChange={(e) => checkField('password', e.target.value)}
                        onBlur={(e) => checkField('password', e.target.value)}
                        required
                        disabled={isSubmitting} />
                </div>
                {errors.password?.length > 0 && (
                    <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                        {errors.password[0]}
                    </div>
                )}
                <div className={f.inputHolder}>
                    <label className={f.label}>Повторите пароль</label>
                    <input
                        type={showPasswords ? "text" : "password"}
                        className={f.field}
                        name="password2"
                        required />
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
                <div className={f.label} style={{ fontSize: "12px", marginTop: "10px", maxWidth:"300px" }}>
                    Регистрируясь, я соглашаюсь с{" "}
                    <a href="/public/privacy-policy.pdf" target="_blank" rel="noopener noreferrer" style={{color: "#2A3E3C"}}>
                        Политикой конфиденциальности
                    </a>
                    {" "}и{" "}
                    <a href="/public/consent.pdf" target="_blank" rel="noopener noreferrer" style={{color: "#2A3E3C"}}>
                        Согласием на обработку персональных данных
                    </a>
                </div> */}
                <div className={f.buttonHolder}>
                    <button className={f.button} type="submit" disabled={isSubmitting || !isConsentChecked}>
                        ОК
                    </button>
                    <button
                        className={f.button}
                        onClick={() => {
                            clearErrors();
                            onCloseClick()
                        }}
                        disabled={isSubmitting}>
                        Отмена
                    </button>
                </div>
                <p className={f.label} style={{ marginTop: "10px" }}>Уже есть аккаунт?</p>
                <div className={f.buttonHolder} style={{ justifyContent: "center" }}>
                    <button
                        className={f.button}
                        style={{ width: "70%" }}
                        onClick={() => {
                            clearErrors();
                            switchForm(LoginForm)
                        }}>
                        Войти
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
