﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web;
using System.Collections;
using Mysoft.Project.Core;
using System.IO;
using Mysoft.Project.Core.DataAnnotations;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
namespace Mysoft.Project.Ajax
{

    public static class AjaxServiceProxy
    {
        static BindingFlags _bindingFlags = BindingFlags.Public | BindingFlags.GetProperty | BindingFlags.Instance | BindingFlags.Static;
        static Dictionary<Type, string> _cacheScript = new Dictionary<Type, string>();
      
    
        public static void Run()
        {
            HttpContext context = HttpContext.Current;
            context.Response.ContentEncoding = System.Text.Encoding.UTF8;
            var mess = Handle(context);
            if (mess is string)
            {
                context.Response.Write(mess);
            }
            else
                context.Response.Write(JsonHelper.SerializeObject(mess));

        }

        private static object Handle(HttpContext context)
        {

            HttpRequest request = context.Request;
            var assbemlyName = request.QueryString["assbemly"];
            var invokeMethod = request.QueryString["invokeMethod"];
            var typeName = request.QueryString["type"];
            Type type;
          
            //请求前端脚本
            if (string.IsNullOrEmpty(typeName) && request.HttpMethod.Equals("GET", StringComparison.OrdinalIgnoreCase))
            {
                try
                {
                   
                    type = ReflectionHelper.GetType(typeName, assbemlyName);
                    context.Response.AddHeader("Content-Type", "application/x-javascript");
                    return GetProxyScript(type, context.Request.Path);
                }
                catch(Exception ex)
                {
                    return "alert('无法加载类型，需要传入正确的type，和 assbemly参数！\n出错信息："+ex.Message+"')";
                }
            }

            object mess = null;
            MethodInfo methodInfo=null;
            try
            {
                methodInfo = ReflectionHelper.GetMethod(invokeMethod, assbemlyName);
            }
            catch (Exception ex)
            {
                mess = new { __error__ = "无法调用方法'" + invokeMethod + "'，请检查后台是否存在此方法！\n出错信息："+ex.Message };
                return JsonConvert.SerializeObject(mess);
            }
           
            try
            {

                ParameterInfo[] paramterInfos = methodInfo.GetParameters();
                object[] paramters = new object[paramterInfos.Length];
                var json = JObject.Parse(request.Form["postdata"]);
                for (int i = 0; i < paramterInfos.Length; i++)
                {
                    Type parameterType = paramterInfos[i].ParameterType;
                    string parameterName = paramterInfos[i].Name;
                    object value = null;
                    var jvalue = json[parameterName];
                    if (jvalue == null)
                    {
                        value = json.ToObject(parameterType);
                    }
                    else {
                        value = jvalue.ToObject(parameterType);
                    }
                    paramters[i] = value;
                }
                type = methodInfo.DeclaringType;
                object instance = null;
                if (!methodInfo.IsStatic)
                    instance = Activator.CreateInstance(type, new object[] { });
                //是否开启事务
                var transAttribute = methodInfo.GetCustomAttributes(typeof(TransactionAttribute), true);
                var isOpenTrans = true;
                if (transAttribute.Length > 0 )                  
                {
                    isOpenTrans = ((TransactionAttribute)transAttribute[0]).IsOpen;
                }
                else if (methodInfo.Name.StartsWith("get", StringComparison.OrdinalIgnoreCase))
                {
                    isOpenTrans = false;
                }               

                if (isOpenTrans)
                {
                    using (var trans = DBHelper.BeginTransaction())
                    {
                        mess = new { result = methodInfo.Invoke(instance, paramters) };
                        trans.Complete();
                    }
                }
                else
                {
                    mess = new { result = methodInfo.Invoke(instance, paramters) };
                }

            }
            catch (Exception ex)
            {
                var innerEx = ex.InnerException ?? ex;
                mess = new { __error__ = innerEx.Message + innerEx.StackTrace };

            }

            return mess;
        }
        /// <summary>
        /// 创建类型代理脚本
        /// </summary>
        /// <param name="type"></param>
        /// <param name="xmlHttpUrl"></param>
        /// <returns></returns>
        static string GetProxyScript(Type type, string xmlHttpUrl)
        {
            string script;
            if (_cacheScript.TryGetValue(type, out script)) { return script; }
            StringBuilder sb = new StringBuilder();
            var resName = typeof(AjaxServiceProxy).FullName + ".js";          
            var serviceJS = ReflectionHelper.GetResourceString(resName, typeof(AjaxServiceProxy));
            sb.AppendLine(serviceJS);
            sb.AppendLine("var service=new AjaxServiceProxy(window,'" + type.FullName + "','" + xmlHttpUrl + "');");
            object instance = null;
            foreach (PropertyInfo propertyInfo in type.GetProperties(_bindingFlags))
            {
                if (propertyInfo.GetGetMethod().IsStatic)
                    sb.AppendLine("service." + propertyInfo.Name + "='" + propertyInfo.GetValue(null, null) + "';");
                else
                {
                    instance = instance ?? Activator.CreateInstance(type, new object[] { });
                    sb.AppendLine("service." + propertyInfo.Name + "='" + propertyInfo.GetValue(instance, null) + "';");
                }
            }
            foreach (MethodInfo methodInfo in type.GetMethods(_bindingFlags))
            {                
                if (methodInfo.DeclaringType == typeof(object))
                    continue;
                ParameterInfo[] paramterInfos = methodInfo.GetParameters();
                var paramterNames = paramterInfos.Select(o => o.Name).ToArray();
                sb.AppendLine("service.registerMethod('" + methodInfo.Name + "','" + string.Join(",", paramterNames) + "')");

            }
            script = sb.ToString();
            _cacheScript[type] = script;
            return script;
        }
    }
}
