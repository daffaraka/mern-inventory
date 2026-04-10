const express = require('express');
const router = express.Router();
const sendMail = require('../utils/mailer');

// POST /api/test-mail
// Body: { "to": "target@email.com" }
router.post('/', async (req, res) => {
  const { to } = req.body;
  if (!to) return res.status(400).json({ message: 'Field "to" is required' });

  await sendMail(
    to,
    'Test Email dari Inventory System',
    `<h2>Halo!</h2><p>Ini adalah email percobaan dari <strong>Inventory System</strong>.</p>`
  );

  res.json({ message: `Email sent to ${to}` });
});

module.exports = router;
