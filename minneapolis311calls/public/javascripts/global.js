$(document).ready(function() {
                $('td#address').click(function(){
                   //alert("clicked");
                   var address = $(this).text();
                   //alert(address);
                   window.location.href = '/addressSearch/'+address;
    });

    $('button.menu').click(function () {
        //add the special close menu button
        $('li.nav-close.menu').css('display', 'block');
        //remove the other close button
        $('li.nav-close.search').css('display', 'none');         
        if ($('div.navbar-collapse.search.collapse').hasClass('in')) {
            $('div.navbar-collapse.search.collapse').removeClass('in');
            //alert('removed the class');
        }
    });

    $('button.search').click(function () {
        //add the special close search button
        $('li.nav-close.search').css('display', 'block');
        //remove the other close button
        $('li.nav-close.menu').css('display', 'none');        
        
        //close the settings menu if it's open
        if ($('div.navbar-collapse.menu.collapse').hasClass('in')) {
            $('div.navbar-collapse.menu.collapse').removeClass('in');


        }
    });

        $('#search-input').keyup(function () {
            var searchInputLength = $('#search-input').val().length;
            if (searchInputLength > 0) {
                $('.navbar-remove-glyph').css('display', 'block');
            } else {
                $('.navbar-remove-glyph').css('display', 'none');              
            }
        });

        $('.navbar-remove-glyph').click(function () {
            $('#search-input').val("");
            $('.navbar-remove-glyph').css('display', 'none');
    });

    $('li.nav-close').click(function () {
        if ($('div.navbar-collapse.search.collapse').hasClass('in')) {
            //$('div.navbar-collapse.search.collapse').removeClass('in');

        }
    
    });


    });        
                // $('#results').DataTable();
//});



