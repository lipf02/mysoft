function HiddenXml(item, section, tab) {
    var name = item.getAttribute("name");
    var field = item.getAttribute("field");
    var tabIndex = tab.index;
    var sectionIndex = section.index;
    new Hidden(name, field, tabIndex, sectionIndex);
}
function DefaultHidden(tabIndex, sectionIndex) {
    new Hidden("", "", tabIndex, sectionIndex);
}
function Hidden(name, field, tabIndex, sectionIndex) {
    this.data = new Array();
    this.data["name"] = name;
    this.data["field"] = field;
    this.ControlType = "Hidden";
    this.tab = TabList[tabIndex];
    this.section = this.tab.SectionList[sectionIndex];
    this.index = this.section.HiddenList.length;
    this.section.HiddenList[this.section.HiddenList.length] = this;
}
Hidden.prototype.ToHtml = function () {
    var html = "<div style=\"padding-left:40px;\">&lt;item type=\"hidden\" ";
    html += TextControl("name", this);
    html += TextControl("field", this);
    html += "/&gt;<span onclick='RemoveHidden(" + this.tab.index + "," + this.section.index + "," + this.index + ")' class='delete'>-</span></div>";
    return html;
}
Hidden.prototype.ToXml = function () {
    var Textxml = "<item type=\"hidden\" />";
    var xmlDoc = loadXML(Textxml);
    var item = xmlDoc.getElementsByTagName("item")[0];
    var itemAttrs = new Array();
    itemAttrs.push({ attr: "name", defaultval: null });
    itemAttrs.push({ attr: "field", defaultval: null });
    SetXmlVal(itemAttrs, this, item);
    return xmlDoc;
}
