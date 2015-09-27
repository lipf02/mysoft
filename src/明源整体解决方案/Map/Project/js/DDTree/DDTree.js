window.my = window.my || {};
my.project = my.project || {};
my.project.showPopup = function(popup, x, y, popupWidth, popupHeight, src) {

    //获取浏览器窗口可视范围的高度和宽度
    var iWidth, iHeight;
    try {
        iWidth = top.document.documentElement.offsetWidth;
        iHeight = top.document.documentElement.offsetHeight;
    }
    catch (e) {
        iWidth = window.screen.availWidth - 10;
        iHeight = window.screen.availHeight - 60;
    }

    //获取当前点击元素所在窗口在浏览器中的位置
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
    //获取当前点击元素的位置
    pos = src.getBoundingClientRect();
    var xPos = pos.left;
    var yPos = pos.top;

    //对当前点击元素的位置进行判断,是否需要调整popup的位置
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

    // 显示 Popup 窗口
    popup.document.iLeft = frameLeft + xPos + x;
    popup.document.iTop = frameTop + yPos + y;
    //二级菜单定位
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
(function($) {




    //下拉树
    function DDTree(element, options) {
        var _this = this;
        this._oPopUp = window.createPopup();
        my.project.addCss(".ddtreeWarp{  padding:0px 0px ;display:inline-block;text-align:left; }  table.ddtree{TABLE-LAYOUT: fixed; WIDTH: 100%; BACKGROUND-COLOR: white; }"
    + " .ddtree  span.spanOut {  CURSOR: default; FONT-SIZE: 9pt; BORDER-TOP: #7b9ebd 1px solid; HEIGHT: 19px; FONT-FAMILY: 宋体, Tahoma, Verdana, Arial; BORDER-RIGHT: medium none; BORDER-BOTTOM: #7b9ebd 1px solid; PADDING-LEFT: 5px; BORDER-LEFT: #7b9ebd 1px solid; WIDTH: 100% }"
    + " .ddtree span.text{ CURSOR: hand; COLOR: blue; TEXT-DECORATION: underline } "
      + " .ddtree span.readonly{ CURSOR: hand; } "
    );

        //将树的key缓存起来，便于构造树数据时查找
        var _treeKey = this._treeKey = {};
        this._rootItems = [];
        var me = this.$element = $(element);
        me.data('_ddtree', _this);
        this.options = options;
        $.each(options.data, function() {
            var item = this;
            var code = item[options.codeField] || '';
            _treeKey[code] = item;
            _treeKey[item[options.valField]] = item;

            var parentCode = code.substr(0, code.lastIndexOf('.'));
            var parentItem = _treeKey[parentCode]
            if (parentItem) {
                parentItem.children = parentItem.children || [];
                parentItem.children.push(item);
                item.parentItem = parentItem;
            } else {
                _this._rootItems.push(item)
            }

        });

        var headerHtml = this.renderHeader();
        me.addClass("ddtreeWarp").html(headerHtml);
        if (options.value)
            this.setValue(options.value);


        //显示下拉的div


        this._expand = function(obj, ev) {
            var $li = $(obj).parents('li');
            var code = $li.prop('code');
            var item = _treeKey[code];
            obj.innerText = (item.expand) ? '[+]' : '[-]';
            if (item.expand) {
                item.expand = false;
                $li.find('ul').hide();

            } else {
                item.expand = true;
                $li.find('ul').show();
            }

            if (ev) {
                ev.cancelBubble = true
                ev.returnValue = false;
            }
            return false;


        }

        this._select = function(obj) {
            var $li = $(obj).parents('li');
            var code = $li.prop('code');

            var item = _treeKey[code];
            if (!options.selectAll && item.children) {
                return;
            }
            if (options.onchange) {
                if (options.onchange(item) === false) {
                    return;
                }
            }
            _this.setValue(code)
            this.hidePopup();

        }
        this.hidePopup = function() {
            if (this._oPopUp && this._oPopUp.hide)
                this._oPopUp.hide();
        }
        this.buildDropDownItem = function(data, arr, indent) {
            var that = this;
            if (!data || data.length == 0) return;
            var indentHtml = ''
            for (var i = 0; i < indent; i++) {
                indentHtml += '&nbsp;&nbsp;&nbsp;'
            }
            $.each(data, function() {
                var item = this;
                var highline = "color:black;";
                if (that._selItem == item) {
                    highline += "background: #CAD3E4;"
                }
                if (!options.selectAll && item.children && item.children.length > 0) {
                    highline += "color:grey;"
                }
                var text = item[that.options.textField];
                var code = item[that.options.codeField];
                arr.push('<li  code="' + code + '" title="' + text + '"  style="CURSOR: hand; height:20px;line-height:20px;">');

                arr.push('<div href="javascript:void(0)" onclick="window._dropdown._select(this)"   style="vertical-align:middle; CURSOR: hand; height:20px; ' + highline + '"><span>' + indentHtml
                 + '</span><span  class="icon"  ');
                var expandHandler = '';
                var icon = ''
                if (item.hasChilden || (item.children && item.children.length > 0)) {
                    icon = (item.expand) ? '[-]' : '[+]'
                    expandHandler = ' onclick="return window._dropdown._expand(this,event); "'
                } else if (options.icon) {

                    icon = '<img style="display:inline-block; margin-right:6px;vertical-align:middle;" src="' + options.icon + '">';
                }
                arr.push(expandHandler + '>' + icon)
                arr.push('</span><span style="display:inline-block;overflow:hidden;text-overflow:clip ;margin-top:2px;"  ');

                arr.push('>' + text + '</span></div>');
                if (item.children) {
                    var display = item.expand ? "block" : "none";
                    arr.push('<ul style="list-style: none;padding:0 0 ;margin:0 0; display:' + display + ';">')
                    _this.buildDropDownItem(item.children, arr, indent + 1);
                    arr.push('</ul>')
                }
                arr.push('</li>');

            });

        }

        me.click(function(e) {
            _this.showDropDown(e);
        });

    }

    DDTree.prototype.wrapDropdown = function(html) {
        var height = this.options.height || 300;
        var warp = '<span style="width:100%; height:' + height + 'px; border:1px solid #8F9DC0; padding:5px; overflow-y:auto; overflow-x:hidden;">';
        var endwarp = '</span>';
        return warp + html + endwarp
    }
    DDTree.prototype.renderHeader = function() {
        var html = [];
        html.push('<TABLE class="ddtree"  cellSpacing=0 cellPadding=0><COLGROUP><COL><COL width=18><TBODY><TD>');
        html.push('<SPAN class="spanOut" name="_spanOut">')
        html.push('<SPAN id="ddtree_text" ></SPAN></SPAN></TD>');
        html.push('<TD><IMG  ');
        if (!this.options.disabled) {
            html.push('onmouseover="this.src=\'/_imgs/selectOn.gif\';" onmouseout="this.src=\'/_imgs/selectOff.gif\';"')
        }
        html.push(' style="CURSOR: hand"  align=absMiddle src="/_imgs/selectOff.gif"></TD></TR></TBODY></TABLE>');
        return html.join('')
    }
    //设置选中的值,将夫元素展开
    DDTree.prototype.setValue = function(code) {
        var item = this._treeKey[code];
        var text = item[this.options.textField]
        text = '<span class="text ddt_text">' + text + '</span>'
        this._selItem = item;
        var parentItem = item.parentItem;
        while (parentItem) {
            parentItem.expand = true;

            var cls = this.options.selectAll ? 'text' : 'readonly';
            if (this.options.showFullText)
                text = '<span class="' + cls + '">' + parentItem[this.options.textField] + '</span><SPAN>－</SPAN>' + text;
            parentItem = parentItem.parentItem;

        }
        this.$element.find('#ddtree_text').html(text)
    }
    DDTree.prototype.showDropDown = function(e) {
        var arr = [];
        if (this.options.showSearch) {
            var input = '<input type="text" id="txtsearch" />';
            arr.push(input);
        }
        arr.push('<ul  style="list-style: none;padding:0 0 ;margin:0 0;font-size: 9pt; font-family: 宋体, Tahoma, Verdana, Arial; width:100%;"  >');
        this.buildDropDownItem(this._rootItems, arr, 0, true)
        arr.push('</ul>');
        var width = this.options.width || this.$element.width();
        var height = this.options.height || 300;
        // 3、生成下拉菜单
        var html = this.wrapDropdown(arr.join(''));

        this._oPopUp.document.body.innerHTML = html

        this._oPopUp.document.parentWindow._dropdown = this;
        var oTable = this.$element[0];

        showPopup(this._oPopUp, oTable.clientLeft, oTable.clientTop + this.$element.height() - 3, width, height, oTable);
    };

    //设置默认值
    DDTree.DEFAULTS = {
        data: null //数据源    
        , text: ''

            , textField: 'Name' //现在的内容
            , codeField: 'Code'//如果未设置parentCodeField ，使用此字段来获取层级
            , valField: 'Guid' //每个节点唯一的标识           
            , disabled: false //是否禁用
            , selectAll: false //只能选择末级节点
            , showFullText: true//显示完整的路径名
            , onchange: false  //选择元素后的回调函数
            , showSearch: true
    };

    //插件
    function Plugin(option) {
        return this.each(function() {
            var options = $.extend({}, DDTree.DEFAULTS, typeof option == 'object' && option)
            new DDTree(this, options);

        })
    }



    $.fn.DDTree = Plugin
    $.fn.DDTree.Constructor = DDTree


    function CompanyTree(option) {
        var options = DDTreeService.GetCompanyTreeDTO(null);
        options.icon = "/_imgs/ico_16_10.gif";
        options.showFullText = false;

        var getMenuIfr = function() {
            var win = window;
            while (true) {
                if (win.refreshByBU)
                    return win;
                var menuIfr;
                if (win.frames && win.frames['menu']) {
                    menuIfr = win.frames['menu'];
                } else {
                    menuIfr = win.parent;
                }
                if (win == menuIfr) { return null; }
                win = menuIfr;
            }
        }

        options.onchange = function(item) {
            DDTreeService.SetBU(item.Guid, item.Name, item.IsEnd);
            try {
                var menuIfr = getMenuIfr();
                if (menuIfr && menuIfr.refreshByBU) {
                    menuIfr.refreshByBU(item.Name);

                }
            }
            catch (e) { }
        }


        return this.each(function() {
            options = $.extend({}, DDTree.DEFAULTS, options, typeof option == 'object' && option)
            new DDTree(this, options);

        })
    }


    $.fn.CompanyTree = CompanyTree


    function CompanyMenuTree(option) {

        addCss(" .ddtree_span{ color:#fff;border:1px solid  #758bb1; font-weight:normal;  display:inline-block} .ddtree_span_active{border-color:#00377a;background:#64799c}  .ddtree_span_click{border-color:#00377a;background:#889DC2 }")

        var options = {};
        options.selectAll = true;
        options.icon = "/_imgs/ico_16_10.gif";
        options.showFullText = false;



        $.fn.DDTree.Constructor.prototype.renderHeader = function() {
            var html = [];
            //   html.push('<TABLE class="ddtree"  cellSpacing=0 cellPadding=0><TD>');
            html.push('<SPAN class="ddtree_span"  style=" padding:4px 5px 0px 5px;height:100%; "  >')

            html.push('<span ><img style="margin:-1px 6px 0px 8px;vertical-align:top;padding-right:2px" width="16" height="16" src="/expand/img/icon_com1.png" /></span>')
            html.push('<span id="ddtree_text" style="padding:0px 1px 0px 0px"></span>')
            html.push('<span ><img style="margin:4px 6px 0px 6px;vertical-align:top;" width="7" height="5" src="/expand/img/icon_arrow_down.png" /></span>')
            html.push('</SPAN  >')
            //    html.push('</TD></TR></TABLE>');
            return html.join('')
        };
        $.fn.DDTree.Constructor.prototype.showDropDown = function(e) {
            var arr = [];
            arr.push('<ul  style="list-style: none;padding:0 0 ;margin:0 0;font-size: 9pt; font-family: 宋体, Tahoma, Verdana, Arial; width:100%;"  >');
            this.buildDropDownItem(this._rootItems, arr, 0, true)
            arr.push('</ul>');

            var width = this.options.width || this.$element.width();
            var height = this.options.height || 300;
            // 3、生成下拉菜单

            var html = arr.join('')
            var warp = '<div style="width:100%; height:' + height + 'px; border:1px solid #00377a; padding:0px 5x 0px 0px  overflow-y:auto; overflow-x:hidden;">';
            warp += '<table cellspacing="0" cellpadding="0" style="height:100%;width:100%" ><tr><td style="background:rgb(136, 157, 194);width:26px;"></td><td style="padding-left:8px;" valign="top">'
            var endwarp = '</td></tr></table></div>';
            html = warp + html + endwarp
            this._oPopUp.document.body.innerHTML = html

            this._oPopUp.document.parentWindow._dropdown = this;
            var oTable = this.$element[0];
            //  var offset = this.$element.offset()
            showPopup(this._oPopUp, oTable.clientLeft, oTable.clientTop + this.$element.height() - 1, width, height, oTable);

        };

        options = $.extend({}, options, typeof option == 'object' && option)
        this.CompanyTree(options);
        var ddtree = $('.ddtreeWarp').data('_ddtree');
        $('.ddtreeWarp').find('.ddtree_span').click(function() {

            if (!ddtree._oPopUp.isOpen)
                $(this).removeClass('ddtree_span_active').addClass('ddtree_span_click');
        }).blur(function() {
            $(this).removeClass('ddtree_span_click').removeClass('ddtree_span_active');
        })
        .hover(function() {
            if (!ddtree._oPopUp.isOpen)
                $(this).removeClass('ddtree_span_click').addClass('ddtree_span_active');
        }, function() {
            $(this).removeClass('ddtree_span_active');
            if (ddtree._oPopUp.isOpen) {
                $(this).addClass('ddtree_span_click');
            }

        });

        //      var ddtree = $('.ddtreeWarp').data('_ddtree');
        //        $('.ddtreeWarp').find('.icMenu').on('mouseover', function() { ddtree.showDropDown(); });
    }


    $.fn.CompanyMenuTree = CompanyMenuTree
})(jQuery);

