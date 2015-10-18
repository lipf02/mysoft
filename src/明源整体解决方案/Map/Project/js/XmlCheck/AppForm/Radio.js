function RadioXml(item, section, tab) {
    var name = item.getAttribute("name");
    var field = item.getAttribute("field");
    var title = item.getAttribute("title");
    var req = GetSelectVal(item.getAttribute("req"), "0", ["0", "1", "2"]);
    var colspan = GetNumberVal(item.getAttribute("colspan"), "1");
    var createapi = GetSelectVal(item.getAttribute("createapi"), "1", ["0", "1"]);
    var updateapi = GetSelectVal(item.getAttribute("updateapi"), "1", ["0", "1"]);
    var onclick = item.getAttribute("onclick");
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
    var tabIndex = tab.index;
    var sectionIndex = section.index;
    new Radio(name, field, title, req, colspan, createapi, updateapi, onclick, options, tabIndex, sectionIndex);
}
function DefaultRadio(tabIndex, sectionIndex) {
    new Radio("", "", "", "0", "1", "1", "1", "", [], tabIndex, sectionIndex);
}

function Radio(name, field, title, req, colspan, createapi, updateapi, onclick, option, tabIndex, sectionIndex) {
    this.data = new Array();
    this.data["name"] = name;
    this.data["field"] = field;
    this.data["title"] = title;
    this.data["req"] = req;
    this.data["colspan"] = colspan;
    this.data["createapi"] = createapi;
    this.data["updateapi"] = updateapi;
    this.data["onclick"] = onclick;
    if (option == null) {
        this.option = [];
    }
    else {
        this.option = option;
    }
    this.ControlType = "Radio";
    this.tab = TabList[tabIndex];
    this.section = this.tab.SectionList[sectionIndex];
    this.index = this.section.OtherList.length;
    this.section.OtherList[this.section.OtherList.length] = this;
}
Radio.prototype.getData = function (type) {
    var val = this.data[type];
    if (val == null) {
        return "";
    }
    return val;
}
Radio.prototype.setAttribute = function (type, val) {
    this.data[type] = val;
}
Radio.prototype.ToHtml = function () {
    var html = "<div style=\"padding-left:40px;\">&lt;item type=\"radio\" ";
    html += TextControl("name", this);
    html += TextControl("field", this);
    html += TextControl("title", this);
    html += SelectControl("req", this, ["0", "1", "2"]);
    html += NumberControl("colspan", this);
    html += "</div><div style=\"padding-left:50px;\">"
    html += SelectControl("createapi", this, ["0", "1"]);
    html += SelectControl("updateapi", this, ["0", "1"]);
    html += TextControl("onclick", this);
    html += "&gt;";
    html += "<span onclick='AddOption(" + this.tab.index + "," + this.section.index + "," + this.index + ")' class='delete'>+</span></div>";
    if (this.option != null) {
        var optionChangeHTML = "onchange=\"ChangeOption(this," + this.tab.index + "," + this.section.index + "," + this.index + ",$index,'$type');\""
        for (var n = 0; n < this.option.length; n++) {
            html = html + "<div style=\"padding-left:50px;\">"
                        + TextOptionControl(this.option[n].value, this.option[n].text, n, this)
                        + "<span onclick='RemoveOption(" + this.tab.index + "," + this.section.index + "," + this.index + "," + n + ")' class='delete'>-</span></div>";
        }
    }
    html += "<div style=\"padding-left:40px;\">&lt;/item&gt;"
    html += "<span onclick='RemoveOther(" + this.tab.index + "," + this.section.index + "," + this.index + ")' class='delete'>-</span></div>";
    return html;
}
Radio.prototype.ToXml = function () {
    var Textxml = ""
    if (this.option != null) {
        Textxml = "<item type=\"radio\">";
        for (var n = 0; n < this.option.length; n++) {
            Textxml += "<option ></option>";
        }
        Textxml += "</item>";
    }
    else {
        Textxml = "<item type=\"radio\"/>"
    }
    var xmlDoc = loadXML(Textxml);
    var item = xmlDoc.getElementsByTagName("item")[0];
    var itemAttrs = new Array();
    itemAttrs.push({ attr: "name", defaultval: null });
    itemAttrs.push({ attr: "field", defaultval: null });
    itemAttrs.push({ attr: "title", defaultval: null });
    itemAttrs.push({ attr: "req", defaultval: "0" });
    itemAttrs.push({ attr: "colspan", defaultval: "" });
    itemAttrs.push({ attr: "createapi", defaultval: "1" });
    itemAttrs.push({ attr: "updateapi", defaultval: "1" });
    itemAttrs.push({ attr: "onclick", defaultval: "" });
    SetXmlVal(itemAttrs, this, item);
    if (this.option != null) {
        var optionXmls = xmlDoc.getElementsByTagName("option");
        for (var n = 0; n < this.option.length; n++) {
            optionXmls[n].setAttribute("value", GetTextVal(this.option[n].value,""));
            optionXmls[n].text = GetTextVal(this.option[n].text, "");
        }
    }
    return xmlDoc;
}
function ChangeOption(self, tabIndex, sectionIndex, otherIndex, optionIndex, type) {
    var tab = TabList[tabIndex];
    var section = tab.SectionList[sectionIndex];
    var Radio = section.OtherList[otherIndex];
    var Option = Radio.option[optionIndex];
    if (type == "value") {
        Option.value = self.value;
    }
    else {
        Option.text = self.value;
    }
    Radio.option[optionIndex] = Option;
    section.OtherList[otherIndex] = Radio;
    tab.SectionList[sectionIndex] = section;
    TabList[tabIndex] = tab;
}
function AddOption( tabIndex, sectionIndex, otherIndex) {
    var tab = TabList[tabIndex];
    var section = tab.SectionList[sectionIndex];
    var Radio = section.OtherList[otherIndex];
    var option = new Object;
    if (Radio.option == null) {
        Radio.option = [];
    }
    option.index = Radio.option.length;
    option.value = "";
    option.text = "";
    Radio.option.push(option);
    section.OtherList[otherIndex] = Radio;
    tab.SectionList[sectionIndex] = section;
    TabList[tabIndex] = tab;
    ToHtml();
}

function RemoveOption(tabIndex, sectionIndex, otherIndex,optionIndex) {
    var tab = TabList[tabIndex];
    var section = tab.SectionList[sectionIndex];
    var Radio = section.OtherList[otherIndex];
    Radio.option.splice(optionIndex, 1);
    for (var n = 0; n < Radio.option.length; n++) {
        Radio.option[n].index = n;
    }
    section.OtherList[otherIndex] = Radio;
    tab.SectionList[sectionIndex] = section;
    TabList[tabIndex] = tab;
    ToHtml();
}