import React from 'react';
import { createRoot } from 'react-dom/client';
import "./dialog.css"

function Dialog({ Content, onCloseClick }) {
    return (
        <div className='dialog-content'>
            {Content()}
            <button onClick={onCloseClick}>Close</button>
        </div>
    )
}



export function showDialog(Content) {
    const domNode = document.createElement('div');
    domNode.classList.add("dialog");
    document.body.appendChild(domNode);
    document.body.classList.add("no-scroll");
    const root = createRoot(domNode);
    root.render(<Dialog Content={Content} onCloseClick={() => { root.unmount(); domNode.remove() }} />);
}


