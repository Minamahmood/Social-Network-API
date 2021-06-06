const { Thoughts, User } = require('../models');

thoughtsControllers = {
        // get all thoughts
        getThoughts(req, res) {
            Thoughts.find({})
                .populate({
                    path: 'reactions',
                    select: '-__v'
                })
                .select('-__v')
                .then(dbThoughtsData => {
                    res.json(dbThoughtsData);
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err);

                });
        }
        getThoughtsById({ params }, res) {
            Thoughts.findOne({ _id: params.id })
                .populate({
                    path: 'reactions',
                    select: '-__v'
                })
                .select('-__v')
                .then(dbThoughtsData => {
                    if (!dbThoughtsData) {
                        res.status(404).json({ message: 'No thought found at this id' });
                        return;
                    }
                    res.json(dbThoughtsData);
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err);
                });
        },
        createThoughts({ body }, res) {
            Thoughts.create(body)
                .then(({ username, _id }) => {
                    return User.findOneAndUpdate({ username: username }, { $push: { thoughts: _id } }, { new: true, runValidators: true })
                })
                .then(dbUserData => {
                    if (!dbUserData) {
                        res.status(404).json({ message: 'No user found at this id!' });
                        return;
                    }
                    res.json(dbUserData);
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err);
                });
        },
        updateThoughts({ body, params }, res) {
            Thoughts.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
                .then(dbThoughtsData => {
                    if (!dbThoughtsData) {
                        res.status(404).json({ message: 'No thought found at this id!' })
                    }

                    res.json(dbThoughtsData);
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err)
                })
        },