(function($) {
    function CompanyMenuTree(option) {
        var css = []
        css.push("  .ddtree_span{ color:#fff;border:1px solid  #758bb1; font-weight:normal;  display:inline-block} ")
        css.push("  .ddtree_span_active{border-color:#00377a;background:#64799c} ")
        css.push("  .ddtree_span_click{border-color:#00377a;background:#889DC2 } ")
        css.push("   table.stdTable{ margin:0px; padding:0px;  }");
        css.push("  nobr.mnuTitle{ height:100%; } .mnuTitle  span{ height:100%;  padding-top:4px;}")
        css.push(" .mnuTitle   a{ height:100%; padding-top:4px; } .mnuTitle span.ddtreeWarp  { height:100%; padding-top:0px;}");
        css.push(" .mnuTitle .ddtreeWarp  span{ height:100%; padding-top:0px; } #spnCompany { margin-right:10px;}")
        my.project.addCss(css.join(''));
        var options = {};
        options.icon = "/_imgs/ico_16_10.gif";
        options.showFullText = false;


        var lblCurCompany = $('#lblCurCompany').hide();
        lblCurCompany.prev().hide();
        var table = $(lblCurCompany.parents('table')[0]);
        table.prop('cellpadding', '0');
        table.prop('cellspacing', '0');


        var span = $('<span id="spnCompany"></span>')

        lblCurCompany.parent().prepend(span);

        $.fn.DDTree.Constructor.prototype.renderHeader = function() {
            var html = [];
            //   html.push('<TABLE class="ddtree"  cellSpacing=0 cellPadding=0><TD>');
            html.push('<SPAN class="ddtree_span "  style=" padding:4px 5px 0px 5px;height:100%; "  >')

            html.push('<span ><img style="margin:-1px 6px 0px 8px;vertical-align:top;padding-right:2px" width="16" height="16" src="/Project/js/DDTree/img/ico_16_10.gif" /></span>')
            html.push('<span id="ddtree_text" style="padding:0px 1px 0px 0px"></span>')
            html.push('<span ><img style="margin:4px 6px 0px 6px;vertical-align:top;" width="7" height="5" src="/Project/js/DDTree/img/icon_arrow_down.png" /></span>')
            html.push('</SPAN  >')
            //    html.push('</TD></TR></TABLE>');
            return html.join('')
        };
        $.fn.DDTree.Constructor.prototype.showPopup = function(html) {
            var width = this.options.width || this.$element.width();
            var height = this.options.height;
            return my.project.showPopup(this.$element[0], html, width + 160, height, -160)
        }
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



        var defaults = { treeType: 2, selectType: 0, showType: 0, showSearch: false, autoSwitchCompany: true, showSearch: false,height:400 }
        options = $.extend(defaults, options, typeof option == 'object' && option)
        options.onchange = function(item) {
            $('.ddtreeWarp').find('.ddtree_span').removeClass('ddtree_span_click').removeClass('ddtree_span_active');
            try {
                var menuIfr = getMenuIfr();
                if (menuIfr && menuIfr.refreshByBU) {
                    menuIfr.refreshByBU(item.name);

                }
            }
            catch (e) { }
        }

        options.nodeBgColor = { "0": "#FFFFFF", "1": "#FFFFFF", "2": "#FFFFFF", "3": "#FFFFFF" };
        span.DDTree(options)
        var ddtree = $('.ddtreeWarp').data('_ddtree');
        $('.ddtreeWarp').find('.ddtree_span').click(function() {
            if (!ddtree._popup.isOpen)
                $(this).removeClass('ddtree_span_active').addClass('ddtree_span_click');
        }).blur(function() {
            $(this).removeClass('ddtree_span_click').removeClass('ddtree_span_active');
        })
        .hover(function() {
            if (!ddtree._popup.isOpen)
                $(this).removeClass('ddtree_span_click').addClass('ddtree_span_active');
        }, function() {
            $(this).removeClass('ddtree_span_active');
            if (ddtree._popup.isOpen) {
                $(this).addClass('ddtree_span_click');
            }

        });


        //      var ddtree = $('.ddtreeWarp').data('_ddtree');
        //        $('.ddtreeWarp').find('.icMenu').on('mouseover', function() { ddtree.showDropDown(); });
    }


    $.fn.CompanyMenuTree = CompanyMenuTree
})(jQuery);

