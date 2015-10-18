<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="AppForm.aspx.cs" Inherits="Project.AppForm" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> 
    <meta http-equiv="X-UA-Compatible" content="IE=8" />
    <title></title>
    <style type="text/css">
        html { font-family:SimSun;font-size:14px;}
        .text{ width:60px;border:none;border-bottom:1px solid #000; }
        .number{ width:60px;border:none;border-bottom:1px solid #000; }
        .content{ width:1000px;border:1px solid #000;margin-top:22px;}
        .memuImg { width:24px;height:24px;}
        .delete { cursor:pointer;width:16px; }
        .tab { border:1px solid #000;cursor:pointer;padding:4px;}
        .tabOn { border:1px solid #000;cursor:pointer;padding:4px;background:#2981A9;color:#fff;}
        .tabContent { padding:4px;position:fixed;top:1px;background:#fff;z-index:999;width:994px;border:none;border-bottom:1px solid #000;}
        .check span { color:red;}
        .pthree {margin-left:-40px;padding-left:40px;}
    </style>
    <script src="/Project/js/jquery-1.11.3.min.js"></script>
    <script src="/Project/Js/XmlCheck/Jquery/jquery.contextmenu.r2.js"></script>
    <script src="/Project/Js/XmlCheck/AppForm/AppForm.js"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            
        }); 
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>     
        <div class="tabContent" > 
            <span class="tabOn" onclick="ChangeTo('Design',this)">Design视图</span>
            <span class="tab" onclick="ChangeTo('Xml',this)">Xml视图</span>
            <span class="tab" onclick="ChangeTo('Check',this)" style="display:none;" id="checkView">检查视图</span>
        </div>
        <div class="content" id="Design">
            <div style="padding:0px;">
                <div style="padding-left:0px;">&lt;control id="<input type="text" class="text" value="appForm" id="txtControlId"/> "&gt; </div>
                <div style="padding-left:20px;">&lt;datasource entity="<input type="text" class="text" id="txtentity" /> " keyname="<input type="text" class="text" id="txtkeyname" /> "&gt;</div>
                <div style="padding-left:40px;">&lt;sql&gt;</div>
                <div style="padding-left:60px;"><textarea cols="50" rows="10" id="txtSql"></textarea></div>
                <div style="padding-left:40px;">&lt;/sql&gt; </div>
                <div style="padding-left:20px;">&lt;/datasource&gt; </div>
                <div style="padding-left:20px;">&lt;form showtab="<select id="sshowtab">
                        <option>true</option>
                        <option selected="selected">false</option>
                      </select>" &gt; <span onclick='DefaultTab();ToHtml();' class='delete'>+</span>
                </div>
                <div id="tabs"></div>  
                <div style="padding-left:20px;">/form&gt;</div>            
                <div style="padding-left:0px;">&lt;/control&gt;</div>  
            </div>           
        </div> 
        <div class="content" id="Xml" style="display:none;">
            <textarea id="txml" cols="122" rows="32" onchange="ToEntity(this);" style="border:none;"></textarea>
        </div>  
        <div class="content" id="Check" style="display:none;" >
            <div id="divCheck" class="check" >
                
            </div>
        </div>
    </div>

    <div class="contextMenu" id="ItemMenu">
	    <ul>
		    <li id="hidden"><img src="/Project/images/hidden.ico" class="memuImg" /> hidden</li>
		    <li id="text"><img src="/Project/images/text.ico" class="memuImg"/> text</li>
		    <li id="memo"><img src="/Project/images/memo.ico" class="memuImg"/> memo</li>
		    <li id="password"><img src="/Project/images/password.ico" class="memuImg" /> password</li>
		    <li id="number"><img src="/Project/images/number.ico" class="memuImg" /> number</li>
            <li id="datetime"><img src="/Project/images/datetime.ico" class="memuImg" /> datetime</li>
		    <li id="radio"><img src="/Project/images/radio.ico" class="memuImg" /> radio</li>
		    <li id="select"><img src="/Project/images/select.ico" class="memuImg" /> select</li>
		    <li id="lookup"><img src="/Project/images/lookup.ico" class="memuImg" /> lookup</li>
		    <li id="hyperlink"><img src="/Project/images/hyperlink.ico" class="memuImg" /> hyperlink</li>
		    <li id="blank"><img src="/Project/images/blank.ico" class="memuImg" /> blank</li>
	    </ul>
    </div>
    </form>
</body>
</html>
