import React from "react"
import f from "../css/.module/form.module.css"
import "../api-globals"
import { showDialog } from "./Dialog";
import { LoginForm } from "./LoginForm";
import "../css/toast.css"


export function SessionExpired({ onCloseClick }) {
    function switchForm(newform) {
        onCloseClick();
        showDialog(newform);
    }


    return (
        <>
            <form className={f.form} id="sessionExpired" method="POST" encType="multipart/form-data">
                <p>Сессия истекла</p>
                <div className={f.buttonHolder}>
                    <button className={f.button} onClick={() => switchForm(LoginForm)}>Войти</button>
                    <button className={f.button}  onClick={() => { onCloseClick('navigate') }}>Закрыть</button>
                </div>
            </form>
        </>
    )
}
