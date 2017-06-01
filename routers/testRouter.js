'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;

const { NoteCard } = require('../models');
router.use(bodyParser.json());
let currentUser;

function randomizeArr(arr) {

    let counter = arr.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
}

//shows categories individually, no multiples
router.get('/', (req, res) => {
    if (req.session && req.user._id) {
        currentUser = req.user._id;
    }
    let resultsArr = [];
    NoteCard
        .find({ username: currentUser })
        .exec()
        .then(notecards => {
            // console.log(notecards);
            for (var i = 0; i < notecards.length; i++) {
                let notecard = notecards[i].category.toLowerCase();
                if (!resultsArr.includes(notecard)) {
                    resultsArr.push(notecard);
                }
            }
            res.json(resultsArr);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' })
        })
})


//randomized answers based on title
router.get('/testing/:title', (req, res) => {
    if (req.session && req.user._id) {
        currentUser = req.user._id;
    }
    let resultsArray = [];
    let answersArray = [];
    let definition = '';
    NoteCard
        .find({ username: currentUser })
        .exec()
        .then(notecards => {
            for (var i = 0; i < notecards.length; i++) {
                let notecard = notecards[i].definition;
                if (req.params.title == notecards[i].title.toLowerCase()) {
                    answersArray.push(notecard);
                    definition=notecard;
                }

                if (!resultsArray.includes(notecard)) {
                    resultsArray.push(notecard);
                }
            }
            randomizeArr(resultsArray);
            for (var i = 0; i < resultsArray.length; i++) {
                if (answersArray.length < 4 && !answersArray.includes(resultsArray[i])) {
                    answersArray.push(resultsArray[i]);
                }
            }
            randomizeArr(answersArray);
            answersArray.push({answer : definition});
            res.json(answersArray);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        })
})

//shows the notecards based on categories
router.get('/:category', (req, res) => {
    if (req.session && req.user._id) {
        currentUser = req.user._id;
    }
    let resultsArray = [];
    NoteCard
        .find({ username: currentUser })
        .exec()
        .then(notecards => {
            for (var i = 0; i < notecards.length; i++) {
                let notecard = notecards[i];
                let category = notecard.category;
                if (category && category.toLowerCase().includes(req.params.category.toLowerCase())) {
                    resultsArray.push(notecard);
                }
            }
            res.json(resultsArray);
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        })
})



module.exports = router;