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
                        minlength: 6,
                        equalTo: "#password"
                    },
                    agree: "required"
                },
                messages: {
                    name: "Please enter your name",
                    username: "Please enter your username",
                    password: {
                        required: "Please provide a password",
                        minlength: "Your password must be at least 6 characters long"
                    },
                    password_confirm: "Passwords must match",
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

$(document).ready(function(e){
    $('.search-summoner .dropdown-menu').find('a').click(function(e) {
        e.preventDefault();
        var param = $(this).attr("href").replace("#","");
        var concept = $(this).text();
        $('.search-summoner span#search_concept').text(concept);
        $('.input-group #search_param').val(param);
    });
});

$(document).ready(function(e){
    $('.search-region .dropdown-menu').find('a').click(function(e) {
        e.preventDefault();
        var param = $(this).attr("href").replace("#","");
        var concept = $(this).text();
        $('.search-region span#search_concept').text(concept);
        $('.input-group #search_param').val(param);
    });
});


// get champion name by id without using api call
function getChampionName(championID) {

    if (championID == 266) {
        document.write('Aatrox')
    }

    if (championID == 103) {
        document.write('Ahri')
    }

    if (championID == 84) {
        document.write('Akali')
    }

    if (championID == 12) {
        document.write('Alistar')
    }

    if (championID == 32) {
        document.write('Amumu')
    }

    if (championID == 34) {
        document.write('Anivia')
    }

    if (championID == 1) {
        document.write('Annie')
    }

    if (championID == 22) {
        document.write('Ashe')
    }

    if (championID == 268) {
        document.write('Azir')
    }

    if (championID == 432) {
        document.write('Bard')
    }

    if (championID == 53) {
        document.write('Blitzcrank')
    }

    if (championID == 63) {
        document.write('Brand')
    }

    if (championID == 201) {
        document.write('Braum')
    }

    if (championID == 51) {
        document.write('Caitlyn')
    }

    if (championID == 69) {
        document.write('Cassiopeia')
    }

    if (championID == 31) {
        document.write("Cho'Gath")
    }

    if (championID == 42) {
        document.write('Corki')
    }

    if (championID == 122) {
        document.write('Darius')
    }

    if (championID == 131) {
        document.write('Diana')
    }

    if (championID == 36) {
        document.write("Dr. Mundo")
    }

    if (championID == 119) {
        document.write("Draven")
    }

    if (championID == 245) {
        document.write("Ekko")
    }

    if (championID == 60) {
        document.write('Elise')
    }

    if (championID == 28) {
        document.write('Evelynn')
    }

    if (championID == 81) {
        document.write('Ezreal')
    }

    if (championID == 9) {
        document.write('Fiddlesticks')
    }

    if (championID == 114) {
        document.write('Fiora')
    }

    if (championID == 105) {
        document.write('Fizz')
    }

    if (championID == 3) {
        document.write('Galio')
    }

    if (championID == 41) {
        document.write('Gangplank')
    }

    if (championID == 86) {
        document.write('Garen')
    }

    if (championID == 150) {
        document.write('Gnar')
    }

    if (championID == 79) {
        document.write('Gragas')
    }

    if (championID == 104) {
        document.write('Graves')
    }

    if (championID == 120) {
        document.write('Hecarim')
    }

    if (championID == 74) {
        document.write('Heimerdinger')
    }

    if (championID == 39) {
        document.write('Irelia')
    }

    if (championID == 40) {
        document.write('Janna')
    }

    if (championID == 59) {
        document.write('Jarvan IV')
    }

    if (championID == 24) {
        document.write('Jax')
    }

    if (championID == 126) {
        document.write('Jayce')
    }

    if (championID == 222) {
        document.write('Jinx')
    }

    if (championID == 429) {
        document.write('Kalista')
    }

    if (championID == 43) {
        document.write('Karma')
    }

    if (championID == 30) {
        document.write('Karthus')
    }

    if (championID == 38) {
        document.write('Kassadin')
    }

    if (championID == 55) {
        document.write('Katarina')
    }

    if (championID == 10) {
        document.write('Kayle')
    }

    if (championID == 85) {
        document.write('Kennen')
    }

    if (championID == 121) {
        document.write("Kha'Zix")
    }

    if (championID == 96) {
        document.write("Kog'Maw")
    }

    if (championID == 7) {
        document.write('LeBlanc')
    }

    if (championID == 64) {
        document.write("Lee Sin")
    }

    if (championID == 89) {
        document.write('Leona')
    }

    if (championID == 127) {
        document.write('Lissandra')
    }

    if (championID == 236) {
        document.write('Lucian')
    }

    if (championID == 117) {
        document.write('Lulu')
    }

    if (championID == 99) {
        document.write('Lux')
    }

    if (championID == 54) {
        document.write('Malphite')
    }

    if (championID == 90) {
        document.write('Malzahar')
    }

    if (championID == 57) {
        document.write('Maokai')
    }

    if (championID == 11) {
        document.write("Master Yi")
    }

    if (championID == 21) {
        document.write("Miss Fortune")
    }

    if (championID == 82) {
        document.write('Mordekaiser')
    }

    if (championID == 25) {
        document.write('Morgana')
    }

    if (championID == 267) {
        document.write('Nami')
    }

    if (championID == 75) {
        document.write('Nasus')
    }

    if (championID == 111) {
        document.write('Nautilus')
    }

    if (championID == 76) {
        document.write('Nidalee')
    }

    if (championID == 56) {
        document.write('Nocturne')
    }

    if (championID == 20) {
        document.write('Nunu')
    }

    if (championID == 2) {
        document.write('Olaf')
    }

    if (championID == 61) {
        document.write('Orianna')
    }

    if (championID == 80) {
        document.write('Pantheon')
    }

    if (championID == 78) {
        document.write('Poppy')
    }

    if (championID == 133) {
        document.write('Quinn')
    }

    if (championID == 33) {
        document.write('Rammus')
    }

    if (championID == 421) {
        document.write("Rek'Sai")
    }

    if (championID == 58) {
        document.write('Renekton')
    }

    if (championID == 107) {
        document.write('Rengar');
    }

    if (championID == 92) {
        document.write('Riven')
    }

    if (championID == 68) {
        document.write('Rumble')
    }

    if (championID == 13) {
        document.write('Ryze')
    }

    if (championID == 113) {
        document.write('Sejuani')
    }

    if (championID == 35) {
        document.write('Shaco')
    }

    if (championID == 98) {
        document.write('Shen')
    }

    if (championID == 102) {
        document.write('Shyvana')
    }

    if (championID == 27) {
        document.write('Singed')
    }

    if (championID == 14) {
        document.write('Sion')
    }

    if (championID == 15) {
        document.write('Sivir')
    }

    if (championID == 72) {
        document.write('Skarner')
    }

    if (championID == 37) {
        document.write('Sona')
    }

    if (championID == 16) {
        document.write('Soraka')
    }

    if (championID == 50) {
        document.write('Swain')
    }

    if (championID == 134) {
        document.write('Syndra')
    }

    if (championID == 223) {
        document.write("Tahm Kench")
    }

    if (championID == 91) {
        document.write('Talon')
    }

    if (championID == 44) {
        document.write('Taric')
    }

    if (championID == 17) {
        document.write('Teemo')
    }

    if (championID == 412) {
        document.write('Thresh');
    }

    if (championID == 18) {
        document.write('Tristana')
    }

    if (championID == 48) {
        document.write('Trundle')
    }

    if (championID == 23) {
        document.write('Tryndamere')
    }

    if (championID == 4) {
        document.write("Twisted Fate")
    }

    if (championID == 29) {
        document.write('Twitch')
    }

    if (championID == 77) {
        document.write('Udyr')
    }

    if (championID == 6) {
        document.write('Urgot')
    }

    if (championID == 110) {
        document.write('Varus')
    }

    if (championID == 67) {
        document.write('Vayne')
    }

    if (championID == 45) {
        document.write('Veigar')
    }

    if (championID == 161) {
        document.write("Vel'Koz")
    }

    if (championID == 254) {
        document.write('Vi')
    }

    if (championID == 112) {
        document.write('Viktor')
    }

    if (championID == 8) {
        document.write('Vladimir')
    }

    if (championID == 106) {
        document.write('Volibear')
    }

    if (championID == 19) {
        document.write('Warwick')
    }

    if (championID == 62) {
        document.write('Wukong')
    }

    if (championID == 101) {
        document.write('Xerath')
    }

    if (championID == 5) {
        document.write("Xin Zhao")
    }

    if (championID == 157) {
        document.write('Yasuo')
    }

    if (championID == 83) {
        document.write('Yorick')
    }

    if (championID == 154) {
        document.write('Zac')
    }

    if (championID == 238) {
        document.write('Zed')
    }

    if (championID == 115) {
        document.write('Ziggs')
    }

    if (championID == 26) {
        document.write('Zilean')
    }

    if (championID == 143) {
        document.write('Zyra')
    }

};                               