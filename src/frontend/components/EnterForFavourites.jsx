import React from "react"
import "../css/form.css"
import { showDialog } from "./Dialog";
import { RegistrationForm } from "./RegistrationForm";
import { LoginForm } from "./LoginForm";
export function EnterForFavourites({ onCloseClick }) {
    function switchForm(newform) {
        onCloseClick();
        showDialog(newform);
    }
    return (
        <form className="form">
            <p>Войдите, чтобы добавлять товары в избранное</p>
            <button className="form-button" onClick={() => switchForm(LoginForm)}>Войти</button>
            <button className="form-button" onClick={() => switchForm(RegistrationForm)}>Зарегестрироваться</button>
            <button className="form-button" onClick={onCloseClick}>Отмена</button>
        </form>
    )
}


