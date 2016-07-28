/**
 *
 * Created by MJ on 2016. 7. 11..
 */

function keywordSearch(the_url, keyword) {

    $.ajax({
        url: the_url,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data:JSON.stringify({
            "keyword" : keyword
        }),

        success: function (data) {
            getResponseResource(data.result.jobId);

        },
        error: function(){
            alert("Cannot get data");
        }
    });
}


function getResponseResource(jobId) {

    the_url = "http://localhost:8090/jobs/" + jobId;

    $.ajax({
        url: the_url,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            if (data.status != "FINISHED") {
                getResponseResource(jobId);
            }
            else{
                // console.log(JSON.stringify(data.result))
                makeResourceHTML(data.result);
            }
        },
        error: function(){
            alert("Cannot get data");
        }
    });
}


function makeResourceHTML(results) {
    var output = "<ul class='chat'>";

    if ( results[0] == null ){
        output += "<li class='left clearfix'>Empty</li></ul>";
    }
    else{
        for (var i in results){
            output += "<li class='left clearfix'>" + results[i].toString() + "</li>";
        }
        output += "</ul>";
    }

    $("#key_resource").html(output);
}
