import React, { useState } from 'react';
import './QAForm.css';
import axios from 'axios';

function QAForm() {
  const [partNumber, setPartNumber] = useState('');
  const [docLinks, setDocLinks] = useState([]);

  const handleSearch = async () => {
    if (!partNumber) {
      alert('Please enter a part number.');
      return;
    }

    try {
      const response = await axios.get(`https://winsdomautocomp.onrender.com/api/qadoc/${partNumber}`);
      setDocLinks(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocLinks([]);
      alert('No documents found or error fetching data.');
    }
  };

  const openCreateDocForm = () => {
    window.open('/createqadoc', '_blank');
  };

  return (
    <div className="qa-wrapper">
      <header className="qa-header">
        <h1>Quality Assurance Document Store</h1>
      </header>

      <main className="qa-main">
        <div className="qa-input-group">
          <label>Part Number:</label>
          <input
            type="number"
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <button onClick={openCreateDocForm} className="create-btn">
            Create New Document
          </button>
        </div>

        <div className="qa-results">
          {docLinks.length === 0 ? (
            <p>No documents found.</p>
          ) : (
            <ul>
              {docLinks.map((doc, idx) => (
                <li key={idx}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer">
                    {doc.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

export default QAForm;
