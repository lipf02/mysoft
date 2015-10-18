using System;
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Xml;

namespace Project
{
    public partial class AppForm : System.Web.UI.Page
    {
        string begFormat = "DD228393B9D1400DBC6D316D64C375D5";
        string endFormat = "CFCFE10C1F8A498481F29716AC73C001";
        protected void Page_Load(object sender, EventArgs e)
        {
            Ajax.Utility.RegisterTypeForAjax(typeof(AppForm));
        }
        [Ajax.AjaxMethod]
        public string FormatXML(string xml)
        {
            try
            {
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(xml);
                StringWriter sw = new StringWriter();
                using (XmlTextWriter writer = new XmlTextWriter(sw))
                {
                    writer.Indentation = 2;
                    writer.Formatting = Formatting.Indented;
                    doc.WriteContentTo(writer);
                    writer.Close();
                }
                return sw.ToString();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        [Ajax.AjaxMethod]
        public string CompareXML(string beforexml, string afterxml)
        {
            XmlDocument beforDoc = new XmlDocument();
            XmlDocument afterDoc = new XmlDocument();
            try
            {
                beforDoc.LoadXml(beforexml);
                afterDoc.LoadXml(afterxml);
                XmlNodeList CcontrolBefor = beforDoc.GetElementsByTagName("control");
                XmlNodeList CcontrolAfter = afterDoc.GetElementsByTagName("control");
                for (int a = 0; a < CcontrolBefor.Count; a++)
                {
                    List<string> DefAttr = new List<string>();
                    DefAttr.Add("id");
                    CheckDefaultAttrName(CcontrolBefor[a], DefAttr, beforDoc);
                    CheckAttributes(CcontrolBefor[a], CcontrolAfter[a]);
                    XmlNodeList CdatasourceBefor = beforDoc.GetElementsByTagName("datasource");
                    XmlNodeList CdatasourceAfter = afterDoc.GetElementsByTagName("datasource");
                    for (int b = 0; b < CdatasourceBefor.Count; b++)
                    {
                        DefAttr = new List<string>();
                        DefAttr.Add("entity");
                        DefAttr.Add("keyname");
                        CheckDefaultAttrName(CdatasourceBefor[b], DefAttr, beforDoc);

                        CheckAttributes(CdatasourceBefor[b], CdatasourceAfter[b]);
                    }
                    XmlNodeList CformBefor = beforDoc.GetElementsByTagName("form");
                    XmlNodeList CformAfter = afterDoc.GetElementsByTagName("form");
                    for (int c = 0; c < CformBefor.Count; c++)
                    {
                        DefAttr = new List<string>();
                        DefAttr.Add("showtab");
                        CheckDefaultAttrName(CformBefor[c], DefAttr, beforDoc);

                        CheckAttributes(CformBefor[c], CformAfter[c]);
                        XmlNodeList CtabBefor = beforDoc.GetElementsByTagName("tab");
                        XmlNodeList CtabAfter = afterDoc.GetElementsByTagName("tab");
                        for (int d = 0; d < CtabBefor.Count; d++)
                        {
                            DefAttr = new List<string>();
                            DefAttr.Add("title");
                            CheckDefaultAttrName(CtabBefor[d], DefAttr, beforDoc);

                            CheckAttributes(CtabBefor[d], CtabAfter[d]);
                            XmlNodeList CsectionBefor = beforDoc.GetElementsByTagName("section");
                            XmlNodeList CsectionAfter = afterDoc.GetElementsByTagName("section");
                            for (int e = 0; e < CsectionBefor.Count; e++)
                            {
                                DefAttr = new List<string>();
                                DefAttr.Add("title");
                                DefAttr.Add("showtitle");
                                DefAttr.Add("showbar");
                                DefAttr.Add("cols");
                                DefAttr.Add("titlewidth");
                                DefAttr.Add("secid");
                                CheckDefaultAttrName(CsectionBefor[e], DefAttr, beforDoc);

                                CheckAttributes(CsectionBefor[e], CsectionAfter[e]);
                                XmlNodeList CitemBefor = beforDoc.GetElementsByTagName("item");
                                XmlNodeList CitemAfter = afterDoc.GetElementsByTagName("item");
                                for (int f = 0; f < CitemBefor.Count; f++)
                                {
                                    string itemType = "";
                                    DefAttr = new List<string>();
                                    if (CitemBefor[f].Attributes["type"] == null)
                                    {
                                        DefAttr.Add("type");
                                    }
                                    else
                                    {
                                        itemType = CitemBefor[f].Attributes["type"].Value.ToLower();
                                        switch (itemType)
                                        {
                                            case "hidden":
                                                DefAttr.Add("name");
                                                DefAttr.Add("field");
                                                break;
                                            case "blank":
                                                DefAttr.Add("html");
                                                DefAttr.Add("align");
                                                break;
                                            case "datetime":
                                                DefAttr.Add("name");
                                                DefAttr.Add("field");
                                                DefAttr.Add("title");
                                                break;
                                            case "hyperlink":
                                                DefAttr.Add("field");
                                                DefAttr.Add("textfield");
                                                DefAttr.Add("title");
                                                break;
                                            case "lookup":
                                                DefAttr.Add("name");
                                                DefAttr.Add("field");
                                                DefAttr.Add("textfield");
                                                break;
                                            case "memo":
                                                DefAttr.Add("name");
                                                DefAttr.Add("field");
                                                DefAttr.Add("title");
                                                break;
                                            case "number":
                                                DefAttr.Add("name");
                                                DefAttr.Add("field");
                                                DefAttr.Add("title");
                                                break;
                                            case "password":
                                                DefAttr.Add("name");
                                                DefAttr.Add("field");
                                                DefAttr.Add("title");
                                                break;
                                            case "radio":
                                                DefAttr.Add("name");
                                                DefAttr.Add("field");
                                                DefAttr.Add("title");
                                                break;
                                            case "text":
                                                DefAttr.Add("name");
                                                DefAttr.Add("field");
                                                DefAttr.Add("title");
                                                break;
                                            case "select":
                                                DefAttr.Add("name");
                                                DefAttr.Add("field");
                                                DefAttr.Add("title");
                                                break;
                                        }
                                    }
                                    CheckDefaultAttrName(CitemBefor[f], DefAttr, beforDoc);
                                    CheckAttributes(CitemBefor[f], CitemAfter[f]);
                                    if (itemType == "select")
                                    {
                                        XmlNodeList CfunctionBefor = beforDoc.GetElementsByTagName("function");
                                        XmlNodeList CfunctionAfter = afterDoc.GetElementsByTagName("function");
                                        for (int g = 0; g < CfunctionBefor.Count; g++)
                                        {
                                            DefAttr = new List<string>();
                                            DefAttr.Add("assembly");
                                            DefAttr.Add("invokeclass");
                                            DefAttr.Add("invokefunction");
                                            DefAttr.Add("textfield");
                                            DefAttr.Add("valuefield");
                                            CheckDefaultAttrName(CfunctionBefor[g], DefAttr, beforDoc);
                                            CheckAttributes(CfunctionBefor[g], CfunctionAfter[g]);
                                        }
                                    }
                                    XmlNodeList CattrBefor = CitemBefor[f].ChildNodes;
                                    XmlNodeList CattrAfter = CitemAfter[f].ChildNodes;
                                    for (int g = 0; g < CattrBefor.Count; g++)
                                    {
                                        if (CattrAfter.Count > g)
                                        {
                                            CheckAttributes(CattrBefor[g], CattrAfter[g]);
                                        }
                                        else
                                        {
                                            XmlNode beforeNode = CattrBefor[g];
                                            XmlAttributeCollection beforeAttrs = beforeNode.Attributes;
                                            for (int n = 0; n < beforeAttrs.Count; n++)
                                            {
                                                string attrName = beforeAttrs[n].Name;
                                                beforeNode.Attributes[n].InnerText = begFormat + beforeNode.Attributes[attrName].InnerText + endFormat;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            Regex regex = new Regex(@"(\s+)\<");
            string formatXml = FormatXML(beforDoc.OuterXml);
            MatchCollection mcoll = regex.Matches(formatXml);
            List<string> gValue = new List<string>();
            foreach (Match m in mcoll)
            {
                foreach (Group g in m.Groups)
                {
                    if (g.Value.IndexOf("<") >= 0)
                    {
                        gValue.Add(g.Value);
                    }
                }
            }
            gValue.Sort();
            foreach (string g in gValue)
            {
                formatXml = formatXml.Replace(g, g.Replace(" ", "&nbsp; "));
            }
            return formatXml.Replace(" ", "&nbsp;").Replace("<", "&lt;")
                .Replace(">", "&gt;")
                .Replace("\n", "<br/>")
                .Replace(begFormat, "<span>")
                .Replace(endFormat, "</span>");
        }
        /// <summary>
        /// 检查缺省属性
        /// </summary>
        /// <param name="node"></param>
        /// <param name="defAttrs"></param>
        private void CheckDefaultAttrName(XmlNode node, List<string> defAttrs, XmlDocument beforDoc)
        {
            foreach (string attr in defAttrs)
            {
                if (node.Attributes[attr] == null)
                {
                    node.Attributes.Append(beforDoc.CreateAttribute(begFormat + attr + endFormat));
                }
            }
        }
        /// <summary>
        /// 检查属性值
        /// </summary>
        /// <param name="beforeNode"></param>
        /// <param name="afterNode"></param>
        private void CheckAttributes(XmlNode beforeNode, XmlNode afterNode)
        {
            XmlAttributeCollection beforeAttrs = beforeNode.Attributes;
            for (int n = 0; n < beforeAttrs.Count; n++)
            {
                string attrName = beforeAttrs[n].Name;
                string beforeAttr = beforeNode.Attributes[attrName].InnerText;
                string afterAttr = "";
                if (afterNode.Attributes[attrName] != null)
                {
                    afterAttr = afterNode.Attributes[attrName].InnerText;
                }
                beforeNode.Attributes[n].InnerText = GetXmlVal(beforeAttr, afterAttr);
            }
        }
        /// <summary>
        /// 判断内容
        /// </summary>
        /// <param name="before">格式化前的值</param>
        /// <param name="after">格式化后的值</param>
        /// <returns></returns>
        private string GetXmlVal(string before, string after)
        {
            if (before.Trim() == "")
            {
                before = before.Replace(" ", "&nbsp;");
            }
            if (after.ToUpper() == before.ToUpper())
            {
                return before;
            }
            return begFormat + before + endFormat;
        }
    }
}
