'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;

const { NoteCard } = require('../models');
router.use(bodyParser.json());

let currentUser;
//when we get a request to /noetcards.
router.get('/', (req, res) => {
    if (req.session && req.user && req.user._id) {
        currentUser = req.user._id;

    }
    else {
        currentUser = '591f58b7e75c3d3f78d3ccd7';
    }
    NoteCard
        .find({ username: currentUser })
        .exec()
        .then(notecard => {
            res.status(200).json(notecard.map(notecard => notecard.apiResponse()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

router.get('/title/:definition', (req, res) => {
    if (req.session && req.user._id) {
        currentUser = req.user._id;
    }
    let resultsArray = [];
    NoteCard
        .find({ username: currentUser })
        .exec()
        .then(notecards => {
            for (var i = 0; i < notecards.length; i++) {
                var definition = notecards[i].definition.toLowerCase();
                if (req.params.definition.toLowerCase() == definition) {
                    resultsArray.push(notecards[i]);
                }
            }
            res.json(resultsArray);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        })
})

router.get('/:title', (req, res) => {
    if (req.session && req.user._id) {
        currentUser = req.user._id;
    }
    let resultsArray = [];
    NoteCard
        .find({ username: currentUser })
        .exec()
        .then(notecards => {
            for (var i = 0; i < notecards.length; i++) {
                var notecard = notecards[i];
                var definition = notecard.definition;
                if (definition && definition.toLowerCase().includes(req.params.title.toLowerCase())) {
                    resultsArray.push(notecard);
                }
            }
            res.json(resultsArray);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        })
});


router.post('/', (req, res) => {
    //validate required fields
    const requiredFields = ['title', 'category', 'definition'];
    requiredFields.forEach(field => {
        if (!(field in req.body)) {
            const message = `Missing \'${field}'\ in request body`;
            console.error(message);
            res.status(400).send(message);
        }
    })
    NoteCard
        .create({
            username: currentUser,
            title: req.body.title,
            category: req.body.category,
            definition: req.body.definition,
            color: req.body.color,
        })
        .then(notecard => {
            res.status(201).json(notecard.apiResponse());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        });
});

router.put('/:id', (req, res) => {
    //verify req.params.id and req.body.id match
    if (req.params.id !== req.body.id) {
        const message = (
            `Request path id (${req.params.id}) and request body id 
                (${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
    }
    const updateFields = ['title', 'category', 'definition'];
    const updateNotecard = {};
    updateFields.forEach(field => {
        if (field in req.body) {
            updateNotecard[field] = req.body[field];
        }
    });

    NoteCard
        .findByIdAndUpdate(req.params.id, { $set: updateNotecard }, { new: true })
        .exec()
        .then(notecard => res.status(200).json(notecard.apiResponse()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

router.delete('/:id', (req, res) => {
    NoteCard
        .findByIdAndRemove(req.params.id)
        .exec()
        .then(() => {
            res.status(204).json({ message: 'deleted!' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        });
});

module.exports = router;