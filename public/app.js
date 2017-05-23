// "http://localhost:8080/"
// "https://rocky-mesa-37949.herokuapp.com/"

// >>>given a list of definitions input correct answer <<<
// var state = {
//     correct: 0,
//     incorrect: 0,
//     questions: [
//         {
//             //this is added in when we start pushing things in state
//             id: "59098d471afbaa2550f41bdd",
//             //this is randomized between notecards made
//             options: ["this one too", "test answer", "okay"],
//             //this would be the current added cards name since it's all added one by one
//             correctAnswer: "this one too" //notecard.title, 

//         }
//     ]
// }
const BASE_URL = "http://localhost:8080/";

function getNotecardData(callback) {
    const query = {
        url: BASE_URL + 'notecards',
        success: callback
    }
    $.getJSON(query);
}

const state = {
    question: []
}

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

//or make a new db for testing that holds questions and then make an array from it as we access the db

function renderTest(data) {
    if (data.length) {

        var tempobj = {},
            title = "title",
            category = "category",
            questions = "questions",
            definition = "definition";

        data.forEach(notecard => {
            let x = [notecard.title];

            arr = [];
            data.forEach(notecards => {
                arr.push(notecards.title);
            });
            //to not push the same categories each time
            randomizeArr(arr);
            for (var i in arr) {
                if (!x.includes(arr[i])) {
                    if (x.length < 4) {
                        x.push(arr[i]);
                        //randomize output of question
                        randomizeArr(x);
                    }
                }
            }

            tempobj = {};
            tempobj.title = notecard.title;
            tempobj.category = notecard.category;
            tempobj.questions = x;
            tempobj.definition = notecard.definition;
            state.question.push(tempobj);
        });
    }
    const categoryArr = [];
    $(".questions").empty();
    data.forEach(notecard => {
        categoryArr.push(notecard.category.toLowerCase());
    })

    renderCategories(categoryArr);

    $('.questions').on('click', '.category', function () {
        $(".questions").empty();
        $(".answers").empty();
        const currentCategory = $(this).attr('id');
        let currentQ = state.question;
        let newState = {
            currentQuestion: 0,
            correctScore: 0,
            question: []
        }

        let answerOptions = "";
        for (var i in currentQ) {
            if (currentCategory == currentQ[i].category.toLowerCase()) {
                newObj = {};
                newObj.title = currentQ[i].title;
                newObj.questions = currentQ[i].questions;
                newObj.definition = currentQ[i].definition;
                newState.question.push(newObj);
            }
        }
        renderQuestion(newState)
        $(".answers").on("click", ".next-question", function (e) {
            e.preventDefault();
            let current = newState.question[newState.currentQuestion];
            let answer = current.title;
            let userAnswer;
            let radios = $("form input:radio");
            for (var i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    userAnswer = radios[i].value;
                }
            }
            console.log(answer);
            checkAnswer(answer, userAnswer, newState);
        })
        $(".answers").on("click", ".next_question", function () {
            newState.currentQuestion++;
            renderNextQuestion(newState);
        })
    })
}

//user to store results of quiz in db, to store need user 
//run a test for a user, and attach results to user and view results for user

function renderNextQuestion(newState) {
    if (newState.currentQuestion == newState.question.length) {
        renderLastPage(newState);

    }
    else {
        renderQuestion(newState);
    }
    console.log(newState.currentQuestion);
    console.log(newState.question.length);
}

function checkAnswer(answer, userAnswer, newState) {
    var message = "";
    if (answer == userAnswer) {
        newState.correctScore++;
        message = `<h1> Correct! </h1>`;
    }
    else {
        message = `<h2> Sorry, the answer is: <h2><h4>${answer}</h4>`
    }
    checkAnswerPage(message)
}

function checkAnswerPage(message) {
    let answers = $(".answers");
    answers.empty();
    answers.append(message);
    answers.append(`<button class = next_question>Next</button>`);
}


function renderLastPage(newState) {
    let answers = $(".answers");
    answers.empty();
    answers.append(`<h2> Your Results </h2> <h4 class = "results">${newState.correctScore} out of ${newState.currentQuestion} are correct`);
}
function renderQuestion(newState) {
    $(".answers").empty();
    let answerOptions = "";
    let current = newState.question[newState.currentQuestion];
    console.log(newState.question[newState.currentQuestion]);
    if (current.questions.length) {
        current.questions.map(answer => {
            answerOptions += `<input class ="radio-button" type = "radio" name = "options" value = "${answer}" required>${answer}<br>`;
        })
        var answersHTML = `<h4 class = "answer-header">${newState.currentQuestion + 1} of ${newState.question.length}</h4><div class = "answers_list">${current.definition}</div><form class = "answers-form">${answerOptions}<button class = "next-question" type = "submit">Check Answer</button></form>`;
        $(".answers").append(answersHTML);
    }
}

function renderCategories(arr) {
    var x = [];
    for (var i = 0; i < arr.length; i++) {
        if (!x.includes(arr[i])) {
            x.push(arr[i]);
        }
        else {
            return;
        }
        var categoryHTML = `<div class = "boxed col-md-6"><h3 class = category id = "${x[i]}">${x[i]}</h3></div>`;
        $(".questions").append(categoryHTML);
    }
}

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

function displayNoteCard(data) {
    $('#profile-grid').empty();
    let notecardhtml = '';
    if (data.length) {
        data.forEach(notecard => {
            notecardhtml += `                            
            <div class="col-md-6 col-xs-12" id="front-container"><div class = "delete-notecard hidden" data-id = "${notecard.id}">x</div><div id="front-card" class="panel panel-default shadow"><div class="note-front ${notecard.color} front face" id = "${notecard.category}"><div class="term" data-id = "${notecard.id}">${notecard.title}</div></div><div class="back face ${notecard.color} note-back data-id = ${notecard.id}">
    <div class = "notecard-header">${notecard.category}</div>
    <div class = "notecard-definition editable_text" data-id = "${notecard.id}">${notecard.definition}</div>
  </div></div></div>
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

function navCategorySearch(data) {
    $(".nav-stacked").on("click", ".nav-category", function () {
        console.log($(this).attr('id'));
        let cat = $(this).attr('id');
        let catHtml = '';
        $('#profile-grid').empty();
        if (data.length) {
            data.forEach(notecard => {
                if (cat == notecard.category.toLowerCase()) {
                    catHtml += `                            
            <div class="col-md-6" id="front-container"><div class = "delete-notecard hidden" data-id = "${notecard.id}">x</div><div id="front-card" class="panel panel-default shadow"><div class="note-front ${notecard.color} front face" id = "${notecard.category}"><div class="term" data-id = "${notecard.id}">${notecard.title}</div></div><div class="back face note-back data-id = ${notecard.id}">
    <div class = "notecard-header">${notecard.category}</div>
    <div class = "notecard-definition editable_text" data-id = "${notecard.id}">${notecard.definition}</div>
  </div></div></div>
             `;
                }
            })
        }
        $('#profile-grid').append(catHtml);
    })
}

$('.add-btn').on('click', function (e) {
    console.log('button clicked');
    renderModalContent();
})

$('.del-btn').on('click', function () {
    $('#profile-grid').find("div.delete-notecard").removeClass("hidden");
})

$('.notecards').on('click', '.delete-notecard', function () {
    deleteCardData();
})

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
    getNotecardData(displayNoteCard);
    getNotecardData(displayCategoryNav);
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

function deleteCardData() {
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
};
//material design cards - tags, category also in front
//https://codepen.io/equinusocio/pen/VYWxXy
//let user choose color

//build the quiz
// write out specific part of the test, write out details
// -- plan it out, what will you do first, etc
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



$("li.test-page").on("click", function () {
    window.location.href = 'test.html';
})

$(document).ready(function () {
    getNotecardData(displayNoteCard);
    getNotecardData(displayCategoryNav);
});


getNotecardData(navCategorySearch);
getNotecardData(renderTest);
updateCardData();



//document ready to execute above -- getnotecarddata, call again after info is posted instead of location reload
//function to open close modal when data submitted and new data loaded in
//testing part - deck of cards that user can modify, define/modify order
//keep track of correct/incorrect, have results(last 10 times,etc)

//notecard by color - pink, green, blue, yellow - pastel colors

//category on navbar and search 
//color for branding, APP NAME!!
