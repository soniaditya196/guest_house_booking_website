const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(500).render('error', { pageName: 'error', pageTitle: 'NITS Guest House' });
});

module.exports = router;