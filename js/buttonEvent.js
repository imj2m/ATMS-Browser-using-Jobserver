/**
 * Created by MJ on 2016. 7. 21..
 */

function buttonEvent() {
    $(".use-triple").on("click", function() {

        var $item = $(this).closest("tr").find(".nr").text();


        console.log("selected : " + $item);
        retractSearch(getJob("SHOW_RETRACT"), $item);

        var changedItem = "<del>" + $item + "</del>";

        $(this).closest("tr").find(".nr").html(changedItem);


        $item = $(this).closest("tr").find(".nr2").text();
        changedItem = "<del>" + $item + "</del>";
        $(this).closest("tr").find(".nr2").html(changedItem);

    });
}

