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
// "http://localhost:8080/"
// "https://rocky-mesa-37949.herokuapp.com/"

const BASE_URL = "http://localhost:8080/";

function getNotecardData(callback) {
    const query = {
        url: BASE_URL + 'notecards',
        success: callback
    }
    $.getJSON(query);
}

function displayNoteCard(data) {
    console.log(data);
    let notecardhtml = '';
    if (data.length) {
        data.forEach(notecard => {
            notecardhtml += `                            
            <div class="col-md-6" id="f1_container"><div class = "delete-notecard hidden" data-id = "${notecard.id}">x</div><div id="f1_card" class="panel panel-default shadow"><div class="note-front ${notecard.color} front face"><div class="term" data-id = "${notecard.id}">${notecard.title}</div></div><div class="back face note-back">
    <div class = "notecard-header">${notecard.category}</div>
    <div class = "notecard-definition">"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</div>
    <div class = "notecard-tag">${notecard.tags}</div>
  </div></div></div>
             `;
        })
    }
    $('#profile-grid').append(notecardhtml);
}

$('.add-btn').on('click', function (e) {
    console.log('button clicked');
    renderModalContent();
})

$('.del-btn').on('click', function(){   
    $('#profile-grid').find("div.delete-notecard").removeClass("hidden");
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
    const colors = ["pink", "green", "yellow", "blue"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    $('.new-notecard-form').on('click', '.submit', function () {
        let cardInput = {
            title: $('#title-input').val(),
            category: $('#category-input').val(),
            definition: $('#definition-input').val(),
            color: randomColor
        }
            const tagArray = [];
        //tags optional
        if ($('#tag-input').val()) {
            tagArray.push($('#tag-input').val());
            cardInput.tags = tagArray;
        }
        $.ajax({
            type: 'POST',
            url: BASE_URL + 'notecards',
            processData: false,
            data: JSON.stringify(cardInput),
            dataType: "json",
            contentType: "application/json",
            success: function () {
                location.reload();
            }
        });
    });
};

function deleteCardData() {
    $('#profile-grid').on('click', '.delete-notecard', function () {
        console.log('delete clicked');
        let testid = $(this).attr('data-id');
        let delete_url = BASE_URL + `notecards/${testid}`;
        $.ajax({
            type: 'DELETE',
            url: delete_url,
            success: function () {
                location.reload();
            }
        });
    });
};

getNotecardData(displayNoteCard);
deleteCardData();
addCardData();

//document ready to execute above -- getnotecarddata, call again after info is posted instead of location reload
//function to open close modal when data submitted and new data loaded in
//testing part - deck of cards that user can modify, define/modify order
//keep track of correct/incorrect, have results(last 10 times,etc)


//notecard by color - pink, green, blue, yellow - pastel colors
//bulk creation, allow to make 10 at once(not priority)

//finish api, color, flipping animation - priority
//category on navbar and search 
//color for branding, APP NAME!!
