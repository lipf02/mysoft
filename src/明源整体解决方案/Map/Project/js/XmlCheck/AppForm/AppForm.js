document.write("<script language=javascript src='/Project/Js/XmlCheck/AppForm/Common.js'></script>");
document.write("<script language=javascript src='/Project/Js/XmlCheck/AppForm/Tab.js'></script>");
document.write("<script language=javascript src='/Project/Js/XmlCheck/AppForm/Section.js'></script>");
document.write("<script language=javascript src='/Project/Js/XmlCheck/AppForm/Hidden.js'></script>");
document.write("<script language=javascript src='/Project/Js/XmlCheck/AppForm/Text.js'></script>");
document.write("<script language=javascript src='/Project/Js/XmlCheck/AppForm/Memo.js'></script>");
document.write("<script language=javascript src='/Project/Js/XmlCheck/AppForm/Password.js'></script>");
document.write("<script language=javascript src='/Project/Js/XmlCheck/AppForm/Number.js'></script>");
document.write("<script language=javascript src='/Project/Js/XmlCheck/AppForm/Datetime.js'></script>");
document.write("<script language=javascript src='/Project/Js/XmlCheck/AppForm/Radio.js'></script>");
document.write("<script language=javascript src='/Project/Js/XmlCheck/AppForm/Select.js'></script>");
document.write("<script language=javascript src='/Project/Js/XmlCheck/AppForm/Lookup.js'></script>");
document.write("<script language=javascript src='/Project/Js/XmlCheck/AppForm/Hyperlink.js'></script>");
document.write("<script language=javascript src='/Project/Js/XmlCheck/AppForm/Blank.js'></script>");
var TabList = [];

function ToHtml() {
    $("#tabs").html("");
    for (var n = 0; n < TabList.length; n++) {
        $("#tabs").append(TabList[n].ToHtml());
    }
    BindEvent();
}

function ToXml() {
    var Textxml = "<control><datasource><sql><![CDATA[]]></sql></datasource><form></form></control>";
    var xmlDoc = loadXML(Textxml);
    xmlDoc.getElementsByTagName("control")[0].setAttribute("id", $("#txtControlId").val().trim());
    var datasource = xmlDoc.getElementsByTagName("datasource")[0];
    datasource.setAttribute("entity", $("#txtentity").val().trim())
    datasource.setAttribute("keyname", $("#txtkeyname").val().trim());
    var sqlXml = $("#txtSql").val().replace(/\n/g, "\n                  ");
    xmlDoc.getElementsByTagName("sql")[0].childNodes[0].text = sqlXml;
    var form = xmlDoc.getElementsByTagName("form")[0];
    var sshowtab = $("#sshowtab").val();
    if (sshowtab == null || sshowtab == undefined) {
        sshowtab = "";
    }
    form.setAttribute("showtab", sshowtab.trim());
    for (var n = 0; n < TabList.length; n++) {
        var childNodes = this.TabList[n].ToXml().childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            form.appendChild(childNodes[i]);
        }
    }
    xml = xmlDoc.xml;
    xml = AppForm.FormatXML(xml).value;
    document.getElementById("txml").value = xml;
}

function ChangeTo(tpe, self) {
    $(".content").css("display", "none");
    $("#" + tpe).css("display", "");
    $(".tabContent span").attr("class", "tab");
    $(self).attr("class", "tabOn");
    if (tpe == "Xml") {
        ToXml();
    }
}

function BindEvent() {
    $('.items').contextMenu('ItemMenu', {
        bindings: {
            'hidden': function (t) {
                DefaultHidden(t.getAttribute("tabIndex"), t.getAttribute("sectionIndex"));
                ToHtml();
            },
            'text': function (t) {
                DefaultText(t.getAttribute("tabIndex"), t.getAttribute("sectionIndex"));
                ToHtml();
            },
            'memo': function (t) {
                DefaultMemo(t.getAttribute("tabIndex"), t.getAttribute("sectionIndex"));
                ToHtml();
            },
            'password': function (t) {
                DefaultPassword(t.getAttribute("tabIndex"), t.getAttribute("sectionIndex"));
                ToHtml();
            },
            'number': function (t) {
                DefaultNumber(t.getAttribute("tabIndex"), t.getAttribute("sectionIndex"));
                ToHtml();
            },
            'datetime': function (t) {
                DefaultDatetime(t.getAttribute("tabIndex"), t.getAttribute("sectionIndex"));
                ToHtml();
            },
            'radio': function (t) {
                DefaultRadio(t.getAttribute("tabIndex"), t.getAttribute("sectionIndex"));
                ToHtml();
            },
            'select': function (t) {
                DefaultSelect(t.getAttribute("tabIndex"), t.getAttribute("sectionIndex"));
                ToHtml();
            },
            'lookup': function (t) {
                DefaultLookup(t.getAttribute("tabIndex"), t.getAttribute("sectionIndex"));
                ToHtml();
            },
            'hyperlink': function (t) {
                DefaultHyperlink(t.getAttribute("tabIndex"), t.getAttribute("sectionIndex"));
                ToHtml();
            },
            'blank': function (t) {
                DefaultBlank(t.getAttribute("tabIndex"), t.getAttribute("sectionIndex"));
                ToHtml();
            }
        }
    });
    /*JQuery 限制文本框只能输入数字*/
    $(".number").change(function () {
        $(this).val($(this).val().replace(/\D|^0/g, ''));
        this.onchange();
    }).css("ime-mode", "disabled");

    /*JQuery 限制文本框只能输入数字和小数点*/
    $(".decimal").change(function () {
        $(this).val($(this).val().replace(/[^0-9.]/g, ''));
        this.onchange();
    }).css("ime-mode", "disabled");

    $(".pthree").mouseover(function () {
        $(this).css("background", "#2981A9");
        $(this).css("color", "#fff");
    }).mouseout(function () {
        $(this).css("background", "#fff");
        $(this).css("color", "#000");
    });
}

$(function () {
    var tab = new Tab("");
    DefaultSection(tab.index);
    ToHtml();
});

function ToEntity(self) {
    var xml = self.value;
    var xmlDoc = loadXML(xml);
    if (xmlDoc != null) {
        var controls = xmlDoc.getElementsByTagName("control");
        if (controls.length > 0) {
            $("#txtControlId").val(controls[0].getAttribute("id"));
            var datasource = controls[0].getElementsByTagName('datasource');
            if (datasource.length > 0) {
                $("#txtentity").val(datasource[0].getAttribute("entity"));
                $("#txtkeyname").val(datasource[0].getAttribute("keyname"));
                var sqlxml = datasource[0].getElementsByTagName("sql");
                if (sqlxml.length > 0) {
                    var sql = "";
                    var sqlStr = "";
                    if (sqlxml[0].childNodes.length > 0) {
                        for (var n = 0 ; n < sqlxml[0].childNodes.length; n++) {
                            if (sqlxml[0].childNodes[n].nodeType != 3) {
                                sql = sqlxml[0].childNodes[n].nodeValue.replace("[CDATA[", "").replace("]]", "");
                                break;
                            }
                        }
                    }
                    if (sql == "") {
                        sql = $(sqlxml[0]).text().trim();
                    }
                    var sqlStrs = sql.split("\n");
                    for (var n = 0; n < sqlStrs.length; n++) {
                        if (sqlStr != "") {
                            sqlStr = sqlStr + "\n";
                        }
                        sqlStr = sqlStr + sqlStrs[n].trim();
                    }
                    $("#txtSql").val(sqlStr);
                }
            }
            var form = controls[0].getElementsByTagName('form');
            if (form.length > 0) {
                $("#sshowtab").val(form[0].getAttribute("showtab"));
                //tabs
                TabList = [];
                var tabs = form[0].getElementsByTagName("tab");
                if (tabs != null && tabs.length > 0) {
                    for (var n = 0; n < tabs.length; n++) {
                        var tab = new Tab(tabs[n].getAttribute("title"));
                        var sections = tabs[n].getElementsByTagName("section");
                        if (sections != null && sections.length > 0) {
                            for (var m = 0; m < sections.length; m++) {
                                var section = new Section(sections[m].getAttribute("title"),
                                                          sections[m].getAttribute("showtitle") == "true" ? "true" : "false",
                                                          sections[m].getAttribute("showbar") == "true" ? "true" : "false",
                                                          sections[m].getAttribute("cols") == null ? "1" : sections[m].getAttribute("cols").replace(/\D|^0/g, ''),
                                                          sections[m].getAttribute("titlewidth") == null ? "" : sections[m].getAttribute("titlewidth").replace(/\D|^0/g, ''),
                                                          sections[m].getAttribute("secid"), tab.index);
                                var items = sections[m].getElementsByTagName("item");
                                for (var i = 0 ; i < items.length; i++) {
                                    var itemType = items[i].getAttribute("type");
                                    switch (itemType) {
                                        case "hidden":
                                            HiddenXml(items[i], section, tab);
                                            break;
                                        case "text":
                                            TextXml(items[i], section, tab);
                                            break;
                                        case "memo":
                                            MemoXml(items[i], section, tab);
                                            break;
                                        case "password":
                                            PasswordXml(items[i], section, tab);
                                            break;
                                        case "number":
                                            NumberXml(items[i], section, tab);
                                            break;
                                        case "datetime":
                                            DatetimeXml(items[i], section, tab);
                                            break;
                                        case "radio":
                                            RadioXml(items[i], section, tab);
                                            break;
                                        case "select":
                                            SelectXml(items[i], section, tab);
                                            break;
                                        case "lookup":
                                            LookupXml(items[i], section, tab);
                                            break;
                                        case "hyperlink":
                                            HyperlinkXml(items[i], section, tab);
                                            break;
                                        case "blank":
                                            BlankXml(items[i], section, tab);
                                            break;
                                        default:
                                            BlankXml(items[i], section, tab);
                                            break;
                                    }
                                }
                            }
                        }
                    }
                }
                ToHtml();
                var before = self.value;
                ToXml();
                var afiter = self.value;

                var checkedXml = AppForm.CompareXML(before, afiter).value;
                document.getElementById("divCheck").innerHTML = checkedXml;
                document.getElementById("checkView").style.display = "";
            }
        }
        else {
            alert("Xml格式错误");
        }
    }
}
