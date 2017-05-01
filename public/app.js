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

const BASE_URL = "https://rocky-mesa-37949.herokuapp.com/";

function getNotecardData(callback) {
  const query = {
    url: BASE_URL + 'notecards',
    success: callback
  }
  return $.getJSON(query);
}

function displayNoteCard(data) {
    console.log(data);
    let notecardhtml = '';
    if(data.length){
        data.forEach(notecard => {
            notecardhtml += `                            
            <div class="col-md-5"><div class="panel panel-default"><div class="note-front"><div class="term">${notecard.title}</div></div></div></div>`;
        })
    }
    $('#profile-grid').append(notecardhtml);
}



$('.add-btn').on('click', function (e) {
    console.log('button clicked');
    renderModalContent();
})

function renderModalContent() {
    var content = $('.modal-body');
    content.empty();
    var newNote = '';
    newNote = `
    <div class="form-group">
        <label for="exampleTextarea" class = "noteheader">Add New Notecard</label>
        <input class="form-control" type="text" placeholder="Title" id="title-input">
        <input class="form-control" type="text" placeholder="Catetory" id="category-input">
        <textarea class="form-control" id="definition-input" rows="3" placeholder = 
        "Define term"></textarea>
        <input class="form-control" type="text" placeholder="Tags" id="tag-input">
    </div>                   
     <div class="modal-footer text-center"><button class="submit" type="button">Submit</button></div>`
        ;
    $('.modal-body').html(newNote);
    $('#newnotecard').modal({ show: true });
}


function addCardData() {
    $('.new-notecard-form').on('click', '.submit', function (e) {
        console.log('submit note clicked');
        let formInput = {
            title: $('#title-input').val(),
            category: $('#category-input').val(),
            definition: $('#definition-input').val()
        }
        //tags optional
        if ($('#tag-input').val()) {
            //fix to take val and put in arr
            formInput.tags = $('#tag-input').val();
        }

        $.ajax({
            type: 'POST',
            url: BASE_URL + 'notecards',
            processData: false,
            data: JSON.stringify(formInput),
            dataType: "json",
            contentType: "application/json",
            success: function () {
                location.reload();
            }
        })
        location.reload();
    });
}

addCardData();
getNotecardData(displayNoteCard);