'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;

const { NoteCard } = require('../models');
router.use(bodyParser.json());

router.get('/', (req, res) => {
    NoteCard
        .find()
        .exec()
        .then(notecard => {
            res.status(200).json(notecard.map(notecard => notecard.apiResponse()));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        });
});


router.get('/:id', (req, res) => {
    NoteCard
        .findById(req.params.id)
        .exec()
        .then(notecard => {
            res.status(200).json(notecard.apiResponse());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
});


router.post('/', (req, res) => {
    //validate required fields
    const requiredFields = ['title', 'category', 'definition', 'tags'];
    requiredFields.forEach(field => {
        if (!(field in req.body)) {
            const message = `Missing \'${field}'\ in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    })
    NoteCard
        .create({
            title: req.body.title,
            category: req.body.category,
            definition: req.body.definition,
            tags: req.body.tags
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
            `Request path id (${req.params.id}) and request body id `
                `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
    }
    const updateFields = ['title', 'category', 'definition', 'tags'];
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
        res.status(204).json({message: 'deleted!'});
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    });
});

module.exports = router;