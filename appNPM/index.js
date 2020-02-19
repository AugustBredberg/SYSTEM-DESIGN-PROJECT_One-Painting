const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, '../public/')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

app.get('/admin', function(req, res) {
  res.sendFile(path.join(__dirname, '../views/admin.html'));
});

app.get('/admin_menu', function(req, res) {
  res.sendFile(path.join(__dirname, '../views/admin_menu.html'));
});

app.listen(3000, () => {
  console.log('One Love is running on port 3000!')
});
