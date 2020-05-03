
import React, {Component} from 'react'
import {Table, Button, Card, Select, Input, Icon, Modal, message, Upload, Descriptions} from 'antd'
import LinkButton from '../../../components/link-button'
import axios from 'axios';
import Add from './add'
import Update from './update'
import {reqSwitchUserStatus,reqResetPwd,reqDeleteEngineerById,reqAddOrUpdateEngineer} from '../../../axios/index'

const Option = Select.Option
const FIRST_PAGE = 0;
const PAGE_SIZE = 30;
export default class Engineer extends Component {
    state = {
      user:{},
      total: 0,//角色总条数
      current: FIRST_PAGE,
      size: PAGE_SIZE,
      nowCurrent: FIRST_PAGE,
      data: [],
      addDetail: {},
      updateDetail: {},
      token: window.localStorage.getItem('token'),
      isShowUpdate:false,
      roleCode:window.localStorage.getItem('roleCode')
    }

    componentDidMount() {
      this.getInfo(FIRST_PAGE)
    }

    getInfo = (page) => {
      const {size, total} = this.state;
      const values = {pageSize: size, pageNum: page, position: 'engineer'}
      axios({
        method: 'POST',
        url: '/spc/engineer/queryAllEngineers',
        headers: {
          'deviceId': this.deviceId,
          'Authorization': 'Bearer ' + this.state.token,
        },
        data: values
      })
        .then((res) => {
          if (res && res.status === 200) {
            this.setState({
              data: res.data.result.list,
              nowCurrent: res.data.result.pageNum,
              total: res.data.result.total
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  
   
    showAdd = () => {
      this.setState({
        addVisible: true
      })
    }
    addOk = e => {
      this.setState({
        addVisible: false
      })
      const values = this.form.getFieldsValue()
      console.log(values)
      axios({
        contentType: 'application/json',
        method: 'POST',
        url: '/spc/engineer/add',
        headers: {
          'deviceId': this.deviceId,
          'Authorization': 'Bearer ' + this.state.token,
        },
        data: values
      })
        .then((res) => {
          if (res && res.status === 200) {
            this.form.resetFields();
            this.getInfo(FIRST_PAGE);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
            
    }
    addCancel = () => {
      this.setState({
        addVisible: false
      })
    }

    showUpdate = () => {
      this.setState({
        isShowUpdate: true
      })
    }
    updateCancel = () => {
      this.setState({
        isShowUpdate: false
      })
    }
    updateOk = e => {
      this.setState({
        isShowUpdate: false
      })
      const values = this.form.getFieldsValue()
      console.log("修改，模态框采集到的values",values)
      axios({
        contentType: 'application/json',
        method: 'POST',
        url: '/spc/engineer/save',
        headers: {
          'deviceId': this.deviceId,
          'Authorization': 'Bearer ' + this.state.token,
        },
        data: values
      })
        .then((res) => {
          if (res && res.status === 200) {
            this.getInfo(FIRST_PAGE)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    showUpdate = (user) => {
      this.setState({user,isShowAddUpdate:true})
    }
    //更改或增添
    addOrUpdateEngineer = async () => {
      this.setState({isShowAddUpdate:false})
      const user = this.form.getFieldsValue()
      this.form.resetFields()
      console.log('修改,模态框采集的role：',user)
  
      if(this.state.user){//更新
        const newUser = {}
        Object.assign(newUser,this.state.user,user)
        console.log('修改，发送的role：',newUser)
         
        const result = await reqAddOrUpdateEngineer(newUser)
        if(result.code === 200){
          this.setState({user:{}},()=>{
            this.getInfo(1)
          })
          
        }
  
      }else{//添加
        const newUser = {}
        Object.assign(newUser,user)
        const result = await reqAddOrUpdateEngineer(newUser)
        if(result.code===200){
          this.getInfo(1)
        }
      }
    }
  



    //启用/禁用
    updateStatus = async (userId,status) => {
      const dataPost = {
        "userId":userId,
        "status":status
      }
      this.setState({loading:true})
      const result = await reqSwitchUserStatus(dataPost)
      if(result.code === 200){
        this.getInfo(FIRST_PAGE)
      }
    }

    resetPwd = (userId) => {
      Modal.confirm({
        title:`确认重置该工程师的登录密码吗？`,
        onOk: async () => {
          const result = await reqResetPwd(userId)
          if(result.code===200){
            message.success('重置密码成功')
            this.getInfo(FIRST_PAGE)
          }
        }
      })
    }

    deleteEngineerById = (userId) => {
      Modal.confirm({
        title:`确认删除该工程师账户吗？`,
        onOk: async () => {
          const result = await reqDeleteEngineerById(userId)
          if(result.code===200){
            message.success('成功删除该用户！')
            this.getInfo(FIRST_PAGE)
          } else {
            message.error(result.message);
          }
        }
      })
    }

    render() {
      let deviceId = new Date().getTime();
      const props = {
        action: '/spc/engineer/uploadEngineerExcelFile',
        headers: {
          authorization: 'Bearer ' + window.localStorage.getItem('token'),
          'deviceId': deviceId,
        },
        onChange(info) {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
      };
      const {current, size, total, data, addDetail,user, isShowAddUpdate} = this.state
      const extra = (
        <span>
          <Button type="primary" style={{marginRight: '15px'}} onClick={() => this.showAdd()}><Icon
            type="plus"
          />添加工程师</Button>
        </span>
      )

      return (
        <div>
          <div>
            <Descriptions bordered>
              <Descriptions.Item label="批量导入">
                <Upload {...props} >
                  <Button>
                    <Icon type="upload"/> 批量添加工程师
                  </Button>
                </Upload>
              </Descriptions.Item>
              <Descriptions.Item label="导入模板下载">
                <a href="http://open.ananops.com/835458504838878208.xlsx">
                                模板下载</a>
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div>
            <Card title={'工程师信息'} extra={extra}>

              <Table
                className="group-list-module"
                bordered
                size='small'
                showHeader={true}
                scroll={{ x: 500 }}
                pagination={{
                  current,
                  pageSize: size,
                  onChange: this.handlePageChange,
                  showTotal: () => `共${total} 条数据`
                }}
                rowClassName={this.setRowClassName}
                dataSource={data}
                columns={[
                  {
                    title:'序号',
                    fixed:'left',
                    width:50,
                    render:(text,record,index)=> `${index+1}`,
                  },
                  {
                    title: '登录名',
                    dataIndex: 'loginName',
                    width: 120,
                  },
                  {
                    title: '性别',
                    dataIndex: 'sex',
                    width: 50,
                    render: (text, record) => {
                      return (record.sex && record.sex) || '--'
                    }
                  },
                  {
                    title: '身份证号码',
                    dataIndex: 'identityNumber',
                    width: 210
                  },
                  {
                    title: '工号',
                    dataIndex: 'userCode',
                    width: 150
                  },
                  {
                    title: '职称证书编号',
                    dataIndex: 'titleCeNumber',
                    width: 180,
                    render: (text, record) => {
                      return (record.titleCeNumber && record.titleCeNumber) || '--'
                    }
                  },
                  {
                    title: '手机号',
                    dataIndex: 'mobileNo',
                    width: 150,
                  },
                  {
                    title: '邮箱',
                    dataIndex: 'email',
                    width: 180,
                  },
                  {
                    title: '学历',
                    dataIndex: 'education',
                    width: 100,
                    render: (text, record) => {
                      return (record.education && record.education) || '--'
                    }
                  },
                  {
                    title:'状态',
                    dataIndex:'status',
                    width:70,
                    render:(status)=>{return <span>{status==='ENABLE'?'启用':'禁用'}</span>}
                  },
                  {
                    title: '位置',
                    dataIndex: 'location',
                    width: 220,
                    render: (text, record) => {
                      return (record.location && record.location) || '--'
                    }
                  },
                  {
                    title:'操作',
                    width:160,
                    fixed:'right',
                    render: (user) => {
                      const {userId,status,id} = user
                      return (
                        <span>
                          <LinkButton onClick={() => this.updateStatus(userId,status==='ENABLE'?'DISABLE':'ENABLE')}>{status==='DISABLE'?'启用':'禁用'}</LinkButton>|
                          <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>|
                          <LinkButton onClick={() => {this.props.history.push({pathname:'/uas/user/list/detail',state:user});console.log(user)}}>详情</LinkButton>|
                          <LinkButton onClick={() => this.resetPwd(userId)}>重置密码</LinkButton>|
                          <LinkButton onClick={() => this.deleteEngineerById(id)}>删除</LinkButton>
                        </span>
                      )
                    }
                  }
                ]}
              />
              
              {/*<Modal
                title="编辑工程师"
                visible={this.state.isShowUpdate}
                onOk={this.updateOK}
                onCancel={this.updateCancel}
              >
                <Update setForm={(form) => {
                  this.form = form
                }} updateDetail={updateDetail}/>
              </Modal>*/}
              <Modal
                title={user.userId?'编辑工程师信息':'添加工程师'}
                visible={isShowAddUpdate}
                onOk={this.addOrUpdateEngineer}
                onCancel={() => {this.setState({isShowAddUpdate:false,user:{}});this.form.resetFields();}}
              >
                <Update
                  setForm={(form)=>{this.form = form}}
                  user={user}
                />
              </Modal>
              <Modal
                title="添加工程师"
                visible={this.state.addVisible}
                onOk={this.addOk}
                onCancel={this.addCancel}
              >
                <Add setSubmit={(form) => {
                  this.form = form
                }} addDetail={addDetail}
                />
              </Modal>
            </Card>
          </div>
        </div>
      )
    }
}