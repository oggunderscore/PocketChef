import React, { useState } from "react";
import "./Modal.css"; // Style this to look like a pop-up

const Modal = ({ title, placeholder, onClose, onSave }) => {
const [value, setValue] = useState("");


const handleSave = () => {
    onSave(value);
    onClose();
};

return (
    <div className="modal-overlay">
        <div className="modal-content">
            <h3>{title}</h3>
            <input 
                type="text" 
                placeholder={placeholder} 
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
            />
            <button onClick={handleSave}>Save</button>
            <button onClick={onClose}>Cancel</button>
    </div>
    </div>
);
};

export default Modal;
