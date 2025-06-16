const express = require('express');
const multer = require('multer');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage, limits: { files: 10 } });

// ✅ Use cloud-compatible SQLite path
const dbPath = path.join(process.cwd(), 'winsdomAutoComp.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error('Database connection error:', err.message);
  console.log('Connected to SQLite database.');
});

// Create QADocuments table if not exists
db.run(`CREATE TABLE IF NOT EXISTS QADocuments (
  partNumber TEXT PRIMARY KEY,
  curDate TEXT,
  doc1 TEXT, doc2 TEXT, doc3 TEXT, doc4 TEXT, doc5 TEXT,
  doc6 TEXT, doc7 TEXT, doc8 TEXT, doc9 TEXT, doc10 TEXT
)`);

// Upload API endpoint
app.post('/api/qadoc', upload.array('documents', 10), (req, res) => {
  const partNumber = req.body.partNumber;
  const curDate = req.body.date;
  const files = req.files;

  console.log('Received POST');
  console.log('Part Number:', partNumber);
  console.log('Date:', curDate);
  console.log('Files:', files);

  if (!partNumber || files.length === 0) {
    return res.status(400).json({ error: 'Part number and at least one document are required.' });
  }

  const docPaths = files.map(file => file.path.replace(/\\/g, '/'));

  db.get('SELECT * FROM QADocuments WHERE partNumber = ?', [partNumber], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });

    if (row) {
      // UPDATE existing record
      let updates = [];
      let values = [];
      let docIndex = 0;

      for (let i = 1; i <= 10 && docIndex < docPaths.length; i++) {
        if (!row['doc' + i]) {
          updates.push(`doc${i} = ?`);
          values.push(docPaths[docIndex]);
          docIndex++;
        }
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'All document slots are already filled for this part number.' });
      }

      values.push(partNumber);
      const query = `UPDATE QADocuments SET ${updates.join(', ')} WHERE partNumber = ?`;

      db.run(query, values, function (err) {
        if (err) {
          console.error('UPDATE error:', err.message);
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Documents updated successfully.' });
      });

    } else {
      // INSERT new record
      let docFields = Array(10).fill(null);
      docPaths.forEach((doc, index) => {
        docFields[index] = doc;
      });

      const insertQuery = `INSERT INTO QADocuments 
        (partNumber, curDate, doc1, doc2, doc3, doc4, doc5, doc6, doc7, doc8, doc9, doc10)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [partNumber, curDate, ...docFields];

      console.log('Attempting INSERT with:', values);

      db.run(insertQuery, values, function (err) {
        if (err) {
          console.error('INSERT error:', err.message);
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Documents uploaded successfully.' });
      });
    }
  });
});

app.get('/api/qadoc/:partNumber', (req, res) => {
  const partNumber = req.params.partNumber;

  db.get('SELECT * FROM QADocuments WHERE partNumber = ?', [partNumber], (err, row) => {
    if (err) {
      console.error('DB fetch error:', err.message);
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ message: 'No record found.' });
    }

    const docs = [];
    for (let i = 1; i <= 10; i++) {
      const filePath = row[`doc${i}`];
      if (filePath) {
        docs.push({
          name: `Document ${i}`,
          url: `http://localhost:5000/${filePath.replace(/\\/g, '/')}`,
        });
      }
    }

    res.json(docs);
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
