function convertXml2Tsv(text)
{
  if(text != ""){
    try {
      $('#erorMsg').text('');
      var res=resXml2Tsv(text);
      //$("#data_text").val(res);
	  editor2.setValue(res);
      if (res) {
        HideLoading();
      } 
    }
    catch(err) {
      //$("#data_text").val('');
	  editor2.setValue('');
      $('#erorMsg').text(err);
    }
  }
}
function resXml2Tsv(text){
  var x2js = new X2JS();
  var parsed = x2js.xml_str2json(text);
  var keys = Object.keys(parsed);
  if (keys.length > 1) {
      $('#erorMsg').text("XML contains multiple primary keys. Too complex to convert to TSV.");
  }
  var primaryKey = keys[0];
  if (typeof parsed[primaryKey] == 'string' || typeof parsed[primaryKey] == 'number') {
      return primaryKey + "\n" + parsed[primaryKey];
  }
  else if (typeof parsed[primaryKey] == 'object') {

    var complexObjectKeys = Object.keys(parsed[primaryKey]);
    if (complexObjectKeys.length == 1) {
        var primaryComplexObjectKey = complexObjectKeys[0];
        if (typeof parsed[primaryKey][primaryComplexObjectKey] == 'string' || 
            typeof parsed[primaryKey][primaryComplexObjectKey] == 'number')
        {
            return primaryKey + "\n" + parsed[primaryKey][primaryComplexObjectKey];
        }
        else if (parsed[primaryKey][primaryComplexObjectKey] instanceof Array) {
            if (typeof parsed[primaryKey][primaryComplexObjectKey][0] == 'string' ||
                typeof parsed[primaryKey][primaryComplexObjectKey][0] == 'number')
            {
                var ret = primaryKey + "\n";
                for (var i = 0; i < parsed[primaryKey][primaryComplexObjectKey].length; i++) {
                    ret += parsed[primaryKey][primaryComplexObjectKey][i] + "\n";
                }
                return ret;
            }
            else if (typeof parsed[primaryKey][primaryComplexObjectKey][0] == 'object') {
                var objKeys = Object.keys(parsed[primaryKey][primaryComplexObjectKey][0]);
                var ret = objKeys.join("\t") + "\n";
                for (var i = 0; i < parsed[primaryKey][primaryComplexObjectKey].length; i++) {
                    for (var j = 0; j < objKeys.length; j++) {
                        ret += parsed[primaryKey][primaryComplexObjectKey][i][objKeys[j]] + "\t";
                    }
                    ret += "\n";
                }
                return ret;
            }
            else {
                $('#erorMsg').text("xml too complex to convert to tsv, or something went wrong");
            }
        } 
        else if (typeof parsed[primaryKey][primaryComplexObjectKey] == 'object') {
            var objKeys = Object.keys(parsed[primaryKey][primaryComplexObjectKey]);
            var ret = objKeys.join("\t") + "\n";
            for (var i = 0; i < objKeys.length; i++) {
                ret += parsed[primaryKey][primaryComplexObjectKey][objKeys[i]] + "\t";
            }
            return ret;
        }
        else {
            $('#erorMsg').text("xml too complex to convert to tsv, or something went wrong");
        }
    }
    else {
        ret = complexObjectKeys.join("\t") + "\n";
        for (var i = 0; i < complexObjectKeys.length; i++) {
            ret += parsed[primaryKey][complexObjectKeys[i]] + "\t";
        }
        return ret;
    }
  }
  else {
      $('#erorMsg').text("xml too complex to convert to tsv, or something went wrong");
  }
}