
using System.Web;
using System;
using System.Data;

using System.Data.SqlClient;
using System.Xml;
using System.Text;
using System.Collections.Generic;
using System.IO;
using System.Web.Hosting;
using System.Reflection;
using HtmlAgilityPack;
namespace MySoft.Project.Control
{
    public class Slxt_SCYX_GsDl_Analysis_Update : DefaultTreeUpdate
    {
        protected override bool AddDom()
        {
            var txtBUName = _doc.DocumentNode.SelectSingleNode("//input[@id=\"txtBUName\"]");
            txtBUName.Attributes.Add("style", "display:none");
            var span = _doc.CreateElement("span");
            span.Attributes.Add("id", "spnCompany");
            txtBUName.ParentNode.AppendChild(span);

            return true;
        }
    }
    public class Slxt_XSZDH_Hfzf_Update : DefaultTreeUpdate
    {
        protected override HtmlNode GetAppendTable()
        {
            var tblFind = _doc.DocumentNode.SelectSingleNode("//table[@id=\"tblFind\"]");

            return tblFind.SelectNodes("tr//table")[0];
        }
    }

    public class Slxt_XSZDH_Khgj_DsReasonTj : DefaultTreeUpdate {
        protected override bool AddDom()
        {

            HtmlNode table = GetAppendTable();
            var tds = table.SelectNodes(".//td");
            foreach (var td in tds)
            {
                if (td.Attributes.Contains("colSpan") && td.Attributes["colSpan"].Value == "4")
                {
                    td.Attributes.Remove("colSpan");
                }
            }
            return base.AddDom();
        }

    }

    public class Slxt_XSZDH_Jdjf_Update : DefaultTreeUpdate
    {
        protected override HtmlNode GetAppendTable()
        {
            var appQueryCtl0 = _doc.DocumentNode.SelectSingleNode("//*[@id=\"appQueryCtl0\"]");

            var table = appQueryCtl0;
            while (table.Name.ToLower() != "table")
            {
                table = table.ParentNode;
            }
            HtmlNode colgroup= table.SelectSingleNode("colgroup");
            if (colgroup == null)
            {
                colgroup = _doc.CreateElement("colgroup");
                var col0 = _doc.CreateElement("col");
                col0.Attributes.Add("width", "60");
                var col1 = _doc.CreateElement("col");
                colgroup.ChildNodes.Prepend(col1);
                colgroup.ChildNodes.Prepend(col0);
                table.ChildNodes.Prepend(colgroup); 
            }

            var tds = table.SelectNodes(".//td");
            foreach (var td in tds)
            {
                if (td.Attributes.Contains("width"))
                {
                    td.Attributes.Remove("width");
                }
            }
            return table;
        }
        
       
    }
   
 
}
