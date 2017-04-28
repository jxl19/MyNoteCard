'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const noteCardSchema = mongoose.Schema({
    title: {type: String, required: true},
    category: {type: String, required: true},
    definition: {type: String, required: true},
    tags: Array
});

noteCardSchema.methods.apiResponse = function() {
  return {
    id: this._id,
    title: this.title,
    category: this.category,
    definition: this.definition,
    tags: this.tags
  }
}

const NoteCard = mongoose.model('NoteCardSchema', noteCardSchema);
module.exports = {NoteCard};