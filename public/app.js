// "http://localhost:8080/"
// "https://rocky-mesa-37949.herokuapp.com/"

const BASE_URL = "http://localhost:8080/";

function getCategoryData(userSearch, cb) {
    const query = {
        url: BASE_URL + 'notecards/' + userSearch,
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
                    catHtml += `                            
            <div class="col-md-6 col-xs-10 col-xs-offset-1 col-md-offset-0" id="front-container"><div class="panel-heading ${notecard.color}"><div class=" pull-right"  data-title="Delete" data-toggle="modal" data-target="#delete"><span class="glyphicon glyphicon-trash delete-notecard" data-id = "${notecard.id}"></span></div></div><div id="front-card" class="panel panel-default shadow"><div class="note-front front face" id = "${notecard.category}"><div class="term" data-id = "${notecard.id}">${notecard.title}</div></div><div class="back face note-back data-id = ${notecard.id}"><div class = "notecard-header">${notecard.category}</div><div class = "notecard-definition editable_text" data-id = "${notecard.id}">${notecard.definition}</div></div></div></div>
             `;
                }
            })
        }
        $('#profile-grid').append(catHtml);
    })
}
//category list for side-nav
function showCategory(input) {
    let searchTerm = $('.form-control.js-query').val().toLowerCase();
    if (!input.val()) {
        getCategoryData(searchTerm, displayNoteCard);
    };
};

function hideJumbotron() { //hide jumbotron on search
    $('.jumbotron').fadeOut(function () {
        $(this).hide();
        localStorage.setItem('hide', 'true')
    });
};

function loginUser(route) {
    let user = {
        email: $('#login-email').val(),
        password: $('#login-password').val()
    }
    $.ajax({
        type: 'POST',
        url: BASE_URL + route,
        processData: false,
        data: JSON.stringify(user),
        contentType: "application/json",
        success: (data, textStatus, jqXHR) => {
            window.location.replace('/notecard');
        }
    });
}

function addUser(route) {
    let newUser = {
        name: $('#signup-name').val(),
        email: $('#signup-email').val(),
        password: $('#signup-password').val()
    }
    $.ajax({
        type: 'POST',
        url: BASE_URL + route,
        processData: false,
        data: JSON.stringify(newUser),
        contentType: "application/json",
        success: (data, textStatus, jqXHR) => {
            window.location.replace('/notecard');
        }
    });
};

function renderSignUpModal() {
    let content = $('.modal-body');
    content.empty();
    var signUp = '';
    signUp = `
        <div class="col-md-12">
            <h4 class="text-center">Sign Up</h4>
            
            <form id="signup-form">
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
                    <button type="submit" class="btn btn-custom" id="user-signup">Sign Up</button>
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

function logOut() {
    $.ajax({
        type: 'GET',
        url: BASE_URL + 'logout',
        success: function (data) {
            window.location.replace('/');
        }
    })
}

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

    $.ajax({
        type: 'POST',
        url: BASE_URL + 'notecards',
        processData: false,
        data: JSON.stringify(cardInput),
        dataType: "json",
        contentType: "application/json",
        success: function () {
            getCategoryData(searchTerm, displayNoteCard);
            getCategoryData(searchTerm, displayCategoryNav);
            getCategoryData(searchTerm, navCategorySearch);
        }
    });

    $('#newnotecard').modal('hide');
};

function updateCardData() {
    $('#profile-grid').on("blur", ".text_editor", function () {
        var data_id = $(this).attr('data-id');
        var new_input = $(this).val();
        var updated_text = $(`<span class='editable_text' data-id = '${data_id}'>`);
        updated_text.text(new_input);
        $(this).replaceWith(updated_text);
        let update_url = BASE_URL + `notecards/${data_id}`;
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

updateCardData();
//adds new card
$('.new-notecard-form').on('click', '.submit', function () {
    hideJumbotron();
    addCardData();
});

$('#sign-out').on('click', function (e) {
    e.preventDefault();
    logOut();
})
//search using searchbar
$('.js-search-form').submit(function (e) {
    let searchTerm = $('.form-control.js-query').val().toLowerCase();
    e.preventDefault();
    getCategoryData(searchTerm, displayNoteCard);
})

//edit notecard on click
$('#profile-grid').on("click", ".editable_text", function () {
    var data_id = $(this).attr('data-id');
    var original_text = $(this).text();
    var new_input = $(`<input class='text_editor' data-id ='${data_id}'>`);
    new_input.val(original_text);
    $(this).replaceWith(new_input);
    new_input.focus();
});

//delete notecard
$('#profile-grid').on('click', '.delete-notecard', function () {
    let data_id = $(this).attr('data-id');
    let delete_url = BASE_URL + `notecards/${data_id}`;
    let searchTerm = '';
    $.ajax({
        type: 'DELETE',
        url: delete_url,
        success: function () {
            getCategoryData(searchTerm, displayNoteCard);
            getCategoryData(searchTerm, displayCategoryNav);
            getCategoryData(searchTerm, navCategorySearch);
        }
    });
});

//if searchbar empty show all notecards
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
    renderModalContent();
})

$('.signupForm').on('click', function () {
    renderSignUpModal();
});

$('.signup-form').on('click', '#user-signup', function (e) {
    let route = 'users/signup';
    addUser(route);
    return false;
});

$('#login-button').on('click', function (e) {
    e.preventDefault();
    let route = 'users/login';
    loginUser(route);
});

$(document).ready(function () {
    let searchTerm = '';
    var hidden = localStorage.getItem('hide');
    if (hidden === 'true') {
        $('.jumbotron').hide();
    }
    getCategoryData(searchTerm, displayNoteCard);
    getCategoryData(searchTerm, displayCategoryNav);
    getCategoryData(searchTerm, navCategorySearch);
});
