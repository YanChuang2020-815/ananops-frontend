import React,{Component,} from 'react'
import { Button,Row,Col,Table,Select,Icon  } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios'
// import './index.styl'
const FIRST_PAGE = 0;
const PAGE_SIZE = 100;
class SubPlan extends Component{
  constructor(props){
    super(props)
    this.state={
      data:[],
      token:window.localStorage.getItem('token'),
      current: FIRST_PAGE,
      size: PAGE_SIZE,
      // total: 20, 
      roleCode:window.localStorage.getItem('roleCode'),
      nowCurrent:FIRST_PAGE,
      status:null,
    }
    this.getGroupList = this.getGroupList.bind(this); 
  }

  componentDidMount(){
    const { 
      match : { params : { subId } }
    } = this.props
    this.getGroupList(subId,FIRST_PAGE);   
  }
     //获取列表信息
     getGroupList = (id,page) => {
       const { size,status } = this.state;
       const values={orderBy: "string",pageSize:size,pageNum:page,taskId:id,status:status}
       axios({
         method: 'GET',
         url: '/mdmc/mdmcDevice/getDeviceByItemId/'+id,
         headers: {
           'deviceId': this.deviceId,
           'Authorization':'Bearer '+this.state.token,
         },
         data:values
       })
         .then((res) => {
           if(res && res.status === 200){
             console.log(res)
             this.setState({
               data: res.data.result,
               nowCurrent:res.data.result.pageNum,
             }) ;
             // console.log(this.state.data)
           }
         })
         .catch(function (error) {
           console.log(error);
         });
      
     }
   //搜索
   selectActivity = (value) => {     
     this.setState({status:value})
   }
   //改变备品备件状态
   //   changeStatus(){
   //     const values={"status": status,"statusMsg": statusMsg,"taskId":id}
   //     axios({
   //         method: 'POST',
   //         url: '/mdmc/mdmcTask/modifyTaskStatusByTaskId/'+id,
   //         headers: {
   //           'Content-Type': 'application/json',
   //           'deviceId': this.deviceId,
   //           'Authorization':'Bearer '+this.state.token,
   //         },
   //         data:JSON.stringify(values)
   //       })
   //     .then((res) => {
   //         if(res && res.status === 200){
   //         this.getInfo(FIRST_PAGE)
   //         }
   //     })
   //     .catch(function (error) {
   //         console.log(error);
   //     });
   //   }
   render(){
     const { 
       match : { params : { id,subId } }
     } = this.props
     const {
       data,
       nowCurrent,
       size, 
       roleCode
     } = this.state;
     // const total = allCount
     const current = nowCurrent+1
     const limit = size
     return(
       <div>
         <div className="searchPart">
           <Row>            
             <Col span={2}>
               <Link to='/cbd/maintain/data'>返回</Link>
             </Col>
             {/* <Col span={4}>
                <Select placeholder="请选择任务子项状态"
                style={{ width: 180 }}
                onChange={this.selectActivity}
              >
                  <Select.Option key='0'
                      value={1}
                    >无备件</Select.Option>
                  <Select.Option key='1' 
                    value={2}
                    >待审核</Select.Option>
                  <Select.Option key='2' 
                    value={3}
                    >已通过</Select.Option>
                  <Select.Option key='3' 
                    value={4}
                    >未通过</Select.Option>
              </Select>
                </Col>
                <Col span={2}>
              <Button  
                type="primary" 
                onClick={() => {this.getGroupList(subId,0)}}
              >搜索</Button>
              </Col> */}
             <Col push={18}>
               {this.state.roleCode=="engineer"&&<Link to={`/cbd/service/plan/new/${id}/${subId}`}>
                 <Button type="primary">
                                +新建备品备件方案
                 </Button>
               </Link>}
             </Col>
           </Row> 
         </div>
         <Table
           className="group-list-module"
           bordered
           showHeader={true}
           size='small'
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
            },
             {
               title: '工单编号',
               key: 'taskId',
               render: (text, record) => {
                 return (record.taskId && record.taskId) || '--'
               }
             }, {
               title: '创建时间',
               key: 'createdTime',
               render: (text, record) => {
                 return (record.createdTime && record.createdTime) || '--'
               }
             },{
               title: '创建者', 
               key: 'creator',
               render: (text, record) => {
                 return (record.creator && record.creator) || '--'
               }
             },
             // {
             //   title: '创建者ID',
             //   key: 'creatorId',
             //   render: (text, record) => {
             //     return ((record.creatorId && record.creatorId) || '--')
             //   }   
             // },
             {
               title: '安装时间',
               key: 'installationDate',
               render: (text, record) => {
                 return (record.installationDate && record.installationDate) || '--'
               }
             }, {
               title: '设备ID',
               key: 'deviceId',
               render: (text, record) => {
                 return (record.deviceId && record.deviceId) || '--'
               }
             },{
               title: '设备类型', 
               key: 'deviceType',
               render: (text, record) => {
                 return (record.deviceType && record.deviceType) || '--'
               }
             }, {
               title: '设备名称',
               key: 'device_name',
               render: (text, record) => {
                 return (record.device_name && record.device_name) || '--'
               }
             },{
               title: '最终操作者', 
               key: 'lastOperator',
               render: (text, record) => {
                 return (record.lastOperator && record.lastOperator) || '--'
               }
             },
             // {
             //   title: '最终操作者ID',
             //   key: 'lastOperatorId',
             //   render: (text, record) => {
             //     return ((record.lastOperatorId && record.lastOperatorId) || '--')
             //   }   
             // }, 
             {
               title: '维修工ID',
               key: 'level',
               render: (text, record) => {
                 return (record.level && record.level) || '--'
               }
             }, {
               title: '负责人ID',
               key: 'maintainerId',
               render: (text, record) => {
                 return (record.maintainerId && record.maintainerId) || '--'
               }
             },{
               title: '生产商', 
               key: 'manufacture',
               render: (text, record) => {
                 return (record.manufacture && record.manufacture) || '--'
               }
             },
             {
               title: '生产日期',
               key: 'productionDate',
               render: (text, record) => {
                 return (record.productionDate && record.productionDate) || '--'
               }
             }, {
               title: '花费',
               key: 'cost',
               render: (text, record) => {
                 return (record.cost && record.cost) || '--'
               }
             },
             // {
             //   title: '总计', 
             //   key: 'count',
             //   render: (text, record) => {
             //     return (record.count && record.count) || '--'
             //   }
             // },
             {
               title: '操作',
               render: (text, record, index) => (
                 <div className="operate-btns"
                   style={{ display: 'block' }}
                 >
                   {/* {(roleCode==='user_leader'&&this.state.status=='2')&&
                    <div>
                      <Button 
                      type="simple"
                      style={{border:'none',padding:0,color:"#357aff",background:'transparent',marginRight:'12px'}}
                      onClick={()=>{this.changeStatus(record.id,8,'维修工提交维修结果，待服务商审核维修结果')}}
                      >通过</Button>
                      <Button 
                      type="simple"
                      style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
                      onClick={()=>{this.changeStatus(record.id,16,'服务商拒绝账单')}}
                    >拒绝</Button>
                    </div>
                    } */}
                 </div>
               ),
             }]}
         />
       </div>  
     )
   }
}
export default SubPlan