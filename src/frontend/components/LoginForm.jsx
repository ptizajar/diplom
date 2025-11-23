import React, { useState } from "react"
import "../css/form.css"
import "../api-globals"
import { showDialog } from "./Dialog";
import { RegistrationForm } from "./RegistrationForm";
import { backend } from "../api-globals";


export function LoginForm({onCloseClick}) {
    const [error, setError] = useState('');
    function switchForm(newform){
        onCloseClick();
        showDialog(newform);
    }
     async function save(e) {
            e.preventDefault();
            
            const response = await fetch(`${backend}/api/login`, {
                method: 'POST',
                body: new FormData(loginForm)
    
            });
            if (!response.ok) {
                const err = await response.json();
                setError(err.error);
                return;
            }
            const result = await response.json();



    
            onCloseClick();
        }
    return (
        <form className="form" onSubmit={save} id="loginForm" method="POST" encType="multipart/form-data">
            <p>Войти</p>
            {error}
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
