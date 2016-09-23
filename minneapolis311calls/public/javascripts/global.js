        $(document).ready(function() {
                $('td#address').click(function(){
                   //alert("clicked");
                   var address = $(this).text();
                   alert(address);
                   //window.location.href = '/addressSearch/'+address;
                });

                // $('#results').DataTable();
            });