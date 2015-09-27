//兼容小平台传参调用
window.my = window.my || {};
my.project = my.project || {};
my.project.invokeMethod = function(option) {
    option = option || {}
    data = option.data || option;
    var serviceInfo = option.serviceInfo;
    return my.ajax.post(serviceInfo, data, option.serverUrl);

}
my.project.post = function(invokeMethod, data, serverUrl) {
    data = data || {};
    serverUrl = serverUrl || '/project/ajax.aspx';
    var async = data.callback ? true : false;
    var returnValue;
    var ajaxdone = function(json) {
        if (json.__error__) {
            var parentWin = window.parent;
            while (parentWin && parentWin != window) {
                parentWin.__error__ = json.__error__;
                parentWin = parentWin.parent;
            }
            parentWin.__error__ = json.__error__;
            if (window.debug || window.location.host.indexOf('localhost') > -1)
                alert(json.__error__);
            else
                alert('操作出错，请联系系统管理员！');
            return;

        }
        if (data.callback) {
            returnValue = data.callback(json.result);
        }
        returnValue = json.result;
    }
    $.ajax({ url: serverUrl + '?invokeMethod=' + invokeMethod, contentType: 'application/x-www-form-urlencoded; charset=UTF-8', data: data, async: async, type: 'POST', cache: false, dataType: 'json' }).done(ajaxdone);
    return returnValue;

};