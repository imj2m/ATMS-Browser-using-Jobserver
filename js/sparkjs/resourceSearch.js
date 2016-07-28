/**
 * Created by MJ on 2016. 7. 15..
 */
/**
 *
 * Created by MJ on 2016. 7. 11..
 */

function resourceSearch(the_url, resourceId) {

    $.ajax({
        url: the_url,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data:JSON.stringify({
            "resourceId" : resourceId
        }),

        success: function (data) {
            getResponseTriples(data.result.jobId);

        },
        error: function(){
            alert("Cannot get data");
        }
    });
}


function getResponseTriples(jobId) {

    the_url = "http://localhost:8090/jobs/" + jobId;

    $.ajax({
        url: the_url,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            if (data.status != "FINISHED") {
                console.log("not yet")
                getResponseTriples(jobId);
            }
            else{
                console.log(JSON.stringify(data.result))
                makeTriplesHTML(data.result);
            }
        },
        error: function(){
            alert("Cannot get data");
        }
    });
}


function makeTriplesHTML(results) {
    var output = "<ul class='chat'>";

    if ( results[0] == null ){
        output += "<li class='left clearfix'><p>empty</p></li></ul>";
    }
    else{
        for (var i in results){
            var tmp = results[i].split('=');
            output += "<li class='left clearfix'>" + "<p>" + tmp[0].toString() + "</p>" +
                "<p><em>" + tmp[1].toString() + "</em></p></li>";
        }
        output += "</ul>";
    }

    $("#resource_triples").html(output);
}


function fillTextBox(str) {
    $("#resourceId").val(str);
    
}
