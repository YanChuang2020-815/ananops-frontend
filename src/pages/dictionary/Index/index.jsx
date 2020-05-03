import React, { Component, } from 'react';
import { Button,Row,Col,Table,Input,Popconfirm,Modal,message,Tag } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios';
import Add from'./add'
import './index.styl'
import {reqMdcDict} from '../../../axios/index'


const FIRST_PAGE = 0;
const PAGE_SIZE = 10;
const Search = Input.Search;
const loginAfter = JSON.parse(window.localStorage.getItem('loginAfter'));
const userId = loginAfter.loginAuthDto.userId;


class Dictionary extends Component{
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
      selectedRowKeys:[], //当前选中的字典库组
    }
    this.getDictListByUserId = this.getDictListByUserId.bind(this);
  }
  initColumns = () => {
    this.columns = [
      {
        title:'序号',
        width:50,
        fixed:'left',
        render:(text,record,index)=> `${index+1}`,
      },{
        title: '名称',
        dataIndex: 'name',
        render: (text, record) => {
          return ((record.name) || '--')
        }   
      },{
        title: '状态',
        dataIndex: 'status',
        render: (text, record) => {
          var dictStatus = record.status;
          if (dictStatus) {
            dictStatus = dictStatus === 'Y' ? '有效' : '无效';
          }
          return (dictStatus) || '--'
        }
      },{
        title: '类型',
        dataIndex: 'dictLevel',
        render: (text, record) => {
          var level = record.dictLevel;
          if (level) {
            level = level === 'system' ? '系统' : '业务';
          }
          return (level) || '--'
        }
      },{
        title: '操作',
        render: (text, record, index) => (
          <div className="operate-btns"
            style={{ display: 'block' }}
          >
            <Link
              to={`/mds/dict/list/dictItem/${record.id}`}
              style={{marginRight:'12px'}}
            >字典项</Link>  
            {/*<Link
              to={`/mds/dict/list/edit/${record.dict.id}`}
              style={{marginRight:'12px'}}
            >修改</Link> */}
            {(record.groupId === '-1' && this.state.roleCode !== 'admin') ? <Tag color="#f50">系统字典库</Tag> : 
            <Popconfirm
                title="确定要删除吗？"
                onConfirm={()=> {this.deleteDictByDictId(record)}}
              >
                <Button 
                  type="simple"
                  style={{border:'none',padding:0,color:"#357aff",background:'transparent',marginRight:'12px'}}
                >删除</Button>
              </Popconfirm>}
          </div>
        ),
      }
    ]
  }
  componentDidMount(){
    this.getDictListByUserId(userId);
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
    const result = await reqMdcDict(selectedRowKeys)
    if(result.code===200){
      this.setState({
        addDetail: result.result,
        addVisible: true
      })
    } else {
      message.error("系统字典库，不允许更新！");
    }
  }

  addOk = e => {
    this.setState({
      addVisible: false
    })
    const {addDetail}=this.state;
    const values = this.form.getFieldsValue();
    if (values.name === undefined) {
      message.error('字典库名称为必填项');
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
      url: '/mdc/dict/save',
      headers: {
        'Content-Type': 'application/json',
        'deviceId': this.deviceId,
        'Authorization':'Bearer '+this.state.token,
      },
      data:JSON.stringify(values)
    })
      .then((res) => {
        if(res && res.status === 200){
          if (res.data.code === 10021031) {
            message.error(res.data.message);
          } else {
            message.info(res.data.message);
          }
          this.form.resetFields();
          this.getDictListByUserId(userId);
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


    //根据用户id获取字典库列表GET 
    getDictListByUserId = (userId) => {
      axios({ 
        method: 'GET',
        url: '/mdc/dict/getDictListByUserId?userId='+userId,
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
            }) ;
          }
        })
        .catch(function (error) {
          console.log(error);
        });       
    }

    //根据字典库id删除字典库及其所属字典项
    deleteDictByDictId = (record) => {
      axios({
        method: 'POST',
        url: '/mdc/dict/deleteDictByDictId/'+ record.id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization': 'Bearer '+ this.state.token,
        }
      })
        .then((res) => {
          if (res && res.status === 200) {
            console.log(res.data.result)
            this.getDictListByUserId(userId);
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
                <Button type="primary" style={{marginRight: '15px'}} onClick={() => this.showAdd()}>新建</Button>
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
            scroll={{ x: 500 }}
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
            title={addDetail.id ? '编辑字典库':'添加字典库'}
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
export default Dictionary;