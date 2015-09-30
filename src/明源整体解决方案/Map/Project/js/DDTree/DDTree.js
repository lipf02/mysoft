(function($) {
    //下拉树
    function DDTree(element, options) {
        var that = this;
        var me = that.$element = $(element);
        that.element = that.$element[0];
        me.data('_ddtree', that);
        that.options = options;
        if (!that.options.data) {
            my.project.invoke(that.options.serviceMethod, that.options, function(data) {
                that.options.data = data.data;
                that.options.value = data.value;
                that.init()
            })
        } else {
            that.init();
        }


    }

    var NodeType = { None: -1, Group: 0, Company: 1, EndCompany: 2, Dept: 3, Team: 4, ProjectTeam: 5, Project: 6, EndProject: 7 }
    var nodeBgColor = ["#E6E6E6", "#DDDDDD", "#F7EDEA", "#ECF1FF", "#EEFFFF", "#EEFFFF", "#EEFFFF", "#EEFFFF", "#EEFFFF", "#EEFFFF"]
    var sqlFields = { "0": "bucode", "1": "bucode", "2": "bucode", "3": "JbDeptCode ", "4": "JbDeptCode ", "5": "JbDeptCode ", "6": "ProjectCode", "7": "ProjectCode" }
    //设置默认值
    DDTree.DEFAULTS = {
        data: null //数据源    
        , text: ''
            , showFullText: true//显示完整的路径名
            , onchange: false  //选择元素后的回调函数
            , showSearch: true
             , serviceMethod: 'MySoft.Project.Control.DDTreeService.GetDDTreeData'
             , treeType: NodeType.EndProject //数据加载类型
             , selectType: NodeType.EndProject //可以选择的类型
             , showType: NodeType.None //默认展开类型，-1不展开
             , showGroup: true  //是否显示集团
             , showCompany: true //是否显示区域公司
             , ApplySys: '0201'
             , afterSetValue: function(item) {
                 if (!item) return;
                 var data = { code: item.code, id: item.id, type: item.type, name: item.name };
                 var error = my.project.invoke('MySoft.Project.Control.DDTreeService.SetValue', data);
                 if (error) alert(error);
             }
             , NodeType: { None: -1, Group: 0, Company: 1, EndCompany: 2, Dept: 3, Team: 4, ProjectTeam: 5, Project: 6, EndProject: 7 }


    };

    DDTree.prototype.addStyle = function() {
        var css = []
        css.push(".ddtreeWarp{  padding:0px 0px ;display:inline-block;text-align:left; }  table.ddtree{TABLE-LAYOUT: fixed; WIDTH: 100%; BACKGROUND-COLOR: white; }")
        css.push(" .ddtree  span.spanOut {  CURSOR: default;  BORDER: #7b9ebd 1px solid; HEIGHT: 19px;FONT-SIZE: 9pt; FONT-FAMILY: 宋体, Tahoma, Verdana, Arial; BORDER-RIGHT: medium none; PADDING-LEFT: 5px; PADDING-top: 1px;  WIDTH: 100% }")
        css.push(" .ddtree span.text{ CURSOR: hand; COLOR: blue; TEXT-DECORATION: underline } ")
        css.push("  .ddtree span.readonly{ CURSOR: hand; } ")
        my.project.addCss(css.join(''));
    }

    DDTree.prototype.init = function() {

        var that = this;
        if (that.options.selectType > that.options.treeType && window.location.host.indexOf('localhost') > 0) {
            alert("注意了，配置的selectType大于treeType将无法选取任何数据");
        }
        var me = that.$element;
        that.addStyle();
        that._rootItems = [];
        that._treeKey = {};
        NodeType = that.options.NodeType
        $.each(that.options.data, function() {
            var item = this;
            var code = item.code;
            if (!that.options.showGroup && item.type == NodeType.Group)
                return;

            if (!that.options.showCompany && item.type == NodeType.Company)
                return;
            that._treeKey[code] = item;
            that._treeKey[item.id] = item;
            item.expand = that.options.showType >= item.type;
            var parentCode = code.substr(0, code.lastIndexOf('.'));
            var parentItem = that._treeKey[parentCode];
            while (parentItem == null) {
                var lastIndex = parentCode.lastIndexOf('.');
                if (lastIndex < 0)
                    break;
                parentCode = parentCode.substr(0, lastIndex);
                parentItem = that._treeKey[parentCode];

            }
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

        //添加appfind支持
        for (var i = 0; i < 20; i++) {
            _oCtl = document.getElementById("#appQueryCtl" + i.toString());
            if (!_oCtl) {
                this._oCtl = $('<input type="hidden" id="appQueryCtl' + i + '" />');
                me.append(this._oCtl);

                break;
            }
        }

        if (that.options.value)
            that.setValue(that.options.value);

        me.click(function(e) {
            that.showDropDown(e);
        });
        me.find('#ddtree_text').on('click', '.text', function() {
            var span = $(this);
            var code = span.prop('code');

            that.setValue(code);
            return false;
        })

    }

    //显示下拉的div


    DDTree.prototype._expand = function(obj, ev) {
        var $li = $(obj).parents('li:eq(0)');
        var code = $li.prop('code');
        var item = this._treeKey[code];
        obj.innerText = (item.expand) ? '[+]' : '[-]';
        if (item.expand) {
            item.expand = false;
            $li.find('ul:eq(0)').hide();

        } else {
            item.expand = true;
            $li.find('ul:eq(0)').show();
        }

        if (ev) {
            ev.cancelBubble = true
            ev.returnValue = false;
        }
        return false;

    }
    DDTree.prototype._search = function(obj) {
        var that = this;
        var $tr = $(obj).parents('tr');
        var searchText = $tr.find('#txtSearch').val();
        that._searchHit = {}
        that._searchShow = {};
        var data = that.options.data
        if (!data || data.length == 0) return;
        for (var i = data.length - 1; i >= 0; i--) {
            var item = data[i];
            if (item.name.indexOf(searchText) > -1) {

                that._searchHit[item.code] = true;
                that._searchShow[item.code] = true;
                var parentItem = item.parentItem;
                while (parentItem) {
                    that._searchShow[parentItem.code] = true;

                    parentItem = parentItem.parentItem;
                }
            }
        }
        var arr = [];
        var html = [];
        if (searchText) {
            that._addColorReg = new RegExp(searchText, "gm");
            that._searchReplace = '<b style="color:red">' + searchText + '</b>';
            this.buildSearchDropDownItem(this._rootItems, arr, 0)
            html = arr.join('')

        } else {
            this.buildDropDownItem(this._rootItems, arr, 0)
            html = arr.join('')

        }
        if (that._popup) {
            var treeUL = that._popup.document.parentWindow.document.getElementById('treeUL');

            treeUL.innerHTML = html;
        }

    }

    DDTree.prototype.buildSearchDropDownItem = function(data, arr, indent) {
        var that = this;
        var options = that.options
        if (!data || data.length == 0) return;
        var indentHtml = ''
        for (var i = 0; i < indent; i++) {
            indentHtml += '&nbsp;&nbsp;&nbsp;'
        }
        $.each(data, function() {
            var item = this;
            if (!that._searchShow[item.code]) return;
            var canSelect = item.type >= options.selectType;
            var selectEvent = 'onclick="_dropdown._select(this)""';
            var highline = ";color:black;";
            if (that._selItem == item) {
                highline += ";background: #CAD3E4;"
            } else
                highline += ";background: " + nodeBgColor[item.type]
            if (!canSelect) {
                highline += ";color:grey;"
                selectEvent = ""
            }
            // '" title="' + item.name +
            arr.push('<li  code="' + item.code + '"  style="CURSOR: hand; height:20px;line-height:20px; margin-bottom:1px;">');

            arr.push('<div href="javascript:void(0)" ' + selectEvent + ' style="vertical-align:middle; CURSOR: hand; height:20px; ' + highline + '"><span>' + indentHtml
                 + '</span><span  class="icon"  ');
            var expandHandler = '';
            var icon = ''
            if (item.hasChilden || (item.children && item.children.length > 0)) {
                icon = (that._searchShow[item.code] || item.expand) ? '[-]' : '[+]'
                expandHandler = ' onclick="return _dropdown._expand(this,event); "'
            } else if (options.icon) {

                icon = '<img style="display:inline-block; margin-right:6px;vertical-align:middle;" src="' + options.icon + '">';
            }
            arr.push(expandHandler + '>' + icon)
            arr.push('</span><span style="display:inline-block;overflow:hidden;text-overflow:clip ;margin-top:2px;"  ');

            var name = item.name;
            if (that._searchHit[item.code]) {
                name = name.replace(that._addColorReg, that._searchReplace);
            }
            arr.push('>' + name + '</span></div>');


            if (item.children) {
                var display = (that._searchShow[item.code] || item.expand) ? "block" : "none";
                arr.push('<ul style="list-style: none;padding:0 0 ;margin:1px 0px 0px 0px; display:' + display + ';">')
                if (that._searchHit[item.code]) {
                    that.buildDropDownItem(item.children, arr, indent + 1);

                } else {
                    var showItems = [];
                    for (var j = 0; j < item.children.length; j++) {
                        var showitem = item.children[j];
                        if (that._searchShow[showitem.code])
                            showItems.push(showitem);
                    }
                    that.buildSearchDropDownItem(showItems, arr, indent + 1);
                }
                arr.push('</ul>')
            }
            arr.push('</li>');

        });

    }

    //ie popup有bug，无法输入字符字母
    DDTree.prototype._input = function(o, keyCode) {
        var that = this;

        //只能输入大小字母和数字
        var c = keyCode;
        if (c == 8) { //Back 
            o.value = o.value.slice(0, -1);
        } else if (c == 46) { //Del 
            o.value = o.value.slice(1);
        } else if (c < 255) {

            o.value += String.fromCharCode(c);
        }
        //防止输入过快，重复的执行渲染方法
        if (that.timer) {
            clearTimeout(that.timer);
            that.timer = null;
        }
        this._isSearch = true;
        this._lastSearchText = o.value;
        that.timer = setTimeout(function() { that._search(o) }, 300);

    }

    DDTree.prototype._select = function(obj) {
        var $li = $(obj).parents('li');
        var code = $li.prop('code');
        options = this.options;
        var item = this._treeKey[code];
        if (!item) return;
        if (this.options.selectType > item.type) return;
        if (this.options.onchange) {
            if (this.options.onchange(item) === false) {
                return;
            }
        }
        this.setValue(code)
        this.hidePopup();

    }

    DDTree.prototype.hidePopup = function() {
        if (this._txtSearch) {
            this._txtSearch.value = '';
            this._lastSearchText = '';
        }
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
            var highline = ";color:black;";
            var canSelect = item.type >= options.selectType;
            var selectEvent = 'onclick="_dropdown._select(this)""';
            if (that._selItem == item) {
                highline += ";background: #CAD3E4;"
            }
            else
                highline += ";background: " + nodeBgColor[item.type]

            if (!canSelect) {
                highline += ";color:grey;"
                selectEvent = ""
            }
            // '" title="' + item.name +
            arr.push('<li  code="' + item.code + '"  style="CURSOR: hand; height:20px;line-height:20px; margin-bottom:1px;">');

            arr.push('<div href="javascript:void(0)" ' + selectEvent + ' style="vertical-align:middle; CURSOR: hand; height:20px; ' + highline + '"><span>' + indentHtml
                 + '</span><span  class="icon"  ');
            var expandHandler = '';

            var icon = ''
            if (item.hasChilden || (item.children && item.children.length > 0)) {
                icon = (that._searchShow[item.code] || item.expand) ? '[-]' : '[+]'
                expandHandler = ' onclick="return _dropdown._expand(this,event); "'
            } else if (options.icon) {

                icon = '<img style="display:inline-block; margin-right:6px;vertical-align:middle;" src="' + options.icon + '">';
            }
            arr.push(expandHandler + '>' + icon)
            arr.push('</span><span style="display:inline-block;overflow:hidden;text-overflow:clip ;margin-top:2px;"  ');

            var name = item.name;
            if (that._searchHit[item.code]) {
                name = name.replace(that._addColorReg, that._searchReplace);
            }
            arr.push('>' + name + '</span></div>');

            if (item.children) {
                var display = (that._searchShow[item.code] || item.expand) ? "block" : "none";
                arr.push('<ul style="list-style: none;padding:0 0 ;margin:0 0; display:' + display + ';">')
                that.buildDropDownItem(item.children, arr, indent + 1);
                arr.push('</ul>')
            }
            arr.push('</li>');

        });

    }


    DDTree.prototype.wrapDropdown = function(html) {
        var height = this.options.height || 300;
        var warp = '<span style="width:100%; height:' + height + 'px; border:1px solid #8F9DC0; padding:1px; overflow-y:auto; overflow-x:hidden;">';
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
        if (!item) return;
        if (this.options.selectType > item.type) return;
        text = '<span class="text ddt_text">' + item.name + '</span>'
        this._selItem = item;
        var parentItem = item.parentItem;
        while (parentItem) {
            parentItem.expand = true;
            var cls = this.options.selectType <= parentItem.type ? 'text' : 'readonly';

            if (this.options.showFullText)
                text = '<span class="' + cls + '" code="' + parentItem.code + '">' + parentItem.name + '</span><SPAN>－</SPAN>' + text;
            parentItem = parentItem.parentItem;
        }
        this.$element.find('#ddtree_text').html(text);
        var field = sqlFields[item.type];
        var queryxml = "<filter><condition attribute=\"replace\" operator=\"replace\" value=\"(" + field + "='" + item.code + "' or " + field + " like '" + item.code + ".%') \"/></filter>";
        this._oCtl.prop('queryxml', queryxml)
        this.options.afterSetValue && this.options.afterSetValue(item);
    }

    DDTree.prototype.showDropDown = function(e) {

        var that = this;
        that._searchHit = {}
        that._searchShow = {};
        var arr = [];
        if (this.options.showSearch) {
            arr.push('<TABLE  style="TABLE-LAYOUT: fixed" cellSpacing=0 cellPadding=0 width="100%">');
            arr.push('<TR><TD>');
            arr.push('<input style="width:100%" type="text" value  id="txtSearch" onkeypress="_dropdown._input(this,event.keyCode)" />');
            arr.push('</TD></TR></TBODY></TABLE>');
        }
        arr.push('<ul id="treeUL"  style="list-style: none;padding:0 0 ;margin:0 0;font-size: 9pt; font-family: 宋体, Tahoma, Verdana, Arial; width:100%;"  >');
        this.buildDropDownItem(this._rootItems, arr, 0, true)
        arr.push('</ul>');
        var width = this.options.width || this.$element.width();
        var height = this.options.height || 300;
        // 3、生成下拉菜单
        var html = this.wrapDropdown(arr.join(''));

        var popup = my.project.showPopup(this.element, html, width, height)
        this._popup = popup
        popup.document.parentWindow._dropdown = this;

        var txtSearch = popup.document.parentWindow.document.getElementById('txtSearch');
        if (txtSearch) {
            that._txtSearch = txtSearch;
            that._txtSearch.value = ''
            that._lastSearchText = '';
            //popbug，无法获取中文输入
            setInterval(function() {
                if (that._txtSearch.value && that._txtSearch.value != that._lastSearchText) {
                    that._lastSearchText = txtSearch.value;
                    that._search(txtSearch);
                }
            }, 100)

        }
        this._isSearch = false;
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

