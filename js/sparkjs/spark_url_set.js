/**
 * Created by MJ on 2016. 7. 11..
 */

var contextName = null;
var appName = null;

function getJob(type) {
    //
    // if (contextName == null)
    //     alert("Not exist Context");
    // if (appName == null)
    //     alert("Not exist appName");


    if (type == "MAKE_ATMS_RDD"){
        return "http://localhost:8090/jobs?appName=" + appName + "&classPath=make_ATMS_RDD&context=" + contextName
    }

    if (type == "SHOW_RESOURCE"){
        return "http://localhost:8090/jobs?appName=" + appName + "&classPath=ShowResource&context=" + contextName
    }

    if (type == "SHOW_TRIPLES"){
        return "http://localhost:8090/jobs?appName=" + appName + "&classPath=ShowTriples&context=" + contextName
    }

    if (type == "SHOW_WHY"){
        return "http://localhost:8090/jobs?appName=" + appName + "&classPath=Why&context=" + contextName
    }

    if (type == "SHOW_RETRACT"){
        return "http://localhost:8090/jobs?appName=" + appName + "&classPath=Retract&context=" + contextName
    }

    if (type == "SHOW_ENV"){
        return "http://localhost:8090/jobs?appName=" + appName + "&classPath=ShowEnv&context=" + contextName
    }

}

function setAppName(name) {
    appName = name;
}


function setContextName(name) {
    contextName = name;
    return "http://localhost:8090/contexts/" + name;
}
