function DefaultTab() {
    new Tab("");
}
function Tab(title) {
    this.title = title;
    this.index = TabList.length;
    this.SectionList = [];
    TabList[TabList.length] = this;
}
Tab.prototype.setAttribute = function (type, val) {
    switch (type) {
        case "title":
            this.title = val;
            break;
    }
}
Tab.prototype.ToHtml = function () {
    var changeHTML = "ChangeTab(this,'$type'," + this.index + ");";
    var html = "<div style=\"padding-left:40px;\">&lt;tab title=\"<input type=\"text\" class=\"text\" onchange=\"" + changeHTML.replace("$type", "title") + "\" value=\"" + ConvertHTML(this.title) + "\" /> \"&gt;";
    html += "<span onclick='DefaultSection(" + this.index + ");ToHtml();' class='delete'>+</span>";
    for (var n = 0; n < this.SectionList.length; n++) {
        html += this.SectionList[n].ToHtml();
    }
    html += "</div><div style=\"padding-left:40px;\">&lt;/tab&gt;<span onclick='RemoveTab(" + this.index + ")' class='delete'>-</span></div>";
    return html;
}

function RemoveTab(tabIndex) {
    TabList.splice(tabIndex, 1);
    for (var n = 0; n < TabList.length; n++) {
        TabList[n].index = n;
    }
    ToHtml();
}
Tab.prototype.ToXml = function () {
    var Textxml = "<tab />";
    var xmlDoc = loadXML(Textxml);
    var tab = xmlDoc.getElementsByTagName("tab")[0];
    tab.setAttribute("title", this.title);
    for (var n = 0; n < this.SectionList.length; n++) {
        var childNodes = this.SectionList[n].ToXml().childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            tab.appendChild(childNodes[i]);
        }
    }
    return xmlDoc;
}
function ChangeTab(self, attr, tabIndex) {
    var tab = TabList[tabIndex];
    tab.setAttribute(attr, self.value);
    TabList[tabIndex] = tab;
}