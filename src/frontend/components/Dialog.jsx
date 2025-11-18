import React from 'react';
import { createRoot } from 'react-dom/client';
import "../css/dialog.css"

export function showDialog(Content, param, onClose) {
	const domNode = document.createElement('div');
	domNode.classList.add("dialog");
	document.body.appendChild(domNode);
	document.body.classList.add("no-scroll");
	const root = createRoot(domNode);
	root.render(<Dialog Content={Content} param={param} onCloseClick={() => { document.body.classList.remove("no-scroll"); root.unmount(); domNode.remove(); onClose?.() }} />);
}


function Dialog({ Content, onCloseClick, param }) {

	return (
		<div className='dialog-content' >
			{Content({ onCloseClick, param })}
		</div>
	)
}






