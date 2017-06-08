// "http://localhost:8080/"
// "https://rocky-mesa-37949.herokuapp.com/"

const BASE_URL = "https://rocky-mesa-37949.herokuapp.com/";

function getCategoryData(userSearch, cb) {
    const query = {
        url: BASE_URL + 'notecards/' + userSearch,
        success: cb
    }
    console.log(query);
    $.getJSON(query);
}

function getTestData(userSearch, cb) {
    const query = {
        url: BASE_URL + 'test/' + userSearch,
        success: cb
    }
    $.getJSON(query);
}

//categories list for nav
function renderNavCategories(arr) {
    $(".nav-stacked").empty();
    var x = [];
    for (var i = 0; i < arr.length; i++) {
        if (!x.includes(arr[i])) {
            x.push(arr[i]);
            let navhtml = `<li role="presentation" class = "nav-category" id = "${arr[i]}"><a href="#">${arr[i]}</a></li>`
            $(".nav-stacked").append(navhtml);
        }
    }
}
//displays the categories to choose from in test
function displayTestCategories(data) {
    $('.questions').empty();
    if (data.length) {
        data.forEach(notecard => {
            let catHTML = `<div class = "boxed col-md-6"><h3 class = category id = "${notecard}">${notecard}</h3></div>`
            $(".questions").append(catHTML);
        })
    }
}
//when a category is chosen, renders the test
$('.questions').on('click', '.category', function () {
    const currentCategory = $(this).attr('id');
    $('.questions').empty();
    getTestData(currentCategory, renderTest);
});
//function to render test 
function renderTest(data) {
    let count = 0;
    $('.category-header').empty();
    let catArray = [];
    if (data.length) {
        data.forEach(category => {
            catArray.push(category.title);
        });
        let currentCat = catArray[count];
        let current = '/testing/' + currentCat.toLowerCase();
        $('.category-header').append(currentCat);
        getTestData(current, displayTestQuestions);
        $('.answers').on('click', '.checkAnswer', function (e) {
            e.preventDefault();
            let userAnswer;
            let radios = $("form input:radio");
            for (var i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    userAnswer = radios[i].value;
                }
            }
            //check answer
            getCategoryData('/testing/' + currentCat.toLowerCase(), checkAnswer);
        });
    }
}

//render next question
// $('.questions').on('click', 'checkAnswer', function () {
//     count++;
//     $('.category-header').empty();
//     $('.category-header').append(catArray[count]);
//     getTestData('/testing/' + catArray[count].toLowerCase(), displayTestQuestions);
// });

function checkAnswer(data) {
    var message = "";
    if (data.length) {
        if (userAnswer == data.definition) {
            message = `<h1> Correct! </h1>`;
        }
    }
    else {
        message = `<h2> Sorry, the answer is: <h2><h4>${data.definition}</h4>`
    }

    checkAnswerPage(message)
}

function checkAnswerPage(message) {
    let answers = $(".answers");
    answers.empty();
    answers.append(message);
    answers.append(`<button class = next_question>Next</button>`);
}

function displayTestQuestions(questions) {
    $('.answers').empty();
    let answerOptions = '';
    let count = 0;
    if (questions.length) {
        while (count <= 3) {
            console.log(questions[0]);
            answerOptions += `<input class ="radio-button" type = "radio" name = "options" value = "${questions[count]}" required>${questions[count]}<br>`;
            count++;
        }
    }
    let answersHTML = `<form class = "answers-form">${answerOptions}<button class = "checkAnswer" type = "submit">Check Answer</button></form>`
    $('.answers').append(answersHTML);
}


getTestData('', displayTestCategories);

function displaySearchResult(data) {
    $('#profile-grid').empty();
    let searchHtml = '';
    if (data.length) {
        data.forEach(notecard => {
            searchHtml = `                            
            <div class="col-md-6 col-xs-10 col-xs-offset-1 col-md-offset-0" id="front-container"><div class="panel-heading ${notecard.color}"><div class=" pull-right"  data-title="Delete" data-toggle="modal" data-target="#delete"><span class="glyphicon glyphicon-trash delete-notecard" data-id = "${notecard.id}"></span></div></div><div id="front-card" class="panel panel-default shadow"><div class="note-front front face" id = "${notecard.category}"><div class="term" data-id = "${notecard.id}">${notecard.title}</div></div><div class="back face note-back data-id = ${notecard.id}"><div class = "notecard-header">${notecard.category}</div><div class = "notecard-definition editable_text" data-id = "${notecard.id}">${notecard.definition}</div></div></div></div>
             `;
            $('#profile-grid').append(searchHtml);
        })
    }
}

function displayNoteCard(data) {
    $('#profile-grid').empty();
    let notecardhtml = '';
    if (data.length) {
        data.forEach(notecard => {
            notecardhtml += `                            
            <div class="col-md-6 col-xs-10 col-xs-offset-1 col-md-offset-0" id="front-container"><div class="panel-heading ${notecard.color}"><div class=" pull-right"  data-title="Delete" data-toggle="modal" data-target="#delete"><span class="glyphicon glyphicon-trash delete-notecard" data-id = "${notecard.id}"></span></div></div><div id="front-card" class="panel panel-default shadow"><div class="note-front front face" id = "${notecard.category}"><div class="term" data-id = "${notecard.id}">${notecard.title}</div></div><div class="back face note-back data-id = ${notecard.id}"><div class = "notecard-header">${notecard.category}</div><div class = "notecard-definition editable_text" data-id = "${notecard.id}">${notecard.definition}</div></div></div></div>
             `;
        })
    }
    $('#profile-grid').append(notecardhtml);
}

function displayCategoryNav(data) {
    let navhtml = '';
    let navArr = [];
    if (data.length) {
        data.forEach(notecard => {
            navArr.push(notecard.category.toLowerCase());
        })
    }
    console.log(navArr);
    renderNavCategories(navArr);
}
//search for the navbar onclick
function navCategorySearch(data) {
    $(".nav-stacked").on("click", ".nav-category", function () {
        let cat = $(this).attr('id');
        let catHtml = '';
        $('#profile-grid').empty();
        if (data.length) {
            data.forEach(notecard => {
                if (cat == notecard.category.toLowerCase()) {
                    catHtml +=  `                            
            <div class="col-md-6 col-xs-10 col-xs-offset-1 col-md-offset-0" id="front-container"><div class="panel-heading ${notecard.color}"><div class=" pull-right"  data-title="Delete" data-toggle="modal" data-target="#delete"><span class="glyphicon glyphicon-trash delete-notecard" data-id = "${notecard.id}"></span></div></div><div id="front-card" class="panel panel-default shadow"><div class="note-front front face" id = "${notecard.category}"><div class="term" data-id = "${notecard.id}">${notecard.title}</div></div><div class="back face note-back data-id = ${notecard.id}"><div class = "notecard-header">${notecard.category}</div><div class = "notecard-definition editable_text" data-id = "${notecard.id}">${notecard.definition}</div></div></div></div>
             `;
                }
            })
        }
        $('#profile-grid').append(catHtml);
    })
}

function showCategory(input) {
    let searchTerm = $('.form-control.js-query').val().toLowerCase();
    if (!input.val()) {
        getCategoryData(searchTerm, displayNoteCard);
    };
};

$('.js-search-form').on('keyup', '.js-query', function (e) {
    e.preventDefault();
    if (e.keyCode == 8) {
        showCategory($(this));
    }
});

$('.navbar-brand').click(function (e) {
    e.preventDefault();
    location.reload();
})

$('.add-btn').on('click', function (e) {
    console.log('button clicked');
    renderModalContent();
})

$('.del-btn').on('click', function () {
    $('#profile-grid').find("div.delete-notecard").removeClass("hidden");
})

// $('.notecards').on('click', '.delete-notecard', function () {
//     deleteCardData();
// })

$('.signupForm').on('click', function () {
    renderSignUpModal();
});

function renderSignUpModal() {
    let content = $('.modal-body');
    content.empty();
    var signUp = '';
    signUp = `
        <div class="col-md-12">
            <h4 class="text-center">Sign Up</h4>

            <form id="signup-form" method="POST" action="/users/signup">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input type="text" name="name" class="form-control" id="signup-name">
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="text" name="email" class="form-control" id="signup-email">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" name="password" class="form-control" id="signup-password">
                </div>
                <div class="form-group">
                    <label for="confirm-password">Confirm Password</label>
                    <input type="password" name="confirm-password" class="form-control" id="confirm-password">
                </div>
                <div class="footer text-center">
                    <button type="submit" class="btn btn-custom">Sign Up</button>
                </div>
            </form>
        </div>
    </div>`
    $('.modal-body').html(signUp);
    $('#signup').modal({ show: true });
}

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
    </div>                   
     <div class="modal-footer text-center"><button class="submit" type="button">Submit</button></div>`
        ;
    $('.modal-body').html(newNote);
    $('#newnotecard').modal({ show: true });
}

$('.new-notecard-form').on('click', '.submit', function () {
    addCardData();
});

function addCardData() {
    const colors = ["pink", "green", "yellow", "blue"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    let searchTerm = $('.form-control.js-query').val().toLowerCase();
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
    });
    getCategoryData(searchTerm, displayNoteCard);
    getCategoryData(searchTerm, displayCategoryNav);
    $('#newnotecard').modal('hide');
};

//edit on click, make function
$('#profile-grid').on("click", ".editable_text", function () {
    var data_id = $(this).attr('data-id');
    var original_text = $(this).text();
    var new_input = $(`<input class='text_editor' data-id ='${data_id}'>`);
    new_input.val(original_text);
    $(this).replaceWith(new_input);
    new_input.focus();
});

// function deleteCardData() {
$('#profile-grid').on('click', '.delete-notecard', function () {
    console.log('delete clicked');
    let data_id = $(this).attr('data-id');
    let delete_url = BASE_URL + `notecards/${data_id}`;
    $.ajax({
        type: 'DELETE',
        url: delete_url,
        success: function () {
            location.reload();
        }
    });
});
// };

function updateCardData() {
    $('#profile-grid').on("blur", ".text_editor", function () {
        console.log($(this).attr('data-id'));
        var data_id = $(this).attr('data-id');
        var new_input = $(this).val();
        var updated_text = $(`<span class='editable_text' data-id = '${data_id}'>`);
        updated_text.text(new_input);
        $(this).replaceWith(updated_text);
        let update_url = BASE_URL + `notecards/${data_id}`;
        console.log(update_url);
        console.log(new_input);
        let updateInput = {
            id: data_id,
            definition: new_input
        }
        $.ajax({
            type: 'PUT',
            url: update_url,
            data: JSON.stringify(updateInput),
            dataType: "json",
            contentType: "application/json",
            success: function () {
                location.reload();
            }
        })
    });
};


//put this on a listner somewhere
updateCardData();

$('.js-search-form').submit(function (e) {
    let searchTerm = $('.form-control.js-query').val().toLowerCase();
    e.preventDefault();
    getCategoryData(searchTerm, displaySearchResult);
})

$("li.test-page").on("click", function () {
    window.location.href = 'test.html';
})

$(document).ready(function () {
    let searchTerm = '';
    getCategoryData(searchTerm, displayNoteCard);
    getCategoryData(searchTerm, displayCategoryNav);
    getCategoryData(searchTerm, navCategorySearch);
});

//document ready to execute above -- getnotecarddata, call again after info is posted instead of location reload
//function to open close modal when data submitted and new data loaded in
//testing part - deck of cards that user can modify, define/modify order
