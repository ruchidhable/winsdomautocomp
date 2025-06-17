import React, { useState } from 'react';
import './CreateQADoc.css';
import axios from 'axios';

function CreateQADoc() {
  const [partNumber, setPartNumber] = useState('');
  const [files, setFiles] = useState([]);
  const currentDate = new Date().toISOString().split('T')[0];

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 10) {
      alert('Maximum 10 files allowed.');
    } else {
      setFiles(selected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!partNumber || files.length === 0) {
      alert('Part number and at least one file are required.');
      return;
    }

    const formData = new FormData();
    formData.append('partNumber', partNumber);
    formData.append('date', currentDate);
    files.forEach((file) => {
      formData.append('documents', file);
    });

    try {
      const response = await axios.post(
        'https://winsdomautocomp.onrender.com/api/qadoc',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Documents uploaded successfully!');
      window.close();
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading documents. Please check console or backend logs.');
    }
  };

  return (
    <div className="create-doc-wrapper">
      <header className="create-doc-header">
        <h1>Quality Assurance Document Upload</h1>
      </header>

      <main className="create-doc-main">
        <form className="create-doc-form" onSubmit={handleSubmit}>
          <label>Part Number</label>
          <input
            type="number"
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
            required
          />

          <label>Date</label>
          <input type="text" value={currentDate} readOnly />

          <label>Upload Documents (Max 10)</label>
          <input
            type="file"
            name="documents"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.png"
            onChange={handleFileChange}
          />

          <div className="btn-group">
            <button type="button" onClick={() => window.close()} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateQADoc;
