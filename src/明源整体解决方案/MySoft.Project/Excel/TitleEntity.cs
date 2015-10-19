using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Mysoft.Project.Excel
{
    public class TitleEntity
    {
        public TitleEntity(string fieldName, string textName)
        {
            this.FieldName = fieldName;
            this.TextName = textName;
        }
        /// <summary>
        /// 对应的字段名
        /// </summary>
        public string FieldName { get; set; }
        /// <summary>
        /// 对应显示名
        /// </summary>
        public string TextName { get; set; }
    }
}
