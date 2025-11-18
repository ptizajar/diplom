import React from "react"
import "../css/form.css"
import "../api-globals"
import { showDialog } from "./Dialog";
import { RegistrationForm } from "./RegistrationForm";

export function EnterForm({onCloseClick}) {
    function switchForm(newform){
        onCloseClick();
        showDialog(newform);
    }
    return (
        <form className="form"  id="enterForm" method="POST" encType="multipart/form-data">
            <p>Войти</p>
            <input type="text" className="form-field" placeholder="Логин" name="login" required  />
            <input type="password"  className="form-field" placeholder="Пароль" name="password" required />
            <p>или</p>
            <button className="form-button" onClick={()=>switchForm(RegistrationForm)}>Зарегестрироваться</button>

            <div className='button-holder'>
                <button className='form-button' type="submit">ОК</button>
                <button className='form-button' onClick={onCloseClick}>Отмена</button>
            </div>
        </form>
    )
}
