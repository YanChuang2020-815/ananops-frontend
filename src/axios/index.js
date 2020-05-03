import ajax from './ajax'

//分页获取角色列表
export const reqRoleList = (searchData) => ajax('/uac/role/queryRoleListWithPage',searchData)
//删除角色
export const reqDeleteRole = (id) => ajax('/uac/role/deleteRoleById/'+id)
//批量删除角色
export const reqDeleteBatch = (deleteArr) => ajax('/uac/role/batchDeleteByIdList',deleteArr)
//更改角色状态
export const reqSwitchRoleStatus = (switchRole) => ajax('/uac/role/modifyRoleStatusById',switchRole)
//添加/更新角色
export const reqAddOrUpdateRole = (newRole) => ajax('/uac/role/save',newRole)
//根据用户id获取下级用户列表
export const reqBindUser = (roleId) => ajax('/uac/role/getBindUser/'+roleId)
//角色绑定用户
export const reqRoleBindUser = (dataPost) => ajax('/uac/role/bindUser',dataPost)

//添加/更新工程师
export const reqAddOrUpdateEngineer = (newEngineer) => ajax('/spc/engineer/save',newEngineer)

//根据工程师Id删除工程师
export const reqDeleteEngineerById = (engineerId) => ajax('/spc/engineer/deleteEngineerById/'+engineerId)

//分页获取权限列表
export const reqAuthList = (searchData) => ajax('/uac/action/queryListWithPage',searchData)
//批量删除权限
export const reqDeleteBatchAuth = (deleteArr) => ajax('/uac/action/batchDeleteByIdList',deleteArr)
//删除权限
export const reqDeleteAuth = (id) => ajax('/uac/action/deleteActionById/'+id)
//更改权限状态
export const reqSwitchAuthStatus = (switchAuth) => ajax('/uac/action/modifyStatus',switchAuth)
//添加/更新权限
export const reqAddOrUpdateAuth = (newAuth) => ajax('/uac/action/save',newAuth)
//获取角色权限树
export const reqGetActionTreeByRoleId = (roleId) => ajax('/uac/role/getActionTreeByRoleId/'+roleId)
//获取菜单树
export const reqGetMenuTree = () => ajax('/uac/menu/getTree');
//编辑菜单
export const reqSaveMenu  = (menu) => ajax('/uac/menu/save',menu);
//删除菜单
export const reqDeleteMenu = (id) => ajax('/uac/menu/deleteById/'+id);
//获取api列表
export const reqGetApis = () => ajax('/uac/acl/getApis');


//loginAfter获取用户整体信息
export const reqLoginAfter = () => ajax('/uac/user/loginAfter/1')
//修改密码
export const reqChangePwd = (dataPost) => ajax('/uac/user/authUserModifyPwd',dataPost)


//获取用户列表
export const reqUserList = (searchData) => ajax('/uac/user/queryListWithPage',searchData)
//根据部门组织Id获取成员用户列表
export const reqDepartUserList = (searchData) => ajax('/uac/group/getUsersByGroupId',searchData)
//更改用户状态
export const reqSwitchUserStatus = (switchUser) => ajax('/uac/user/modifyUserStatusById',switchUser)
//添加/更新用户
export const reqAddOrUpdateUser = (newUser) => ajax('/uac/user/save',newUser)
//根据用户id重置密码
export const reqResetPwd = (userId) => ajax('/uac/user/resetLoginPwd/'+userId)
//删除用户
export const reqDeleteUser = (id) => ajax('/uac/user/deleteUserById/'+id)
//根据登陆用户查询组织列表
export const reqGroupList = () => ajax('/uac/group/getGroupTree')
//获取企业列表
export const reqGetCompanyList = () => ajax('/uac/group/getCompanyList')
//获取组织树
export const reqGroupTree = () => ajax('/uac/group/getTree')
//删除组织
export const reqDeleteGroupById = (id) => ajax('/uac/group/deleteById/'+id)
//查询组织详情
export const reqQueryById = (id) => ajax('/uac/group/queryById/'+id)
//查询在线用户列表
export const reqOnlineUsers = (dataPost) => ajax('/uac/token/queryListWithPage',dataPost)
//查询某用户的操作日志
export const reqUserLogs = (dataPost) => ajax('/uac/user/queryUserLogListWithPage',dataPost)
//根据userId获取绑定角色
export const reqBindRole = (userId) => ajax('/uac/user/getPermitBindRole/'+userId)
//用户绑定组织
export const reqBindGroup = (dataPost) => ajax('/uac/user/bindGroup',dataPost)

//获取操作日志
export const reqLogs = (dataPost) => ajax('/uac/log/queryListWithPage',dataPost)
//强制退出用户
export const reqForceLogout = (accessToken) => ajax('/uac/user/logout?accessToken='+accessToken)
//带搜索获取异常信息
export const reqExceptions = (dataPost) => ajax('/mdc/exception/queryListWithPage',dataPost)



//获取未审批列表
export const reqExamines = (dataPost) => ajax('/activiti/approve/untask',dataPost)
//审批根据工单ID获取工单信息
export const reqOrderInfo = (taskId) => ajax('/mdmc/mdmcTask/getTaskByTaskId',{taskId},'GET')
//获取已审批列表
export const reqTasked = (dataPost) => ajax('/activiti/approve/tasked',dataPost)
//审核不通过
export const reqDisagree = (dataPost) => ajax('/activiti/approve/disagree',dataPost)
//审核通过
export const reqAgree = (dataPost) => ajax('/activiti/approve/agree',dataPost)
//获取批注
export const reqComment = (processInstanceId) => ajax('/activiti/base/getComment',{processInstanceId},'GET')



//新建/编辑组织信息
export const reqAddOrUpdateGroup = (dataPost) => ajax('/uac/group/save',dataPost)
//添加或修改用户信息时，登录名校验
export const reqValidateUserLoginName = (dataPost) => ajax('/uac/auth/checkValid',dataPost)
//用户绑定角色
export const reqUserBindRole = (dataPost) => ajax('/uac/user/bindRole',dataPost)


//根据登录userId查询公司信息
export const reqCompanyInfo = (userId) => ajax('/spc/company/getSpcCompanyByUserId/'+userId)

//获取地址列表
export const reqAddressList = () => ajax('/mdc/address/get4City')


//编辑保存服务商信息
export const reqEditProvider = (dataPost) => ajax('/spc/company/save',dataPost)

export const reqMdcDict = (dictId) => ajax('/mdc/dict/queryById/'+dictId)

//查询websocket信息
export const reqMessage = (reqMsg) => ajax('/websocket/websocket/queryWebsocketMsgInfo',reqMsg)
//修改信息已读未读
export const reqChangeMsgState = (msgBody) => ajax('/websocket/websocket/changeWebsocketMsgStatus',msgBody)


// 动态表单相关接口
export const reqInspcFormSchema = () => ajax('/mdc/formSchema/getInspcFormSchema',{},'GET')
// 根据动态表单Id获取动态表单模板
export const reqFormTemplate = (templateId) => ajax('/mdc/formTemplate/queryById/'+templateId)
// 根据动态表单Id获取动态表单模板数据
export const getFormTemplateDetailById = (templateId) => ajax('/mdc/formTemplate/queryDetailsById/'+templateId)
// 根据巡检单据Id获取动态表单模板数据
export const getInvoiceItemDetailById = (invoiceId) => ajax('/imc/itemInvoice/queryDetailsById/'+invoiceId)