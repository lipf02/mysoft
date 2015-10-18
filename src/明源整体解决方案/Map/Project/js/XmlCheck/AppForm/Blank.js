function BlankXml(item, section, tab) {
    var html = item.getAttribute("html");
    var align = GetSelectVal(item.getAttribute("align"), "left", ["left", "center", "right"]);
    var colspan = GetNumberVal(item.getAttribute("colspan"), 1);
    var tabIndex = tab.index;
    var sectionIndex = section.index;
    new Blank(html, align, colspan, tabIndex, sectionIndex);
}
function DefaultBlank(tabIndex, sectionIndex) {
    new Blank("", "left", "", tabIndex, sectionIndex);
}
function Blank(html, align, colspan, tabIndex, sectionIndex) {
    this.data = new Array();
    this.data["html"] = html;
    this.data["align"] = align;
    this.data["colspan"] = colspan;
    this.ControlType = "Blank";
    this.tab = TabList[tabIndex];
    this.section = this.tab.SectionList[sectionIndex];
    this.index = this.section.OtherList.length;
    this.section.OtherList[this.section.OtherList.length] = this;
}
Blank.prototype.ToHtml = function () {
    var html = "<div style=\"padding-left:40px;\">&lt;item type=\"blank\" ";
    html += TextControl("html", this);
    html += SelectControl("align", this, ["left", "center","right"]); 
    html += NumberControl("colspan", this);
    html += "&gt;&lt;/item&gt;"
    html += "<span onclick='RemoveOther(" + this.tab.index + "," + this.section.index + "," + this.index + ")' class='delete'>-</span></div>";
    return html;
}
Blank.prototype.ToXml = function () {
    var Textxml = "<item type=\"blank\" />";
    var xmlDoc = loadXML(Textxml);
    var item = xmlDoc.getElementsByTagName("item")[0];
    var itemAttrs = new Array();
    itemAttrs.push({ attr: "html", defaultval: null });
    itemAttrs.push({ attr: "align", defaultval: null });
    itemAttrs.push({ attr: "colspan", defaultval: "" });
    SetXmlVal(itemAttrs, this, item);
    return xmlDoc;
}