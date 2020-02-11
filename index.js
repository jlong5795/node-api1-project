// implement your API here
const express = require('express');
const Users = require('./data/db.js');

const server = express();
const port = 5000;

server.use(express.json());
server.listen(port, () => console.log(`\n** API on port ${port} \n`));

server.get('/api/users', (req, res) => {
	Users.find()
		.then(users => {
			res.status(200).json(users);
		})
		.catch(err => {
			console.log(err);
			res
				.status(500)
				.json({
					errorMessage: 'The users information could not be retrieved.'
				});
		});
});

server.get('/api/users/:id', (req, res) => {
	Users.findById(req.params.id)
		.then(user => {
			if (user) {
				res.status(200).json(user);
			} else {
				res
					.status(404)
					.json({
						errorMessage: 'The user with the specified ID does not exist.'
					});
			}
		})
		.catch(err => {
			console.log(err);
			res
				.status(500)
				.json({ errorMessage: 'The user information could not be retrieved.' });
		});
});

server.post('/api/users', (req, res) => {
	const newUser = req.body;
	if (newUser.name && newUser.bio) {
		Users.insert(newUser)
			.then(user => {
				res.status(201).json(newUser);
			})
			.catch(err => {
				console.log(err);
				res
					.status(500)
					.json({
						errorMessage:
							'There was an error while saving the user to the database'
					});
			});
	} else {
		res
			.status(400)
			.json({ errorMessage: 'Please provide name and bio for the user' });
	}
});

server.delete('/api/users/:id', (req, res) => {
	Users.remove(req.params.id)
		.then(user => {
			if (user === 1) {
				res
					.status(200)
					.json({ message: 'User successfully removed from the database.' });
			} else {
				res
					.status(404)
					.json({
						errorMessage: 'The user with the specified ID does not exist.'
					});
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ errorMessage: 'The user could not be removed.' });
		});
});

server.put('/api/users/:id', (req, res) => {
    const newUser = req.body;
    
    if (newUser.name || newUser.bio) {
    Users.update(req.params.id, newUser)
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({errorMessage: 'The user with the specified ID does not exist.'});
            };
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({errorMessage: 'The user information could not be modified.'});
        });
    };
});