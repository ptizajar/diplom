import React, { useContext, useState } from "react"
import "../css/form.css"
import "../api-globals"
import { showDialog } from "./Dialog";
import { backend } from "../api-globals";
import { LoginForm } from "./LoginForm";
import { useDispatch } from "react-redux";
import { setUser } from "../store";
import { useValidation } from "../validation/useValidation";



export function RegistrationForm({ onCloseClick }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();

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

    async function save(e) {
        e.preventDefault();
        const formData = new FormData(registrationForm);

        const missMatch = formData.get("password") !== formData.get("password2");
        if (missMatch) {
            setError("Пароли не совпадают");
            return;
        }

        const validationData = {
            login: formData.get('login') || '',
            user_name: formData.get('user_name') || '',
            phone: formData.get('phone') || '',
            password: formData.get('password') || ''
        };

        const isValid = checkForm(validationData);

        if (!isValid) {
            return;
        }

        setIsSubmitting(true);


        const response = await fetch(`${backend}/api/registrate`, {
            method: 'PUT',
            body: new FormData(registrationForm)

        });
        if (!response.ok) {
            const err = await response.json();
            setError(err.error);
            setIsSubmitting(false)
            return;
        }
        const result = await response.json();

        dispatch(setUser(result));
        console.log(result);
        clearErrors();
        onCloseClick();

    }


    function switchForm(newform) {
        onCloseClick();
        showDialog(newform);
    }
    return (
        <form className="form" onSubmit={save} id="registrationForm" method="POST" encType="multipart/form-data">
            <p>Зарегестрироваться</p>
            <p>{error}</p>
            <input
                type="text"
                className="form-field"
                placeholder="Логин"
                name="login"
                onChange={(e) => handleChange('login', e.target.value)}
                onBlur={(e) => handleBlur('login', e.target.value)}
                required
                disabled={isSubmitting} />
            {errors.login?.length > 0 && (
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                    {errors.login[0]}
                </div>
            )}
            <input
                type="text"
                className="form-field"
                placeholder="Имя"
                name="user_name"
                onChange={(e) => handleChange('user_name', e.target.value)}
                onBlur={(e) => handleBlur('user_name', e.target.value)}
                required
                disabled={isSubmitting} />
            {errors.user_name?.length > 0 && (
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                    {errors.user_name[0]}
                </div>
            )}
            <input
                type="tel"
                className="form-field"
                placeholder="Номер телефона"
                name="phone"
                onChange={(e) => handleChange('phone', e.target.value)}
                onBlur={(e) => handleBlur('phone', e.target.value)}
                required
                disabled={isSubmitting} />
            {errors.phone?.length > 0 && (
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                    {errors.phone[0]}
                </div>
            )}
            <input
                type="password"
                className="form-field"
                placeholder="Пароль"
                name="password"
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={(e) => handleBlur('password', e.target.value)}
                required
                disabled={isSubmitting} />
            {errors.password?.length > 0 && (
                <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
                    {errors.password[0]}
                </div>
            )}
            <input
                type="password"
                className="form-field"
                placeholder="Повторите пароль"
                name="password2"
                required />
            <p>или</p>
            <button
                className="form-button"
                onClick={() => {
                    clearErrors();
                    switchForm(LoginForm)
                }}>
                Войти
            </button>

            <div className='button-holder'>
                <button
                    className='form-button'
                    type="submit"
                    disabled={isSubmitting}>
                    {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                    ОК
                </button>
                <button
                    className='form-button'
                    onClick={() => {
                        clearErrors();
                        onCloseClick()
                    }}
                    disabled={isSubmitting}>
                    Отмена
                </button>
            </div>
        </form>
    )
}
