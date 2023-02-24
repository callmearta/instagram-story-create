import { useState } from "react";

export default function InputModal(props) {
    const {addText, closeModal} = props;
    const [text,setText] = useState('');

    const _addText = () => {
        addText(text);
        closeModal();
    };
    
    return (
        <div className="modal">
            <div className="modal-backdrop"></div>
            <div className="modal-content">
                <input type="text" onChange={e => setText(e.target.value)} value={text} />
                <button onClick={_addText}>
                    Add
                </button>
            </div>
        </div>
    );
}