/**
 * Created by MJ on 2016. 7. 18..
 */
/**
 *
 * Created by MJ on 2016. 7. 11..
 */

function whySearch(the_url, nodename) {

    $.ajax({
        url: the_url,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data:JSON.stringify({
            "nodename" : nodename
        }),

        success: function (data) {
            getResponseWhy(data.result.jobId);

        },
        error: function(){
            alert("Cannot get data");
        }
    });
}


function getResponseWhy(jobId) {

    the_url = "http://localhost:8090/jobs/" + jobId;

    $.ajax({
        url: the_url,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            if (data.status != "FINISHED") {
                getResponseWhy(jobId);
            }
            else{
                // console.log(JSON.stringify(data.result))
                makeWhyHTML(data.result);
            }
        },
        error: function(){
            alert("Cannot get data");
        }
    });
}


function makeWhyHTML(results) {

    var output = "";
    var conseq = "";


    conseq += "<div class='alert alert-info' style='padding-bottom: 0px'>";
    conseq += "<table class='table table-sm'>";
    conseq += "<tbody><b>Label : { ";

    var buttonStr = "<button type='button' class='use-triple'>Retract</button>";
    //


    // for display Antecedent list

    var ant = results.antecedent;

    for ( i in ant){

        output += "<div class='alert alert-success' style='padding-bottom: 0px'>";
        output += "<table class='table table-sm'>";
        output += "<tbody>";

        for (j in ant[i]){
            
            if ( j == 0 ){
                console.log("ant2 : " + ant[i][j]);
                conseq += ant[i][j].toString() + " ";
                output += "<b>" + "Environment : " + ant[i][j].toString() + "</b>";

            }else{

                for (k in ant[i][j]){

                    console.log("ant2 : " + ant[i][j][k]);

                    var spAnt = ant[i][j][k].split("=");

                    output += "<tr>" +
                              "<td rowspan='2'>" + spAnt[0].trim().toString() + "</td>" +
                              "<td class='nr'>" + spAnt[2].trim().toString() + "</td>" +
                              "<td rowspan='2'>" + buttonStr + "</td>" +
                              "</tr>" +
                              "<tr>" +
                              "<td class='nr2'>" + spAnt[1].trim().toString() + "</td>" +
                              "</tr>";
                }


            }// else
        }

        output += "</tbody></table></div>";
    }

    $("#ant").html(output);
    

    // for consequent
    conseq += " }<tr><td>" + results.consequent + "</td></tr></tbody></table></div>";

    console.log("consequent : " + results.consequent);

    // if not empty
    if (conseq.indexOf("{  }") == -1){
        $("#con").html(conseq);

        // register button event
        buttonEvent();
    }
    else{
        $("#con").html("");
    }


    // loading garph
    var graph = results.graphinfo;
    var flag = true;

    for ( var i in graph){
        console.log("graph : " + graph[i]);
        if (graph[i] == "Not Exist"){
            flag = false;

            $("#cytoscapeweb").html("");
            alert(" Not Exist Assumption!");

            break;
        }

    }

    if ( flag == true )
        initGraph(graph);


}
