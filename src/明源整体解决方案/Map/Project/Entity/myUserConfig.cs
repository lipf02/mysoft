using System;
using Mysoft.Project.Core.DataAnnotations;
using System.ComponentModel.DataAnnotations;
namespace Mysoft.BusinessPortal.Entity
{
	/// <summary>
	///�û�����
	/// </summary>
	public partial class myUserConfig
	{
		public myUserConfig()
		{
		}
		
		/// <summary>
		///�û�GUID
		/// </summary>
		[ID]
		public String  UserGUID { get; set; }
		
		/// <summary>
		///����Ĭ�ϻ��ܷ�ʽ
		/// </summary>
		[StringLength(10)]
		public String  SummaryKind { get; set; }
		
	}
}
