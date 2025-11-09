import React, { useEffect, useState } from "react"

import "../api-globals"
import { backend } from "../api-globals";

export function AddItemForm({ onCloseClick, param }) {
    const [item, setItem] = useState(null);
    async function loadItem() {
        const result = await fetch(`${backend}/api/item/${param.item_id}`);
        const data = await result.json();
        setItem(data)
    }
    useEffect(() => {
        if (param.item_id) {
            loadItem()
        }
    }, []);
    async function save(e) {
        e.preventDefault();
        const response = await fetch(`${backend}/api/admin/item`, {
            method: 'PUT',
            body: new FormData(addItemForm)
        });

        const result = await response.json();
        onCloseClick();
    }
    const style = param ? { backgroundImage: `url('${backend}/api/item/image/${item?.item_id}')` } : {};
    return (
        <form className="form" onSubmit={save} id="addItemForm" method="POST" encType="multipart/form-data">
            {param.item_id ? "Редактировать товар" : "Добавить товар"}
            <input type="text" className="item-artic" placeholder="Артикул" name="article" required defaultValue={item?.article} />
            <input type="text" className="item-name" placeholder="Название" name="item_name" required defaultValue={item?.item_name} />
            <input type="text" className="item-length" placeholder="Длина" name="length" required defaultValue={item?.length} />
            <input type="text" className="item-width" placeholder="Ширина" name="width" required defaultValue={item?.width} />
            <input type="text" className="item-heigth" placeholder="Высота" name="height" required defaultValue={item?.height} />
            <input type="text" className="item-quantity" placeholder="Заказ от" name="quantity" required defaultValue={item?.quantity} />
            <input type="text" className="item-price" placeholder="Цена" name="price" required defaultValue={item?.price} />
            <textarea type="text" className="item-desc" placeholder="Описание" name="description" defaultValue={item?.description} />
            <div className="form-image" style={style}>
                <input type="file" placeholder="Загрузите изображение" name="item_image" accept="image/png, image/jpeg" required={!param} />
            </div>
            <label >Отображать на главной
                <input type="checkbox" name="show" defaultChecked={item?.show}></input>
            </label>
            <input type="hidden" name="item_id" value={param.item_id} />
            <input type="hidden" name="category_id" value={param.category_id} />

            <div className='button-holder'>
                <button className='form-button' type="submit">ОК</button>
                <button className='form-button' onClick={onCloseClick}>Отмена</button>
            </div>
        </form>
    )
}
