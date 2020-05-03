import React, { Component, } from 'react';
import { Button,Row,Col,Table,Input,Popconfirm,Modal,message,Tag } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios';
import Add from'./add'
import './index.styl'
import {reqFormTemplate} from '../../../axios/index'

const FIRST_PAGE = 0;
const PAGE_SIZE = 10;
const Search = Input.Search;
const loginAfter = JSON.parse(window.localStorage.getItem('loginAfter'));
const userId = loginAfter.loginAuthDto.userId;

class FormTemplate extends Component{
  constructor(props){
    super(props)
    this.state={
      addVisible:false,
      groupId: JSON.parse(window.localStorage.getItem('loginAfter')).loginAuthDto.groupId,
      roleCode: window.localStorage.getItem('roleCode'),
      addDetail: {},
      current: FIRST_PAGE,
      token: window.localStorage.getItem('token'),
      data:[],
      selectedRowKeys:[], //当前选中的巡检表单
    }
    this.getFormTemplateList = this.getFormTemplateList.bind(this);
  }
  initColumns = () => {
    this.columns = [
      {
        title:'序号',
        width:50,
        fixed:'left',
        render:(text,record,index)=> `${index+1}`,
      },{
        title: '模板说明',
        dataIndex: 'mark',
        render: (text, record) => {
          return ((record.mark) || '--')
        }   
      },{
        title: '唯一编号',
        dataIndex: 'id',
        width: 180,
        render: (text, record) => {
          return ((record.id) || '--')
        }   
      },{
        title: '状态',
        dataIndex: 'status',
        width: 60,
        render: (text, record) => {
          var templateStatus = record.status;
          if (templateStatus) {
            templateStatus = templateStatus === 'Y' ? '有效' : '无效';
          }
          return (templateStatus) || '--'
        }
      },{
        title: '类型',
        dataIndex: 'type',
        width: 60,
        render: (text, record) => {
          var type = record.type;
          if (type) {
            type = type === 'system' ? '系统' : '业务';
          }
          return (type) || '--'
        }
      },{
        title: '关联项目',
        dataIndex: 'projectId',
        width: 80,
        render: (text, record) => {
          var projectId = record.projectId;
          return projectId = projectId === null ? '未关联' : '已关联';
        }
      },{
        title: '项目名称',
        dataIndex: 'projectName',
        render: (text, record) => {
          return ((record.projectName) || '--')
        }
      },{
        title: '操作',
        fixed:'right',
        render: (text, record, index) => (
          <div className="operate-btns"
            style={{ display: 'block' }}
          >
            <Link
              to={`/mds/form/list/edit/${record.id}`}
              style={{marginRight:'12px'}}
            >编辑内容项</Link>  
            {/*<Link
              to={`/mds/dict/list/edit/${record.dict.id}`}
              style={{marginRight:'12px'}}
            >修改</Link> */}
            <Popconfirm
                title="确定要删除吗？"
                onConfirm={()=> {this.deleteFormTemplateById(record)}}
              >
                <Button 
                  type="simple"
                  style={{border:'none',padding:0,color:"#357aff",background:'transparent',marginRight:'12px'}}
                >删除</Button>
              </Popconfirm>
          </div>
        ),
      }
    ]
  }
  componentDidMount(){
    this.getFormTemplateList();
    this.initColumns();
  }
  
  showAdd = () => {
    this.setState({
      addVisible: true,
      addDetail: {}
    })
  }
  showUpdate = async() => {
    const {selectedRowKeys}=this.state;
    var len = selectedRowKeys.length;
    if (len < 1) {
      message.error("请选择一项字典库！");
      return;
    }
    if (len > 1) {
      message.error("只允许选择一项字典库！");
      return;
    }
    const result = await reqFormTemplate(selectedRowKeys)
    if(result.code===200){
      this.setState({
        addDetail: result.result,
        addVisible: true
      })
    } else {
      message.error("系统模板，不允许更新！");
    }
  }

  addOk = e => {
    this.setState({
      addVisible: false
    })
    const {addDetail}=this.state;
    const values = this.form.getFieldsValue();
    if (values.mark === null) {
      message.error('请填写表单模板说明');
      return;
    }
    values.id = addDetail.id;
    if(this.state.roleCode === 'admin' ){
      values.groupId=-1 ;
    }
    else{
      values.groupId=this.state.groupId;
    }
    axios({
      method: 'POST',
      url: '/mdc/formTemplate/update',
      headers: {
        'Content-Type': 'application/json',
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:JSON.stringify(values)
    })
      .then((res) => {
        if(res && res.status === 200){
          if (res.data.code === 10021038) {
            message.error(res.data.message);
          } else {
            message.info(res.data.message);
          }
          this.form.resetFields();
          this.getFormTemplateList();
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

    //获取巡检表单模板列表GET 
    getFormTemplateList = () => {
      axios({ 
        method: 'GET',
        url: '/mdc/formTemplate/getFormTemplateList',
        headers: { 
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
        .then((res) => {
          if(res && res.status === 200){
            console.log(res)
            this.setState({
              data: res.data.result,
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });       
    }

    //根据字典库id删除字典库及其所属字典项
    deleteFormTemplateById = (record) => {
      axios({
        method: 'POST',
        url: '/mdc/formTemplate/deleteFormTemplateById/'+ record.id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization': 'Bearer '+ this.state.token,
        }
      })
      .then((res) => {
        if (res && res.status === 200) {
          this.getFormTemplateList();
        }
      })
      .catch(function (error) {
        console.log(error);
        message.error("类型为系统类型，不允许删除！");
      });
    }

    selectRow = (record) => {
      const selectedRowKeys = [...this.state.selectedRowKeys];
      if (selectedRowKeys.indexOf(record.id) >= 0) {
        selectedRowKeys.splice(selectedRowKeys.indexOf(record.id), 1);
      } else {
        selectedRowKeys.push(record.id);
      }
      this.setState({
        selectedRowKeys : selectedRowKeys
      });
    }
  
    onSelectedRowKeysChange = (selectedRowKeys) => {
      this.setState({
        selectedRowKeys : selectedRowKeys
      });
    }

    render(){
      const {data,addDetail,selectedRowKeys}=this.state;
      const rowSelection = {
        selectedRowKeys,
        onChange:this.onSelectedRowKeysChange,
      }
      return(
        <div>
          <div>
            <Row gutter={[16, 16]}>
              <Col span={2}>
                <Link to={"/mds/form/list/new"}>
                        <Button type="primary">
                                    新建
                        </Button>
                    </Link>
              </Col>
              <Col span={2}>
                <Button type="primary" style={{marginRight: '15px'}} onClick={() => this.showUpdate()}>更新</Button>
              </Col>
            </Row>
          </div>

          <Table
            bordered
            showHeader={true}
            dataSource={data}
            columns={this.columns}
            scroll={{ x: 1200 }}
            rowKey="id"
            size='small'
            rowSelection={rowSelection}
            onRow={(record)=>({
              onClick:()=>{
                this.selectRow(record)
              }
            })}
          />

          <Modal
            title='更新巡检表单模板'
            visible={this.state.addVisible}
            onOk={this.addOk}
            onCancel={() => {this.setState({addVisible:false});this.form.resetFields();}}
          >
            <Add setSubmit={(form) => {
              this.form = form
            }} addDetail={addDetail}
            />
          </Modal>
        </div>
      )
    }
}
export default FormTemplate;