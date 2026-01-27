const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Authorities endpoint' });
});

module.exports = router;
