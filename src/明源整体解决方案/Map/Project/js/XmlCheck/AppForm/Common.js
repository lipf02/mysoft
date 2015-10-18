//字符转换成HTML
function ConvertHTML(val) {
    if (val == null || val == undefined) {
        return "";
    }
    val = val.toString().replace(/"/g, "&quot;");
    return val;
}
//字符串转换成XML对象
function loadXML(xmlText) {
    var xmlDoc;
    if (window.ActiveXObject) {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(xmlText);
    }
    else if (document.implementation && document.implementation.createDocument) {
        xmlDoc = document.implementation.createDocument("", "", null);
        xmlDoc.async = false;
        xmlDoc.loadXML(xmlText);
    } else {
        alert('您的浏览器不支持该系统脚本！');
    }
    return xmlDoc;
}
//跟去Item类型获取相关通用关键字
function GetCType(type) {
    if (type == "Hidden") {
        type = "Hidden";
    }
    else if (type == "Section") {
        type = "Section";
    }
    else {
        type = "Other";
    }
    return type;
}

function TextControl(attrName, obj, css) {
    var type = obj.ControlType;
    type = GetCType(type);
    return attrName + "=\"<input type=\"text\" " + (css == undefined ? "" : css) + " class=\"text\" value=\"" + ConvertHTML(obj.data[attrName]) + "\" onchange=\"Change" + type + "(this,'" + attrName + "'," + obj.tab.index + "," + obj.section.index + "," + obj.index + ");\" />\" ";
}
function NumberControl(attrName, obj) {
    var type = obj.ControlType;
    type = GetCType(type);
    return attrName + "=\"<input type=\"text\" class=\"number\" value=\"" + ConvertHTML(obj.data[attrName]) + "\" onchange=\"Change" + type + "(this,'" + attrName + "'," + obj.tab.index + "," + obj.section.index + "," + obj.index + ");\" />\" ";
}
function SelectControl(attrName, obj, options) {
    var type = obj.ControlType;
    type = GetCType(type);
    var html = attrName + "=<select onchange=\"Change" + type + "(this,'" + attrName + "'," + obj.tab.index + "," + obj.section.index + "," + obj.index + ");\" >";
    for (var n = 0; n < options.length; n++) {
        html += "<option " + (obj.data[attrName] == options[n] ? "selected=\"selected\"" : "") + ">" + options[n] + "</option>";
    }
    html += "</select> ";
    return html;
}


function TextSectionControl(attrName, obj, css) {
    var type = obj.ControlType;
    type = GetCType(type);
    return attrName + "=\"<input type=\"text\" " + (css == undefined ? "" : css) + " class=\"text\" value=\"" + ConvertHTML(obj.data[attrName]) + "\" onchange=\"Change" + type + "(this,'" + attrName + "'," + obj.tab.index + "," + obj.index + ");\" />\" ";
}
function NumberSectionControl(attrName, obj) {
    var type = obj.ControlType;
    type = GetCType(type);
    return attrName + "=\"<input type=\"text\" class=\"number\" value=\"" + ConvertHTML(obj.data[attrName]) + "\" onchange=\"Change" + type + "(this,'" + attrName + "'," + obj.tab.index + "," + obj.index + ");\" />\" ";
}
function SelectSectionControl(attrName, obj, options) {
    var type = obj.ControlType;
    type = GetCType(type);
    var html = attrName + "=\"<select onchange=\"Change" + type + "(this,'" + attrName + "'," + obj.tab.index + "," + obj.index + ");\" >";
    for (var n = 0; n < options.length; n++) {
        html += "\r\n<option " + (obj.data[attrName] == options[n] ? "selected=\"selected\"" : "") + ">" + options[n] + "</option>";
    }
    html += "</select>\" ";
    return html;
}

function TextOptionControl(value, text, n, obj) {
    var optionChangeHTML = "onchange=\"ChangeSectionOption(this," + obj.tab.index + "," + obj.section.index + "," + obj.index + ",$index,'$type');\""
    return " &lt;option value=\"" +
                "<input type=\"text\" class=\"text\" value=\"" + ConvertHTML(value) + "\" " + optionChangeHTML.replace("$type", "value").replace("$index", n.toString()) + " />"
                + "\"&gt;" +
                "<input type=\"text\" class=\"text\" value=\"" + ConvertHTML(text) + "\" " + optionChangeHTML.replace("$type", "text").replace("$index", n.toString()) + " />"
                + "&lt;/option&gt;";
}
//ParamHTML
function TextParamControl(text, n, obj) {
    var optionChangeHTML = "onchange=\"ChangeParam(this," + obj.tab.index + "," + obj.section.index + "," + obj.index + ",$index);\""
    return " &lt;param&gt;" +
                "<input type=\"text\" class=\"text\" value=\"" + ConvertHTML(text) + "\" " + optionChangeHTML.replace("$index", n.toString()) + " />"
                + "&lt;/param&gt;";
}

//取可用选择值
function GetSelectVal(val, defaultVal, options) {
    for (var n = 0; n < options.length; n++) {
        if (val == options[n]) {
            return val;
        }
    }
    return defaultVal;
}
//取可用Number
function GetNumberVal(val, defaultVal) {
    if (val == null) {
        return defaultVal;
    }
    return val.replace(/\D|^0/g, '');
}
//取可用Text
function GetTextVal(val, defaultVal) {
    if (val == null) {
        return defaultVal;
    }
    return val;
}
//修改非HiddenItem节点值
function ChangeOther(self, type, tabIndex, sectionIndex, otherIndex) {
    var val = self.value;
    if (self.tagName.toUpperCase() == "SELECT") {
        val = self.options[self.selectedIndex].innerText;
    }
    var tab = TabList[tabIndex];
    var section = tab.SectionList[sectionIndex];
    var other = section.OtherList[otherIndex];
    other.data[type] = val;
    section.OtherList[otherIndex] = other;
    tab.SectionList[sectionIndex] = section;
    TabList[tabIndex] = tab;
}
//修改HiddenItem节点值
function ChangeHidden(self, type, tabIndex, sectionIndex, hiddenIndex) {
    var tab = TabList[tabIndex];
    var section = tab.SectionList[sectionIndex];
    var hidden = section.HiddenList[hiddenIndex];
    hidden.data[type] = self.value;
    section.HiddenList[hiddenIndex] = hidden;
    tab.SectionList[sectionIndex] = section;
    TabList[tabIndex] = tab;
}
//对Item节点的属性赋值
function SetXmlVal(itemAttrs, self, item) {
    for (var n = 0; n < itemAttrs.length; n++) {
        var val = self.data[itemAttrs[n].attr];
        val = val == null ? "" : val.toString();
        if (val != itemAttrs[n].defaultval) {
            item.setAttribute(itemAttrs[n].attr, val.trim());
        }
    }
}
//对Item节点attribute的属性赋值
function SetXmlAttr(attributeAttrs, self, attribute) {
    var needAttr = false;
    for (var n = 0; n < attributeAttrs.length; n++) {
        var val = self.data[attributeAttrs[n].attr];
        val = val == null ? "" : val.toString();
        if (val != attributeAttrs[n].defaultval) {
            needAttr = true;
            attribute.setAttribute(attributeAttrs[n].attr, val.trim());
        }
    }
    return needAttr;
}
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim = function () {
    return this.replace(/(^\s*)/g, "");
}
String.prototype.rtrim = function () {
    return this.replace(/(\s*$)/g, "");
}