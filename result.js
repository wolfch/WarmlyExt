
function render_row(row_data) {

  var row = $("<tr/>");
  $("#warmly_results").append(row);

  var td_text = '';

  if (row_data.hasOwnProperty('relevance')) {
    td_text += '<p><span class="r_hdr">Relevance:</span> ' + ss(row_data.relevance)
  }

  td_text += '<p><span class="r_hdr">Summary:</span> ' + ss(row_data.summary)
    + '<p><span class="r_hdr">Keywords:</span> ' + list_to_html_list(row_data.keywords) + "</p>";
    if (row_data.hasOwnProperty('mentions')) {
        td_text += ('<p><span class="r_hdr">Mentions:</span> ' + list_to_html_list(row_data.mentions) + "</p>");
    }
    if (row_data.hasOwnProperty('quotes')) {
        td_text += ('<p><span class="r_hdr">Quotes:</span> ' + list_to_html_list(row_data.quotes) + "</p>");
    }
    if (row_data.hasOwnProperty('snippet')) {
        td_text += ('<p><span class="r_hdr">Snippet:</span> ' + ss(row_data.snippet) + "</p>");
    }
    td_text += ('<p><span class="r_hdr">Source:</span> ' + ss(row_data.url) + "</p>"
            + '<span class="r_hdr">Published date:</span> ' + ss(row_data['published date']));

  row.append($("<td>" + td_text + "</td>"));
}

function list_to_html_list(slist) {
  if (slist == null || slist.length < 1)
    return '';
  var hlist = '<ol><li>';
  hlist += slist.join('</li><li>')
  hlist += '</li></ol>';
  return hlist;  
}

// safe string...
function ss(str) {
  return (str != null ? str : "n/a");
}

function render_result(warmly_doc) {
    $.each(warmly_doc['results'], function(i, row) {
         console.log('row: ' + i + ': ' + row['published date']);
        render_row(row);
    });
}

function load_test_data() {
    $.getJSON("guido_rossum.json", function(data) {
        //data.terms = 'One two three';
        console.log('Test data: ' + data);
        render_result(data); 
        document.getElementById('loading_progress').style.display = 'none';
        document.getElementById('warmly_result_title').innerHTML = 'Results:';
        document.getElementById('warmly_result_count').innerHTML = data.results.length;
        document.getElementById('warmly_terms').innerHTML = 'One Two Three';
        document.getElementById('terms').style.visibility = 'visible';
        document.getElementById('sunpalms_img').style.display = 'inline-block';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('====> result.js AddEventListener');
    chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
        console.log('====> result.js message received: ' + request.type);
        if (request.type === 'warmly_display_result') {
            console.log('====> result.js render data: ' + request.data);
            //load_test_data();
            document.getElementById('loading_progress').style.display = 'none';
            if (request.data == null) {
                document.getElementById('warmly_result_title').innerHTML = 'No data found.';
            } else {
                render_result(request.data); 
                document.getElementById('warmly_result_title').innerHTML = 'Results:';
                document.getElementById('warmly_result_count').innerHTML = request.data.results.length;
                
                var terms = request.data.search_criteria.target + ': ' + request.data.search_criteria.tags;
                document.getElementById('warmly_terms').innerHTML = '"' + terms + '"';
                document.getElementById('terms').style.visibility = 'visible';
                document.getElementById('sunpalms_img').style.display = 'inline-block';
            }
        }
    });
}, false);

