
# 项目小平台
项目小平台是针对项目中常用的场景进行提炼和封装的框架
目的是简化开发人员的日常工作，代码必须简单灵活，可理解，可维护，可调错，让开发人员能真正聚焦与业务开发

## API

+ [Core](/docs/core/readme.md)



## Quick start
+ 定义后台服务类和方法，（不限语言，没有小平台项目名称约束）

```C#
namespace Mysoft.Cbgl.Services
{
    public class MonthPlanService
    {
        public string GetWorkflowProcessGUID(string planMonth, string buguid)
        {
            string sql = @"select ProcessGUID from myWorkflowProcessEntity where  IsHistory=0 and BusinessGUID in
                        ( select top 1 MpProcessGUID from  cb_MonthPlan  where planmonth=@0 and buguid=@1)";
            string mpProcessGUID = DBHelper.ExecuteScalarString(sql, planMonth, buguid);
            return mpProcessGUID;
        }
    }
    //more...
}
```

+ 在头部添加jquery和需要调用的后台服务类型
`<head>`:

```html
<script type="text/javascript" src="/Project/js/jquery.js" ></script>
<script type="text/javascript" src="/Project/ajax.aspx?type=Mysoft.Cbgl.Services.MonthPlanService"></script>
```

+ 在前台脚步调用服务 **注意区分大小写**

```javascript
function doSendProcess() {
		var mpProcessGUID = MonthPlanService.GetMpProcessGUID($('#__planMonth').val(), $('#txtBUGUID').val());
		initiateBusinessProcess(mpProcessGUID, '资金计划审批');
	}
```
