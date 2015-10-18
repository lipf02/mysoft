function DefaultSection(tabIndex) {
    var tab = TabList[tabIndex];
    var index = tab.SectionList.length;
    new Section("", "false", "false", 1, "", "s" + tabIndex.toString() + index.toString(), tabIndex);
}
function Section(title, showtitle, showbar, cols, titlewidth, secid, tabIndex) {
    this.data = new Array();
    this.data["title"] = title;
    this.data["showtitle"] = showtitle;
    this.data["showbar"] = showbar;
    this.data["cols"] = cols;
    this.data["titlewidth"] = titlewidth;
    this.data["secid"] = secid;
    this.ControlType = "Section";
    this.HiddenList = [];
    this.OtherList = [];
    this.tab = TabList[tabIndex];
    this.index = this.tab.SectionList.length;
    this.tab.SectionList[this.tab.SectionList.length] = this;
}
Section.prototype.ToHtml = function () {
    var html = "<div style=\"padding-left:20px;\">&lt;section ";
    html += TextSectionControl("title", this);
    html += SelectSectionControl("showtitle", this, ["true", "false"]);
    html += SelectSectionControl("showbar", this, ["true", "false"]);
    html += NumberSectionControl("cols", this);
    html += NumberSectionControl("titlewidth", this);
    html += TextSectionControl("secid", this);
    html += "&gt;</div><div class=\"items\" style=\"border:1px solid #0fefef;min-height:20px;margin-left:-40px;padding-left:40px;\" tabindex=\"" + this.tab.index + "\" sectionindex=\"" + this.index + "\" >";
    for (var n = 0; n < this.HiddenList.length; n++) {
        html = html + "<div class=\"pthree\">" + this.HiddenList[n].ToHtml() + "</div>";
    }
    for (var n = 0; n < this.OtherList.length; n++) {
        html = html + "<div class=\"pthree\">" + this.OtherList[n].ToHtml() + "</div>";
    }
    html += "</div><div style=\"padding-left:20px;\">&lt;/section&gt;<span onclick='RemoveSection(" + this.tab.index + "," + this.index + ")' class='delete'>-</span></div>";
    return html;
}
function RemoveSection(tabIndex, sectionIndex) {
    var tab = TabList[tabIndex];
    tab.SectionList.splice(sectionIndex, 1);
    for (var n = 0; n < tab.SectionList.length; n++) {
        tab.SectionList[n].index = n;
    }
    TabList[tabIndex] = tab;
    ToHtml();
}
Section.prototype.ToXml = function () {
    var Textxml = "<section />";
    var xmlDoc = loadXML(Textxml);
    var section = xmlDoc.getElementsByTagName("section")[0];
    var itemAttrs = new Array();
    itemAttrs.push({ attr: "title", defaultval: null });
    itemAttrs.push({ attr: "showtitle", defaultval: null });
    itemAttrs.push({ attr: "showbar", defaultval: null });
    itemAttrs.push({ attr: "cols", defaultval: null });
    itemAttrs.push({ attr: "titlewidth", defaultval: null });
    itemAttrs.push({ attr: "secid", defaultval: null });
    SetXmlVal(itemAttrs, this, section);
    for (var n = 0; n < this.HiddenList.length; n++) {
        var childNodes = this.HiddenList[n].ToXml().childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            section.appendChild(childNodes[i]);
        }
    }
    for (var n = 0; n < this.OtherList.length; n++) {
        var childNodes = this.OtherList[n].ToXml().childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            section.appendChild(childNodes[i]);
        }
    }
    return xmlDoc;
}
function ChangeSection(self, type, tabIndex, sectionIndex) {
    var val = self.value;
    if (self.tagName.toUpperCase() == "SELECT") {
        val = self.options[self.selectedIndex].innerText;
    }
    var tab = TabList[tabIndex];
    var section = tab.SectionList[sectionIndex];
    section.data[type] = val;
    tab.SectionList[sectionIndex] = section;
    TabList[tabIndex] = tab;
}

function RemoveHidden(tabIndex, sectionIndex, hiddenIndex) {
    var tab = TabList[tabIndex];
    var section = tab.SectionList[sectionIndex];
    section.HiddenList.splice(hiddenIndex, 1);
    for (var n = 0; n < section.HiddenList.length; n++) {
        section.HiddenList[n].index = n;
    }
    tab.SectionList[sectionIndex] = section;
    TabList[tabIndex] = tab;
    ToHtml();
}
function RemoveOther(tabIndex, sectionIndex, otherIndex) {
    var tab = TabList[tabIndex];
    var section = tab.SectionList[sectionIndex];
    section.OtherList.splice(otherIndex, 1);
    for (var n = 0; n < section.OtherList.length; n++) {
        section.OtherList[n].index = n;
    }
    tab.SectionList[sectionIndex] = section;
    TabList[tabIndex] = tab;
    ToHtml();
}