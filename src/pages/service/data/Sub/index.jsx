import React,{Component,} from 'react'
import { Button,Row,Col,Table,Input,Select,Popconfirm,Card  } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import './index.styl'
import axios from 'axios'
import ReactDOM from 'react-dom'


const FIRST_PAGE = 0;
const PAGE_SIZE = 10;
const Search = Input.Search;

class Sub extends Component{
  constructor(props){
    super(props)
    this.state={
      data:[],
      token:window.localStorage.getItem('token'),
      roleCode:window.localStorage.getItem('roleCode'),
      size: PAGE_SIZE,
      nowCurrent:FIRST_PAGE,
      status:null,
      lastStatus:null,

      
    }
    this.getInfo=this.getInfo.bind(this)
    this.getStatus=this.getStatus.bind(this)
  }
  componentDidMount(){
    const { 
      match : { params : { id } }
    } = this.props
    this.getInfo(id,FIRST_PAGE)
    this.getStatus(id)
  }
    //获取工单对应的子项
    getInfo=(id,page)=>{
      const { size, status} = this.state;
      const values={orderBy: "string",pageSize:size,pageNum:page,taskId:id,status:status}
      axios({
        method: 'POST',
        url: '/mdmc/mdmcItem/getItemList',
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
        data:values
      })
        .then((res) => {
          if(res && res.status === 200){
            console.log(res.data.result)
            var taskItemList
            var pageNum
            res.data.result==null?taskItemList=[]:taskItemList=res.data.result.taskItemList
            res.data.result==null?pageNum=0:pageNum=res.data.result.pageNum
            this.setState({
              data:taskItemList,
              nowCurrent:pageNum,
              //status:status,
              // roleCode:roleCode,
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
        
    }
    //加载按钮状态判断
    getStatus=(id)=>{
      axios({
        method: 'GET',
        url: '/mdmc/mdmcTask/getTaskByTaskId?taskId='+id,
        headers: {
          'deviceId': this.deviceId,
          'Authorization':'Bearer '+this.state.token,
        },
      })
        .then((res) => {
          if(res && res.status === 200){
            this.setState({
              lastStatus:res.data.result.status
            })
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
 //删除子项
 deleteItemByItemId=(record)=>{
   const { 
     match : { params : { id } }
   } = this.props
   console.log(record.id)
   axios({
     method:'POST',
     url:'/mdmc/mdmcItem/deleteItemByItemId/'+record.id,
     headers:{
       'deviceId': this.deviceId,
       'Authorization':'Bearer '+this.state.token,
     }           
   }) 
     .then((res) => {
       if(res && res.status === 200){
       // console.log(res.data.result);
         this.getInfo(id,FIRST_PAGE)
         this.getStatus(id)

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
   changeStatus(Id,status,msg){
     const { 
       match : { params : { id } }
     } = this.props
     const values={"status": status,"statusMsg": msg,"itemId":Id}
     axios({
       method: 'POST',
       url: '/mdmc/mdmcItem/modifyItemStatusByItemId',
       headers: {
         'Content-Type': 'application/json',
         'deviceId': this.deviceId,
         'Authorization':'Bearer '+this.state.token,
       },
       data:JSON.stringify(values)
     })
       .then((res) => {
         if(res && res.status === 200){
           this.getInfo(id,FIRST_PAGE)
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
         <Card>
           <div className="searchPart">
             <Row>            
               <Col span={3}>
                 <Link to="/cbd/maintain/data">返回上级</Link>
               </Col>
               {/* <Col span={3}>任务子项状态：</Col> */}
               {/* <Col span={3}>
               <Select placeholder="请选择任务子项状态"
                 style={{ width: 180 }}
                 onChange={this.selectActivity}
               >
                 <Select.Option key="0"
                   value={1}
                 >无备件</Select.Option>
                 <Select.Option key="1" 
                   value={2}
                 >待审核</Select.Option>
                 <Select.Option key="2" 
                   value={3}
                 >已通过</Select.Option>
                 <Select.Option key="3" 
                   value={4}
                 >未通过</Select.Option>
               </Select>
             </Col> */}
               {/* <Col span={2}>
               <Button  
                 type="primary" 
                 onClick={() => {this.getInfo(id,0)}}
               >搜索</Button>
             </Col> */}
               <Col push={17}>
                 {((roleCode=="user_watcher"||roleCode=='user_manager'||roleCode==='user_leader')&&(this.state.lastStatus<=3))&&<Link to={`/cbd/service/sub/new/${id}`}>
                   <Button type="primary">
                                +新建子项任务
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
                 title: '维修任务ID ',
                 key: 'taskId',
                 render: (text, record) => {
                   return ((record.taskId && record.taskId) || '--')
                 }   
               }, {
                 title: '设备名称',
                 key: 'deviceName',
                 render: (text, record) => {
                   return (record.deviceName && record.deviceName) || '--'
                 }
               }, {
                 title: '设备编号',
                 key: 'deviceId',
                 render: (text, record) => {
                   return (record.deviceId && record.deviceId) || '--'
                 }
               },{
                 title: '故障地址', 
                 key: 'troubleAddress',
            
                 render: (text, record) => {
                   return (record.troubleAddress && record.troubleAddress) || '--'
                 }
               },{
                 title: '故障等级',
                 key: 'level',
                 render: (text, record) => {
                   return (record.level && record.level===1?'不紧急':(record.level===2?'一般':(record.level===3?'紧急':'非常紧急'))) || '--'
                 }
               },{
                 title: '故障描述',
                 key: 'description',
                 render: (text, record) => {
                   return (record.description && record.description) || '--'
                 }
               },{
                 title: '操作',
                 render: (text, record, index) => (
                   <div className="operate-btns"
                     style={{ display: 'block' }}
                   >
                     <Link
                       to={`/cbd/service/sublog/${id}/${record.id}`}
                       style={{marginRight:'12px'}}
                     >子项日志</Link>
                     <Link
                       to={`/cbd/service/subDetail/${id}/${record.id}`}
                       style={{marginRight:'12px'}}
                     >详情</Link>
                     {this.state.lastStatus<=3 ? 
                      <span>
                       <Link
                          to={`/cbd/service/subEdit/${id}/${record.id}`}
                          style={{marginRight:'12px'}}
                        >修改</Link> 
                        <Popconfirm
                          title="确定要删除吗？"
                          onConfirm={() => { 
                            this.deleteItemByItemId(record)
                          }}
                        >
                          <Button
                            type="simple"
                            style={{border: 'none', padding: 0, color: "#357aff", background: 'transparent'}}
                          >删除</Button>
                        </Popconfirm>
                      </span> : ""}
                     {(roleCode==='user_leader'&&this.state.status=='2')&&
                     <div>
                       <Button 
                         type="simple"
                         style={{border:'none',padding:0,color:"#357aff",background:'transparent',marginRight:'12px'}}
                         onClick={()=>{this.changeStatus(record.id,3,'用户负责人通过备件方案')}}
                       >通过</Button>
                       <Button 
                         type="simple"
                         style={{border:'none',padding:0,color:"#357aff",background:'transparent'}}
                         onClick={()=>{this.changeStatus(record.id,4,'驳回备件方案')}}
                       >拒绝</Button>
                     </div>
                     }
                   </div>
                 ),
               }]}
           />
         </Card>
       </div>  
     )
   }
}
export default Sub