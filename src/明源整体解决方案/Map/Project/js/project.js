//����Сƽ̨���ε���
window.my = window.my || {};
my.project = my.project || {};

my.project.invoke = function(method, option, callback) {

    var invokeMethod = method;
    var data = option;
    if (typeof invokeMethod !== "string") {
        invokeMethod = method.serviceInfo;
        data = method.data || method
        callback = option;
    } else if ($.isFunction(option)) {
        callback = option;
        data = {}   
    }


    serverUrl = data.serverUrl || '/project/ajax.aspx';
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
                alert('������������ϵϵͳ����Ա��');
            return;

        }
        if (callback) {
            returnValue = callback(json.result);
        }
        returnValue = json.result;
    }
    $.ajax({ url: serverUrl + '?invokeMethod=' + invokeMethod, contentType: 'application/x-www-form-urlencoded; charset=UTF-8', data: { postdata: JSON.stringify(data) }, async: async, type: 'POST', cache: false, dataType: 'json' }).done(ajaxdone);
    return returnValue;

};


my.project.showPopup = function(src, html, popupWidth, popupHeight, x, y) {
    var x = x || src.clientLeft;
    var y = y || src.clientTop + $(src).height()
    src._oPopUp = src._oPopUp || window.createPopup();
    var popup = src._oPopUp;
    popup.document.body.innerHTML = html
    //��ȡ��������ڿ��ӷ�Χ�ĸ߶ȺͿ��
    var iWidth, iHeight;
    try {
        iWidth = top.document.documentElement.offsetWidth;
        iHeight = top.document.documentElement.offsetHeight;
    }
    catch (e) {
        iWidth = window.screen.availWidth - 10;
        iHeight = window.screen.availHeight - 60;
    }

    //��ȡ��ǰ���Ԫ�����ڴ�����������е�λ��
    var frameLeft = 0;
    var frameTop = 0;
    var oWin = window;
    var pos;
    try {
        while (oWin.frameElement != null) {
            pos = oWin.frameElement.getBoundingClientRect();
            frameLeft += pos.left;
            frameTop += pos.top;

            oWin = oWin.parent;
        }
    }
    catch (e) { }
    //��ȡ��ǰ���Ԫ�ص�λ��
    pos = src.getBoundingClientRect();
    var xPos = pos.left;
    var yPos = pos.top;

    //�Ե�ǰ���Ԫ�ص�λ�ý����ж�,�Ƿ���Ҫ����popup��λ��
    if (frameLeft + xPos + x + popupWidth > iWidth) {
        x = iWidth - frameLeft - xPos - popupWidth;
    }
    if (frameLeft + xPos + x < 0) {
        x = 0 - frameLeft - xPos;
    }

    if (frameTop + yPos + y + popupHeight > iHeight) {
        y = iHeight - frameTop - yPos - popupHeight;
    }
    if (frameTop + yPos + y < 0) {
        y = 0 - frameTop - yPos;
    }

    // ��ʾ Popup ����
    popup.document.iLeft = frameLeft + xPos + x;
    popup.document.iTop = frameTop + yPos + y;
    //�����˵���λ
    if (src.ownerDocument.iLeft) {
        xPos = src.ownerDocument.iLeft;
        yPos = yPos + src.ownerDocument.iTop;
        if (frameLeft + xPos + x + popupWidth > iWidth) {
            x = 0 - popupWidth;
        }
        if (frameTop + yPos + y + popupHeight > iHeight) {
            y = yPos - popupHeight;
        }
        if (frameTop + yPos + y < 0) {
            y = 0;
        }
    }

    popup.show(x, y, popupWidth, popupHeight, src);
    setTimeout(function() { popup.document.focus() }, 0);

    return popup;

}
my.project.hidePopup = function(ele) {
    if (ele._oPopUp && ele._oPopUp.hide)
        ele._oPopUp.hide();
}

my.project.addCss = function(styleText) {
    style = document.createElement('style');
    style.setAttribute("type", "text/css");
    if (style.styleSheet)
        style.styleSheet.cssText = styleText;
    else
        style.appendChild(document.createTextNode(styleText));
    document.getElementsByTagName('head')[0].appendChild(style);
}