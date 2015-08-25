// jQuery.validator.addMethod('passwordMatch', function(value, element) {

//     // The two password inputs
//     var password = $("#password").val();
//     var confirmPassword = $("#password_confirm").val();

//     // Check for equality with the password inputs
//     if (password != confirmPassword ) {
//         return false;
//     } else {
//         return true;
//     }

// }, "Your Passwords Must Match");

// // ==========================================================================
// // Registration Form : jquery validation
// // http://jqueryvalidation.org/validate

// $('#register-form').validate({

//     // rules
//     rules: {
//         password: {
//             required: true,
//             minlength: 3
//         },
//         password_confirm: {
//             required: true,
//             minlength: 3,
//             passwordMatch: true // set this on the field you're trying to match
//         }
//     },

//     // messages
//     messages: {
//         password: {
//             required: "What is your password?",
//             minlength: "Your password must contain more than 3 characters"
//         },
//         password_confirm: {
//             required: "You must confirm your password",
//             minlength: "Your password must contain more than 3 characters",
//             passwordMatch: "Your Passwords Must Match" // custom message for mismatched passwords
//         }
//     }
// });//end validate



(function($,W,D)
{
    var JQUERY4U = {};

    JQUERY4U.UTIL =
    {
        setupFormValidation: function()
        {
            //form validation rules
            $("#register-form").validate({
                rules: {
                    name: "required",
                    username: "required",
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true,
                        minlength: 6
                    },
                    password_confirm: {
                        required: true,
                        minlength: 5,
                        equalTo: "#password"
                    },
                    agree: "required"
                },
                messages: {
                    name: "Please enter your firstname",
                    username: "Please enter your lastname",
                    password: {
                        required: "Please provide a password",
                        minlength: "Your password must be at least 5 characters long"
                    },
                    email: "Please enter a valid email address",
                    agree: "Please accept our policy"
                },
                submitHandler: function(form) {
                    form.submit();
                }
            });
        }
    }

    //when the dom has loaded setup form validation rules
    $(D).ready(function($) {
        JQUERY4U.UTIL.setupFormValidation();
    });

})(jQuery, window, document);

jQuery.extend(jQuery.validator.messages, {
    equalTo: "Passwords do not match!"
});


$(function(){
    $("#toggle-link").click(function(e) {
        e.preventDefault();
        $("#profileCol").toggleClass("hidden");
        if($("#profileCol").hasClass('hidden')){
            
            $("#contentCol").removeClass('col-md-9');
            $("#contentCol").addClass('col-md-12 fade in');
            $(this).html('Show Menu <i class="fa fa-arrow-right"></i>');
        }else {
            $("#contentCol").removeClass('col-md-12');
            $("#contentCol").addClass('col-md-9');
            $(this).html('<i class="fa fa-arrow-left"></i> Hide Menu');
        }
    });
    $('.tip').tooltip();
});
                                    