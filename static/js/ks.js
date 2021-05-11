$(document).ready(function() {
    var keywordsToDisplay = new Array();
    var hashMapResults = {};
    var numOfInitialKeywords = 0;
    var doWork = false;
    var keywordsToQuery = new Array();
    var keywordsToQueryIndex = 0;
    var maxResults;
    var jobCount;
    var jobCache;
    var queryflag = false;
    $('#googleselect').show();
    $('#amazonselect').hide();
    $('.newselect').select2();
    $('.newselect-sm').select2({
        minimumResultsForSearch: Infinity
    });
    $('#TrendModal').modal({
        show: false
    });
    $('#searchsite').change(function() {
        if ($('#searchsite').val() == 'amazon') {
            $('#googleselect').hide();
            $('#amazonselect').show();
        } else {
            $('#googleselect').show();
            $('#amazonselect').hide();
        }
    });
    $('#search').click(function() {
        keywordsToDisplay = new Array();
        hashMapResults = {};
        numOfInitialKeywords = 0;
        doWork = false;
        keywordsToQuery = new Array();
        keywordsToQueryIndex = 0;
        keywordsToDisplay = new Array();
        jobCount = 0;
        jobCache = 0;
        queryflag = false;
        maxResults = $('#searchvol').val();
        if (document.cookie.indexOf("runOnce") < 0) {}
        $('#keywordTable').css('display', 'none');
        $('#intro').css('display', 'none');
        $('#resultsprog').css('display', 'block');
        $('#keywordTable table tbody').html('');
        if (doWork == false) {
            keywordsToDisplay = new Array();
            hashMapResults = {};
            keywordsToQuery = new Array();
            keywordsToQueryIndex = 0;
            hashMapResults[""] = 1;
            hashMapResults[" "] = 1;
            hashMapResults["  "] = 1;
            var ks = $('#startword').val();
            keywordsToQuery[keywordsToQuery.length] = ks;
            keywordsToDisplay[keywordsToDisplay.length] = ks;
            for (var j = 0; j < 26; j++) {
                var chr = String.fromCharCode(97 + j);
                var currentx = ks + ' ' + chr;
                keywordsToQuery[keywordsToQuery.length] = currentx;
                hashMapResults[currentx] = 1;
                var currentxb = chr + ' ' + ks;
                keywordsToQuery[keywordsToQuery.length] = currentxb;
                hashMapResults[currentxb] = 1;
            }
            numOfInitialKeywords = keywordsToDisplay.length;
            FilterAndDisplay();
            doWork = true;
        } else {
            doWork = false;
        }
    });
    $('#startword').keypress(function(e) {
        if (e.which == 13) {
            $('#search').click();
        }
    });
    $('#selectAll').click(function(event) {
        if (this.checked) {
            $('.keywordSelection').each(function() {
                this.checked = true;
            });
        } else {
            $('.keywordSelection').each(function() {
                this.checked = false;
            });
        }
    });
    $('#download').click(function() {
        var trendSelected = $('input:checkbox:checked.keywordSelection').map(function() {
            return this.value;
        }).get();
        if (trendSelected.length < 1) {
            exportToCsv('danstools-keywordlist.csv', keywordsToDisplay);
        } else {
            exportToCsv('danstools-keywordlist.csv', trendSelected);
        }
    });
    $('#trends').click(function() {
        var trendSelected = $('input:checkbox:checked.keywordSelection').map(function() {
            return this.value;
        }).get();
        if (trendSelected.length > 5) {
            alert('You can compare a max of 5 keywords.');
        } else if (trendSelected.length < 1) {
            alert('Please select up to 5 keywords.');
        } else {
            $('#TrendModal .modal-body').html('<iframe style="padding:0;border:0;overflow:hidden; width: 100%; height: 350px;" src="http://www.google.com/trends/fetchComponent?hl=en-US&q=' + trendSelected.join(",") + '&cid=TIMESERIES_GRAPH_0&export=5&w=500&h=200"></iframe>');
            $('#TrendModal').modal('show')
        }
    });
    window.setInterval(DoJob, 100);

    function doneDisplay(res, words) {
        if (typeof table != 'undefined') {
            table.destroy();
        }
        $('#datatable-1 tbody').html('');
        $('#resultsprog').css('display', 'none');
        for (var i = 0; i < words.length; i++) {
            $('#keywordTable').css('display', 'block');
            $('#datatable-1 tbody').append('<tr><td><input type="checkbox" class="keywordSelection" value="' + words[i] + '" /></td><td>' + words[i] + '</td><td>' + ((typeof res[words[i]] != "undefined") ? res[words[i]]['imp'] : 'N/A') + '</td><td>$' + ((typeof res[words[i]] != "undefined") ? res[words[i]]['cpc'] : 'N/A') + '</td></tr>');
        }
        if ($.fn.dataTable.isDataTable('#datatable-1')) {
            table = $('#datatable-1').DataTable();
        } else {
            table = $('#datatable-1').DataTable({
                paging: false,
                sDom: '<f<"dantest">>t',
                "order": [
                    [1, 'asc']
                ],
                "columns": [{
                    "orderable": false
                }, null, null, null]
            });
        }
    }

    function DoJob() {
        if (doWork == true && queryflag == false) {
            if (keywordsToDisplay.length == jobCache) {
                jobCount++;
            } else {
                jobCache = keywordsToDisplay.length;
                jobCount = 0;
            }
            if (keywordsToQueryIndex < keywordsToQuery.length && keywordsToDisplay.length < maxResults) {
                var currentKw = keywordsToQuery[keywordsToQueryIndex];
                QueryKeyword(currentKw);
                keywordsToQueryIndex++;
            } else {
                if (numOfInitialKeywords != keywordsToDisplay.length) {
                    doWork = false;
                } else {
                    keywordsToQueryIndex = 0;
                }
            }
            if (keywordsToDisplay.length >= maxResults || jobCount > 5) {
                doWork = false;
                words = keywordsToDisplay;
                if (document.cookie.indexOf("est") >= 0) {
                    $('#keywordTable div:first').append('<br /><span class="text-danger">Volume and CPC data is currently only available for 1 search per day, per user.</span>');
                    doneDisplay({}, words);
                } else {
                    $.ajax({
                        type: "POST",
                        dataType: "json",
                        url: "est.php",
                        data: {
                            q: JSON.stringify(words),
                        },
                        success: function(res) {
                            var now = new Date();
                            var time = now.getTime();
                            var expireTime = time + 86400 * 1000;
                            now.setTime(expireTime);
                            document.cookie = 'est=1;expires=' + now.toGMTString() + ';path=/';
                            doneDisplay(res, words);
                            doWork = false;
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            $('#resultsprog').css('display', 'none');
                            $('#intro').css('display', 'block');
                            doneDisplay({}, words);
                            doWork = false;
                        }
                    });
                }
            }
        }
    }

    function QueryKeyword(keyword) {
        var querykeyword = keyword;
        var queryresult = '';
        queryflag = true;
        if ($('#searchsite').val() == 'amazon') {
            $.ajax({
                url: "https://completion.amazon.com/search/complete",
                dataType: "jsonp",
                data: {
                    q: querykeyword,
                    client: 'amazon-search-ui',
                    'search-alias': 'aps',
                    mkt: $('#amazonsite').val(),
                },
                success: function(res) {
                    QueryKeywordSuccess(res);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    $('#resultsprog').css('display', 'none');
                    $('#intro').css('display', 'block');
                    alert('You\'ve overused this feature.  Please try again later.');
                }
            });
        } else {
            $.ajax({
                url: "https://suggestqueries.google.com/complete/search",
                jsonp: "jsonp",
                dataType: "jsonp",
                data: {
                    q: querykeyword,
                    gl: $('#language').val(),
                    hl: $('#country').val(),
                    ds: $('#searchsite').val(),
                    client: "chrome"
                },
                success: function(res) {
                    QueryKeywordSuccess(res);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    $('#resultsprog').css('display', 'none');
                    $('#intro').css('display', 'block');
                    alert('You\'ve overused this feature.  Please try again later.');
                }
            });
        }
    }

    function QueryKeywordSuccess(res) {
        var retList = res[1];
        for (var i = 0; i < retList.length; i++) {
            var currents = CleanVal(retList[i]);
            if (hashMapResults[currents] != 1) {
                hashMapResults[currents] = 1;
                keywordsToDisplay[keywordsToDisplay.length] = CleanVal(retList[i]);
                keywordsToQuery[keywordsToQuery.length] = currents;
                for (var j = 0; j < 26; j++) {
                    var chr = String.fromCharCode(97 + j);
                    var currentx = currents + ' ' + chr;
                    keywordsToQuery[keywordsToQuery.length] = currentx;
                    hashMapResults[currentx] = 1;
                }
            }
        }
        FilterAndDisplay();
        var textarea = document.getElementById("startword");
        textarea.scrollTop = textarea.scrollHeight;
        queryflag = false;
    }

    function CleanVal(input) {
        var val = input;
        val = val.replace("\\u003cb\\u003e", "");
        val = val.replace("\\u003c\\/b\\u003e", "");
        val = val.replace("\\u003c\\/b\\u003e", "");
        val = val.replace("\\u003cb\\u003e", "");
        val = val.replace("\\u003c\\/b\\u003e", "");
        val = val.replace("\\u003cb\\u003e", "");
        val = val.replace("\\u003cb\\u003e", "");
        val = val.replace("\\u003c\\/b\\u003e", "");
        val = val.replace("\\u0026amp;", "&");
        val = val.replace("\\u003cb\\u003e", "");
        val = val.replace("\\u0026", "");
        val = val.replace("\\u0026#39;", "'");
        val = val.replace("#39;", "'");
        val = val.replace("\\u003c\\/b\\u003e", "");
        val = val.replace("\\u2013", "2013");
        if (val.length > 4 && val.substring(0, 4) == "http") val = "";
        return val;
    }

    function Filter(listToFilter) {
        var retList = listToFilter;
        return retList;
    }

    function FilterAndDisplay() {
        var sb = '';
        var outputKeywords = Filter(keywordsToDisplay);
        for (var i = 0; i < outputKeywords.length; i++) {
            sb += outputKeywords[i];
            sb += '\n';
        }
        var progress = Math.round((keywordsToDisplay.length / maxResults) * 100);
        if (progress > 100) {
            progress = 100;
        }
        $('#resultsprog').html('<div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="' + progress + '" aria-valuemin="0" aria-valuemax="100" style="width:' + progress + '%">' + keywordsToDisplay.length + ' of ' + maxResults + ' keywords</div></div>');
    }

    function FilterIfNotWorking() {
        if (doWork == false) {
            FilterAndDisplay();
        }
    }

    function post_to_url(path, params, method) {
        method = method || "post";
        var form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", path);
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var hiddenField = document.createElement("startword");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);
                form.appendChild(hiddenField);
            }
        }
        document.body.appendChild(form);
        form.submit();
    }

    function exportToCsv(filename, rows) {
        var processRow = function(row) {
            return row + '\n';
        };
        var csvFile = '';
        for (var i = 0; i < rows.length; i++) {
            csvFile += processRow(rows[i]);
        }
        var blob = new Blob([csvFile], {
            type: 'text/csv;charset=utf-8;'
        });
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
});