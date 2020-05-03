// const menuConfig = [
//   {
//     title: '首页',
//     key: '/',
//     icon: 'ome'
//   },
//   {
//     title: '维修维护',
//     key: '/system',
//     icon: 'build',
//   },
//   {
//     title: '项目管理',
//     key: '/contract',
//     icon: 'book',
//     children:[
//       {
//         title: '我的合同',
//         key: '/contract/management',
//       },
//       {
//         title: '我的项目',
//         key: '/contract/project',
//       },
//     ]
//   },
//   {
//     title:'审批管理',
//     key:'/approval',
//     icon: 'solution'  
//   },
//   {
//     title:'账单管理',
//     key:'/bill',
//     icon: 'account-book'  
//   },
//   {
//     title:'系统管理',
//     key:'/system',
//     icon:'laptop',
//     children:[
//       {
//         title:'角色管理',
//         key:'/role',
//         icon: 'robot'
//       },
//       {
//         title:'用户管理',
//         key:'/user',
//         icon: 'user'
//       },
//       {
//         title:'菜单管理',
//         key:'/menu',
//         icon: 'block'
//       },
//       {
//         title:'权限管理',
//         key:'/authority',
//         icon: 'audit'  
//       },
//       {
//         title:'组织管理',
//         key:'/group',
//         icon:'usergroup-add'
//       }
//     ]
//   },
//   {
//     title:'加盟管理',
//     key:'/serviceProvider',
//     icon: 'team',
//     children:[
//       {
//         title: '加盟服务商',
//         key: '/serviceProvider/provider',
//       },{
//         title: '加盟工程师',
//         key: '/serviceProvider/engineer',
//       }]
//   },
//   {
//     title:'报警管理',
//     key:'/alarm',
//     icon: 'alert'  
//   },
//   {
//     title:'验收管理',
//     key:'/acceptance',
//     icon: 'sound'  
//   },
//   {
//     title:'报表管理',
//     key:'/report',
//     icon: 'file-pdf'  
//   }
// ];
const menuConfig = JSON.parse(localStorage.getItem("resMenu"))
  
export default menuConfig;