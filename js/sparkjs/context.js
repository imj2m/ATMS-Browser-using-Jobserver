/**
 * Created by MJ on 2016. 7. 11..
 */

function makeContext(the_url) {

    $.ajax({
        url: the_url,
        type: 'POST',

        success: function (data) {
            alert(JSON.stringify(data));

        },
        error: function(){
            //alert("Cannot get data");
        }
    });
}


function chkContext(the_url, appName) {

    $.ajax({
        url: "http://localhost:8090/contexts/",
        type: 'GET',

        success: function (data) {
            console.log(JSON.stringify(data));

            if (data.indexOf(the_url) == -1){
                setAppName(appName);
                makeContext(setContextName(the_url));

            }else{
                setAppName(appName);
                setContextName(the_url)
            }

        },
        error: function(){
            //alert("Cannot get data");
        }
    });
}