// var mock_notecards = {
//     "notecards": [
//         {
//             "title": "Middleware",
//             "category": "Node",
//             "definition": "The organizing principle of express apps. An express app is a stack of middleware functions that requests are sent through.",
//             "tags": ["node", "javascript", "express"],
//         },
//         {
//             "title": "Event Delegation",
//             "category": "JavaScript",
//             "definition": "Allows us to attach a single event listener to a parent element that will fire for all descendants matching the selector, whether or not it is currently there or added in the future.",
//             "tags": ["JS", "jQuery"],
//         },
//         {
//             "title": "Closure",
//             "category": "JavaScript",
//             "definition": "Closure is an inner function that has access to the outer function's variables. use it when you need private variables",
//             "tags": ["JS", "functions", "global", "local"],
//         },
//         {
//             "title": "Media Query",
//             "category": "CSS",
//             "definition": "Media Queries is a CSS3 module allowing content rendering to adapt to screen resolution.",
//             "tags": ["css", "html", "resolution"]
//         }
//     ]
// };

// function getNoteCard(callbackFn){
//     setTimeout(function() {
//         callbackFn(mock_notecards)
//     },1);
// }

// function displayNoteCard(data) {
//     for (index in data.notecards){
//         $("body").append(
//             "<p>" + data.notecards[index].title + "</p>" + 
//             "<p>" + data.notecards[index].definition + "</p>" 
//         )
//     }
// }

// function getAndDisplayNoteCard() {
//     getNoteCard(displayNoteCard);
// }

// getAndDisplayNoteCard();

$('.add-btn').on('click', function(e){
    console.log('button clicked');
    renderModalContent();
})

function renderModalContent(){
    var content = $('.modal-body');
    content.empty();
    addNewCard();
    $('.carousel-control left').hide()
    $('#newnotecard').modal({ show: true });
}

function addNewCard() {
    var newNote = '';
    newNote =    `<div class="form-group">
        <label for="exampleTextarea" class = "noteheader">Example notecard</label>
        <input class="form-control" type="text" placeholder="Term" id="note-text">
        <input class="form-control" type="text" placeholder="Catetory" id="note-category">
        <textarea class="form-control" id="note-def" rows="3" placeholder = 
        "Define term"></textarea>
        <input class="form-control" type="text" placeholder="Tags" id="note-tags">
    </div>`;
    $('.modal-body').html(newNote);
}
