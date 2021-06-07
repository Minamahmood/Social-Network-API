const { User, Thoughts } = require('../models');

const userController = {
        // get all users
        getAllUsers(req, res) {
            User.find({})
                .populate({
                    path: 'thoughts',
                    select: '-__v'
                })
                .populate({
                    path: 'friends',
                    select: '-__v'
                })
                .select('-__v')
                .then(dbUserData => res.json(dbUserData))
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err);
                });
        },
        getUserById({ params }, res) {
            User.findOne({ _id: params.id })
                .populate({
                    path: 'thoughts',
                    select: '-__v'
                })
                .select('-__v')
                .then(dbUserData => {
                    if (!dbUserData) {
                        res.status(404).json({ message: 'No user found at this id' });
                        return
                    }
                    res.json(dbUserData)
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err);
                });
        },
        createUser({ body }, res) {
            User.create(body)
                .then(dbUserData => {
                    res.json(dbUserData);
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err);
                });
        },
        updateUser({ params, body }, res) {
            User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
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
        deleteUser({ params }, res) {
            User.findByIdAndDelete({ _id: params.id })
                .then(dbUserData => {
                    dbUserData.thoughts.forEach(thought => {
                        Thoughts.findOneAndDelete({ _id: thought })
                            .then(dbThoughtData => {
                                if (!dbThoughtData) {
                                    res.status(500).json({ message: 'there was an error!' });
                                    return;
                                }

                                res.json(dbUserData)
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(400).json(err);
                            });
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err);
                });
        },
        addFriend({ params }, res) {
            User.findOneAndUpdate({ _id: params.userId }, { $push: { friends: params.friendId } }, { new: true })
                .then(dbUserData => {
                    if (!dbUserData) {
                        res.status(404).json({ message: 'No user found at this id!' });
                        return;
                    }
                    res.json(dbUserData)
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json(err);
                });
        },