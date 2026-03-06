import "../css/form.css"
import "../api-globals"
import { backend } from "../api-globals";
import { useState } from "react";
import { useValidation } from "../validation/useValidation";
import "../css/toast.css"
import React from "react";
import { showDialog } from "./Dialog";
import { EnterForFavourites } from "./EnterForFavourites";
import { useSelector } from "react-redux";

export function OrderForm({ onCloseClick, param }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
     const currentUser = useSelector((state) => state.user.currentUser);
    const { errors, checkField, checkForm, clearErrors } = useValidation('registration');

    // Функция для расчета минимальной даты
    const getMinDateTime = () => {
        const now = new Date();
        const minDate = new Date(now);
        minDate.setMinutes(minDate.getMinutes() + 30); // +30 минут

        // Если время попадает в рабочие часы сегодня (10:00-17:00)
        const hours = minDate.getHours();
        if (hours >= 10 && hours < 17) {
            return minDate.toISOString().slice(0, 16);
        }

        // Иначе ставим завтра 10:00
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        return tomorrow.toISOString().slice(0, 16);
    };

    // Функция для расчета максимальной даты
    const getMaxDateTime = () => {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 14); // +2 недели
        maxDate.setHours(16, 59, 0, 0); // Последнее рабочее время
        return maxDate.toISOString().slice(0, 16);
    };

    // const handleFieldChange = (e) => {
    //     checkField('registration', e.target.value);
    // };

    async function save(e) {
        e.preventDefault();
        setError("");
        if (!currentUser) {
            // showDialog(EnterForFavourites)
            setError('Войдите, чтобы оставить заявку на заказ');
            return;
        }
        if(currentUser.is_admin){
            setError('Администраторам нельзя оформлять заказы');
            return;
        }
        
        const formData = new FormData(e.target);
        const userName = formData.get('user_name') || '';
        const userPhone = formData.get('phone') || '';
        const preferredDatetime = formData.get('preferred_datetime') || '';

        // Проверяем обязательные поля
        const isValid = checkForm({
            user_name: userName,
            phone: userPhone
        });

        if (!isValid) return;

        // Проверяем дату-время
        if (!preferredDatetime) {
            setError("Пожалуйста, выберите дату и время");
            return;
        }

        const selected = new Date(preferredDatetime);
        // const now = new Date();
        const minDate = new Date(getMinDateTime());
        const maxDate = new Date(getMaxDateTime());

        // Проверяем что не раньше минимального
        if (selected < minDate) {
            const minTime = minDate.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });
            const minDateStr = minDate.toLocaleDateString('ru-RU');
            setError(`Пожалуйста, выберите время не ранее ${minTime} ${minDateStr}`);
            return;
        }

        // Проверяем что не позже максимума
        if (selected > maxDate) {
            const maxTime = maxDate.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            });
            const maxDateStr = maxDate.toLocaleDateString('ru-RU');
            setError(`Пожалуйста, выберите время не позднее ${maxTime} ${maxDateStr}`);
            return;
        }

        // Проверяем рабочие часы (10:00-17:00)
        const hours = selected.getHours();
        if (hours < 10 || hours >= 17) {
            setError("Пожалуйста, выберите время с 10:00 до 17:00");
            return;
        }

        setIsSubmitting(true);

        const res = await fetch(`${backend}/api/order/${param.item_id}`, {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            const err = await res.json();
            setError(err.error);
            setIsSubmitting(false);
            return;
        }

        await res.json();
        clearErrors();
        onCloseClick();
    }

    return (
        <>
            <form className="form" onSubmit={save} id="orderForm" method="POST" encType="multipart/form-data">
                <div style={{ marginBottom: '15px', width: '100%' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Как к Вам обращаться?
                    </label>
                    <input
                        type="text"
                        className="form-field"
                        placeholder="Имя"
                        name="user_name"
                        defaultValue={currentUser.user_name}
                        required
                        onChange={(e) => checkField('user_name', e.target.value)}
                        onBlur={(e) => checkField('user_name', e.target.value)}
                        disabled={isSubmitting} />
                    {errors.user_name?.length > 0 && (
                        <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                            {errors.user_name[0]}
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '15px', width: '100%' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Номер телефона
                    </label>
                    <input
                        type="tel"
                        className="form-field"
                        placeholder="Номер телефона"
                        name="phone"
                        defaultValue={currentUser.phone}
                        required
                        onChange={(e) => checkField('phone', e.target.value)}
                        onBlur={(e) => checkField('phone', e.target.value)}
                        disabled={isSubmitting} />
                    {errors.phone?.length > 0 && (
                        <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                            {errors.phone[0]}
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '15px', width: '100%' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                        Удобные дата и время (МСК):
                    </label>

                    <input
                        type="datetime-local"
                        className="form-field"
                        name="preferred_datetime"
                        min={getMinDateTime()}
                        max={getMaxDateTime()}
                        required
                        disabled={isSubmitting}
                        style={{ width: '100%' }}
                    />

                    <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                        • Рабочие часы: с 10:00 до 17:00<br />
                        • Можно выбрать время в течение ближайших двух недель
                    </div>
                </div>

                <div className='button-holder'>
                    <button
                        className='form-button'
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Сохранение...' : 'ОК'}
                    </button>
                    <button
                        className='form-button'
                        onClick={() => {
                            clearErrors();
                            onCloseClick();
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
                    <div className="toast-progress"></div>
                </div>
            )}
        </>
    )
}