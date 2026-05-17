const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// All CSS & JS is inlined inside index.html — serve it for every route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`GoTracker running on port ${PORT}`);
});
