using System;
using Mysoft.Project.Core.DataAnnotations;
using System.ComponentModel.DataAnnotations;
namespace Mysoft.BusinessPortal.Entity
{
	/// <summary>
	///�ҹ�ע�Ĺ�˾
	/// </summary>
	public partial class myAttentionCompany
	{
		public myAttentionCompany()
		{
		}
		
		/// <summary>
		///����
		/// </summary>
		public String  Id { get; set; }
		
		/// <summary>
		///�û�GUID
		/// </summary>
		public String  UserGUID { get; set; }
		
		/// <summary>
		///��˾GUID
		/// </summary>
		[StringLength(8000)]
		public String  CompanyGUID { get; set; }
		
	}
}
