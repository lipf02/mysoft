function LookupXml(item, section, tab) {
    var name = item.getAttribute("name");
    var field = item.getAttribute("field");
    var textfield = item.getAttribute("textfield");

    var icon = item.getAttribute("icon");
    var detailpage = item.getAttribute("detailpage");
    var defaultvalue = item.getAttribute("defaultvalue");
    var defaulttext = item.getAttribute("defaulttext");
    var lookupstyle = GetSelectVal(item.getAttribute("lookupstyle"), "1", ["single", "multi"]);
    var lookupclass = item.getAttribute("lookupclass");
    var lookupbrowse = item.getAttribute("lookupbrowse");
    var rowslimit = GetNumberVal(item.getAttribute("rowslimit"), "");
    var lookupcustom = item.getAttribute("lookupcustom");
    var features = item.getAttribute("features");
    var onbeforeselect = item.getAttribute("onbeforeselect");
    var onafterselect = item.getAttribute("onafterselect");

    var title = item.getAttribute("title");
    var req = GetSelectVal(item.getAttribute("req"), "0", ["0", "1", "2"]);
    var colspan = GetNumberVal(item.getAttribute("colspan"), "1");
    var createapi = GetSelectVal(item.getAttribute("createapi"), "1", ["0", "1"]);
    var updateapi = GetSelectVal(item.getAttribute("updateapi"), "1", ["0", "1"]);

    var tabIndex = tab.index;
    var sectionIndex = section.index;
    new Lookup(name, field, textfield, icon, detailpage, defaultvalue, defaulttext,
    lookupstyle, lookupclass, lookupbrowse, rowslimit, lookupcustom, features, onbeforeselect, onafterselect,
    title, req, colspan, createapi, updateapi, tabIndex, sectionIndex);
}
function DefaultLookup(tabIndex, sectionIndex) {
    new Lookup("", "", "", "", "", "", "",
            "single", "", "0", "0", "", "dialogWidth:800px;dialogHeight:600px;resizable:yes;center:yes;status:no;help:no;scroll:no;", "", "",
            "", "0", "1", "1", "1", tabIndex, sectionIndex);
}

function Lookup(name, field, textfield, icon, detailpage, defaultvalue, defaulttext,
    lookupstyle, lookupclass, lookupbrowse, rowslimit, lookupcustom, features, onbeforeselect, onafterselect,
    title, req, colspan, createapi, updateapi, tabIndex, sectionIndex) {
    this.data = new Array();
    this.data["name"] = name;
    this.data["field"] = field;
    this.data["textfield"] = textfield;
    this.data["icon"] = icon;
    this.data["detailpage"] = detailpage;
    this.data["defaultvalue"] = defaultvalue;
    this.data["defaulttext"] = defaulttext;
    this.data["lookupstyle"] = lookupstyle;
    this.data["lookupclass"] = lookupclass;
    this.data["lookupbrowse"] = lookupbrowse;
    this.data["rowslimit"] = rowslimit;
    this.data["lookupcustom"] = lookupcustom;
    this.data["features"] = features;
    this.data["onbeforeselect"] = onbeforeselect;
    this.data["onafterselect"] = onafterselect;
    this.data["title"] = title;
    this.data["req"] = req;
    this.data["colspan"] = colspan;
    this.data["createapi"] = createapi;
    this.data["updateapi"] = updateapi;

    this.ControlType = "Lookup";
    this.tab = TabList[tabIndex];
    this.section = this.tab.SectionList[sectionIndex];
    this.index = this.section.OtherList.length;
    this.section.OtherList[this.section.OtherList.length] = this;
} 
Lookup.prototype.ToHtml = function () {
    var html = "<div style=\"padding-left:40px;\">&lt;item type=\"lookup\" ";
    html += TextControl("name", this);
    html += TextControl("field", this);
    html += TextControl("textfield", this);
    html += TextControl("title", this);
    html += "<br/><span style=\"padding-left:38px;\">&nbsp;</span>"
    html += TextControl("icon", this, "style=\"width:180px;\"");
    html += TextControl("detailpage", this, "style=\"width:180px;\"");
    html += "<br/><span style=\"padding-left:38px;\">&nbsp;</span>"
    html += TextControl("defaultvalue", this );
    html += TextControl("defaulttext", this );
    html += TextControl("editvalue", this);
    html += TextControl("edittext", this);
    html += "<br/><span style=\"padding-left:38px;\">&nbsp;</span>"
    html += SelectControl("lookupstyle", this, ["single", "multi"]);
    html += TextControl("lookupclass", this);
    html += SelectControl("lookupbrowse", this, ["0", "1"]);
    html += NumberControl("rowslimit", this);
    html += "<br/><span style=\"padding-left:38px;\">&nbsp;</span>"
    html += TextControl("lookupcustom", this, "style=\"width:180px;\"");
    html += TextControl("features", this, "style=\"width:180px;\"");
    html += "<br/><span style=\"padding-left:38px;\">&nbsp;</span>"
    html += SelectControl("req", this, ["0", "1", "2"]);
    html += NumberControl("colspan", this);
    html += SelectControl("createapi", this, ["0", "1"]);
    html += SelectControl("updateapi", this, ["0", "1"]);
    html += "&gt;</div><div style=\"padding-left:40px;\">&lt;/item&gt;"
    html += "<span onclick='RemoveOther(" + this.tab.index + "," + this.section.index + "," + this.index + ")' class='delete'>-</span></div>";
    return html;
}
Lookup.prototype.ToXml = function () {
    var Textxml = "<item type=\"lookup\" />";
    var xmlDoc = loadXML(Textxml);
    var item = xmlDoc.getElementsByTagName("item")[0];
    var itemAttrs = new Array();
    itemAttrs.push({ attr: "name", defaultval: null });
    itemAttrs.push({ attr: "field", defaultval: null });
    itemAttrs.push({ attr: "textfield", defaultval: null });
    itemAttrs.push({ attr: "icon", defaultval: "" });
    itemAttrs.push({ attr: "detailpage", defaultval: "" });
    itemAttrs.push({ attr: "defaultvalue", defaultval: "" });
    itemAttrs.push({ attr: "defaulttext", defaultval: "" });
    itemAttrs.push({ attr: "lookupstyle", defaultval: "" });
    itemAttrs.push({ attr: "lookupclass", defaultval: "" });
    itemAttrs.push({ attr: "lookupbrowse", defaultval: "" });
    itemAttrs.push({ attr: "rowslimit", defaultval: "" });
    itemAttrs.push({ attr: "lookupcustom", defaultval: "" });
    itemAttrs.push({ attr: "features", defaultval: "" });
    itemAttrs.push({ attr: "onbeforeselect", defaultval: "" });
    itemAttrs.push({ attr: "onafterselect", defaultval: "" });
    itemAttrs.push({ attr: "req", defaultval: "0" });
    itemAttrs.push({ attr: "colspan", defaultval: "" });
    itemAttrs.push({ attr: "createapi", defaultval: "1" });
    itemAttrs.push({ attr: "updateapi", defaultval: "1" });
    SetXmlVal(itemAttrs, this, item);   
    return xmlDoc;
}