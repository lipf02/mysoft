using System;
using Mysoft.Project.Core.DataAnnotations;
using System.ComponentModel.DataAnnotations;
namespace Mysoft.BusinessPortal.Entity
{
	/// <summary>
	///�û���
	/// </summary>
	public partial class myUser
	{
		public myUser()
		{
			this.IsDisabeld  =  0 ;
			this.IsAdmin  =  0 ;
			this.IsSaler  =  0 ;
			this.IsAdvanceUser  =  0 ;
			this.UserKind  =  0 ;
			this.IsUserChangePWD  =  0 ;
			this.IsLocked  =  0 ;
			this.IsMobileUser  =  0 ;
		}
		
		/// <summary>
		///�û�GUID
		/// </summary>
		[ID]
		public String  UserGUID { get; set; }
		
		/// <summary>
		///�û�����
		/// </summary>
		[StringLength(16)]
		public String  UserCode { get; set; }
		
		/// <summary>
		///�û�����
		/// </summary>
		[StringLength(20)]
		public String  UserName { get; set; }
		
		/// <summary>
		///������˾
		/// </summary>
		public String  BUGUID { get; set; }
		
		/// <summary>
		///��Ƭ��ַ
		/// </summary>
		[StringLength(50)]
		public String  PhotoUrl { get; set; }
		
		/// <summary>
		///ְλ
		/// </summary>
		[StringLength(50)]
		public String  JobTitle { get; set; }
		
		/// <summary>
		///��������
		/// </summary>
		[StringLength(50)]
		public String  Email { get; set; }
		
		/// <summary>
		///��˾�绰
		/// </summary>
		[StringLength(20)]
		public String  OfficePhone { get; set; }
		
		/// <summary>
		///�ƶ��绰
		/// </summary>
		[StringLength(20)]
		public String  MobilePhone { get; set; }
		
		/// <summary>
		///��ͥ�绰
		/// </summary>
		[StringLength(20)]
		public String  HomePhone { get; set; }
		
		/// <summary>
		///AD��½�ʺ�
		/// </summary>
		[StringLength(50)]
		public String  ADAccount { get; set; }
		
		/// <summary>
		///����ʱ��
		/// </summary>
		public DateTime?  CreatedOn { get; set; }
		
		/// <summary>
		///�޸�ʱ��
		/// </summary>
		[StringLength(50)]
		public String  ModifiedOn { get; set; }
		
		/// <summary>
		///������
		/// </summary>
		public String  CreatedBy { get; set; }
		
		/// <summary>
		///�޸���
		/// </summary>
		public String  ModifiedBy { get; set; }
		
		/// <summary>
		///�Ƿ����
		/// </summary>
		public Int16  IsDisabeld { get; set; }
		
		/// <summary>
		///����ԭ��
		/// </summary>
		[StringLength(200)]
		public String  DisabledReason { get; set; }
		
		/// <summary>
		///��ע
		/// </summary>
		[StringLength(200)]
		public String  Comments { get; set; }
		
		/// <summary>
		///������˾2
		/// </summary>
		public String  ParentGUID { get; set; }
		
		/// <summary>
		///����
		/// </summary>
		[StringLength(50)]
		public String  Password { get; set; }
		
		/// <summary>
		///�Ƿ񳬼��û�
		/// </summary>
		public Int16  IsAdmin { get; set; }
		
		/// <summary>
		///�Ƿ�����Ա
		/// </summary>
		public Int16  IsSaler { get; set; }
		
		/// <summary>
		///����
		/// </summary>
		[StringLength(50)]
		public String  JobNumber { get; set; }
		
		/// <summary>
		///��������
		/// </summary>
		public String  DepartmentGUID { get; set; }
		
		/// <summary>
		///�û���Ŀ����
		/// </summary>
		[StringLength(16)]
		public String  UserProject { get; set; }
		
		/// <summary>
		///�Ƿ�߼��û�
		/// </summary>
		public Int16  IsAdvanceUser { get; set; }
		
		/// <summary>
		///Ĭ�ϸ�λ
		/// </summary>
		public String  DefaultStation { get; set; }
		
		/// <summary>
		///�û�����
		/// </summary>
		public Byte  UserKind { get; set; }
		
		/// <summary>
		///�����޸�ʱ��
		/// </summary>
		public DateTime?  PSWModifyTime { get; set; }
		
		/// <summary>
		///�Ƿ��û��Լ���������
		/// </summary>
		public Byte  IsUserChangePWD { get; set; }
		
		/// <summary>
		///�Ƿ�����
		/// </summary>
		public Byte  IsLocked { get; set; }
		
		/// <summary>
		///�Ƿ��ƶ��û�
		/// </summary>
		public Byte  IsMobileUser { get; set; }
		
		public DateTime?  LockTime { get; set; }
		
	}
}
