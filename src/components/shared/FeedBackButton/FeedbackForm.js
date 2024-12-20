import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../configuration";
import "./FeedbackForm.css";

const FeedbackForm = ({ closeForm }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "feedbacks"), {
        name,
        email,
        message,
        timestamp: new Date(),
      });
      setSuccess(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-form">
      {success ? (
        <div className="success-message">
          <p>Thank you for your feedback!</p>
          <button onClick={closeForm}>Close</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Contact Us / Provide Feedback</h2>
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button type="button" onClick={closeForm}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackForm;
