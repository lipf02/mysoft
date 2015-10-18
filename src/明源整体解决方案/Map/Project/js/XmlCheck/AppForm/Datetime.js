function DatetimeXml(item, section, tab) {
    var name = item.getAttribute("name");
    var field = item.getAttribute("field");
    var title = item.getAttribute("title");
    var time = GetSelectVal(item.getAttribute("time"), "0", ["0", "1", "2"]);
    var req = GetSelectVal(item.getAttribute("req"), "0", ["0", "1", "2"]);
    var colspan = GetNumberVal(item.getAttribute("colspan"), "1");
    var createapi = GetSelectVal(item.getAttribute("createapi"), "1", ["0", "1"]);
    var updateapi = GetSelectVal(item.getAttribute("updateapi"), "1", ["0", "1"]);
   
    var onreturnvaluechange = "";
    var attribute = item.getElementsByTagName("attribute");
    if (attribute != null && attribute.length > 0) {
        onreturnvaluechange = attribute[0].getAttribute("onreturnvaluechange");
    }

    var tabIndex = tab.index;
    var sectionIndex = section.index;
    new Datetime(name, field, title, req, time, colspan, createapi, updateapi, onreturnvaluechange,
    tabIndex, sectionIndex);
}
function DefaultDatetime(tabIndex, sectionIndex) {
    new Datetime("", "", "", "0", "0", "1", "1", "1", "", tabIndex, sectionIndex);
}
function Datetime(name, field, title, req, time, colspan, createapi, updateapi, onreturnvaluechange,
    tabIndex, sectionIndex) {
    this.data = new Array();
    this.data["name"] = name;
    this.data["field"] = field;
    this.data["title"] = title;
    this.data["time"] = time;
    this.data["req"] = req;
    this.data["colspan"] = colspan;
    this.data["createapi"] = createapi;
    this.data["updateapi"] = updateapi;
    this.data["onreturnvaluechange"] = onreturnvaluechange;
    this.ControlType = "Datetime";
    this.tab = TabList[tabIndex];
    this.section = this.tab.SectionList[sectionIndex];
    this.index = this.section.OtherList.length;
    this.section.OtherList[this.section.OtherList.length] = this;
}
Datetime.prototype.ToHtml = function () {
    var html = "<div style=\"padding-left:40px;\">&lt;item type=\"datetime\" ";
    html += TextControl("name", this);
    html += TextControl("field", this);
    html += TextControl("title", this);
    html += SelectControl("req", this, ["0", "1", "2"]);
    html += SelectControl("time", this, ["0", "1", "2"]);
    html += "<br/><span style=\"padding-left:38px;\">&nbsp;</span>"
    html += NumberControl("colspan", this);
    html += SelectControl("createapi", this, ["0", "1"]);
    html += SelectControl("updateapi", this, ["0", "1"]);
    html += "&gt;</div>";
    //Attribute
    html += "<div style=\"padding-left:60px;\">&lt;attribute ";
    html += TextControl("onreturnvaluechange", this);
    html += "/&gt;</div>"
    html += "<div style=\"padding-left:40px;\">&lt;/item&gt;"
    html += "<span onclick='RemoveOther(" + this.tab.index + "," + this.section.index + "," + this.index + ")' class='delete'>-</span></div>";
    return html;
}
Datetime.prototype.ToXml = function () {
    var Textxml = "<item type=\"datetime\" ><attribute /></item>";
    var xmlDoc = loadXML(Textxml);
    var item = xmlDoc.getElementsByTagName("item")[0];
    var itemAttrs = new Array();
    itemAttrs.push({ attr: "name", defaultval: null });
    itemAttrs.push({ attr: "field", defaultval: null });
    itemAttrs.push({ attr: "title", defaultval: null });
    itemAttrs.push({ attr: "time", defaultval: "0" });
    itemAttrs.push({ attr: "req", defaultval: "0" });
    itemAttrs.push({ attr: "colspan", defaultval: "" });
    itemAttrs.push({ attr: "createapi", defaultval: "1" });
    itemAttrs.push({ attr: "updateapi", defaultval: "1" });
    SetXmlVal(itemAttrs, this, item);
    var attribute = xmlDoc.getElementsByTagName("attribute")(0);
    var attributeAttrs = new Array();
    attributeAttrs.push({ attr: "onreturnvaluechange", defaultval: "" });
    var needAttr = SetXmlAttr(attributeAttrs, this, attribute);
    if (!needAttr) { item.removeChild(attribute); }
    return xmlDoc;
}