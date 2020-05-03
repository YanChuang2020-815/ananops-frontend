import React,{Component,} from 'react'
import { Button,Row,Col,Table,Input,Select,Popconfirm,message  } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import './index.styl'
import axios from 'axios'
const FIRST_PAGE = 0;
const PAGE_SIZE = 10;
const Search = Input.Search;

class Sub extends Component{
  constructor(props){
    super(props)
    this.state={
      data:{},
      token:window.localStorage.getItem('token'),
      roleCode:window.localStorage.getItem('roleCode'),
      size: PAGE_SIZE,
      // total: 20, 
      nowCurrent:FIRST_PAGE,
      data:[],
      status:null,
    }
    this.getInfo=this.getInfo.bind(this)
  }
  componentDidMount(){
    const { 
      match : { params : { id } }
    } = this.props
    this.getInfo(id)
  }

    //获取工单对应的子项
    getInfo=(id)=>{
      const { size, status} = this.state;
      const values={orderBy: "string",pageSize:100,pageNum:0,taskId:id,status:status}
      axios({
        method: 'POST',
        url: '/imc/inspectionItem/save',
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:values
      })
        .then((res) => {
          if(res && res.status === 200){
            // console.log(res.data.result)
            var taskItemList
            res.data.result==null?taskItemList=[]:taskItemList=res.data.result.taskItemList
            // res.data.result==null?pageNum=0:pageNum=res.data.result.pageNum
            this.setState({
              data:taskItemList,
              //   status:status,
              //  roleCode:roleCode,
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
        
    }

    render(){
      const { 
        match : { params : { id } }
      } = this.props
      const {
        data,
        nowCurrent,
        size, 
        roleCode
      } = this.state;
      const current = nowCurrent+1
      const limit = size
      console.log(roleCode)
      return(
        <div>
          <div className="searchPart">
            <Row>            
              <Col span={3}>
                <Link to='/cbd/inspection'>返回上级</Link>
              </Col>
              {/* <Col span={3}>任务子项状态：</Col> */}
            </Row> 
          </div>
          <Table
            className="group-list-module"
            bordered
            size='small'
            showHeader={true}
            pagination={{
              current,
              // total,
              pageSize: size,
              onChange: this.handlePageChange,
              // showTotal: () => `共${allCount} 条数据`
            }}
            rowClassName={this.setRowClassName}
            dataSource={data}
            columns={[
            {
              title:'序号',
              width:50,
              fixed:'left',
              render:(text,record,index)=> `${index+1}`,
            },{
              title: '巡检任务子项ID  ',
              key: 'id',
              render: (text, record) => {
                return ((record.id && record.id) || '--')
              }   
            }, {
              title: '巡检子项的名称',
              key: 'itemName',
              render: (text, record) => {
                return ((record.itemName && record.itemName) || '--')
              }   
            }, {
              title: '从属的巡检任务的ID',
              key: 'inspectionTaskId',
              render: (text, record) => {
                return (record.inspectionTaskId && record.inspectionTaskId) || '--'
              }
            }, {
              title: '巡检子项对应的维修工',
              key: 'maintainerId',
              render: (text, record) => {
                return (record.maintainerId && record.maintainerId) || '--'
              }
            },{
              title: '巡检任务子项对应的用户方用户id', 
              key: 'userId',
              render: (text, record) => {
                return (record.userId && record.userId) || '--'
              }
            }, {
              title: '巡检周期（月）',
              key: 'frequency',
              render: (text, record) => {
                return (record.frequency && record.frequency) || '--'
              }
            },{
              title: '实际开始时间 ',
              key: 'actualStartTime',
              render: (text, record) => {
                return (record.actualStartTime && record.actualStartTime) || '--'
              }
            },{
              title: '实际完成时间',
              key: 'actualFinishTime',
              render: (text, record) => {
                return (record.actualFinishTime && record.actualFinishTime) || '--'
              }
            },{
              title: '内容描述 ',
              key: 'description',
              render: (text, record) => {
                return (record.description && record.description) || '--'
              }
            },
              // {
              //   title: '操作',
              //   render: (text, record, index) => (
              //     <div className="operate-btns"
              //       style={{ display: 'block' }}
              //     >
              //       <Link
              //         to={`/cbd/service/sublog/${id}/${record.id}`}
              //         style={{marginRight:'12px'}}
              //       >子项日志</Link>
              //       <Link
              //         to={`/cbd/service/subplan/${id}/${record.id}`}
              //         style={{marginRight:'12px'}}
              //       >备件方案</Link>
              //     </div>
              //   ),
              // }
            ]}
          />
        </div>  
      )
    }
}
export default Sub