import React from 'react';
import { createRoot } from 'react-dom/client';
import "../css/dialog.css"
import { Provider } from 'react-redux';
import { store } from '../store';


function Dialog({ Content, onCloseClick, param }) {//получает из showDialog и передаёт в форму
	return (
		<div className='dialog-content' >
			{Content({ onCloseClick, param })} 
		</div>
	)
}

export function showDialog(Content, param, onClose) {//пропсы приходяд из страницы/компонента
	const domNode = document.createElement('div');
	domNode.classList.add("dialog");
	document.body.appendChild(domNode);
	document.body.classList.add("no-scroll");
	const root = createRoot(domNode);
	root.render(
		<Provider store={store}>
			<Dialog
				Content={Content}
				param={param}
				onCloseClick={() => { document.body.classList.remove("no-scroll"); root.unmount(); domNode.remove(); onClose?.() }}
			/>
		</Provider>);
}









