
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
    public interface IDDTreeItem
    {
        string Code { get; set; }
        string Name { get; set; }
        string Guid { get; set; }
        int IsEnd { get; set; }
        //  public string ParentCode { get; set; }
    }
    public class DDTreeItem : IDDTreeItem
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Guid { get; set; }
        public int IsEnd { get; set; }
    }

    public class DDTreeDTO<T> where T : IDDTreeItem
    {
        /// <summary>
        /// 允许选择所有节点
        /// </summary>
        public bool selectAll { get; set; }
        /// <summary>
        /// 禁用树
        /// </summary>
        public bool disabled { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<T> data { get; set; }
        public DDTreeDTO()
        {
            data = new List<T>();
        }
        public string value { get; set; }
    }
    

    public class DDTreeService
    {

        public DDTreeDTO<IDDTreeItem> GetCompanyTreeDTO(string userguid)
        {
            
            if (string.IsNullOrEmpty(userguid))
                userguid = HttpContext.Current.Session["UserGUID"].ToString();

            DDTreeDTO<IDDTreeItem> tree = new DDTreeDTO<IDDTreeItem>();
            tree.data = GetCompany(userguid);
            tree.value = HttpContext.Current.Session["BUGUID"].ToString();
            return tree;
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

                strSQL = "SELECT myBusinessUnit.BUGUID AS GUID ,BUName AS Name,myBusinessUnit.OrderHierarchyCode AS Code,ISNULL(myBusinessUnit.Level, 0) AS Level,myBusinessUnit.IsEndCompany FROM myBusinessUnit WHERE BUType = 0 AND OrderHierarchyCode + '.' LIKE '" + strCode + ".%'  order by  OrderHierarchyCode";

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

                strSQL = "SELECT b1.BUGUID AS GUID ,BUName AS Name,b1.OrderHierarchyCode AS Code,ISNULL(b1.Level, 0) AS Level,b1.IsEndCompany FROM myBusinessUnit AS b1 INNER JOIN (" + strSQL + ") AS b2 ON b1.OrderHierarchyCode + '.' LIKE b2.OrderHierarchyCode + '.%' WHERE b1.BUType = 0  order by b1.OrderHierarchyCode";

            }
            var dtRights = DBHelper.GetDataTable(strSQL);
            //创建临时表
            var list = new List<IDDTreeItem>();
            for (int i = 0; i < dtRights.Rows.Count; i++)
            {
                var item = new DDTreeItem();
                var row = dtRights.Rows[i];
                item.Code = row["Code"].ToString();
                item.Guid = row["GUID"].ToString();
                item.Name = row["Name"].ToString();
                item.IsEnd = Convert.ToInt32(row["IsEndCompany"]);
                list.Add(item);

            }
            return list;

        }
        /// <summary>
        /// 获取当前用户业务系统授权的项目
        /// </summary>
        /// <param name="application"></param>
        /// <returns></returns>
        public List<IDDTreeItem> GetProjectTree(string application,string treeType)
        {
            return GetCompany(null);
        }
        /// <summary>
        /// 设置当前用户访问的公司
        /// </summary>
        /// <param name="buguid"></param>
        /// <param name="BUName"></param>
        /// <param name="IsEndCompany"></param>
        /// <returns></returns>
        public bool SetBU(String buguid, String BUName, int IsEndCompany)
        {
            HttpContext context = HttpContext.Current;
            context.Session["BUGUID"] = buguid;
            context.Session["BUName"] = BUName;
            context.Session["IsEndCompany"] = IsEndCompany;
            context.Session["MySessionState"] = Guid.NewGuid().ToString();

            // 保存到Cookie
            context.Response.Cookies["mycrm_company"].Value = buguid;
            context.Response.Cookies["mycrm_company"].Expires = DateTime.Now.AddDays(365);

            //是否末级公司
            context.Response.Cookies["mycrm_isendcompany"].Value = IsEndCompany.ToString();
            context.Response.Cookies["mycrm_isendcompany"].Expires = DateTime.Now.AddDays(365);
            //在临时表中保存当前公司
            //254类型为 Mysoft.Map.Utility.General
            if (!ReflectionHelper.InvokeMethodSafe("Mysoft.Map.Utility.GeneralBase.InsertKeywordValue2myTemp", "Mysoft.Map.Core", context.Session["UserGUID"] + "_" + context.Session.SessionID, "[当前公司]", buguid))
                ReflectionHelper.InvokeMethodSafe("Mysoft.Map.Utility.General.InsertKeywordValue2myTemp", "Mysoft.Map.Core", context.Session["UserGUID"] + "_" + context.Session.SessionID, "[当前公司]", buguid);

            // 切换公司时清除桌面部件的缓存
            ReflectionHelper.InvokeMethodSafe("Mysoft.Map.Caching.MyCache.ClearDeskTempFile", "Mysoft.Map.Core", context.Session["UserGUID"].ToString());

            return true;
        }

    
         

    }
}
