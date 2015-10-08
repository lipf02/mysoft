## API

+ [Entity](entity.md)

+ [DBHelper](dbhelper.md)

+ [Ajax](ajax.md)


## dbhelper
DBHelper是数据库访问层，执行sql或实体操作

+  在查询时，可通过位置参数或是对象来传递参数

```C#
  string sql = @"select ProcessGUID from myWorkflowProcessEntity where  IsHistory=0 and BusinessGUID in
  ( select top 1 MpProcessGUID from  cb_MonthPlan  where planmonth=@0 and buguid=@1)";
  string mpProcessGUID = DBHelper.ExecuteScalarString(sql, planMonth, buguid);
  return mpProcessGUID;

  string sql = @"select ProcessGUID from myWorkflowProcessEntity where  IsHistory=0 and BusinessGUID in
  ( select top 1 MpProcessGUID from  cb_MonthPlan  where planmonth=@planmonth and buguid=@buguid)";
  string mpProcessGUID = DBHelper.ExecuteScalarString(sql,new {planMonth=buguid,buguid=@buguid}  );
}
```

+ 实体查询

列表查询

```C#
var list = DBHelper.GetList<cb_MonthPlanDtl>("select * from  cb_MonthPlanDtl  where  MonthPlanGUID in (select MonthPlanGUID from cb_MonthPlan where   planmonth=@0 and buguid=@1) and SBState='已确认'  ", planMonth, buguid);

```

+ 单一实体查询

```C#
List<cb_MonthPlanDtl> entitys = DBHelper.First<cb_MonthPlanDtl>("select * from  cb_MonthPlanDtl  where  MonthPlanGUID in (select MonthPlanGUID from cb_MonthPlan where   planmonth=@0 and buguid=@1) and SBState='已确认'  ", planMonth, buguid);
//or  
cb_MonthPlanDtl entity= DBHelper.GetByID<cb_MonthPlanDtl>(guid) ;
```


+ 实体增删改

实体更新
```C#
           cb_MonthPlanVersion version = new cb_MonthPlanVersion();
           version.VersionGUID = Guid.NewGuid().ToString();
           version.PlanMonth = planMonth;
           version.BUGUID = buguid;
           var date = DateTime.Now;
           version.VersionName = date.ToString("yyyy年MM月dd日HH:mm:ss") + "版本";
           version.CreatedDate = date;
           version.CreatedBy = CurrentUser.Current.UserName;
           DBHelper.Insert(version);

```

+ 更新特定字段


```C#

          var versionName = date.ToString("yyyy年MM月dd日HH:mm:ss") + "版本";
           DBHelper.Update<cb_MonthPlanVersion>({VersionGUID:"",VersionName:versionName});

```


+ 开启事务

```C#

                using (var trans = DBHelper.BeginTransaction())
                 {
                     mess = new { result = methodInfo.Invoke(instance, paramters) };
                     trans.Complete();
                 }

```
