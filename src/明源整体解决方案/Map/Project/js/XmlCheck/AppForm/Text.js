function TextXml(item, section, tab) {
    var name = item.getAttribute("name");
    var field = item.getAttribute("field");
    var title = item.getAttribute("title");
    var req = GetSelectVal(item.getAttribute("req"), "0", ["0", "1", "2"]);
    var colspan = GetNumberVal(item.getAttribute("colspan"), "1");
    var createapi = GetSelectVal(item.getAttribute("createapi"), "1", ["0", "1"]);
    var updateapi = GetSelectVal(item.getAttribute("updateapi"), "1", ["0", "1"]);
    var assistanticon = item.getAttribute("assistanticon");
    var iconwidth = GetNumberVal(item.getAttribute("iconwidth"), "");
    var iconalign = GetSelectVal(item.getAttribute("iconalign"), "right", ["left", "center", "right"]);
    var iconclick = item.getAttribute("iconclick");
    var icontip = item.getAttribute("icontip");
    var defaultvalue = item.getAttribute("defaultvalue");
    var editvalue = item.getAttribute("editvalue");

    var maxlength = "";
    var onchange = "";
    var onclick = "";
    var ondblclick = "";
    var forbiddenchars = "";
    var allowchars = "";
    var attribute = item.getElementsByTagName("attribute");
    if (attribute != null && attribute.length > 0) {
        maxlength = GetNumberVal(attribute[0].getAttribute("maxlength"), "");
        onchange = attribute[0].getAttribute("onchange");
        onclick = attribute[0].getAttribute("onclick");
        ondblclick = attribute[0].getAttribute("ondblclick");
        forbiddenchars = attribute[0].getAttribute("forbiddenchars");
        allowchars = attribute[0].getAttribute("allowchars");
    }

    var tabIndex = tab.index;
    var sectionIndex = section.index;
    new Text(name, field, title, req, colspan, createapi, updateapi,
    assistanticon, iconwidth, iconalign, iconclick, icontip, defaultvalue, editvalue,
    maxlength, forbiddenchars, allowchars, onchange, onclick, ondblclick,
    tabIndex, sectionIndex);
}
function DefaultText(tabIndex, sectionIndex) {
    new Text("", "", "", "0", "1", "1", "1", "", "", "right", "", "", "", "", "", "", "", "", "", "", tabIndex, sectionIndex);
}
function Text(name, field, title, req, colspan, createapi, updateapi, 
    assistanticon, iconwidth, iconalign, iconclick, icontip, defaultvalue, editvalue,
    maxlength, forbiddenchars, allowchars, onchange, onclick, ondblclick,
    tabIndex, sectionIndex) {
    this.data = new Array();
    this.data["name"] = name;
    this.data["field"] = field;
    this.data["title"] = title;
    this.data["req"] = req;
    this.data["colspan"] = colspan;
    this.data["createapi"] = createapi;
    this.data["updateapi"] = updateapi;
    this.data["assistanticon"] = assistanticon;
    this.data["iconwidth"] = iconwidth;
    this.data["iconalign"] = iconalign;
    this.data["iconclick"] = iconclick;
    this.data["icontip"] = icontip;
    this.data["defaultvalue"] = defaultvalue;
    this.data["editvalue"] = editvalue;
    this.data["maxlength"] = maxlength;
    this.data["forbiddenchars"]= forbiddenchars;
    this.data["allowchars"]= allowchars;
    this.data["onchange"]= onchange;
    this.data["onclick"]= onclick;
    this.data["ondblclick"]= ondblclick;
    this.ControlType = "Text";
    this.tab = TabList[tabIndex];
    this.section = this.tab.SectionList[sectionIndex];
    this.index = this.section.OtherList.length;
    this.section.OtherList[this.section.OtherList.length] = this;
}
Text.prototype.ToHtml = function () {
    var html = "<div style=\"padding-left:40px;\">&lt;item type=\"text\" ";
    html += TextControl("name", this);
    html += TextControl("field", this);
    html += TextControl("title", this);
    html += SelectControl("req", this, ["0", "1", "2"]);
    html += NumberControl("colspan", this);
    html += "<br/><span style=\"padding-left:38px;\">&nbsp;</span>"
    html += SelectControl("createapi", this, ["0", "1" ]);
    html += SelectControl("updateapi", this, ["0", "1"]);
    html += TextControl("assistanticon", this);
    html += NumberControl("iconwidth", this);
    html += SelectControl("iconalign", this, ["left", "center", "right"]);
    html += "<br/><span style=\"padding-left:38px;\">&nbsp;</span>"
    html += TextControl("iconclick", this);
    html += TextControl("icontip", this);
    html += TextControl("defaultvalue", this);
    html += TextControl("editvalue", this); 
    html += "&gt;</div>"; 
    //Attribute
    html += "<div style=\"padding-left:60px;\">&lt;attribute ";
    html += NumberControl("maxlength", this);
    html += TextControl("forbiddenchars", this);
    html += TextControl("allowchars", this);
    html += "<br/><span style=\"padding-left:70px;\">&nbsp;</span>"
    html += TextControl("onchange", this);
    html += TextControl("onclick", this);
    html += TextControl("ondblclick", this);
    html += "/&gt;</div>"
    html += "<div style=\"padding-left:40px;\">&lt;/item&gt;"
    html += "<span onclick='RemoveOther(" + this.tab.index + "," + this.section.index + "," + this.index + ")' class='delete'>-</span></div>";
    return html;
}
Text.prototype.ToXml = function () {
    var Textxml = "<item type=\"text\"><attribute /></item>";
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
    itemAttrs.push({ attr: "assistanticon", defaultval: "" });
    itemAttrs.push({ attr: "iconwidth", defaultval: "" });
    itemAttrs.push({ attr: "iconalign", defaultval: "right" });
    itemAttrs.push({ attr: "iconclick", defaultval: "" });
    itemAttrs.push({ attr: "icontip", defaultval: "" });
    itemAttrs.push({ attr: "defaultvalue", defaultval: "" });
    itemAttrs.push({ attr: "editvalue", defaultval: "" });
    SetXmlVal(itemAttrs, this, item);
    var attribute = xmlDoc.getElementsByTagName("attribute")(0);
    var attributeAttrs = new Array();
    attributeAttrs.push({ attr: "maxlength", defaultval: "" });
    attributeAttrs.push({ attr: "forbiddenchars", defaultval: "" });
    attributeAttrs.push({ attr: "allowchars", defaultval: "" });
    attributeAttrs.push({ attr: "onchange", defaultval: "" });
    attributeAttrs.push({ attr: "onclick", defaultval: "" });
    attributeAttrs.push({ attr: "ondblclick", defaultval: "" });
    var needAttr = SetXmlAttr(attributeAttrs, this, attribute);
    if (!needAttr) { item.removeChild(attribute); }
    return xmlDoc;
}
