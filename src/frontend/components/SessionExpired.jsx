import React from "react"
import "../css/form.css"
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
            <form className="form" id="loginForm" method="POST" encType="multipart/form-data">
                <p>Сессия истекла</p>
                <div className='button-holder'>
                    <button className="form-button" onClick={() => switchForm(LoginForm)}>Войти</button>
                    <button className='form-button' onClick={() => { onCloseClick('navigate') }}>Закрыть</button>
                </div>
            </form>
        </>
    )
}
