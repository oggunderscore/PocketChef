import React, { useState } from "react";
import FeedbackForm from "../FeedBackButton/FeedbackForm.js";
import "./ContactUsButton.css";
const ContactUsButton = () => {
  const [showForm, setShowForm] = useState(false);

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  return (
    <div className="contact-us">
      <button onClick={handleOpenForm}>Contact Us</button>
      {showForm && (
        <div className="contact-us-content">
          <div className="modal-content">
            <FeedbackForm closeForm={handleCloseForm} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUsButton;
