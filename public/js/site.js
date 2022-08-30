function cleanSignUpForm() {
    $("#first-name-error-container").addClass("hidden");
    $("#first-name-error-text").text("");
    $("#last-name-error-container").addClass("hidden");
    $("#last-name-error-text").text("");
    $("#email-error-container").addClass("hidden");
    $("#email-error-text").text("");
    $("#username-error-container").addClass("hidden");
    $("#username-error-text").text("");
    $("#password-error-container").addClass("hidden");
    $("#password-error-text").text("");
}

function signUp() {
    const signupForm = document.getElementById("signup-form");

    let valid = true;

    if (signupForm) {

        cleanSignUpForm();

        const firstName = document.getElementById("firstName").value;
        if (firstName === "" || typeof firstName !== "string") {
            valid = false;
            $("#first-name-error-container").removeClass("hidden");
            $("#first-name-error-text").text("Please enter a valid First Name");
        }

        const lastName = document.getElementById("lastName").value;
        if (lastName === "" || typeof lastName !== "string") {
            valid = false;
            $("#last-name-error-container").removeClass("hidden");
            $("#last-name-error-text").text("Please enter a valid Last Name");
        }

        const email = document.getElementById("email").value;
        if (email === "" || typeof email !== "string") {
            valid = false;
            $("#email-error-container").removeClass("hidden");
            $("#email-error-text").text("Please enter a valid Email");
        } else {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(String(email).toLowerCase())) {
                valid = false;
                $("#email-error-container").removeClass("hidden");
                $("#email-error-text").text("Please enter a valid Email");
            }
        }

        const username = document.getElementById("username").value;
        if (username === "" || typeof username !== "string") {
            valid = false;
            $("#username-error-container").removeClass("hidden");
            $("#username-error-text").text("Please enter a valid Username");
        } else {
            $.post("/username", {username: username}).then(function (response) {
                    if (!response["valid"]) {
                        valid = false;
                        $("#signup-button").prop('disabled', true);
                        $("#username-error-container").removeClass("hidden");
                        $("#username-error-text").text("Username not available");
                    }
                }
            );
        }

        const password = document.getElementById("password").value;
        if (password === "" || typeof password !== "string") {
            valid = false;
            $("#password-error-container").removeClass("hidden");
            $("#password-error-text").text("Please enter a valid Password");
        }

        if (password.length < 6 || 15 < password.length) {
            valid = false;
            $("#password-error-container").removeClass("hidden");
            $("#password-error-text").text("Password length must be between 6 and 15 characters");
        }

        if (valid) {
            $("#signup-button").prop('disabled', false);
        } else {
            $("#signup-button").prop('disabled', true);
        }
    }
}

function like(newsId) {
    console.log(`#like-${newsId}`);
    $(`#like-${newsId}`).addClass("collapse");
    $(`#dislike-${newsId}`).removeClass("collapse");
}

function dislike(newsId) {
    console.log(`#like-${newsId}`);
    $(`#like-${newsId}`).removeClass("collapse");
    $(`#dislike-${newsId}`).addClass("collapse");
}

function share(news) {

}