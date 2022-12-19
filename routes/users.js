var express = require('express');
// const { json } = require('express/lib/response');
var jwt = require('jsonwebtoken')

var router = express.Router();

router.post('/generateToken', async (req, res) => {
	// Validate User Here
	// Then generate JWT Token

	res.contentType('application/json');
	try {
		const { username, password } = req.body;
		console.log(`${username} and ${password}`);

		if (!username || !password) {
			res.status(400).send({ 'error': 'Bad request' });
		}
		console.log('All values received. Check valid values');
		if (username == 'admin' &&
			password == process.env.ACCESS_PASS) {

			let jwtSecretKey = process.env.JWT_SECRET_KEY;
			let data = {
				time: Date(),
				userId: 12,
			}

			const token = jwt.sign(data, jwtSecretKey);
			console.log('Send token ', token);
			res.status(200).send({ token: token });
		}
		else {
			res.status(401).send({ 'error': 'Unauthorized' });
		}

	}
	catch {
		res.status(500).send({ 'error': 'Service unavailable' });
	}


});

router.get("/validateToken", (req, res) => {
	// Tokens are generally passed in the header of the request
	// Due to security reasons.

	let jwtSecretKey = process.env.JWT_SECRET_KEY;
	res.contentType('application/json');
	try {
		const token = req.headers.authorization.split(' ')[1];
		console.log(token);
		const verified = jwt.verify(token, jwtSecretKey);
		if (verified) {
			return res.status(200).send({ 'result': 'Successfully Verified' });
		} else {
			// Access Denied
			// return res.status(401).send({ 'error': 'Unauthorized' });
			return res.status(401);
		};

	} catch (error) {
		// Access Denied
		return res.status(400).send({ 'error': 'Bad request' });
	}
});


/* GET users listing. */
router.get('/', function (req, res, next) {
	res.json({ response: 'Success' })
	// res.send('respond with a resource');
});

module.exports = router;
