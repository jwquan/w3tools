/*$(".btn-primary:first").click(function(){
    if ($('.copy_text').val() != '') {
    
    _ServiceBase.JsonPostClient({
      showLoading: true,
    });
  }
});*/

function ShowLoading() {
    var parentdiv = $("body");
    $(".loadingdiv", parentdiv[0]).remove();
    parentdiv.append('<div class="loadingdiv" style="background-color: rgba(255, 255, 255, 0.4);position: fixed;top:0;left:0;height:100%;width: 100%;text-align:center;"><img src="' + base_url + 'assets/frontend/images/loading.gif" width="100px"/></div>');
    $(".loadingdiv").each(function () {
        $(this).css("padding-top", (($(this).height() / 2) - 50) + "px");
    });
}

function HideLoading() {
    var parentdiv = $("body");
    $(".loadingdiv", parentdiv[0]).remove();
}