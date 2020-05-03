import React,{Component,} from 'react'
import { Button,Row,Col,Table,Card,Icon  } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import axios from 'axios'
import './index.styl'
class Fault extends Component{
  constructor(props){
    super(props)
    this.state={
      data:[],
      token:window.localStorage.getItem('token'),
      roleCode:window.localStorage.getItem('roleCode'),
    }
    this.getGroupList = this.getGroupList.bind(this); 
  }

  componentDidMount(){
    const { 
      match : { params : { id } }
    } = this.props
    this.getGroupList(id);   
  }
     //获取列表信息
     getGroupList = (id) => {
       axios({
         method: 'GET',
         url: '/rdc/deviceOrder/all/object/'+id+'/1',
         headers: {
           'deviceId': this.deviceId,
           'Authorization':'Bearer '+this.state.token,
         },
         //   data:values
       })
         .then((res) => {
           if(res && res.status === 200){
             console.log(res)
             this.setState({
               data: res.data.result.deviceOrderList,
             }) ;
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
         data,roleCode
       } = this.state;
       //   const extra = (
       //     roleCode==='fac_leader'?
       //     <span>
       //     <Button type="primary" style={{marginRight:'15px'}} onClick={() => this.showAdd()}><Icon type="plus"/>添加工程师</Button>
       //     <Button type="primary" style={{marginRight:'15px'}} onClick={() => this.showAdd()}><Icon type="plus"/>添加工程师</Button>
       //     </span>:(roleCode==='user_leader'? <span>
       //     <Button type="primary" style={{marginRight:'15px'}} onClick={() => this.showAdd()}><Icon type="plus"/>添加工程师</Button>
       //     <Button type="primary" style={{marginRight:'15px'}} onClick={() => this.showAdd()}><Icon type="plus"/>添加工程师</Button>
       //     </span>:(roleCode==='engineer'?<span>
       //     <Button type="primary" style={{marginRight:'15px'}} onClick={() => this.showAdd()}><Icon type="plus"/>添加工程师</Button>
       //     </span>:null))
       // )
       return(
         <div>
           <div className="searchPart">
             <Row>
               <Col span={5}>
                 <Link to={`/cbd/maintain/data`}>
                   <Icon type="arrow-left" ></Icon>返回
                 </Link>
               </Col>
             </Row> 
           </div>
           <div style={{margin:'15px'}}>
             {data&&data.map((items,index)=>(
               <Card key={index} className="orderList"
                 title="备品备件信息" bordered={false}
               //   extra={extra}
               >
                 {/* <div    
                    style={{borderLeft:'5px solid #49A5FE',borderRadius:'5px',height:'40px',marginBottom:'5px',fontSize:'25px'}}
                    >
                        设备订单                
                    </div>             */}
                 {/* <Icon type="double-right" style={{color:'#49A5FE',fontSize:'20px',marginRight:'5px',marginBottom:'10px',}} />
                      <span style={{fontSize:'20px',fontWeight:'7px',color:'#49A5FE'}}>备品备件信息</span> */}
                 <Row gutter={16}>
                   <Col span={8}>
                     <Card key={index} type="inner" title="设备订单">
                       {/* <span style={{fontSize:'18px',fontWeight:'10px',}}>设备订单</span> */}
                       <div style={{marginLeft:'5px',fontSize:'20px'}} >
                         <p key={index}>备件订单编号：{items.deviceOrder.id}</p>
                         <p key={index}>维修工单编号：{items.deviceOrder.objectId}</p>          
                         <div key={index} >
                           {JSON.parse(items.deviceOrder.items)&&JSON.parse(items.deviceOrder.items).map((item,ind)=>(
                             <div key={ind}>
                                    备件子项{ind+1}.
                               <p key={ind} style={{marginLeft:'10px'}}>
                                 <span style={{marginRight:'15px'}}>设备厂商：{item.manufacture}</span>  
                                 <span>设备名称：{item.name}</span>
                               </p>
                               <p key={ind} style={{marginLeft:'10px'}}>
                                 <span style={{marginRight:'15px'}}>设备型号：{item.model}</span>
                                 <span>申请数量：{item.count===null?0:item.count}</span>
                               </p>
                             </div>
                           ))}
                         </div>
                         <p key={index}>备件订单状态描述：{items.deviceOrder.statusMsg}</p>
                         <p key={index}>备件订单处理结果：{items.deviceOrder.processResult}</p>
                         <p key={index}>备件订单处理意见：{items.deviceOrder.processMsg}</p> 
                         <p key={index}>备件订单总价：{items.deviceOrder.totalPrice}</p>    
                       </div>               
                     </Card>
                   </Col>
                   <Col span={8}>
                     <Card key={index} type="inner" title="相关信息">
                       {/* <span style={{fontSize:'18px',fontWeight:'10px',}}>相关信息</span> */}
                       <div style={{marginLeft:'5px',fontSize:'20px'}}>
                         {items.approves&&items.approves.map((item,ind)=>(
                           <div key={ind}>
                                      审核记录{ind+1}.
                             <div key={ind} style={{marginLeft:'10px'}}>
                               <p key={ind}>工程师编号：{item.applicantId}</p>
                               <p key={ind}>工程师名称：{item.applicant}</p>          
                               <p key={ind}>当前审核人编号：{item.currentApproverId}</p>
                               <p key={ind}>当前审核人：{item.currentApprover}</p>
                               <p key={ind}>备件订单处理结果：{item.result}</p> 
                               <p key={ind}>备件订单处理意见：{item.suggestion}</p> 
                             </div>
                           </div>
                         ))}
                          
                       </div>    
                            
                     </Card>
                   </Col>
                 </Row>
               </Card>
             ))}
           </div>
         </div>  
       )
     }
}
export default Fault