lookupDictDefiniton = function() {

    var partsOfSpeech = {
        'n': 'noun',
        'v': 'verb',
        'a': 'adjective',
        's': 'adjective satellite'
    };

    function displayDefinition(response, selection) {
        var definitions = JSON.parse(response);
        var html = "";
        var i;
        var j;
        var samples;


        var div = document.createElement("div");
        var contents = document.createElement("div");
        var body = document.getElementsByTagName("body")[0];
        var selectionRect = selection.getRangeAt(0).getClientRects()[0];
        var scrollTop = (document.documentElement && document.documentElement.scrollTop) || body.scrollTop;
        var scrollLeft = (document.documentElement && document.documentElement.scrollLeft) || body.scrollLeft;

        var bodyListener = function() {
            body.removeChild(div);
            body.removeEventListener("click", bodyListener);
        };
        body.addEventListener("click", bodyListener);

        div.addEventListener("click", function(evt) {
            evt.stopPropagation();
        });

        div.className = "dict_bubble top";
        contents.className = "dict_content";

        for (i = 0; i < definitions.length; i++) {
            if (i == 0
                 || (definitions[i].lemma != definitions[i - 1].lemma)
                 || (definitions[i].pos != definitions[i - 1].pos)) {
                    if (i != 0) {
                        html += "</ol>";
                    }
               html += "<b>" + definitions[i].lemma + "</b> (" + partsOfSpeech[definitions[i].pos] + 
               "):<ol class='dict_list'>";
            }
            html += "<li class='dict_list_li'>" + definitions[i].definition + "</li>";
            if(definitions[i].sampleset) {
                samples = definitions[i].sampleset.split("|");
                html += "<ul class='dict_samp_list'>";
                for (j = 0; j < samples.length; j++) {
                    html += "<li class='dict_samp_li'><i>" + samples[j] + "</i></li>";
                }
                html += "</ul>";
            }
        }
        html += "</ol>";
        contents.innerHTML = html;
        div.appendChild(contents);
        div.style.top = selectionRect.bottom + 20 + scrollTop + "px";
        div.style.left = ((selectionRect.left + selectionRect.right) / 2) - 67 + scrollLeft + "px";
        body.appendChild(div);
        


        console.log(response);
    }

    function fetchWords(words, selection) {
        var httpRequest = new XMLHttpRequest();

        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState == XMLHttpRequest.DONE && httpRequest.status == 200) {
                displayDefinition(httpRequest.response, selection);
            }
        };
        httpRequest.open("GET", "https://localhost/CIS233W/lab5/dict/word_lookup.php?word=" + words, true);
        httpRequest.send();
    }

    return function () {
        var selection = window.getSelection();
        var words;

        if (selection.rangeCount == 0) {
           // console.log("No selection");
        }else{
            words = selection.toString().trim();
            if (words == "") {
               // console.log("No selection");
            } else {
               // console.log("Selection: '" + words + "'"); 
               fetchWords(words, selection);
            }
        }
       
    }
}();

lookupDictDefiniton();