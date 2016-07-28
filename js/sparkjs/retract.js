/**
 * Created by MJ on 2016. 7. 20..
 */
/**
 *
 * Created by MJ on 2016. 7. 11..
 */

function retractSearch(the_url, assumption) {

    $.ajax({
        url: the_url,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data:JSON.stringify({
            "assumption" : assumption
        }),

        success: function (data) {
            getResponseRetract(data.result.jobId);

        },
        error: function(){
            alert("Cannot get data");
        }
    });
}


function getResponseRetract(jobId) {

    the_url = "http://localhost:8090/jobs/" + jobId;

    $.ajax({
        url: the_url,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            if (data.status != "FINISHED") {
                getResponseRetract(jobId);
            }
            else{
                // console.log(JSON.stringify(data.result))
                makeRetractHTML(data.result);
            }
        },
        error: function(){
            alert("Cannot get data");
        }
    });
}


function makeRetractHTML(results) {

    console.log("Retract : " + results);
    alert("Retracted !! ");


    // var output = "<ul class='chat'>";
    //
    // for (var i in results){
    //     output += "<li class='left clearfix'>" + results[i].toString() + "</li>";
    // }
    // output += "</ul>";
    //
    // $("#key_resource").html(output);
}
