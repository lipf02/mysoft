(function($) {
    //下拉树
    function DDTree(element, options) {
        var that = this;
        var me = that.$element = $(element);
        that.element = that.$element[0];
        me.data('_ddtree', that);
        that.options = options;
        if (!that.options.data) {
            my.project.post(that.options.serviceMethod, that.options, function(data) {
                that.options.data = data;
                that.init()
            })
        } else {
            that.init();
        }


    }

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
             , serviceMethod: 'MySoft.Project.Control.DDTreeService.GetProjectTree'
             , application: '0201'
             , treeType: 'project'
    };

    DDTree.prototype.addStyle = function() {
        var css = []
        css.push(".ddtreeWarp{  padding:0px 0px ;display:inline-block;text-align:left; }  table.ddtree{TABLE-LAYOUT: fixed; WIDTH: 100%; BACKGROUND-COLOR: white; }")
        css.push(" .ddtree  span.spanOut {  CURSOR: default; FONT-SIZE: 9pt; BORDER-TOP: #7b9ebd 1px solid; HEIGHT: 19px; FONT-FAMILY: 宋体, Tahoma, Verdana, Arial; BORDER-RIGHT: medium none; BORDER-BOTTOM: #7b9ebd 1px solid; PADDING-LEFT: 5px; BORDER-LEFT: #7b9ebd 1px solid; WIDTH: 100% }")
        css.push(" .ddtree span.text{ CURSOR: hand; COLOR: blue; TEXT-DECORATION: underline } ")
        css.push("  .ddtree span.readonly{ CURSOR: hand; } ")
        my.project.addCss(css.join(''));
    }

    DDTree.prototype.init = function() {
        var that = this;
        var me = that.$element;
        that.addStyle();
        that._rootItems = [];
        that._treeKey = {};
        $.each(that.options.data, function() {
            var item = this;
            var code = item[that.options.codeField] || '';
            that._treeKey[code] = item;
            that._treeKey[item[that.options.valField]] = item;

            var parentCode = code.substr(0, code.lastIndexOf('.'));
            var parentItem = that._treeKey[parentCode]
            if (parentItem) {
                parentItem.children = parentItem.children || [];
                parentItem.children.push(item);
                item.parentItem = parentItem;
            } else {
                that._rootItems.push(item)
            }

        });

        var headerHtml = that.renderHeader();
        me.addClass("ddtreeWarp").html(headerHtml);
        if (that.options.value)
            that.setValue(that.options.value);

        me.click(function(e) {
            that.showDropDown(e);
        });
    }

    //显示下拉的div


    DDTree.prototype._expand = function(obj, ev) {
        var $li = $(obj).parents('li');
        var code = $li.prop('code');
        var item = this._treeKey[code];
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

    DDTree.prototype._select = function(obj) {
        var $li = $(obj).parents('li');
        var code = $li.prop('code');

        var item = this._treeKey[code];
        if (!options.selectAll && item.children) {
            return;
        }
        if (this.options.onchange) {
            if (this.options.onchange(item) === false) {
                return;
            }
        }
        this.setValue(code)
        this.hidePopup();

    }

    DDTree.prototype.hidePopup = function() {
        my.project.hidePopup(this.element)

    }


    DDTree.prototype.buildDropDownItem = function(data, arr, indent) {
        var that = this;
        var options = that.options
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
                that.buildDropDownItem(item.children, arr, indent + 1);
                arr.push('</ul>')
            }
            arr.push('</li>');

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
            arr.push('<TABLE  style="TABLE-LAYOUT: fixed" cellSpacing=0 cellPadding=0 width="100%"><COLGROUP>');
            arr.push('<COL><COL width=40><TBODY><TR>');
            arr.push('<TD><input style="width:100%" type="text" value="123"  id="txtSearch" /></TD>');
            arr.push('<TD style="PADDING-LEFT: 4px"><IMG  class=lookup align=absMiddle src="/_imgs/btn_off_lookup.gif"></TD></TR></TBODY></TABLE>');
        }
        arr.push('<ul  style="list-style: none;padding:0 0 ;margin:0 0;font-size: 9pt; font-family: 宋体, Tahoma, Verdana, Arial; width:100%;"  >');
        this.buildDropDownItem(this._rootItems, arr, 0, true)
        arr.push('</ul>');
        var width = this.options.width || this.$element.width();
        var height = this.options.height || 300;
        // 3、生成下拉菜单
        var html = this.wrapDropdown(arr.join(''));
        $('#demohtml').html(html);
        var popup = my.project.showPopup(this.element, html, width, height)
        popup.document.parentWindow._dropdown = this;
    }



    //插件
    function Plugin(option) {
        return this.each(function() {
            var options = $.extend({}, DDTree.DEFAULTS, typeof option == 'object' && option)
            new DDTree(this, options);

        })
    }



    $.fn.DDTree = Plugin
    $.fn.DDTree.Constructor = DDTree


})(jQuery);



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


//$.fn.CompanyTree = CompanyTree


//function CompanyMenuTree(option) {

//    addCss(" .ddtree_span{ color:#fff;border:1px solid  #758bb1; font-weight:normal;  display:inline-block} .ddtree_span_active{border-color:#00377a;background:#64799c}  .ddtree_span_click{border-color:#00377a;background:#889DC2 }")

//    var options = {};
//    options.selectAll = true;
//    options.icon = "/_imgs/ico_16_10.gif";
//    options.showFullText = false;



//    $.fn.DDTree.Constructor.prototype.renderHeader = function() {
//        var html = [];
//        //   html.push('<TABLE class="ddtree"  cellSpacing=0 cellPadding=0><TD>');
//        html.push('<SPAN class="ddtree_span"  style=" padding:4px 5px 0px 5px;height:100%; "  >')

//        html.push('<span ><img style="margin:-1px 6px 0px 8px;vertical-align:top;padding-right:2px" width="16" height="16" src="/expand/img/icon_com1.png" /></span>')
//        html.push('<span id="ddtree_text" style="padding:0px 1px 0px 0px"></span>')
//        html.push('<span ><img style="margin:4px 6px 0px 6px;vertical-align:top;" width="7" height="5" src="/expand/img/icon_arrow_down.png" /></span>')
//        html.push('</SPAN  >')
//        //    html.push('</TD></TR></TABLE>');
//        return html.join('')
//    };
//    $.fn.DDTree.Constructor.prototype.showDropDown = function(e) {
//        var arr = [];
//        arr.push('<ul  style="list-style: none;padding:0 0 ;margin:0 0;font-size: 9pt; font-family: 宋体, Tahoma, Verdana, Arial; width:100%;"  >');
//        this.buildDropDownItem(this._rootItems, arr, 0, true)
//        arr.push('</ul>');

//        var width = this.options.width || this.$element.width();
//        var height = this.options.height || 300;
//        // 3、生成下拉菜单

//        var html = arr.join('')
//        var warp = '<div style="width:100%; height:' + height + 'px; border:1px solid #00377a; padding:0px 5x 0px 0px  overflow-y:auto; overflow-x:hidden;">';
//        warp += '<table cellspacing="0" cellpadding="0" style="height:100%;width:100%" ><tr><td style="background:rgb(136, 157, 194);width:26px;"></td><td style="padding-left:8px;" valign="top">'
//        var endwarp = '</td></tr></table></div>';
//        html = warp + html + endwarp
//        this._oPopUp.document.body.innerHTML = html

//        this._oPopUp.document.parentWindow._dropdown = this;
//        var oTable = this.$element[0];
//        //  var offset = this.$element.offset()
//        showPopup(this._oPopUp, oTable.clientLeft, oTable.clientTop + this.$element.height() - 1, width, height, oTable);

//    };

//    options = $.extend({}, options, typeof option == 'object' && option)
//    this.CompanyTree(options);
//    var ddtree = $('.ddtreeWarp').data('_ddtree');
//    $('.ddtreeWarp').find('.ddtree_span').click(function() {

//        if (!ddtree._oPopUp.isOpen)
//            $(this).removeClass('ddtree_span_active').addClass('ddtree_span_click');
//    }).blur(function() {
//        $(this).removeClass('ddtree_span_click').removeClass('ddtree_span_active');
//    })
//        .hover(function() {
//            if (!ddtree._oPopUp.isOpen)
//                $(this).removeClass('ddtree_span_click').addClass('ddtree_span_active');
//        }, function() {
//            $(this).removeClass('ddtree_span_active');
//            if (ddtree._oPopUp.isOpen) {
//                $(this).addClass('ddtree_span_click');
//            }

//        });

//    //      var ddtree = $('.ddtreeWarp').data('_ddtree');
//    //        $('.ddtreeWarp').find('.icMenu').on('mouseover', function() { ddtree.showDropDown(); });
//}


//$.fn.CompanyMenuTree = CompanyMenuTree

