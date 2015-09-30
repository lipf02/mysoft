
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
using Mysoft.Project.Core;
namespace MySoft.Project.Control
{
    public enum TreeType { None = -1, Group = 0, Company = 1, EndCompany = 2, Dept = 3, Team = 4, ProjectTeam = 5, Project = 6, EndProject = 7 }
    public interface IDDTreeItem
    {
        string code { get; set; }
        string name { get; set; }
        string id { get; set; }
        int isend { get; set; }
        TreeType type { get; set; }
      
        //  public string ParentCode { get; set; }
    }
    public class DDTreeItem : IDDTreeItem
    {
        public string code { get; set; }
        public string name { get; set; }
        public string id { get; set; }
        public int isend { get; set; }
        public TreeType type { get; set; }
      
    }

    public class DDTreeDTO<T> where T : IDDTreeItem
    {     
        /// <summary>
        /// 
        /// </summary>
        public List<T> data { get; set; }
        public DDTreeDTO()
        {
            data = new List<T>();
        }
        public string value { get; set; }
        string ApplySys { get; set; }
    }
    

    public class DDTreeService
    {

        public List<IDDTreeItem> GetProject(string userguid, string applySys)
        {
            var sql = @"SELECT  p.ProjGUID,       
        p.ProjShortName,
        p.Level ,      
        p.IfEnd,
        BU.HierarchyCode + '.' + SUBSTRING(P.ProjCode,CHARINDEX('.', P.ProjCode) + 1, 100) AS Code
FROM    p_Project p ,
        e_myBusinessUnit BU
WHERE   P.BUGUID = BU.BUGUID
        AND EXISTS ( SELECT 1
                     FROM   p_Project p2
                     WHERE  (1=1)
                            AND   (p2.ProjCode=p.ProjCode OR   p2.ProjCode  LIKE p.ProjCode+'.%'  )
                       ) 
  order by  BU.HierarchyCode,P.ProjCode ";
            var projs = (string)ReflectionHelper.InvokeMethod("Mysoft.Map.Data.MyDB.GetProjectString", "Mysoft.Map.Core", userguid, "", applySys, true);
           
         
            sql = sql.Replace("1=1", " p2.ProjGUID IN   ( " + projs + ") ");
            var table = DBHelper.GetDataTable(sql);
            //创建临时表
            var list = GetCompany(userguid);
            //var TreeType = { Group: 0, Dept: 1, Team: 2, ProjectTeam: 3, Company: 4, EndCompany: 5, Project: 6, EndProject: 7 }
            for (int i = 0; i < table.Rows.Count; i++)
            {
                var item = new DDTreeItem();
                var row = table.Rows[i];
                item.code = row["Code"].ToString();
                item.id = row["ProjGUID"].ToString();
                item.name = row["ProjShortName"].ToString();

                item.isend = Convert.ToInt32(row["IfEnd"]);


                item.type = TreeType.Project;
                if (item.isend == 1)
                    item.type = TreeType.EndProject;

                list.Add(item);

            }
            return list;

        }
      
        /// <summary>
        /// 获取当前用户可以访问的公司
        /// </summary>
        /// <param name="userguid"></param>
        /// <returns></returns>
        public List<IDDTreeItem> GetCompany(string userguid)
        {        //整棵公司树
            string strSQL = "SELECT OrderHierarchyCode AS Code,BUGUID AS GUID,BUName AS Name,CASE WHEN IsEndCompany=1 THEN '1' ELSE '0' END AS IsEndCompany, Level, '0' AS IsShow FROM myBusinessUnit WHERE BUType = 0 ORDER BY OrderHierarchyCode";
            DataTable dtBU = DBHelper.GetDataTable(strSQL);
            userguid = userguid ?? CurrentUser.Current.UserGUID;
            //根据用户岗位获取有权限的公司
            if ((bool)ReflectionHelper.InvokeMethod("Mysoft.Map.Application.Security.User.IsAdmin", "Mysoft.Map.Core", userguid))
            {
                //系统管理员有所属公司所有权限
                strSQL = @"SELECT bu.OrderHierarchyCode FROM myBusinessUnit AS bu RIGHT OUTER JOIN myUser AS u ON bu.BUGUID = u.BUGUID WHERE u.UserGUID = '" + userguid + "'";
                var strCode = DBHelper.ExecuteScalarString (strSQL);

                strSQL = "SELECT myBusinessUnit.BUGUID AS GUID ,BUName AS Name,myBusinessUnit.HierarchyCode AS Code,ISNULL(myBusinessUnit.Level, 0) AS Level,myBusinessUnit.IsEndCompany FROM myBusinessUnit WHERE BUType = 0 AND OrderHierarchyCode + '.' LIKE '" + strCode + ".%'  order by  OrderHierarchyCode";

            }
            else
            {
                // 取用户岗位所属公司
                strSQL = @"SELECT b.OrderHierarchyCode FROM myBusinessUnit AS b 
RIGHT OUTER JOIN (  SELECT ISNULL(s.CompanyGUID, u.BUGUID) AS BUGUID  FROM myStation AS s  RIGHT OUTER JOIN myStationUser AS su ON s.StationGUID = su.StationGUID
RIGHT OUTER JOIN myUser AS u ON su.UserGUID = u.UserGUID  WHERE u.UserGUID ='" + userguid + "' ) AS ub ON b.BUGUID = ub.BUGUID";

                // 取用户物理所属公司
                strSQL += @" UNION SELECT b.OrderHierarchyCode FROM myBusinessUnit AS b INNER JOIN myUser AS u ON u.BUGUID=b.BUGUID
WHERE u.UserGUID ='" + userguid + "'";

                strSQL = "SELECT b1.BUGUID AS GUID ,BUName AS Name,b1.HierarchyCode AS Code,ISNULL(b1.Level, 0) AS Level,b1.IsEndCompany FROM myBusinessUnit AS b1 INNER JOIN (" + strSQL + ") AS b2 ON b1.OrderHierarchyCode + '.' LIKE b2.OrderHierarchyCode + '.%' WHERE b1.BUType = 0  order by b1.OrderHierarchyCode";

            }
            var dtRights = DBHelper.GetDataTable(strSQL);
            //创建临时表
            var list = new List<IDDTreeItem>();
            //var TreeType = { Group: 0, Dept: 1, Team: 2, ProjectTeam: 3, Company: 4, EndCompany: 5, Project: 6, EndProject: 7 }
            for (int i = 0; i < dtRights.Rows.Count; i++)
            {
                var item = new DDTreeItem();
                var row = dtRights.Rows[i];
                item.code = row["Code"].ToString();
                item.id = row["GUID"].ToString();
                item.name = row["Name"].ToString();
                item.isend = Convert.ToInt32(row["IsEndCompany"]);

                if (item.isend == 1)
                {
                    item.type = TreeType.EndCompany;
                }
                else
                {
                    if (Convert.ToInt32(row["Level"]) == 0)
                    {
                        item.type = TreeType.Group;
                    }
                    else
                    {
                        item.type = TreeType.Company;
                    }
                }
                list.Add(item);

            }
            return list;

        }
        /// <summary>
        /// 获取当前用户业务系统授权的项目
        /// </summary>
        /// <param name="application"></param>
        /// <returns></returns>
        public DDTreeDTO<IDDTreeItem> GetDDTreeData( TreeType treeType, string ApplySys)
        {
            var tree = new DDTreeDTO<IDDTreeItem>();
            var userguid = HttpContext.Current.Session["UserGUID"].ToString();
            switch (treeType) { 
                    //部门
                case TreeType.Dept:
                case TreeType.ProjectTeam:
                case TreeType.Team:
                    return null;
                    //项目
                case TreeType.Project:
                case TreeType.EndProject:
                    tree.data = GetProject(userguid, ApplySys);               
                    break;
                    //公司
                default:
                    tree.data = GetCompany(userguid);                  
                    break;
                    
            }

            tree.value = DBHelper.ExecuteScalarString("select ArgGUID from myCurrArgs where UserGUID=@0 and ObjType=@1", userguid, treeType.ToString());
            return tree;
           
        }
        public string SetValue(DDTreeItem item) {
            switch (item.type) { 
                case TreeType.Group:
                case TreeType.Company:
                case TreeType.EndCompany:
                    SetBU(item);
                    break;
                case TreeType.Project:
                case TreeType.EndProject:
                    SetProject(item);
                    var bu = DBHelper.First<DDTreeItem>("select BUGUID id,BUName name,IsEndCompany isend from myBusinessUnit where buguid in (select buguid from dbo.p_Project WHERE ProjGUID=@0)", item.id);
                    SetBU(bu);
                    break;
                case TreeType.Dept:
                    break;
                 
            }
        
            var updateSql = @"delete myCurrArgs where ObjType=@ObjType;
 INSERT INTO dbo.myCurrArgs( UserGUID ,  ObjType , ArgGUID ,  LastUpdate        )
VALUES  ( @UserGUID ,@ObjType,@ArgGUID,getdate())";
            DBHelper.Execute(updateSql, new { UserGUID = HttpContext.Current.Session["UserGUID"], ObjType = item.type.ToString(), ArgGUID = item.id });
            return string.Empty;
        }
        /// <summary>
        /// 设置当前用户访问的公司
        /// </summary>
        /// <param name="buguid"></param>
        /// <param name="BUName"></param>
        /// <param name="IsEndCompany"></param>
        /// <returns></returns>
        public void SetBU(DDTreeItem item)
        {
            HttpContext context = HttpContext.Current;
            context.Session["BUGUID"] = item.id;
            context.Session["BUName"] = item.name;
            context.Session["IsEndCompany"] = item.isend;
        //    context.Session["MySessionState"] = Guid.NewGuid().ToString();

            // 保存到Cookie
            context.Response.Cookies["mycrm_company"].Value = item.id;
            context.Response.Cookies["mycrm_company"].Expires = DateTime.Now.AddDays(365);

            //是否末级公司
            context.Response.Cookies["mycrm_isendcompany"].Value = item.isend.ToString();
            context.Response.Cookies["mycrm_isendcompany"].Expires = DateTime.Now.AddDays(365);
            ////在临时表中保存当前公司
            ////254类型为 Mysoft.Map.Utility.General
            if (!ReflectionHelper.InvokeMethodSafe("Mysoft.Map.Utility.GeneralBase.InsertKeywordValue2myTemp", "Mysoft.Map.Core", context.Session["UserGUID"] + "_" + context.Session.SessionID, "[当前公司]", item.id))
                ReflectionHelper.InvokeMethodSafe("Mysoft.Map.Utility.General.InsertKeywordValue2myTemp", "Mysoft.Map.Core", context.Session["UserGUID"] + "_" + context.Session.SessionID, "[当前公司]", item.id);

            //// 切换公司时清除桌面部件的缓存
            //ReflectionHelper.InvokeMethodSafe("Mysoft.Map.Caching.MyCache.ClearDeskTempFile", "Mysoft.Map.Core", context.Session["UserGUID"].ToString());

         
        }

        public void SetProject(DDTreeItem item)
        {
          
        }
         

    }
}
