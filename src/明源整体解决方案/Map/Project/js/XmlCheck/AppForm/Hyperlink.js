function HyperlinkXml(item, section, tab) {
    var field = item.getAttribute("field");
    var textfield = item.getAttribute("textfield");
    var title = item.getAttribute("title");
    var colspan = GetNumberVal(item.getAttribute("colspan"), "1");
    var href = item.getAttribute("href");
    var target = item.getAttribute("target");
    var onclick = item.getAttribute("onclick");
    var defaultvalue = item.getAttribute("defaultvalue");
    var defaulttext = item.getAttribute("defaulttext");
    var editvalue = item.getAttribute("editvalue");
    var edittext = item.getAttribute("edittext"); 

    var tabIndex = tab.index;
    var sectionIndex = section.index;

    new Hyperlink(field, textfield, title, colspan, href, target,
    onclick, defaultvalue, defaulttext, editvalue, edittext, tabIndex, sectionIndex);
}
function DefaultHyperlink(tabIndex, sectionIndex) {
    new Hyperlink("", "", "", "1", "", "_blank", "", "", "", "", "", tabIndex, sectionIndex);
}
function Hyperlink(field, textfield, title, colspan, href, target,
    onclick, defaultvalue, defaulttext, editvalue, edittext, tabIndex, sectionIndex) {
    this.data = new Array();

    this.data["field"] = field;
    this.data["textfield"] = textfield;
    this.data["title"] = title;
    this.data["colspan"] = colspan;
    this.data["href"] = href;
    this.data["target"] = target;
    this.data["onclick"] = onclick;
    this.data["defaultvalue"] = defaultvalue;
    this.data["defaulttext"] = defaulttext;
    this.data["editvalue"] = editvalue;
    this.data["edittext"] = edittext;

    this.ControlType = "Hyperlink";
    this.tab = TabList[tabIndex];
    this.section = this.tab.SectionList[sectionIndex];
    this.index = this.section.OtherList.length;
    this.section.OtherList[this.section.OtherList.length] = this;
}
Hyperlink.prototype.ToHtml = function () {
    var html = "<div style=\"padding-left:40px;\">&lt;item type=\"hyperlink\" ";
    html += TextControl("field", this);
    html += TextControl("textfield", this);
    html += TextControl("title", this);
    html += NumberControl("colspan", this);
    html += "<br/><span style=\"padding-left:38px;\">&nbsp;</span>"
    html += TextControl("href", this);
    html += TextControl("target", this);
    html += TextControl("onclick", this);
    html += TextControl("defaultvalue", this);
    html += "<br/><span style=\"padding-left:38px;\">&nbsp;</span>"
    html += TextControl("defaulttext", this);
    html += TextControl("editvalue", this);
    html += TextControl("edittext", this);
    html += "&gt;</div><div style=\"padding-left:40px;\">&lt;/item&gt;"
    html += "<span onclick='RemoveOther(" + this.tab.index + "," + this.section.index + "," + this.index + ")' class='delete'>-</span></div>";

    return html;
}
Hyperlink.prototype.ToXml = function () {
    var Textxml = "<item type=\"hyperlink\" />";
    var xmlDoc = loadXML(Textxml);
    var item = xmlDoc.getElementsByTagName("item")[0];

    var itemAttrs = new Array();
    itemAttrs.push({ attr: "field", defaultval: null });
    itemAttrs.push({ attr: "textfield", defaultval: null });
    itemAttrs.push({ attr: "title", defaultval: null });
    itemAttrs.push({ attr: "colspan", defaultval: "" });
    itemAttrs.push({ attr: "href", defaultval: "" });
    itemAttrs.push({ attr: "target", defaultval: "" });
    itemAttrs.push({ attr: "onclick", defaultval: "" });
    itemAttrs.push({ attr: "defaultvalue", defaultval: "" });
    itemAttrs.push({ attr: "defaulttext", defaultval: "" });
    itemAttrs.push({ attr: "editvalue", defaultval: "" });
    itemAttrs.push({ attr: "edittext", defaultval: "" });
    SetXmlVal(itemAttrs, this, item);
    return xmlDoc;
}