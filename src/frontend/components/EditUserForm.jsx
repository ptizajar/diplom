import f from "../css/.module/form.module.css"
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
            email: formData.get('email'),
            company: formData.get('company')
        };
        const isValid = checkForm(formObject);
        if (!isValid) {
            return;
        }
        setIsSubmitting(true);
        const res = await fetch(`/api/edit_user`, {
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
        dispatch(updateUser(updatedUser));
        clearErrors();
        onCloseClick();
    }

    return (
        <>
            <form className={f.form} onSubmit={save} id="editUserForm" method="PUT" encType="multipart/form-data">
                <p className={f.title}>Редактировать</p>
                <div className={f.inputHolder}>
                    <label className={f.label}>Имя</label>
                    <input
                        type="text"
                        className={f.field}
                        name="user_name"
                        required
                        defaultValue={currentUser?.user_name}
                        onChange={(e) => checkField('name', e.target.value)}
                        onBlur={(e) => checkField('name', e.target.value)}//потеря фокуса
                        disabled={isSubmitting} />
                </div>
                {errors.user_name?.length > 0 && (
                    <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                        {errors.user_name[0]}
                    </div>
                )}
                <div className={f.inputHolder}>
                    <label className={f.label}>Email</label>
                    <input
                        type="text"
                        className={f.field}
                        name="email"
                        required
                        defaultValue={currentUser?.email}
                        onChange={(e) => checkField('email', e.target.value)}
                        onBlur={(e) => checkField('email', e.target.value)}//потеря фокуса
                        disabled={isSubmitting} />
                </div>
                {errors.email?.length > 0 && (
                    <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                        {errors.email[0]}
                    </div>
                )}
                 <div className={f.inputHolder}>
                    <label className={f.label}>Компания</label>
                    <input
                        type="text"
                        className={f.field}
                        name="company"
                        required
                        defaultValue={currentUser?.company}
                        disabled={isSubmitting} />
                </div>
                <div className={f.inputHolder}>
                    <label className={f.label}>Телефон</label>
                    <input
                        type="text"
                        className={f.field}
                        name="phone"
                        required
                        defaultValue={currentUser?.phone}
                        onChange={(e) => checkField('phone', e.target.value)}
                        onBlur={(e) => checkField('phone', e.target.value)}//потеря фокуса
                        disabled={isSubmitting} />
                </div>
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
                       ОК
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
