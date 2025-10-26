import React from 'react';
import { createRoot } from 'react-dom/client';
import "./dialog.css"

function Dialog({ Content, onCloseClick , param}) {
	
	return (
		<div className='dialog-content' >
			{Content({onCloseClick, param})}
		</div>
	)
}



export function showDialog(Content, param) {
	const domNode = document.createElement('div');
	domNode.classList.add("dialog");
	document.body.appendChild(domNode);
	document.body.classList.add("no-scroll");
	const root = createRoot(domNode);
	root.render(<Dialog Content={Content} param={param} onCloseClick={() => { root.unmount(); domNode.remove() }} />);
}


