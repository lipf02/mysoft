function SelectXml(item, section, tab) {
    var name = item.getAttribute("name");
    var field = item.getAttribute("field");
    var title = item.getAttribute("title");
    var req = GetSelectVal(item.getAttribute("req"), "0", ["0", "1", "2"]);
    var colspan = GetNumberVal(item.getAttribute("colspan"), "1");
    var createapi = GetSelectVal(item.getAttribute("createapi"), "1", ["0", "1"]);
    var updateapi = GetSelectVal(item.getAttribute("updateapi"), "1", ["0", "1"]);
    var onchange = item.getAttribute("onchange");
    var sql = item.getAttribute("sql");
    var options = [];
    var optionItem = item.getElementsByTagName("option");
    if (optionItem != null && optionItem != undefined) {
        for (var n = 0; n < optionItem.length; n++) {
            var val = optionItem[n].getAttribute("value");
            var text = $(optionItem[n]).text()
            var option = new Object;
            option.value = val;
            option.text = text;
            options.push(option);
        }
    }
    var assembly = "";
    var invokeclass = "";
    var invokefunction = "";
    var textfield = "";
    var valuefield = "";
    var params = [];
    var functionItem = item.getElementsByTagName("function");
    if (functionItem != null && functionItem != undefined && functionItem.length > 0) {
        assembly = functionItem[0].getAttribute("assembly");
        invokeclass = functionItem[0].getAttribute("invokeclass");
        invokefunction = functionItem[0].getAttribute("invokefunction");
        textfield = functionItem[0].getAttribute("textfield");
        valuefield = functionItem[0].getAttribute("valuefield");
        var paramItem = functionItem[0].getElementsByTagName("param");
        if (paramItem != null && paramItem != undefined) {
            for (var n = 0; n < paramItem.length; n++) {
                var text = $(paramItem[n]).text()
                var param = new Object;
                param.text = text;
                params.push(param);
            }
        }
    }

    var tabIndex = tab.index;
    var sectionIndex = section.index;

    new Select(name, field, title, req, colspan, createapi, updateapi, onchange, options, sql,
    assembly, invokeclass, invokefunction, textfield, valuefield, params, tabIndex, sectionIndex);
}
function DefaultSelect(tabIndex, sectionIndex) {
    new Select("", "", "", "0", "1", "1", "1", "", [], "", "", "", "", "", "", [], tabIndex, sectionIndex);
}

function Select(name, field, title, req, colspan, createapi, updateapi, onchange, option, sql,
    assembly, invokeclass, invokefunction, textfield, valuefield, param, tabIndex, sectionIndex) {
    this.data = new Array();
    this.data["name"] = name;
    this.data["field"] = field;
    this.data["title"] = title;
    this.data["req"] = req;
    this.data["colspan"] = colspan;
    this.data["createapi"] = createapi;
    this.data["updateapi"] = updateapi;
    this.data["onchange"] = onchange;
    this.data["sql"] = sql;
    this.data["assembly"] = assembly;
    this.data["invokeclass"] = invokeclass;
    this.data["invokefunction"] = invokefunction;
    this.data["textfield"] = textfield;
    this.data["valuefield"] = valuefield;
    if (option == null) {
        this.option = [];
    }
    else {
        this.option = option;
    }
    if (param == null) {
        this.param = [];
    }
    else {
        this.param = param;
    }

    this.ControlType = "Select";
    this.tab = TabList[tabIndex];
    this.section = this.tab.SectionList[sectionIndex];
    this.index = this.section.OtherList.length;
    this.section.OtherList[this.section.OtherList.length] = this;
}
Select.prototype.getData = function (type) {
    var val = this.data[type];
    if (val == null) {
        return "";
    }
    return val;
}
Select.prototype.setAttribute = function (type, val) {
    this.data[type] = val;
}
Select.prototype.ToHtml = function () {
    var html = "<div style=\"padding-left:40px;\">&lt;item type=\"select\" ";
    html += TextControl("name", this);
    html += TextControl("field", this);
    html += TextControl("title", this);
    html += SelectControl("req", this, ["0", "1", "2"]);
    html += NumberControl("colspan", this);
    html += "</div><div style=\"padding-left:82px;\">"
    html += TextControl("sql", this, "style=\"width:360px;\"");
    html += "</div><div style=\"padding-left:82px;\">"
    html += SelectControl("createapi", this, ["0", "1"]);
    html += SelectControl("updateapi", this, ["0", "1"]);
    html += TextControl("onchange", this); 
    html += "&gt;";
    html += "<span onclick='AddSectionOption(" + this.tab.index + "," + this.section.index + "," + this.index + ")' class='delete'>+</span></div>";
    if (this.option != null) {
        for (var n = 0; n < this.option.length; n++) {
            html = html + "<div style=\"padding-left:60px;\">"
                        + TextOptionControl(this.option[n].value, this.option[n].text, n, this)
                        + "<span onclick='RemoveSectionOption(" + this.tab.index + "," + this.section.index + "," + this.index + "," + n + ")' class='delete'>-</span></div>";
        }
    }
    html += "<div style=\"padding-left:60px;\">&lt;function ";
    html += TextControl("assembly", this, "style=\"width:160px;\"");
    html += TextControl("invokeclass", this, "style=\"width:160px;\"");
    html += "</div><div style=\"padding-left:130px;\">"
    html += TextControl("invokefunction", this, "style=\"width:160px;\"");
    html += TextControl("textfield", this, "style=\"width:160px;\"");
    html += "</div><div style=\"padding-left:130px;\">"
    html += TextControl("valuefield", this, "style=\"width:160px;\"");
    html += "&gt;"
    html += "<span onclick='AddParam(" + this.tab.index + "," + this.section.index + "," + this.index + ")' class='delete'>+</span></div>";
    if (this.option != null) {
        var optionChangeHTML = "onchange=\"ChangeParam(this," + this.tab.index + "," + this.section.index + "," + this.index + ",$index);\""
        for (var n = 0; n < this.param.length; n++) {
            html = html + "<div style=\"padding-left:100px;\">"
                        + TextParamControl(this.param[n].text, n, this)
                        + "<span onclick='RemoveParam(" + this.tab.index + "," + this.section.index + "," + this.index + "," + n + ")' class='delete'>-</span></div>";
        }
    }
    html += "<div style=\"padding-left:60px;\">&lt;/function&gt;</div>"
    html += "<div style=\"padding-left:40px;\">&lt;/item&gt;";
    html += "<span onclick='RemoveOther(" + this.tab.index + "," + this.section.index + "," + this.index + ")' class='delete'>-</span></div>";
    return html;
}
Select.prototype.ToXml = function () {
    var Textxml = "<item type=\"select\">";
    if (this.option != null) {
        for (var n = 0; n < this.option.length; n++) {
            Textxml += "<option value=\"\" ></option>"
        }
    }    
    if (this.param != null) {
        Textxml += "<function>";
        for (var n = 0; n < this.param.length; n++) {
            Textxml += "<param></param>";
        }
        Textxml += "</function>";
    }
    else {

        Textxml += "<function />";
    }
    Textxml += "</item>";
    var xmlDoc = loadXML(Textxml);
    var item = xmlDoc.getElementsByTagName("item")[0];
    var itemAttrs = new Array();
    itemAttrs.push({ attr: "name", defaultval: null });
    itemAttrs.push({ attr: "field", defaultval: null });
    itemAttrs.push({ attr: "title", defaultval: null });
    itemAttrs.push({ attr: "sql", defaultval: "" });
    itemAttrs.push({ attr: "req", defaultval: "0" });
    itemAttrs.push({ attr: "colspan", defaultval: "" });
    itemAttrs.push({ attr: "createapi", defaultval: "1" });
    itemAttrs.push({ attr: "updateapi", defaultval: "1" });
    itemAttrs.push({ attr: "onchange", defaultval: "" });
    SetXmlVal(itemAttrs, this, item);
    if (this.option != null) {
        var optionXmls = xmlDoc.getElementsByTagName("option");
        for (var n = 0; n < this.option.length; n++) {
            optionXmls[n].setAttribute("value", GetTextVal(this.option[n].value, ""));
            optionXmls[n].text = GetTextVal(this.option[n].text, "");
        }
    }
    var func = xmlDoc.getElementsByTagName("function")[0];
    itemAttrs = new Array();
    itemAttrs.push({ attr: "assembly", defaultval: null });
    itemAttrs.push({ attr: "invokeclass", defaultval: null });
    itemAttrs.push({ attr: "invokefunction", defaultval: null });
    itemAttrs.push({ attr: "textfield", defaultval: null });
    itemAttrs.push({ attr: "valuefield", defaultval: null });
    SetXmlVal(itemAttrs, this, func);
    if (this.param != null) {
        var paramXmls = xmlDoc.getElementsByTagName("param");
        for (var n = 0; n < this.param.length; n++) {
            paramXmls[n].text = GetTextVal(this.param[n].text, "");
        }
    }
    return xmlDoc;
}

function ChangeSectionOption(self, tabIndex, sectionIndex, otherIndex, optionIndex, type) {
    var tab = TabList[tabIndex];
    var section = tab.SectionList[sectionIndex];
    var Select = section.OtherList[otherIndex];
    var Option = Select.option[optionIndex];
    if (type == "value") {
        Option.value = self.value;
    }
    else {
        Option.text = self.value;
    }
    Select.option[optionIndex] = Option;
    section.OtherList[otherIndex] = Select;
    tab.SectionList[sectionIndex] = section;
    TabList[tabIndex] = tab;
}
function AddSectionOption( tabIndex, sectionIndex, otherIndex) {
    var tab = TabList[tabIndex];
    var section = tab.SectionList[sectionIndex];
    var Select = section.OtherList[otherIndex];
    var option = new Object;
    if (Select.option == null) {
        Select.option = [];
    }
    option.index = Select.option.length;
    option.value = "";
    option.text = "";
    Select.option.push(option);
    section.OtherList[otherIndex] = Select;
    tab.SectionList[sectionIndex] = section;
    TabList[tabIndex] = tab;
    ToHtml();
}

function RemoveSectionOption(tabIndex, sectionIndex, otherIndex,optionIndex) {
    var tab = TabList[tabIndex];
    var section = tab.SectionList[sectionIndex];
    var Select = section.OtherList[otherIndex];
    Select.option.splice(optionIndex, 1);
    for (var n = 0; n < Select.option.length; n++) {
        Select.option[n].index = n;
    }
    section.OtherList[otherIndex] = Select;
    tab.SectionList[sectionIndex] = section;
    TabList[tabIndex] = tab;
    ToHtml();
}



function ChangeParam(self, tabIndex, sectionIndex, otherIndex, paramIndex) {
    var tab = TabList[tabIndex];
    var section = tab.SectionList[sectionIndex];
    var Select = section.OtherList[otherIndex];
    var Option = Select.param[paramIndex];
    Option.text = self.value;
    Select.param[paramIndex] = Option;
    section.OtherList[otherIndex] = Select;
    tab.SectionList[sectionIndex] = section;
    TabList[tabIndex] = tab;
}
function AddParam(tabIndex, sectionIndex, otherIndex) {
    var tab = TabList[tabIndex];
    var section = tab.SectionList[sectionIndex];
    var Select = section.OtherList[otherIndex];
    var param = new Object;
    if (Select.param == null) {
        Select.param = [];
    }
    param.index = Select.param.length;
    param.text = "";
    Select.param.push(param);
    section.OtherList[otherIndex] = Select;
    tab.SectionList[sectionIndex] = section;
    TabList[tabIndex] = tab;
    ToHtml();
}

function RemoveParam(tabIndex, sectionIndex, otherIndex, paramIndex) {
    var tab = TabList[tabIndex];
    var section = tab.SectionList[sectionIndex];
    var Select = section.OtherList[otherIndex];
    Select.param.splice(paramIndex, 1);
    for (var n = 0; n < Select.param.length; n++) {
        Select.param[n].index = n;
    }
    section.OtherList[otherIndex] = Select;
    tab.SectionList[sectionIndex] = section;
    TabList[tabIndex] = tab;
    ToHtml();
}