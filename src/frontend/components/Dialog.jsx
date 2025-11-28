import React from 'react';
import { createRoot } from 'react-dom/client';
import "../css/dialog.css"
import { Provider } from 'react-redux';
import { store } from '../store';

export function showDialog(Content, param, onClose) {
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


function Dialog({ Content, onCloseClick, param }) {

	return (

		<div className='dialog-content' >
			{Content({ onCloseClick, param })}
		</div>

	)
}






