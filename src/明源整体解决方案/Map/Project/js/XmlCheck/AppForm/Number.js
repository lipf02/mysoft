function NumberXml(item, section, tab) {
    var name = item.getAttribute("name");
    var field = item.getAttribute("field");
    var title = item.getAttribute("title");
    var format = item.getAttribute("format");
    var req = GetSelectVal(item.getAttribute("req"), "0", ["0", "1", "2"]);
    var colspan = GetNumberVal(item.getAttribute("colspan"), "1");
    var createapi = GetSelectVal(item.getAttribute("createapi"), "1", ["0", "1"]);
    var updateapi = GetSelectVal(item.getAttribute("updateapi"), "1", ["0", "1"]);
    var defaultvalue = item.getAttribute("defaultvalue");
    var editvalue = item.getAttribute("editvalue");
    var maxlength = "";
    var min = "";
    var max = "";
    var grp = "";
    var acc = "";
    var dt = "";
    var onchange = "";
    var attribute = item.getElementsByTagName("attribute");
    if (attribute != null && attribute.length > 0) {
        maxlength = GetNumberVal(attribute[0].getAttribute("maxlength"), "");
        min = GetNumberVal(attribute[0].getAttribute("min"), "");
        max = GetNumberVal(attribute[0].getAttribute("max"), "");
        grp = GetSelectVal(attribute[0].getAttribute("grp"), "true", ["true", "false"]);
        acc = GetNumberVal(attribute[0].getAttribute("acc"), "2");
        dt = attribute[0].getAttribute("dt");
        onchange = attribute[0].getAttribute("onchange");
    }

    var tabIndex = tab.index;
    var sectionIndex = section.index;
    new Number(name, field, title, req, colspan, createapi, updateapi, format, defaultvalue, editvalue,
    maxlength, min, max, grp, acc, dt, onchange, tabIndex, sectionIndex);
}

function DefaultNumber(tabIndex, sectionIndex) {
    new Number("", "", "", "0", "1", "0", "0", "#,##0.00", "", "", "", "", "", "true", "2", "", "", tabIndex, sectionIndex);
}
function Number(name, field, title, req, colspan, createapi, updateapi, format,defaultvalue,editvalue,
    maxlength, min, max, grp, acc, dt, onchange, tabIndex, sectionIndex) {
    this.data = new Array();
    this.data["name"] = name;
    this.data["field"] = field;
    this.data["title"] = title;
    this.data["req"] = req;
    this.data["colspan"] = colspan;
    this.data["createapi"] = createapi;
    this.data["updateapi"] = updateapi;
    this.data["format"] = format;
    this.data["defaultvalue"] = defaultvalue;
    this.data["editvalue"] = editvalue;
    this.data["maxlength"] = maxlength;
    this.data["onchange"] = onchange;
    this.data["min"] = min;
    this.data["max"] = max;
    this.data["grp"] = grp;
    this.data["acc"] = acc;
    this.data["dt"] = dt;

    this.ControlType = "Number";
    this.tab = TabList[tabIndex];
    this.section = this.tab.SectionList[sectionIndex];
    this.index = this.section.OtherList.length;
    this.section.OtherList[this.section.OtherList.length] = this;
}
Number.prototype.getData = function (type) {
    var val = this.data[type];
    if (val == null) {
        return "";
    }
    return val;
}
Number.prototype.setAttribute = function (type, val) {
    this.data[type] = val;
}
Number.prototype.ToHtml = function () {
    var html = "<div style=\"padding-left:40px;\">&lt;item type=\"number\" ";
    html += TextControl("name", this); 
    html += TextControl("field", this);
    html += TextControl("title", this); 
    html += TextControl("format", this);
    html += "<br/><span style=\"padding-left:38px;\">&nbsp;</span>"
    html += NumberControl("defaultvalue", this);
    html += NumberControl("editvalue", this);
    html += "<br/><span style=\"padding-left:38px;\">&nbsp;</span>"
    html += SelectControl("req", this, ["0", "1", "2"]);
    html += NumberControl("colspan", this);
    html += SelectControl("createapi", this, ["0", "1"]);
    html += SelectControl("updateapi", this, ["0", "1"]);
    html += "&gt;</div>";
    //Attribute
    html += "<div style=\"padding-left:60px;\">&lt;attribute ";
    html += NumberControl("maxlength", this);
    html += NumberControl("min", this);
    html += NumberControl("max", this);
    html += "<br/><span style=\"padding-left:70px;\">&nbsp;</span>"
    html += SelectControl("grp", this, ["true", "false"]);
    html += NumberControl("acc", this);
    html += TextControl("dt", this);
    html += TextControl("onreturnvaluechange", this);
    html += "/&gt;</div>"
    html += "<div style=\"padding-left:40px;\">&lt;/item&gt;"
    html += "<span onclick='RemoveOther(" + this.tab.index + "," + this.section.index + "," + this.index + ")' class='delete'>-</span></div>";
    return html;
}
Number.prototype.ToXml = function () {
    var Textxml = "<item type=\"number\"><attribute /></item>";
    var xmlDoc = loadXML(Textxml);
    var item = xmlDoc.getElementsByTagName("item")[0];
    var itemAttrs = new Array();
    itemAttrs.push({ attr: "name", defaultval: null });
    itemAttrs.push({ attr: "field", defaultval: null });
    itemAttrs.push({ attr: "title", defaultval: null });
    itemAttrs.push({ attr: "req", defaultval: "0" });
    itemAttrs.push({ attr: "format", defaultval: "" });
    itemAttrs.push({ attr: "defaultvalue", defaultval: "" });
    itemAttrs.push({ attr: "editvalue", defaultval: "" });
    itemAttrs.push({ attr: "colspan", defaultval: "" });
    itemAttrs.push({ attr: "createapi", defaultval: "1" });
    itemAttrs.push({ attr: "updateapi", defaultval: "1" }); 
    SetXmlVal(itemAttrs, this, item);

    var attribute = xmlDoc.getElementsByTagName("attribute")(0);
    var attributeAttrs = new Array();
    attributeAttrs.push({ attr: "maxlength", defaultval: "" });
    attributeAttrs.push({ attr: "min", defaultval: "" });
    attributeAttrs.push({ attr: "max", defaultval: "" });
    attributeAttrs.push({ attr: "grp", defaultval: "" });
    attributeAttrs.push({ attr: "acc", defaultval: "" });
    attributeAttrs.push({ attr: "dt", defaultval: "" });
    attributeAttrs.push({ attr: "onreturnvaluechange", defaultval: "" });
    var needAttr = SetXmlAttr(attributeAttrs, this, attribute);
    if (!needAttr) { item.removeChild(attribute); }
    return xmlDoc;
}