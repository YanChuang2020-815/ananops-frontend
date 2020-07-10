import React from 'react';
import { Layout, Menu, Dropdown, Icon, Breadcrumb,Modal,Form,message,Avatar,Badge,Drawer,Button,List,Descriptions,notification,Switch} from 'antd';
import {BellOutlined,PlusCircleTwoTone,CheckCircleTwoTone,InfoCircleTwoTone,CloseCircleTwoTone} from '@ant-design/icons'
// import customUrl from '../../images/custom.jpeg';
import { connect } from 'react-redux';
import ChangePwd from './changePws';
import {reqChangePwd,reqMessage,reqChangeMsgState} from '../../axios/index';
import StompJS from 'stompjs/lib/stomp.js';
import { NavLink, Link } from 'react-router-dom'

const { Header } = Layout;
const {Item} = Form;
const Stomp = StompJS.Stomp;

class UserInfo extends React.Component {
  state = {
    visible: false,   // 菜单是否显示
    isShowChangePwd:false,
    count:0,
    showDrawer:false,
    showChildDrawer:false,
    itemMessage:{},
    itemStatus:[],
    checkIsRead:false,

    // 全局状态
    connected: false,  // 是否已经建立连接
    // controlled components相关状态
    url: 'wss://www.ananops.com/wss/ws',
    stompSubscribeDestination: '/user/queue/chat',
    // 在console中显示的信息
    message: [],
    messageAlreadyRead:[],
  };

  componentDidMount(){
    var loginAfter = window.localStorage.getItem('loginAfter');
    if (loginAfter === null) {
      window.localStorage.setItem('loggedIn', false);
      this.props.history.push('/login');
    }
    const userId = JSON.parse(loginAfter).loginAuthDto.userId;
    this.userId = userId
    this.getInitialCount()
    
    this.disconnect();
    this.connect(userId);
  }
  
  /**
   * 连接服务端
   */
  connect = (userId) => {
    const that = this;
    try {
      let client = Stomp.over(new WebSocket(this.state.url));

      client.connect({"userId": userId}, () => {
        that.setState({connected: true});
        console.log(`Connect STOMP server success, url = ${that.state.url}, connectHeader = ${userId}`);

        try {
          client.subscribe(this.state.stompSubscribeDestination, this.getSubscribeCallback(this.state.stompSubscribeDestination));
          
          console.log(`subscribe destination ${this.state.stompSubscribeDestination} success`);
          
        } catch (e) {
          console.log(`subscribe destination ${this.state.stompSubscribeDestination} fail, message = ${e.message}`);
        }
        
      }, () => {
        that.setState({connected: false});
        console.log('连接断开，5秒后重新连接');
        window.setTimeout(() => {
          this.connect(userId);
        }, 5000);
      });
      this.client = client;
    } catch (e) {
      console.error('Connect error %o', e);
      console.log(`Connect error, message = ${e.message}, view chrome console for detail`);
      that.setState({connected: false});
      return;
    }
  };

  getSubscribeCallback = (destination) =>{
    
    return content => {
      // console.log(`Receive subscribed message from destination ${destination}, content = ${content}`)
      // console.log(JSON.parse(content.body))
      const contentBody = JSON.parse(content.body)
      console.log(contentBody)
      const incomeMsg = {
        id:contentBody.messageId,
        userId:contentBody.content.userId,
        messageTopic:contentBody.topic,
        messageTag:contentBody.tag,
        messageBody:JSON.stringify(contentBody.content)
      }
      const incomeStatus = {
        msgId:contentBody.messageId,
        isDot:1
      }
      const newStatus = this.state.itemStatus
      newStatus.push(incomeStatus)
      const newMessage = this.state.message
      newMessage.push(incomeMsg)
      this.setState({itemStatus:newStatus,count:this.state.count+1,message:newMessage})
      notification.open({
        message: contentBody.topic,
        duration: 0,
        description:
        contentBody.content.deviceTwins==null?
        contentBody.content.deviceName + "消息,当前值为：" + contentBody.content.value:
        "设备名称：" + contentBody.content.deviceName + "\n" + "行为：" + contentBody.content.action
        + "\n" + "当前数据为：" + JSON.stringify(contentBody.content.deviceTwins),
        onClick: this.showDrawer,
      });
    };
  }

  /**
   * 关闭连接
   */
  disconnect = () => {
    if (!this.state.connected) {
      console.log(`Not Connected Yet`);
      return;
    }
    try {
      this.client.disconnect();
      console.log('Close Connection Success');
      this.setState({connected: false});
    } catch (e) {
      console.log(`disconnect fail, message = ${e.message}, view chrome console for detail`);
    }
  };
  
  handleLogout = e => {
    if (e.key === 'outLogin') {
      this.setState({
        visible: false
      });
      //window.localStorage.removeItem('loggedIn');
      this.disconnect();
      this.setState({connected: false});
      window.localStorage.clear();
      this.userId = null
      this.props.history.push('/login');
    }
  };

  getInitialCount = async () => {
    const msgPost = {
      'userId':this.userId,
      'status':0
    }
    const result = await reqMessage(msgPost)
    if(result.code===200){
      this.setState({message:result.result.list,count:result.result.list.length},()=>{this.mapItemStatus()})
      
    }else{
      message.error('请求同步消息失败')
    }
  }

  mapItemStatus = () => {
    const itemStatus = this.state.message.map((item)=>{
      return {
        "msgId":item.id,
        "isDot":item.status===0?1:0
      }
    })
    this.setState({itemStatus:itemStatus})
  }
  
  showDrawer = async () => {
    const msgPost = {
      'userId':this.userId,
      'status':0
    }
    const result = await reqMessage(msgPost)
    if(result.code===200){
      this.setState({checkIsRead:false,message:result.result.list,count:result.result.list.length,showDrawer:true})
    }else{
      message.error('请求同步消息失败')
    }
    
   
  }

  showChildrenDrawer = (msg) => {
   
    this.setState({itemMessage:msg,showChildDrawer:true})
  }
 
  onClose = () => {
    this.setState({
      showDrawer: false,
      checkIsRead:false
    });
  };

  onChildrenDrawerClose = async () => {
    const changeBody = {
      "messageId":this.state.itemMessage.id,
      "status":1
    }
    const result = await reqChangeMsgState(changeBody)
    if(result.code===200){
      const newItemStatus = this.state.itemStatus.map((item)=>{
        if(item.msgId===this.state.itemMessage.id){
          item.isDot = 0
        }
        return item
      })
      var count = this.state.count-1;
      if (count < 0) {
        count = 0;
      }
      this.setState({
        itemStatus:newItemStatus,
        showChildDrawer: false,
        itemMessage:{},
        count:count,
      });
    }
    
  };
 
  onReadChildrenDrawerClose = () => {
    this.setState({showChildDrawer:false,itemMessage:{}})
  }
 
  chooseIcon = (msg) => {
    if(msg.messageTopic==='IMC_TOPIC'){
      let status = msg.messageBody.msgBodyDto.status
      if(status===-1){
        return <CloseCircleTwoTone style={{fontSize:30}} twoToneColor="#F81D22"/>
      }else if(status>=0&&status<=2){
        return <InfoCircleTwoTone style={{fontSize:30}} />
      }else{
        return <CheckCircleTwoTone style={{fontSize:30}} twoToneColor="#52c41a"/>
      }
    }else if(msg.messageTopic==='MDMC_TOPIC'){
      let status = msg.messageBody.msgBodyDto.status
      if(status===1||(status>=14&&status<=18)){
        return <CloseCircleTwoTone style={{fontSize:30}} twoToneColor="#F81D22"/>
      }else if(status>=7&&status<=12){
        return <InfoCircleTwoTone style={{fontSize:30}} />
      }else{
        return <CheckCircleTwoTone style={{fontSize:30}} twoToneColor="#52c41a"/>
      }
    }else{
      return <PlusCircleTwoTone style={{fontSize:30}} />
    }
  }

  findIsDot = (itemId) => {
    const chosenItem = this.state.itemStatus.filter((status)=>status.msgId===itemId)
    
    return chosenItem[0].isDot
  } 

  openTask = (msgBodyDto, tag) => {
    this.onChildrenDrawerClose();
    this.setState({
      showDrawer: false
    });
    if (msgBodyDto.taskId === undefined || msgBodyDto.itemId === undefined) {
      this.props.history.push('/');
    }
    if (tag.indexOf("IMC_ITEM") !== -1) {
      this.props.history.push(`/cbd/imcItemInfo/detail/undefined/undefined/${msgBodyDto.itemId}`);
    } else if (tag.indexOf("IMC") !== -1) {
      this.props.history.push(`/cbd/imcTaskInfo/detail/${msgBodyDto.taskId}`);
    } else {
      this.props.history.push(`/cbd/service/detail/${msgBodyDto.taskId}`);
    }
  }
 
  showAlreadyRead = async () => {
    if(this.state.checkIsRead){
      this.setState({checkIsRead:false})
      this.showDrawer()
    }else{
      const changeBody = {
        'userId':this.userId,
        'status':1
      }
      const result = await reqMessage(changeBody)
      if(result.code===200){
        this.setState({messageAlreadyRead:result.result.list,checkIsRead:true})
      }else{
        message.error('请求同步消息失败')
      }
    }
    
  }
  
  handleUserInfo = () => {
  }

  handleChangePwd = async () => {
    
    const pwd = this.form.getFieldsValue()
    this.form.resetFields()
    console.log('修改,模态框采集的pwd：',pwd)
    if(pwd.newPassword==pwd.confirmPwd){
      this.setState({isShowChangePwd:false})
      const logName = JSON.parse(window.localStorage.getItem('loginAfter')).loginAuthDto.loginName
      console.log(logName)
      const dataPost = {}
      Object.assign(dataPost,pwd,{loginName:logName})
      console.log(dataPost)
      const result = await reqChangePwd(dataPost)
      if(result.code==200){
        message.success(result.message);
        window.localStorage.clear();
        this.props.history.push('/login');
      }else{
        window.localStorage.clear();
        this.props.history.push('/login');
      }
    }else{
      message.error("两次新密码输入不一致，请重新输入");

    }
  }

  isShowChangePwd = (e) => {
    console.log(123);
    this.setState({isShowChangePwd:true});
  }

  handleVisibleChange = flag => {
    this.setState({ visible: flag });
  };

  render() {
    const {isShowChangePwd} = this.state
    var loginAfter = window.localStorage.getItem('loginAfter');
    const loggedIn = window.localStorage.getItem('loggedIn');
    if (loggedIn === false || loginAfter === null || JSON.parse(loginAfter).loginAuthDto === null) {
      window.localStorage.setItem('loggedIn', false);
      this.props.history.push('/login');
    }
    const userName = JSON.parse(loginAfter).loginAuthDto.userName;
    const menu = (
      <Menu>
        {/* <Menu.Item key="userInfo" onClick={this.handleUserInfo}>个人信息</Menu.Item> */}
        <Menu.Item key="outLogin" onClick={this.handleLogout}>退出登录</Menu.Item>
        <Menu.Item key="changePwd" onClick={this.isShowChangePwd}>修改密码</Menu.Item>
        <Menu.Item title="showAllBills" key="showAllBills">
          <NavLink to="/cbd/bill/index" >
            <span>费用账单</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item title="addMoney" key="addMoney">
          <NavLink to="/cbd/bill/history" >
            <span>产品续费</span>
          </NavLink>
        </Menu.Item>
        <Menu.Item title="unfinishedBills" key="unfinishedBills">
          <NavLink to="/cbd/bill/creatingBill" >
            <span>未支付账单</span>
          </NavLink>
        </Menu.Item>
      </Menu>
    );
    const data = this.state.message.map((item)=>{
      return {
        "key":item.id,
        "id":item.id,
        "createdTime":item.createdTime,
        "updateTime":item.updateTime,
        "userId":item.userId,
        "messageTopic":item.messageTopic,
        "messageTag":item.messageTag,
        "messageBody":JSON.parse(item.messageBody)
      }
    })
    const itemMessage = this.state.itemMessage

    const dataRead = this.state.messageAlreadyRead.map((item)=>{
      return {
        "key":item.id,
        "id":item.id,
        "createdTime":item.createdTime,
        "updateTime":item.updateTime,
        "userId":item.userId,
        "messageTopic":item.messageTopic,
        "messageTag":item.messageTag,
        "messageBody":JSON.parse(item.messageBody)
      }
    })
   
    return (
      <div>
        <div style={{position:'fixed',right:150}}>
          <a onClick={this.showDrawer}>
            <Badge count={this.state.count}>
              <Avatar icon={<BellOutlined />}></Avatar>
            </Badge>
          </a>
        </div>
        <Dropdown overlay={menu} onVisibleChange={this.handleVisibleChange} visible={this.state.visible}>
          <div className="ant-dropdown-link">
            {userName}
            <Icon type="caret-down" />
          </div>
        </Dropdown>
        <Modal
          title="修改密码"
          visible={isShowChangePwd}
          onOk={this.handleChangePwd}
          onCancel={() => {this.setState({isShowChangePwd:false});this.form.resetFields();}}
        >
          <ChangePwd setForm={(form)=>{this.form = form}}/>
        </Modal>
        {/* <Drawer
          title={<><Switch defaultChecked={this.state.checkIsRead} checked={this.state.checkIsRead} onChange={this.showAlreadyRead}/><span>  展示已读</span></>}
          width={420}
          closable={false}
          onClose={this.onClose}
          visible={this.state.showDrawer}
        >
          {
            this.state.checkIsRead?
              (<>
                <List
                  itemLayout="horizontal"
                  dataSource={dataRead}
                  renderItem={item => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={this.chooseIcon(item)} />}
                        title={
                          <Button type="link" onClick={()=>{this.showChildrenDrawer(item)}}>{String(item.messageTag).indexOf("IMC") !== -1 ? "巡检任务消息" : (String(item.messageTag).indexOf("MDMC") !== -1 ? "维修任务消息" : "其他消息")}</Button>
                        }
                        description={item.messageBody.msgBodyDto.statusMsg}
                      />
                    </List.Item>
                  )}
                />
                <Drawer
                  title={<div>消息内容 {(String(itemMessage.messageTag).indexOf("MDMC") || String(itemMessage.messageTag).indexOf("IMC"))&&itemMessage.messageBody ? <Button 
                  type="primary" style={{marginLeft: 20}} 
                  onClick={() => this.openTask(itemMessage.messageBody.msgBodyDto, String(itemMessage.messageTag))}> 进入任务详情页面 </Button> : ""}
                  </div>}
                  width={320}
                  closable={false}
                  onClose={this.onReadChildrenDrawerClose}
                  visible={this.state.showChildDrawer}
                >
                  <Descriptions bordered column={1} layout="vertical">
                    <Descriptions.Item label="消息主题">{itemMessage.messageTopic || ''}</Descriptions.Item>
                    <Descriptions.Item label="消息标签">{itemMessage.messageTag || ''}</Descriptions.Item>
                    <Descriptions.Item label="状态消息">{itemMessage.messageBody?itemMessage.messageBody.msgBodyDto.statusMsg:''}</Descriptions.Item>
                    <Descriptions.Item label="任务编号">{itemMessage.messageBody?itemMessage.messageBody.msgBodyDto.taskId:''}</Descriptions.Item>
                    <Descriptions.Item label="消息编号">{itemMessage.id || ''}</Descriptions.Item>
                    <Descriptions.Item label="发生时间">{itemMessage.createdTime || ''}</Descriptions.Item>
                    <Descriptions.Item label="更新时间">{itemMessage.updateTime || ''}</Descriptions.Item>
                  </Descriptions>
                </Drawer>
              </>)
              :(
                <>
                  <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={this.chooseIcon(item)} />}
                          title={
                            <Badge dot count={this.findIsDot(item.id)}>
                              <Button type="link" onClick={()=>{this.showChildrenDrawer(item)}}>{String(item.messageTag).indexOf("IMC") !== -1 ? "巡检任务消息" : (String(item.messageTag).indexOf("MDMC") !== -1 ? "维修任务消息" : "其他消息")}</Button>
                            </Badge>
                          }
                          description={item.messageBody.msgBodyDto.statusMsg}
                        />
                      </List.Item>
                    )}
                  />
                  <Drawer
                    title={<div>消息内容 {(String(itemMessage.messageTag).indexOf("MDMC") || String(itemMessage.messageTag).indexOf("IMC"))&&itemMessage.messageBody ? <Button 
                    type="primary" style={{marginLeft: 20}} 
                    onClick={() => this.openTask(itemMessage.messageBody.msgBodyDto, String(itemMessage.messageTag))}> 进入任务详情页面 </Button> : ""}
                    </div>}
                    width={320}
                    closable={false}
                    onClose={this.onChildrenDrawerClose}
                    visible={this.state.showChildDrawer}
                  >
                    <Descriptions bordered column={1} layout="vertical">
                      <Descriptions.Item label="消息主题">{itemMessage.messageTopic || ''}</Descriptions.Item>
                      <Descriptions.Item label="消息标签">{itemMessage.messageTag || ''}</Descriptions.Item>
                      <Descriptions.Item label="状态消息">{itemMessage.messageBody?itemMessage.messageBody.msgBodyDto.statusMsg:''}</Descriptions.Item>
                      <Descriptions.Item label="任务编号">{itemMessage.messageBody?itemMessage.messageBody.msgBodyDto.taskId:''}</Descriptions.Item>
                      <Descriptions.Item label="消息编号">{itemMessage.id || ''}</Descriptions.Item>
                      <Descriptions.Item label="发生时间">{itemMessage.createdTime || ''}</Descriptions.Item>
                      <Descriptions.Item label="更新时间">{itemMessage.updateTime || ''}</Descriptions.Item>
                    </Descriptions>
                  </Drawer>
                </>
              )
          }
          
        </Drawer> */}
      </div>
    );
  }
}

const HeaderBar = (props) => {
  
  console.log(props.menuName)
  return (
    <Header>
      <Breadcrumb separator=">">
        {
          props.menuName.map((item) => {
            return (
              <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
            );
          })
        }
      </Breadcrumb>
      <UserInfo history={props.history}/>
    </Header>
  );
};

const mapStateToProps = (state) => {
  return {
    menuName: state.menuName
  }
};

export default connect(mapStateToProps)(HeaderBar);