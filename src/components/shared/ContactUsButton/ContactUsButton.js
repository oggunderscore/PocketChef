import React, { useState } from "react";
import FeedbackForm from "../FeedBackButton/FeedbackButton.js";
import "./ContactUsButton.css";

const ContactUsButton = () => {
  const [showForm, setShowForm] = useState(false);

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  return (
    <div className="contact-us">
      <button onClick={handleOpenForm}>Contact Us / Provide Feedback</button>
      {showForm && <FeedbackForm closeForm={handleCloseForm} />}
    </div>
  );
};

export default ContactUsButton;
