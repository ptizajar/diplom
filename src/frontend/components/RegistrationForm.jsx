import React, { useState } from "react"
import "./addCategoryForm.css"
import "../api-globals"
import { showDialog } from "./Dialog";
import { backend } from "../api-globals";
import { EnterForm } from "./EnterForm";

export function RegistrationForm({ onCloseClick }) {
    const [error, setError] = useState("");
    async function save(e) {
        e.preventDefault();
        const reqBody = new FormData(registrationForm);

        const missMatch = reqBody.get("password") !== reqBody.get("password2");
        if (missMatch) {
            setError("Пароли не совпадают");
            return;
        }
        const response = await fetch(`${backend}/api/registrate`, {
            method: 'PUT',
            body: new FormData(registrationForm)

        });
        if (!response.ok) {
            const err = await response.json();
            setError(err.error);
            return;
        }
        const result = await response.json();

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
            <input type="text" className="form-field" placeholder="Логин" name="login" required />
            <input type="text" className="form-field" placeholder="Имя" name="user_name" required />
            <input type="tel" className="form-field" placeholder="Номер телефона" name="phone" required />
            <input type="password" className="form-field" placeholder="Пароль" name="password" required />
            <input type="password" className="form-field" placeholder="Повторите пароль" name="password2" required />
            <p>или</p>
            <button className="form-button" onClick={() => switchForm(EnterForm)}>Войти</button>

            <div className='button-holder'>
                <button className='form-button' type="submit">ОК</button>
                <button className='form-button' onClick={onCloseClick}>Отмена</button>
            </div>
        </form>
    )
}
