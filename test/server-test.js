const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const should = chai.should();
const { app, runServer, closeServer } = require('../server');
const { NoteCard } = require('../models');
const { TEST_DATABASE_URL } = require('../config')
chai.use(chaiHttp);

//generates an object to represent a notecard to seed data using the faker library
function generateNotecard() {
    return {
        title: faker.lorem.words(),
        category: faker.lorem.words(),
        definition: faker.lorem.sentences(),
        tags: [faker.lorem.words(), faker.lorem.words()]
    }
}

// used to put random documents in db so we have data to work with
function seedNoteCardData() {
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
        seedData.push(generateNotecard());
    }
    return NoteCard.insertMany(seedData);
}

//function to delete the db to call it after each function to ensure that data from each test does not stick around
function tearDownDb() {
    return mongoose.connection.dropDatabase();
}

describe('notecard API', function () {

    //starts server before each function
    before(function () {
        return runServer(TEST_DATABASE_URL);
    });
    //inserts seed data into collection before each function
    beforeEach(function () {
        return seedNoteCardData();
    });
    //drops db connection after each function is done running to make sure state isn't maintained between tests
    afterEach(function () {
        return tearDownDb();
    });
    //closes server after function is done running
    after(function () {
        return closeServer();
    });

    const expectedKeys = ['id', 'title', 'category', 'definition',
        'tags'];
    describe('GET endpoint', function () {
        it('should return all notecards', function () {
            //gets back all notecards by GET
            //prove res has right data type
            //prove number of notecards we get is equal to number in db
            let res;
            return chai.request(app)
                .get('/notecards')
                .then(_res => {
                    res = _res;
                    res.should.be.json;
                    res.should.have.status(200);
                    //at least one makes sure our db seeding worked
                    res.body.length.should.be.at.least(1);
                    res.body.forEach(notecard => {
                        notecard.should.be.a('object');
                        notecard.should.include.keys(expectedKeys);
                    })
                    return NoteCard.count();
                })
                //make sure number of notecards same as db
                .then(function (count) {
                    res.body.should.have.length.of(count);
                });
        });

        it('should return notecards with the right fields', function () {
            //gets notecards and ensures they have the expected keys
            let resNoteCard;
            return chai.request(app)
                .get('/notecards')
                .then(res => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.length.should.be.at.least(1);
                    res.body.forEach(notecard => {
                        notecard.should.be.a('object');
                        notecard.should.include.keys(expectedKeys);
                    })
                    //making resnotecard equal to first notecard 
                    resNoteCard = res.body[0];
                    return NoteCard.findById(resNoteCard.id);
                })
                .then(notecard => {
                    resNoteCard.id.should.equal(notecard.id);
                    resNoteCard.title.should.equal(notecard.title);
                    resNoteCard.category.should.equal(notecard.category);
                    resNoteCard.definition.should.equal(notecard.definition);
                });
        });
    });
    describe('POST endpoint', function () {
        //make post request with data and prove what we get back has correct keys 
        it('should add a new notecard', function () {
            const newNoteCard = generateNotecard();
            return chai.request(app)
                .post('/notecards')
                .send(newNoteCard)
                .then(res => {
                    res.should.have.status(201);
                    res.should.be.json;
                    res.should.be.a('object');
                    res.body.should.include.keys(expectedKeys);
                    res.body.id.should.not.be.null;
                    res.body.title.should.equal(newNoteCard.title);
                    res.body.category.should.equal(newNoteCard.category);
                    res.body.definition.should.equal(newNoteCard.definition);
                    return NoteCard.findById(res.body.id);
                })
                .then(notecard => {
                    notecard.title.should.equal(newNoteCard.title);
                    notecard.category.should.equal(newNoteCard.category);
                    notecard.definition.should.equal(newNoteCard.definition);
                });
        });
    });
    describe('PUT endpoint', function () {
        it('should update fields you send over', function () {
            const updatedData = {
                title: 'Cola',
                category: 'Soda',
                definition: 'Soda pop!'
            };

            return NoteCard
                .findOne()
                .exec()
                .then(notecard => {
                    updatedData.id = notecard.id;
                    return chai.request(app)
                        .put(`/notecards/${notecard.id}`)
                        .send(updatedData);
                })
                .then(res => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.should.be.a('object');
                    res.body.title.should.equal(updatedData.title);
                    res.body.category.should.equal(updatedData.category);
                    res.body.definition.should.equal(updatedData.definition);
                    return NoteCard.findById(updatedData.id).exec();
                })
                .then(notecard =>{
                    notecard.title.should.equal(updatedData.title);
                    notecard.category.should.equal(updatedData.category);
                    notecard.definition.should.equal(updatedData.definition);
                });
        });
    });

});