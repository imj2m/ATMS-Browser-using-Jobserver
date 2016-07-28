function initGraph(results){
  var re = /\((.*)\)/
  var jsonArray = new Array();

    if (results[0] == null){
        console.log("no exist graph data!")
        return;
    }

  for (var i in results){
      console.log(i +"의 인풋 " + results[i])
      var replaceResult = results[i]//.replace(/\"/gi, "")
      // var string1 = results[i].toString().replace(/</g, '&lt;').replace(/>/g, '&gt;').split('/')
      var resultSplit = replaceResult.split(' ')
      var antecedente = replaceResult.match(re)[1]
      var justID = resultSplit[0]
      // var conclusion = resultSplit[1] +" "+ resultSplit[2] +" "+ resultSplit[3].replace(",", '')
      var conclusion = "[" + replaceResult.split(",")[0].split("[")[1]
      console.log(conclusion)
      var depth = resultSplit[10]
      // jsonArray = makeTree(jsonArray,string1[0],string1[1],string1[2])
      // console.log(justID,antecedente,conclusion)
      jsonArray = makeTree(jsonArray,justID,antecedente,conclusion)
  }
  generating(jsonArray)
}

function makeJson(s1, s2, s3){
  var tmp_s3 = s3.split("[")[1].split("]")
  var s3_num = tmp_s3[0]

  s1 = trim(s1)
  s2 = trim(s2)
  s3 = trim(tmp_s3[1])
  console.log(s3)

  var results = new Array();
  var parentObj = new Object() // 최상위 
  parentObj.name = s3  // 최상위 이름  
  parentObj.number = s3_num
  var tmp = new Array() // 최상위 단계의 children array

  var justficationObj = new Object()  // 중간단계 즉 justfication 
  justficationObj.name = s1  // 중간단계 이름
  justficationObj.role = "j"  //롤설정
  
  var split_Ancedent = s2.split(',') // 최하위단계의 갯수때문에 스플릿
  var tmp2 = new Array() // 중간단계 children에 달릴 array
  for(var ii in split_Ancedent){ // 최하위 단계의 모든 것을 다추가하기 위해 for문
      var tmpAncedent = trim(split_Ancedent[ii]).split("[")[1].split("]")
      var ancedentObj = new Object() // 최하위 단계의 한개의 노드
      ancedentObj.name = tmpAncedent[1] // 최하위 단계의 한개의 노드의 이름
      ancedentObj.number = tmpAncedent[0]
      ancedentObj.parent = s1 // 중간단계를 부모로 가짐
      tmp2.push(ancedentObj) // 중간단계 children의 array에 최하위단계 노드 추가 
  }
  justficationObj.children = tmp2; // 중간 단계 children 추가
  tmp.push(justficationObj) // 최상위 단계 array 에 중간단계 부탁
  parentObj.children = tmp; // array 부착
  results.push(parentObj); // 최상위 단계를 부착 

  return results;
} 

function makeTree(jsonArray, s1, s2, s3){

    if(jsonArray[0] == null){
        console.log("case1 d: " + depth)
        jsonArray = makeJson(s1, s2, s3)
    }
    else{ // 관련 justfication이 한개가아닐때 
        if(jsonArray[0].name == s3.split("]")[1]){ // concequent가 최상위 노드일때 
            console.log("case2 d: " + depth)
            var tmpArray = makeJson(s1, s2, s3)
            jsonArray[0].children.push(tmpArray[0].children[0]) // 최상위 단계 array 에 중간단계 부탁
        }
        else if(s2.indexOf(jsonArray[0].name.split("\"")) != -1){ // 새로 만드는 그래프의 하위 노드에 원래노드의 concequent가 있을때
            console.log("case3 d: " + depth)
            var tmpArray = makeJson(s1,s2,s3)
            for(var iiii in tmpArray[0].children[0].children){
                console.log("help"+iiii)

                if(tmpArray[0].children[0].children[iiii].name == jsonArray[0].name){
                    console.log("help")
                    tmpArray[0].children[0].children[iiii].children = jsonArray[0].children
                }
            }
            jsonArray = tmpArray;
        }
        else{ // 새로 만드는 그래프의 concequent 가 이미 있던 그래프의 antecendent에 있을때
            var tmpArray = makeJson(s1,s2,s3)
            jsonArray[0] = searchInChildren(jsonArray[0], tmpArray, s3)
        }            
    }
    depth += 1
    // console.log("makeTree")
    return jsonArray;
}
function searchInChildren(jsonArray, tmpArray, s3){
  s3 = s3.split("]")[1]
  for(var justc =0; justc<jsonArray.children.length; justc++){
    for(var iii=0; iii<jsonArray.children[justc].children.length; iii++){
        if(jsonArray.children[justc].children[iii].name == s3){
            if(jsonArray.children[justc].children[iii].children != null)
              jsonArray.children[justc].children[iii].children.push(tmpArray[0].children[0])
            else{
              jsonArray.children[justc].children[iii].children = tmpArray[0].children
            }
        }
        else{
          if(jsonArray.children[justc].children[iii].children != null){
            tmpArray2 = searchInChildren(jsonArray.children[justc].children[iii], tmpArray, s3)
            }
        }
    }
  }
  return jsonArray
}

function trim(str) {
  return str.replace( /(^\s*)|(\s*$)/g, "" );
}