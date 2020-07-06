import React, { lazy, Suspense } from 'react';
import {Layout,Spin} from "antd";
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from '../pages/home';
import HeaderBar from '../components/layout/HeaderBar.jsx';
import SiderBar from '../components/layout/SideBar.jsx'
import FooterBar from '../components/layout/FooterBar.jsx';
import PlanApproval from '../pages/approval'
import Acceptance from '../pages/acceptance'
import Alarm from '../pages/amc'
import Authority from '../pages/authority'
import Bill from '../pages/bill'
import Device from '../pages/device'
import Contract from '../pages/contract'
import System from '../pages/system'
import Service from '../pages/service'
import Uflo from '../pages/uflo'
import ServiceProvider from '../pages/serviceProvider'
import User from '../pages/user'
import OnlineUsers from '../pages/user/online-users'
import DetailUser from '../pages/user/user-detail'
import Role from '../pages/role'
import Menu from '../pages/menu'
import Group from '../pages/group'
import PlanRoute from '../pages/inspection'
import Report from '../pages/report'
import Zipkin from '../pages/monitor/zipkin'
import Kibana from '../pages/monitor/kibana'
import Boot from '../pages/monitor/boot'
import Swagger from '../pages/monitor/swagger'
import Druid from '../pages/monitor/druid'
import Log from '../pages/monitor/log'
import Token from '../pages/monitor/token'
import Exception from '../pages/monitor/exception'
import Item from '../pages/inspectionItem'
import ImcTaskInfo from '../pages/imcTaskInfo'
import ImcItemInfo from '../pages/imcItemInfo'
import NewImcTask from '../pages/inspection/add'
import StartImcTask from '../pages/inspection/start'
import Dictionary from '../pages/dictionary'
import UserForm from '../pages/userForm'
import CompanyManager from '../pages/group/company-manager'
import GroupEmpl from '../pages/group/group-empl'
import CompanyAdd from '../pages/group/company-add'
import PanoramaRoute from '../pages/panorama'
import EdgeDeviceRoute from '../pages/edgeDevice'
//const Home = React.lazy(()=>import(/* webpackChunkName: 'Home'*/ "../pages/home"))
//const HeaderBar = React.lazy(()=>import(/* webpackChunkName: 'HeaderBar'*/ "../components/layout/HeaderBar.jsx"))
//const SiderBar = React.lazy(()=>import(/* webpackChunkName: 'SiderBar'*/ "../components/layout/SideBar.jsx"))
//const FooterBar = React.lazy(()=>import(/* webpackChunkName: 'FooterBar'*/ "../components/layout/FooterBar.jsx"))
// const PlanApproval = React.lazy(()=>import(/* webpackChunkName: 'PlanApproval'*/ "../pages/approval"));
// const Acceptance = React.lazy(()=>import(/* webpackChunkName: 'Acceptance'*/ "../pages/acceptance"));
// const Alarm = React.lazy(()=>import(/* webpackChunkName: 'Alarm'*/ "../pages/amc"));
// const Authority = React.lazy(()=>import(/* webpackChunkName: 'Authority'*/ "../pages/authority"));
// const Bill = React.lazy(()=>import(/* webpackChunkName: 'Bill'*/ "../pages/bill"));
// const Device = React.lazy(()=>import(/* webpackChunkName: 'Device'*/ "../pages/device"));
// const Contract = React.lazy(()=>import(/* webpackChunkName: 'Contract'*/ "../pages/contract"));
// const System = React.lazy(()=>import(/* webpackChunkName: 'System'*/ "../pages/system"));
// const Service = React.lazy(()=>import(/* webpackChunkName: 'Service'*/ "../pages/service"));
// const ServiceProvider = React.lazy(()=>import(/* webpackChunkName: 'ServiceProvider'*/ "../pages/serviceProvider"));
// const User = React.lazy(()=>import(/* webpackChunkName: 'User'*/ "../pages/user"));
// const OnlineUsers = React.lazy(()=>import(/* webpackChunkName: 'OnlineUsers'*/ "../pages/user/online-users"));
// const DetailUser = React.lazy(()=>import(/* webpackChunkName: 'DetailUser'*/ "../pages/user/user-detail"));
// const Role = React.lazy(()=>import(/* webpackChunkName: 'Role'*/ "../pages/role"));
// const Menu = React.lazy(()=>import(/* webpackChunkName: 'Menu'*/ "../pages/menu"));
// const Group = React.lazy(()=>import(/* webpackChunkName: 'Group'*/ "../pages/group"));
// const PlanRoute = React.lazy(()=>import(/* webpackChunkName: 'PlanRoute'*/ "../pages/inspection"));
// const Report = React.lazy(()=>import(/* webpackChunkName: 'Report'*/ "../pages/report"));
// const Zipkin = React.lazy(()=>import(/* webpackChunkName: 'Zipkin'*/ "../pages/monitor/zipkin"));
// const Kibana = React.lazy(()=>import(/* webpackChunkName: 'Kibana'*/ "../pages/monitor/kibana"));
// const Boot = React.lazy(()=>import(/* webpackChunkName: 'Boot'*/ "../pages/monitor/boot"));
// const Swagger = React.lazy(()=>import(/* webpackChunkName: 'Swagger'*/ "../pages/monitor/swagger"));
// const Druid = React.lazy(()=>import(/* webpackChunkName: 'Druid'*/ "../pages/monitor/druid"));
// const Log = React.lazy(()=>import(/* webpackChunkName: 'Log'*/ "../pages/monitor/log"));
// const Token = React.lazy(()=>import(/* webpackChunkName: 'Token'*/ "../pages/monitor/token"));
// const Exception = React.lazy(()=>import(/* webpackChunkName: 'Exception'*/ "../pages/monitor/exception"));
// const Item = React.lazy(()=>import(/* webpackChunkName: 'Item'*/ "../pages/inspectionItem"));
// const ImcTaskInfo = React.lazy(()=>import(/* webpackChunkName: 'ImcTaskInfo'*/ "../pages/imcTaskInfo"));
// const ImcItemInfo = React.lazy(()=>import(/* webpackChunkName: 'ImcItemInfo'*/ "../pages/imcItemInfo"));
// const NewImcTask = React.lazy(()=>import(/* webpackChunkName: 'NewImcTask'*/ "../pages/inspection/add"));
// const StartImcTask = React.lazy(()=>import(/* webpackChunkName: 'StartImcTask'*/ "../pages/inspection/start"));
// const CompanyManager = React.lazy(()=>import(/* webpackChunkName: 'CompanyManager'*/ "../pages/group/company-manager"));
// const Dictionary = React.lazy(()=>import(/* webpackChunkName: 'Dictionary'*/ "../pages/dictionary"));
// const CompanyAdd = React.lazy(()=>import(/* webpackChunkName: 'CompanyAdd'*/ "../pages/group/company-add"));

let lastTime = new Date().getTime();
let currentTime = new Date().getTime()
let timeOut =  2 * 60 * 60 * 1000; 
class Index extends React.Component {
  constructor(props){
    super(props);
    this.state={
      
    }
  }
  componentDidMount(){
    window.setInterval(function testTime(){
      currentTime = new Date().getTime(); //更新当前时间
      if(currentTime - lastTime > timeOut){ //判断是否超时
        window.localStorage.removeItem('loggedIn')
        window.location.reload('/')
      }
    }, 10 * 60 *  1000)
  }
  setTime = ()=>{
    lastTime = new Date().getTime()
  }
  render() {
    const loggedIn = window.localStorage.getItem('loggedIn');
    const fallback = <Spin></Spin>
    const mainPage = (
      <div onMouseMove={this.setTime}>

        <Layout>
          <SiderBar></SiderBar>
          <Layout>
            <HeaderBar history={this.props.history}></HeaderBar>
            <div className="layout-content" style={{height:'100%'}}>
              <Switch>
                <Route exact path="/" component={Home}/>
                {/* <Route path="/user/list" component={ List }/>
                <Route path="/tool/rich" component={ Rich }/> */}
                <Route path="/cbd/service" component={Service}/>
                <Route path="/cbd/maintain/data" component={System}/>
                <Route path="/cbd/pro" component={Contract}/>
                <Route path="/cbd/inspection" component={PlanRoute}/>
                <Route path="/cbd/imc/add" component={NewImcTask}/>
                <Route path="/cbd/imc/start" component={StartImcTask}/>
                <Route path="/cbd/item/:tabKey/:imcTaskId/:imcTaskStatus" component={Item}/>
                <Route path="/cbd/examine" component={PlanApproval}/>
                <Route path="/cbd/bill" component={Bill}/>
                <Route path="/cbd/amc" component={Alarm}/>
                <Route path="/cbd/check" component={Acceptance}/>
                <Route path="/cbd/alliance" component={ServiceProvider}/>
                <Route path="/report" component={Report}/>
                <Route path="/cbd/imcTaskInfo" component={ImcTaskInfo}/>
                <Route path="/cbd/imcItemInfo" component={ImcItemInfo}/>
                <Route path="/cbd/panorama" component={PanoramaRoute}/>
                <Route path="/cbd/edgeDevice" component={EdgeDeviceRoute}/>

                <Route path="/mds/dict/list" component={Dictionary}/>
                <Route path="/mds/form/list" component={UserForm}/>

                <Route exact path="/uas/user/list" component={User}/>
                <Route path="/uas/user/list/online" component={OnlineUsers}/>
                <Route path="/uas/user/list/detail" component={DetailUser}/>
                <Route path="/uas/role/list" component={Role}/>
                <Route path="/uas/menu/list" component={Menu}/>
                <Route path="/uas/action/list" component={Authority}/>
                <Route path="/uas/group/list" component={Group}/>
                <Route path="/uas/group/manager" component={CompanyManager}/>
                <Route path="/uas/group/emplist" component={GroupEmpl}/>
                <Route path="/uas/group/add" component={CompanyAdd}/>
            
                <Route path="/uas/monitor/zipkin" component={Zipkin}/>
                <Route path="/uas/monitor/boot" component={Boot}/>
                <Route path="/uas/monitor/swagger" component={Swagger}/>
                <Route path="/uas/monitor/druid" component={Druid}/>
                <Route path="/uas/monitor/log" component={Log}/>
                <Route path="/uas/monitor/token" component={Token}/>
                <Route path="/uas/monitor/exception" component={Exception}/>
                <Route path="/uas/monitor/kibana" component={Kibana}/>

                <Route path="/uflo" component={Uflo}/>
              </Switch>
            </div>
            <FooterBar></FooterBar>
          </Layout>
        </Layout>
      </div>
    );
    return (
      loggedIn ? (
        mainPage
      ) : (
        <Redirect to="/login"/>
      )
    );
  }
}

export default Index;