import React from 'react';
import { createRoot } from 'react-dom/client';
import d from "../css/.module/dialog.module.css"
import { Provider } from 'react-redux';
import { store } from '../store';


function Dialog({ Content, onCloseClick, param }) {//получает из showDialog и передаёт в форму
	return (
		<div className={d.content} >
			{Content({ onCloseClick, param })} 
		</div>
	)
}

export function showDialog(Content, param, onClose) {//пропсы приходяд из страницы/компонента
	const domNode = document.createElement('div');
	domNode.classList.add(d.dialog);
	document.body.appendChild(domNode);
	document.body.classList.add(d.noScroll);
	const root = createRoot(domNode);
	root.render(
		<Provider store={store}>
			<Dialog
				Content={Content}
				param={param}
				onCloseClick={(action) => { document.body.classList.remove(d.noScroll); root.unmount(); domNode.remove(); onClose?.(action) }}
			/>
		</Provider>);
}









