import React,{Component} from 'react'
import {Card,Table,Select,Button,Icon,Input,message} from 'antd'
import LinkButton from '../../components/link-button'

const Option = Select.Option


const alarms = [
  {
    deviceId:'333',
    staffId:'123',
    type:'自然灾害',
    desc:'火警',
    level:'2'
  },
  {
    deviceId:'333',
    staffId:'123',
    type:'自然灾害',
    desc:'火警',
    level:'2'
  }
]
export default class AlarmHome extends Component{

  state={
    alarms:[], //当前页的商品数组
    total:0,//商品总条数
    loading:false, //是否正在加载中
    searchName:'', //搜索关键字
    searchType:'alarmLevel', //根据哪个字段搜索
  }

  constructor(props){
    super(props)
    this.columns = [
      {
        title:'序号',
        width:50,
        fixed:'left',
        render:(text,record,index)=> `${index+1}`,
      },
      {
        width:150,
        title:'设备ID',
        dataIndex:'deviceId'
      },
      {
        width:150,
        title:'报警员工ID',
        dataIndex:'staffId'
      },
      {
        width:100,
        title:'警报等级',
        dataIndex:'level',
      },
      {
        width:150,
        title:'警报类型',
        dataIndex:'type'
      },{
        title:'报警描述',
        dataIndex:'desc',
      },  
      {
        width:100,
        title:'操作',
        render: (alarmInfo) => {
          return (
            <span>
              <LinkButton onClick={() => this.props.history.push('/alarm/detail')}>详情</LinkButton>
              <LinkButton onClick={() => this.props.history.push('/alarm/addupdate')}>修改</LinkButton>
            </span>
            
          )
        }
      }
    ]
  }

  initColumns = () => {
    
  }

  render(){
    
    const title = (
      <span>
        <Select style={{width:180,}} onChange={value => this.setState({searchType:value})}>
          <Option value="alarmLevel" key="alarmLevel">按警报等级搜索</Option>
          <Option value="alarmDesc" key="alarmDesc">按报警描述搜素</Option>
        </Select>
        <Input placeholder="关键字" style={{width:150,margin:'0 15px'}} onChange={event => this.setState({searchName:event.target.value})}/>
        <Button type="primary" onClick={() => {this.getAlarm()}}>搜索</Button>
      </span>
    )

    const extra = (
      <Button type="primary" onClick={() => this.props.history.push('/alarm/addupdate')}><Icon type="plus"/>新建报警</Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          size='small'
          dataSource={alarms}
          columns={this.columns}
        />
      </Card>
    )
  }
}