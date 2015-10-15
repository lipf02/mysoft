## API

+ [Entity](/docs/api/entity.md)

+ [DBHelper](/docs/api/dbhelper.md)

+ [Ajax](/docs/api/ajax.md)


## ajax
ajax使用的ajax.aspx作为服务中转地址
**无须在方法中定义事务,服务中转时，除方法名以Get开始的，默认将开启事务，可以使用TransactionAttribute特性自行控制事务**

+ 后端服务方法可以直接传递实体对象，datatable，基础类型，数组等到前端，无须类型转换。

+ 前端js传递参数到后台方法，可以按位置传递，也可传递对象

```javascript
function doSendProcess() {
  var planMonth=$('#__planMonth').val();
  var BUGUID=$('#txtBUGUID').val();  
		var mpProcessGUID = MonthPlanService.GetMpProcessGUID(planMonth,BUGUID);
		initiateBusinessProcess(mpProcessGUID, '资金计划审批');
	}

```

```javascript
function doSendProcess() {
  var planMonth=$('#__planMonth').val();
  var BUGUID=$('#txtBUGUID').val();
		var mpProcessGUID = MonthPlanService.GetMpProcessGUID({planMonth:planMonth,BUGUID: BUGUID});
		initiateBusinessProcess(mpProcessGUID, '资金计划审批');
	}

```


+ 如需要异步调用，在js最后一个参数传入回调处理函数


```javascript
function doSendProcess() {
  var planMonth=$('#__planMonth').val();
  var BUGUID=$('#txtBUGUID').val();
	 MonthPlanService.GetMpProcessGUID({planMonth:planMonth,BUGUID: BUGUID},function(mpProcessGUID){
     	initiateBusinessProcess(mpProcessGUID, '资金计划审批');
   });

	}

```

+ 兼容小平台传参写法，引入/project/js/project.js后，也可支持回调


```javascript
function doSendProcess() {
  var planMonth=$('#__planMonth').val();
  var BUGUID=$('#txtBUGUID').val();
  var option={serviceInfo:"Mysoft.Cbgl.Services.MonthPlanService.GetMpProcessGUID",
              data:{planMonth:planMonth,BUGUID: BUGUID}
  }
	my.project.invokeMethod(option,callbackifneed)

	}

```
