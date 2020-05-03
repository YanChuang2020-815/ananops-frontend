import React, { Component, } from 'react';
import { Button,Row,Col,Table,Input,Popconfirm,message,Icon } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios'
import './index.styl'
const FIRST_PAGE = 0;
const PAGE_SIZE = 10;
const Search = Input.Search;
const token=window.localStorage.getItem('token')
class Inspection extends Component{
  constructor(props){
    super(props)
    this.state={
      current: FIRST_PAGE,
      // size: PAGE_SIZE,
      // // total: 20, 
      // nowCurrent:FIRST_PAGE,
      data:[],
    }
    this.getGroupList = this.getGroupList.bind(this);
  }
  componentDidMount(){
    const { 
      match : { params : { projectId } }
    } = this.props
    var id=projectId
    console.log(id)
    this.getGroupList(id);   
  }
    //获取项目下的全部巡检列表信息
    getGroupList = (id) => {
      axios({
        method: 'POST',
        url: '/pmc/InspectDevice/getTasksByProjectId/'+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+token,
        },
      })
        .then((res) => {
          if(res && res.status === 200){
            console.log(res)
            this.setState({
              data: res.data.result,
            }) ;
            // console.log(this.state.data)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
        
    }
    deleteGroup=(record)=>{
      const { 
        match : { params : { id } }
      } = this.props
      axios({
        method:'POST',
        url:'/pmc/InspectDevice/deleteTaskById/'+record.id,
        headers:{
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+token,
        }           
      }) 
        .then((res) => {
          if(res && res.status === 200){
            console.log(res.data.result)
            this.getGroupList(id)
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    render(){
      const { 
        match : { params : { projectId } }
      } = this.props
      const {data}=this.state
        
      return(
        <div>
          <div className="searchPart">
            <Row>
              {/* <Col span={2}>巡检人姓名：</Col> */}
              <Col span={5}>
                {/* <Search
                    placeholder="搜索从这里开始"
                    enterButton
                    onSearch={value => this.selectActivity(value)}
                /> */}
                <Link to={`/cbd/pro/project`}>
                  <Icon type="arrow-left" ></Icon>返回项目
                </Link>
              </Col>
              <Col push={16}>
                <Link to={`/cbd/pro/inspection/new/${projectId}`}>
                  <Button type="primary">
                                +新建巡检计划
                  </Button>
                </Link>
              </Col>
            </Row> 
          </div>
          <Table
            className="group-list-module"
            bordered
            showHeader={true}
            size='small'
            // pagination={{
            //     current,
            //     total,
            //     pageSize: size,
            //     onChange: this.handlePageChange,
               
            // }}
            rowClassName={this.setRowClassName}
            dataSource={data}
            columns={[{
              title: '巡检计划ID',
              key: 'id',
              render: (text, record) => {
                return ((record.id && record.id) || '--')
              }   
            }, {
              title: '项目ID',
              key: 'projectId',
              render: (text, record) => {
                return (record.projectId && record.projectId) || '--'
              }
            }, {
              title: '项目名称',
              key: 'projectName',
              render: (text, record) => {
                return (record.projectName && record.projectName) || '--'
              }
            },
            {
              title: '计划名称', 
              key: 'deviceName',
              render: (text, record) => {
                return (record.taskName && record.taskName) || '--'
              }
            }, {
              title: '巡检内容',
              key: 'inspectionContent',
              render: (text, record) => {
                return (record.inspectionContent && record.inspectionContent) || '--'
              }
            },
            // {
            //     title: '巡检情况',
            //     key: 'inspectionCondition',
            //     render: (text, record) => {
            //     return (record.inspectionCondition && record.inspectionCondition) || '--'
            //     }
            // },{
            //     title: '处理结果',
            //     key: 'dealResult',
            //     render: (text, record) => {
            //     return (record.dealResult && record.dealResult) || '--'
            //     }
            // },
            {
              title: '操作',
              render: (text, record, index) => (
                <div className="operate-btns"
                  style={{ display: 'block' }}
                >
                  <Link
                    to={`/cbd/pro/inspection/detail/${projectId}/${record.id}`}
                    style={{marginRight:'12px'}}
                  >详情</Link>               
                  <Link
                    to={`/cbd/pro/inspection/edit/${projectId}/${record.id}`}
                    style={{marginRight:'12px'}}
                  >修改</Link>
                  <Popconfirm
                    title="确定要删除吗？"
                    onConfirm={()=> {this.deleteGroup(record)}}
                  >
                    <Button 
                      type="simple"
                      style={{border:'none',padding:0,color:"#357aff",background:'transparent',marginRight:'12px'}}
                    >删除</Button>
                  </Popconfirm>
                  <Link
                    to={`/cbd/pro/sub/${projectId}/${record.id}`}
                    style={{marginRight:'12px'}}
                  >巡检子项</Link>   
                </div>
              ),
            }]}
          />
        </div>
      )
    }
}
export default Inspection;