function AjaxServiceProxy(window, type, serverUrl) {   
    var service = {};
    service._typeName = type;
    service._serverUrl = serverUrl;
    service.parseParam = function(data, paramName, paramVal) {
        if (!window.$ && window.location.host.indexOf('localhost') > 0) { alert('人生苦短，我用jquery '); };
        if ($.isArray(paramVal)) {
            data[paramName] = JSON.stringify(paramVal);
        }
        else if ($.isFunction(paramVal)) { }
        else if (typeof paramVal === 'object') {
            $.extend(data, paramVal);
        }
        else if (typeof data[paramName] === 'undefined') {
            data[paramName] = paramVal;
        }

    }
    service.registerMethod = function(methodName, methodParams) {
        var arrParams = methodParams.split(",");
        service[methodName] = function() {
            var data = {};
            var callback = null;
            for (var i = 0; i < arrParams.length; i++) {
                service.parseParam(data, arrParams[i], arguments[i]);
            }
            if (arguments.length > 0 && $.isFunction(arguments[arguments.length - 1])) {
                callback = arguments[arguments.length - 1];
            }
            var invokeMethod = this._typeName + '.' + methodName;
            data.serverUrl = service._serverUrl;
            var sRtn = my.project.post(invokeMethod, data, callback);
            return sRtn;
        }
    }

    if (module && typeof module === 'object' && typeof module.exports === 'object') { module.exports = service; }
    if (typeof define === 'function') { define(function() { return service; }); }
    var serviceNames = type.split('.');
    window[serviceNames[serviceNames.length - 1]] = service;
    return service;
}


//兼容小平台传参调用
window.my = window.my || {};
my.project = my.project || {};
my.project.invokeMethod = function(option, callback) {
    option = option || {}
    data = option.data || option;
    var serviceInfo = option.serviceInfo;
    return my.ajax.post(serviceInfo, data, callback);

}
my.project.post = function(invokeMethod, data, callback) {
    if ($.isFunction(data)) {
        callback = data;
        data = null;
    }
    data = data || {};
    serverUrl =data.serverUrl || '/project/ajax.aspx';
    var async = callback ? true : false;
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