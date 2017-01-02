        $(document).ready(function() {
                $('td#address').click(function(){
                   //alert("clicked");
                   var address = $(this).text();
                   //alert(address);
                   window.location.href = '/addressSearch/'+address;
    });


    $('button.menu').click(function () {
        if ($('div.navbar-collapse.search.collapse').hasClass('in')) {
            $('div.navbar-collapse.search.collapse').removeClass('in');
            //alert('removed the class');
        }

        });
    $('button.search').click(function () {
        if ($('div.navbar-collapse.menu.collapse').hasClass('in')) {
            $('div.navbar-collapse.menu.collapse').removeClass('in');
            //alert('removed the class');
        }

    });        
                // $('#results').DataTable();
});



