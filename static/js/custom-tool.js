/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

jQuery("document").ready(function () {
    // Code to configure editor 1
    var editor1 = ace.edit("editor1");
    editor1.setTheme("ace/theme/textmate");
    editor1.session.setMode("ace/mode/javascript");
    editor1.setShowPrintMargin(false);

    // Code to configure editor 2    
    var editor2 = ace.edit("editor2");
    editor2.setTheme("ace/theme/textmate");
    editor2.session.setMode("ace/mode/javascript");
    editor2.setShowPrintMargin(false);


    /*$('.tool-action-btn').on('click', function () {
        var editor_val = editor1.getValue();
        var toolname = $(this).data("toolname")
        var result = handleAction(editor_val, toolname);
        editor2.setValue(result);
        /*   $.ajax({
         type: "POST", // use $_POST method to submit data
         url: ajaxurl, // where to submit the data
         data: {
         action: 'tool_action_callback',
         toolname: toolname,
         editor_val: editor_val,
         },
         success: function (data) {
         console.log("return: -" + data);
         editor2.setValue(data);
         },
         error: function (errorThrown) {
         $('#the-empty-div').html('<p>Error retrieving data. Please try again.</p>');
         }
         }); */
    /*});*/
	
	
	
	
    function handleAction(editor_val, toolname) {
        switch (toolname) {
            case "base64encode":
                return btoa(editor_val);
                break;
            case "base64decode":
                return atob(editor_val);
                break;
            default:
                return "Define Code in custom-tool.js file to perform action";
                break;
        }
    }


});

function makefile(data,ex) {
		  if ('Blob' in window) {
			var fileName = 'Untitled.'+ex;
			if (fileName) {
			  var textToWrite = data.replace(/n/g, 'rn');
			  var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
		
			  if ('msSaveOrOpenBlob' in navigator) {
				navigator.msSaveOrOpenBlob(textFileAsBlob, fileName);
			  } else {
				var downloadLink = document.createElement('a');
				downloadLink.download = fileName;
				downloadLink.innerHTML = 'Download File';
				
				if ('webkitURL' in window) {
				  // Chrome allows the link to be clicked without actually adding it to the DOM.
				  downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
				} else {
				  // Firefox requires the link to be added to the DOM before it can be clicked.
				  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
				  downloadLink.click(function(){
					document.body.removeChild(event.target);
				  }); 
				  
				  downloadLink.style.display = 'none';
				  document.body.appendChild(downloadLink);
				}
				downloadLink.click();
			  }
			}
		  } else {
			alert('Your browser does not support the HTML5 Blob.');
		  }
		}

//for ace editer
function copyToClipboard(editor) {
	var sel = editor.selection.toJSON(); // save selection
	editor.selectAll();
	editor.focus();
	document.execCommand('copy');
	editor.selection.fromJSON(sel); // restore selection
}
//for tiny editer
function tinycopyToClipboard(text) {
if (window.clipboardData && window.clipboardData.setData) {
    // IE specific code path to prevent textarea being shown while dialog is visible.
    return clipboardData.setData("Text", text); 

} else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
        return document.execCommand("copy");  // Security exception may be thrown by some browsers.
    } catch (ex) {
        console.warn("Copy to clipboard failed.", ex);
        return false;
    } finally {
        document.body.removeChild(textarea);
    }
}}

function generateHtmlTable(data) {
	var html = '<table border="1">';
	if(typeof(data[0]) === 'undefined') {
		return null;
	} else {
		$.each(data, function( index, row ) {
			//bind header
			if(index == 0) {
				html += '<thead>';
				html += '<tr>';
				$.each(row, function( index, colData ) {
					html += '<th>';
					html += colData;
					html += '</th>';
				});
				html += '</tr>';
				html += '</thead>';
				html += '<tbody>';
			} else {
				html += '<tr>';
				$.each(row, function( index, colData ) {
					html += '<td>';
					html += colData;
					html += '</td>';
				});
				html += '</tr>';
			}
		});
		html += '</tbody>';
		html += '</table>';
		return html;
	}
}

var xt="",h3OK=1;
function checkErrorXML(x){
	xt="";
	h3OK=1;
	checkXML(x);
}

function checkXML(n){
	var l,i,nam;
	nam=n.nodeName;
	if (nam=="h3"){
		if (h3OK==0){
			return;
		}
		h3OK=0;
	}
	if (nam=="#text"){
		xt=xt + n.nodeValue + "\n";
	}
	l=n.childNodes.length;
	for (i=0;i<l;i++){
		checkXML(n.childNodes[i]);
 	}
}

function validateXML(txt){
	// code for IE
	if (window.ActiveXObject){
		var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async=false;
		xmlDoc.loadXML(document.all(txt).value);
		if(xmlDoc.parseError.errorCode!=0){
			txt="Error Code: " + xmlDoc.parseError.errorCode + "\n";
			txt=txt+"Error Reason: " + xmlDoc.parseError.reason;
			txt=txt+"Error Line: " + xmlDoc.parseError.line;
			//alert(txt);
			//error
			return false;
		}else{
			//alert("No errors found");
			return true;
		}
	}
	// code for Mozilla, Firefox, Opera, etc.
	else if (document.implementation.createDocument){
		try{
			var text=document.getElementById(txt).value;
			var parser=new DOMParser();
			var xmlDoc=parser.parseFromString(text,"application/xml");
		}
		catch(err){
			//alert(err.message)
			return false;
		}
		if (xmlDoc.getElementsByTagName("parsererror").length>0){
			checkErrorXML(xmlDoc.getElementsByTagName("parsererror")[0]);
			//alert(xt)
			return false;
		}else{
			//alert("No errors found");
			return true;
		}
	}else{
		alert('Your browser cannot handle XML validation');
	}
}
