import f from "../css/.module/form.module.css"
import "../api-globals"
import { backend } from "../api-globals";
import { useState } from "react";
import { useValidation } from "../validation/useValidation";
import "../css/toast.css"
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../store";
import { showDialog } from "./Dialog";
import { SessionExpired } from "./SessionExpired";
import { useNavigate } from "react-router-dom";


export function EditUserForm({ onCloseClick }) {//получает из Dialog
    const [isSubmitting, setIsSubmitting] = useState(false);//проверять находится ли форма в процессе отправки на сервер
    const [error, setError] = useState("");
    const currentUser = useSelector((state) => state.user.currentUser);
    const { errors, checkField, checkForm, clearErrors } = useValidation('registration');
    const dispatch = useDispatch();

    async function save(e) {//on submit
        e.preventDefault();
        setError("");
        const formData = new FormData(e.target);
        const formObject = {
            user_name: formData.get('user_name'),
            phone: formData.get('phone'),
            email: formData.get('email')
        };
        const isValid = checkForm(formObject);
        if (!isValid) {
            return;
        }
        setIsSubmitting(true);
        const res = await fetch(`${backend}/api/edit_user`, {
            method: 'PUT',
            body: formData
        });
        if (res.status === 401) {
            showDialog(SessionExpired, undefined, onCloseClick);
            onCloseClick();
            return;
        }
        if (!res.ok && res.status !== 401) {
            const err = await res.json();
            setError(err.error);
            setTimeout(() => setError(""), 5000);
            setIsSubmitting(false)
            return;
        }
        const updatedUser = await res.json();
        console.log('Updated user:', updatedUser);
        dispatch(updateUser(updatedUser));
        clearErrors();
        onCloseClick();
    }

    return (
        <>
            <form className={f.form} onSubmit={save} id="editUserForm" method="PUT" encType="multipart/form-data">
                Редактировать
                <input
                    type="text"
                    className={f.field}
                    placeholder="Имя"
                    name="user_name"
                    required
                    defaultValue={currentUser?.user_name}
                    onChange={(e) => checkField('name', e.target.value)}
                    onBlur={(e) => checkField('name', e.target.value)}//потеря фокуса
                    disabled={isSubmitting} />
                {errors.user_name?.length > 0 && (
                    <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                        {errors.user_name[0]}
                    </div>
                )}
                <input
                    type="text"
                    className={f.field}
                    placeholder="Email"
                    name="email"
                    required
                    defaultValue={currentUser?.email}
                    onChange={(e) => checkField('email', e.target.value)}
                    onBlur={(e) => checkField('email', e.target.value)}//потеря фокуса
                    disabled={isSubmitting} />
                {errors.email?.length > 0 && (
                    <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                        {errors.email[0]}
                    </div>
                )}
                <input
                    type="text"
                    className={f.field}
                    placeholder="Телефон"
                    name="phone"
                    required
                    defaultValue={currentUser?.phone}
                    onChange={(e) => checkField('phone', e.target.value)}
                    onBlur={(e) => checkField('phone', e.target.value)}//потеря фокуса
                    disabled={isSubmitting} />
                {errors.phone?.length > 0 && (
                    <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                        {errors.phone[0]}
                    </div>
                )}

                <div className={f.buttonHolder}>
                    <button
                        className={f.button}
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Сохранение...' : 'ОК'}
                    </button>
                    <button
                        className={f.button}
                        onClick={() => {
                            clearErrors();
                            onCloseClick()
                        }}
                        disabled={isSubmitting}
                    >
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
            )}
        </>
    )
}
