/**
 * Created by MJ on 2016. 7. 11..
 */
function build_rdd(the_url) {

    $.ajax({
        url: the_url,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',

        success: function (data) {
            // alert(JSON.stringify(data));
            getResponseLoad(data.result.jobId);

        },
        error: function(){
            alert("Cannot get data");
        }
    });
}

function getResponseLoad(jobId) {

    the_url = "http://localhost:8090/jobs/" + jobId;
    //var dataStr = "input.string = hi am a boy you are a girl"

    $.ajax({
        url: the_url,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            // alert(JSON.stringify(data));
            if (data.status != "FINISHED") {
                getResponseLoad(jobId);
            }
            else{
                console.log(JSON.stringify(data.result));
                makeInfoHTML(data.result);
            }
        },
        error: function(){
            alert("Cannot get data");
        }
    });
}

function makeInfoHTML(results) {

    $("#rr").html(results.inferredTriples);
    $("#ih").html(results.indexedHolds);
    $("#ie").html(results.indexedEnvs);
    $("#ia").html(results.indexedAssumptions);
    $("#in").html(results.indexedNodes);
    $("#ij").html(results.indexedJustificands);



}