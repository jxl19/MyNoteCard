function getCategoryData(userSearch, cb) {
    const query = {
        url: '/notecards/' + userSearch,
        success: cb
    }
    $.getJSON(query);
}
//categories list for nav
function renderNavCategories(arr) {
    $("#side-menu").empty();
    //add border bottom or smth later
    $("#side-menu").append(`<h5 class="cat-nav">Categories</h5>`)
    var x = [];
    for (var i = 0; i < arr.length; i++) {
        // let navHtml = `<h5>Categories</h5>`;
        if (!x.includes(arr[i])) {
            x.push(arr[i]);
            let navhtml = `<a class ="nav-category" id ="${arr[i]}" href ="#">${arr[i]}</a>`
            $("#side-menu").append(navhtml);
        }
    }
}

function displayNoteCard(data) {
    $('#profile-grid').empty();
    let notecardhtml = '';
    if (data.length) {
        data.forEach(notecard => {
            notecardhtml += `                            
            <div class="notecard-data" id="front-container"><div class="panel-heading ${notecard.color}"><div data-title="Delete" data-toggle="modal" data-target="#delete"><span class="far fa-trash-alt delete-notecard" data-id = "${notecard.id}"></span><span class ="far fa-edit editable_text" data-id = "${notecard.id}"></span></div></div><div id="front-card" class="panel panel-default shadow"><div class="note-front front face" id = "${notecard.category}"><div class="term" data-id = "${notecard.id}">${notecard.title}</div></div><div class="back face note-back data-id = ${notecard.id}"><div class = "notecard-header">${notecard.category}</div><div class = "notecard-definition" data-id = "${notecard.id}">${notecard.definition}</div></div></div></div>
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
            navArr.push(notecard.category);
        })
    }
    renderNavCategories(navArr);
}
//search for the navbar onclick
let catHtml;
function navCategorySearch(data) {
    $("#side-menu").on("click", ".nav-category", function (e) {
        e.preventDefault();
        let cat = $(this).attr('id');
        $('#profile-grid').empty();
        // console.log($('#profile-grid'));
        if (data.length) {
            // console.log(data.length);
            catHtml = '';
            data.forEach(notecard => {
                if (cat == notecard.category) {
                    // console.log({cat: cat, notecardCat:notecard.category});
                     catHtml += `<div class="col-md-6 col-xs-10 col-xs-offset-1 col-md-offset-0" id="front-container"><div class="panel-heading ${notecard.color}"><div class=" pull-right"  data-title="Delete" data-toggle="modal" data-target="#delete"><span class="glyphicon glyphicon-trash delete-notecard" data-id = "${notecard.id}"></span></div></div><div id="front-card" class="panel panel-default shadow"><div class="note-front front face" id = "${notecard.category}"><div class="term" data-id = "${notecard.id}">${notecard.title}</div></div><div class="back face note-back data-id = ${notecard.id}"><div class = "notecard-header">${notecard.category}</div><div class = "notecard-definition editable_text" data-id = "${notecard.id}">${notecard.definition}</div></div></div></div>
             `;
                }
            })
        }
        console.log(catHtml)
        $('#profile-grid').append(catHtml);
    })
}
//category list for side-nav
function showCategory(input) {
    let searchTerm = $('.def-search.js-query').val().toLowerCase();
    if (!input.val()) {
        getCategoryData(searchTerm, displayNoteCard);
    };
};

function hideJumbotron() { //hide jumbotron on search
    $('.jumbotron').fadeOut(300, function () {
        $(this).hide();
        localStorage.setItem('hide', 'true');
    });
};

function showJumbotron() {
    $('.jumbotron').fadeIn(300, function () {
        $(this).show();
        localStorage.setItem('hide', 'false');
    })
}

function loginUser(route) {
    let user = {
        email: $('#login-email').val(),
        password: $('#login-password').val()
    }
    $.ajax({
        type: 'POST',
        url: '/' + route,
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
        url: '/' + route,
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
        url: '/' + 'logout',
        success: function (data) {
            window.location.replace('/');
        }
    })
}

function getAllData(searchTerm) {
    getCategoryData(searchTerm, displayNoteCard);
    getCategoryData(searchTerm, displayCategoryNav);
    getCategoryData(searchTerm, navCategorySearch);
}

function addCardData() {
    const colors = ["pink", "green", "yellow", "blue"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    let searchTerm = $('.def-search.js-query').val().toLowerCase();
    let string = $('#category-input').val().split(' ');
    let title = $('#title-input').val();
    let definition = $('#definition-input').val();
    let catUpper = [];
    //uppercase first letter of categories
    for (var i = 0; i < string.length; i++) {
        catUpper.push(string[i][0].toUpperCase() + string[i].slice(1));
    }
    catUpper = catUpper.join(' ')
    let cardInput = {
        title: title,
        category: catUpper,
        definition: definition,
        color: randomColor
    }
    $.ajax({
        type: 'POST',
        url: '/' + 'notecards',
        processData: false,
        data: JSON.stringify(cardInput),
        dataType: "json",
        contentType: "application/json",
        success: function () {
            getAllData(searchTerm);
            $('#notecard-add-form').addClass('hide-add');
            $('.add-form')[0].reset();
        }
    });
};

function updateCardData(card) {
    var data_id = card.attr('data-id');
    var new_input = card.val();
    var updated_text = $(`<span class='editable_text' data-id = '${data_id}'>`);
    updated_text.text(new_input);
    card.replaceWith(updated_text);
    let searchTerm = '';
    let update_url = '/' + `notecards/${data_id}`;
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
            getAllData(searchTerm)
        }
    })
};

var clicked = false;
$('.info').on('click', function () {
    if (!clicked) {
        clicked = true;
        showJumbotron();
    }
    else {
        clicked = false;
        hideJumbotron();
    }
});

$('#profile-grid').on("blur", ".text_editor", function () {
    updateCardData($(this));
    $('#profile-grid').find('.update_card').hide();
});

//adds new card
$('.add-form').submit(function (e) {
    e.preventDefault();
    hideJumbotron();
    addCardData();
});

$('#sign-out').on('click', function (e) {
    e.preventDefault();
    logOut();
})

//search using searchbar
$('.js-search-form').keyup((e) => {
    let searchTerm = $('.def-search.js-query').val().toLowerCase();
    e.preventDefault();
    hideJumbotron();
    getCategoryData(searchTerm, displayNoteCard);
})

//edit notecard on click
$('#profile-grid').on("click", ".editable_text", function () {
    var data_id = $(this).attr('data-id');
    var original_text = $(this).parents('#front-container').find(".notecard-definition").text();
    console.log(original_text);
    var new_input = $(`<input class='text_editor' data-id ='${data_id}'><br><div class ="update_card col-xs-6">Update</div><div class="cancel_update col-xs-6">Cancel</div>`);
    new_input.val(original_text);
    $(this).parents('#front-container').find(".notecard-definition").replaceWith(new_input);
    new_input.focus();
});

//delete notecard
$('#profile-grid').on('click', '.delete-notecard', function () {
    let data_id = $(this).attr('data-id');
    let delete_url = '/' + `notecards/${data_id}`;
    let searchTerm = '';
    $.ajax({
        type: 'DELETE',
        url: delete_url,
        success: function () {
            getAllData(searchTerm)
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

$('#side-menu').on('click', '.nav-category', function (e) {
    console.log('working')
    let searchTerm = '';
    navCategorySearch(searchTerm)
})


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

$('.notecard-container').on('click', '#front-card', function () {
    $(this).toggleClass('flipped');
    $(this).find('.term').toggleClass('hide');
});

let menuClicked = false;
$('#side-menu-icon').on('click', function () {
    if (!menuClicked) {
        menuClicked = true;
        openSlideMenu();
    }
    else {
        menuClicked = false;
        closeSlideMenu();
    }
})
$('.btn-close').on('click', function () {
    closeSlideMenu();
})
let formOpened = false;
$('.add-form-input').on('click', function () {
    $('#notecard-add-form').removeClass('hide-add');
    formOpened = true;
})
$(window).on('click', function () {
    let focused = $('#notecard-add-form').children().is(':focus') || $('#notecard-add-form').children().children().is(':focus');
    let openForm = $('.add-form-input').is(':focus');
    if(formOpened){
        if(focused || openForm) {
            return;
        }
        else{
            $('#notecard-add-form').addClass('hide-add');
            formOpened = false;
        }
    }
})


function openSlideMenu() {
    $('#side-menu').css('width', '221px');
    $('.main').css('margin-left', '221px');
}

function closeSlideMenu() {
    $('#side-menu').css('width', '0px');
    $('.main').css('margin-left', '0px');
}

$('textarea').each(function () {
    this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
}).on('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

$(document).ready(function () {
    let searchTerm = '';
    var hidden = localStorage.getItem('hide');
    if (hidden === 'true') {
        $('.jumbotron').hide();
    }
    getAllData(searchTerm)
});
