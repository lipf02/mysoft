
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
  
   
    public class DDTreeUpdateInfo {
        public string Path { get; set; }
        public bool HasUpdated { get; set; }
        public string Error { get; set; }
        public string Name { get; set; }
        public string UpdateClass { get; set; }
        public int ColGroupIndex { get; set; }
        public bool AutoReload { get; set; }
        public DDTreeUpdateInfo() {
            ColGroupIndex = -1;
            AutoReload = true;
        }
    }
    public interface ITreeUpdate {
        void Update(DDTreeUpdateInfo updateInfo);
    }
    public class DDTreeUpdateService {
        public List<DDTreeUpdateInfo> Update()
        {


            var path = HostingEnvironment.MapPath("/Expand/js/DDTree/ddttreeupdate.json");
            List<DDTreeUpdateInfo> list;
            using (StreamReader reader = new StreamReader(path, Encoding.UTF8))
            {
                var jsonstr = reader.ReadToEnd();
                list = Newtonsoft.Json.JsonConvert.DeserializeObject<List<DDTreeUpdateInfo>>(jsonstr);


            }
            var tempFile = HostingEnvironment.MapPath("/TempFiles/ddtree");
            if (Directory.Exists(tempFile))
                Directory.Delete(HostingEnvironment.MapPath("/TempFiles/ddtree"), true);
            foreach (var item in list)
            {
                if (item.HasUpdated) continue;
                var typeName = item.UpdateClass ?? "Mysoft.Expand.DefaultTreeUpdate";
                var type = Assembly.GetExecutingAssembly().GetType(typeName, false, true);
                if (type == null)
                {
                    item.Error = "找不到处理类型：" + item.UpdateClass;
                    continue;
                }
                try
                {
                    var update = Activator.CreateInstance(type, new object[] { }) as ITreeUpdate;
                    update.Update(item);
                }
                catch (Exception ex)
                {
                    item.Error = ex.Message;
                }
            }
            return list;

        }
    }
   // Slxt/XSZDH/Hfzf.aspx
    public class DefaultTreeUpdate:ITreeUpdate
    {

       protected  HtmlDocument _doc;
       protected  DDTreeUpdateInfo _updateInfo;
    
        
         protected virtual bool AddDom()
         {           
             HtmlNode table = GetAppendTable();
             if (table == null)
             {
                 _updateInfo.Error = "没有检测到可以添加的table节点";
                 return false;
             }
             var colgroup = table.SelectSingleNode("colgroup");
             var col0 = _doc.CreateElement("col");
             col0.Attributes.Add("width", "50");
             var col1 = _doc.CreateElement("col");
             col1.Attributes.Add("width", "");
             var col2 = _doc.CreateElement("col");
             col2.Attributes.Add("width", "15");

             colgroup.ChildNodes.Prepend(col2);
             colgroup.ChildNodes.Prepend(col1);
             colgroup.ChildNodes.Prepend(col0);
             var tr = table.SelectNodes("tr")[0];
             var td0 = _doc.CreateElement("td");
             td0.InnerHtml = "<b >公司</b>";
             var td1 = _doc.CreateElement("td");
             td1.InnerHtml = "<span id=\"spnCompany\"></span>";
             var td2 = _doc.CreateElement("td");
             tr.ChildNodes.Prepend(td2);
             tr.ChildNodes.Prepend(td1);
             tr.ChildNodes.Prepend(td0);
             return true;
         }

         protected virtual HtmlNode GetAppendTable()
         {

             var colgroups = _doc.DocumentNode.SelectNodes("//colgroup");
             var colGroupIdx = _updateInfo.ColGroupIndex;
             if (colgroups != null && colgroups.Count > 0)
             {
                 if (colGroupIdx > -1)
                 {
                     if (colgroups.Count < colGroupIdx + 1) { return null; }
                     return colgroups[colGroupIdx].ParentNode;
                 }
                 return colgroups[colgroups.Count - 1].ParentNode;
             }
             return null;
         }
         public virtual void Update(DDTreeUpdateInfo updateInfo)
         {
              var path = HostingEnvironment.MapPath(updateInfo.Path);
              _doc = new HtmlDocument();
              _doc.OptionOutputOriginalCase = true;
              _doc.Load(path);
            
              _updateInfo = updateInfo;

             var scripts = new List<string>();
             var scriptresources = _doc.DocumentNode.SelectSingleNode("//scriptresources");
             if (scriptresources != null)
             {
                 foreach (var node in scriptresources.ChildNodes)
                 {
                     if (node.Attributes.Contains("src"))
                         scripts.Add(node.Attributes["src"].Value.ToLower());
                 }
             }
             var scriptNodes = _doc.DocumentNode.SelectNodes("//script");
             if (scriptNodes != null)
             {
                 foreach (var node in scriptNodes)
                 {
                     if (node.Attributes.Contains("src"))
                         scripts.Add(node.Attributes["src"].Value.ToLower());
                 }
             }

             bool existsJquery = false;
             bool existsDDTree = false;
             foreach (var script in scripts)
             {
                 if (script.Contains("jquery"))
                     existsJquery = true;
                 if (script.Contains("ddtree.js"))
                     existsDDTree = true;
             }
             if (existsDDTree)
             {
                 _updateInfo.HasUpdated = true;
                 _updateInfo.Error = "页面已经添加过公司控件";
                 return;
             }

             if (!AddDom())
                 return;
             if (!existsJquery)
                 AddJs("/Expand/js/jquery-1.8.3.js");
             AddJs("/Expand/ajax.aspx?type=Mysoft.Expand.DDTreeService");
             AddJs("/Expand/js/DDTree/DDTree.js");
             AddTreeJs();           
             Save();
             _updateInfo.Error = "已生成文件";
             _updateInfo.HasUpdated = true;
             return;

         }
         protected virtual void AddTreeJs()
         {
             var body = _doc.DocumentNode.SelectSingleNode("//body");
             var js = _doc.CreateElement("script");
             js.Attributes.Add("type", "text/javascript");
             if (_updateInfo.AutoReload)
                 js.InnerHtml = "  $(function() { $('#spnCompany').CompanyTree(); });";
             else
                 js.InnerHtml = "  $(function() { $('#spnCompany').CompanyTree({onchange:false}); });";
             body.AppendChild(js);
         }

        protected virtual void Save(){
            var path = HostingEnvironment.MapPath("/TempFiles/ddtree"+_updateInfo.Path);
             var dir = Path.GetDirectoryName(path);
             if (!Directory.Exists(dir))
                 Directory.CreateDirectory(dir);
             _doc.Save(path);
        }
        protected void AddJs(string path) {
            var body = _doc.DocumentNode.SelectSingleNode("//body");
            var js = _doc.CreateElement("script");
            js.Attributes.Add("type", "text/javascript");
            js.Attributes.Add("src", path);
            body.AppendChild(js);
        
        }
    }


    public class MenuCompanyTree_Update : DefaultTreeUpdate
    {
        protected override bool AddDom()
        {
            var lblCurCompany = _doc.DocumentNode.SelectSingleNode("//*[@id=\"lblCurCompany\"]");
            lblCurCompany.Attributes.Add("style", "display:none");
            lblCurCompany.PreviousSibling.Attributes.Add("style", "display:none");

            var table = lblCurCompany.ParentNode.ParentNode.ParentNode.ParentNode;
            table.Attributes.Add("cellpadding", "0");
            table.Attributes.Add("cellspacing", "0");

            var span = _doc.CreateElement("span");
           span.Attributes.Add("id", "spnCompany");

           lblCurCompany.ParentNode.PrependChild(span);

           var head = _doc.DocumentNode.SelectSingleNode("//head");
           var style = _doc.CreateElement("style");
           style.InnerHtml = @"table.stdTable{ margin:0px; padding:0px;  }
nobr.mnuTitle{ height:100%; }
.mnuTitle  span{ height:100%;  padding-top:4px;}
.mnuTitle   a{ height:100%; padding-top:4px; }
.mnuTitle span.ddtreeWarp  { height:100%; padding-top:0px;}
.mnuTitle .ddtreeWarp  span{ height:100%; padding-top:0px; }
#spnCompany { margin-right:10px;}";
           head.AppendChild(style);
           AddJs("/Expand/js/jquery-1.8.3.js");
            return true;
        }
        protected override void AddTreeJs()
        {
            var body = _doc.DocumentNode.SelectSingleNode("//body");
            var js = _doc.CreateElement("script");
            js.Attributes.Add("type", "text/javascript");
            js.InnerHtml = "  $(function() { $('#spnCompany').CompanyMenuTree({width:260}) });";
            body.AppendChild(js);
        }
    }
 
}
