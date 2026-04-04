import React from "react"
import f from "../css/.module/form.module.css"
import { showDialog } from "./Dialog";
import { LoginForm } from "./LoginForm";
export function EnterForFavourites({ onCloseClick }) {//не используется удалить потом
    function switchForm(newform) {
        onCloseClick();
        showDialog(newform);
    }
    return (
        <form className={f.form}>
            <p className={f.title}>Войдите, чтобы добавлять товары в избранное</p>
            <div className={f.buttonHolder}>
                <button className={f.button} onClick={() => switchForm(LoginForm)}>Войти</button>
                <button className={f.button} onClick={onCloseClick}>Отмена</button>
            </div>
        </form>
    )
}


