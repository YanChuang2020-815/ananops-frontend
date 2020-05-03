
import React from 'react';
import { NavLink } from 'react-router-dom'
import { Menu, Icon, Layout } from 'antd';
import menuConfig from '../../config';
import logoURL from '../../img/logo.png';
import { connect } from 'react-redux';
import { switchMenu } from '../../redux/actions';
const { Sider } = Layout;
const { SubMenu } = Menu;

class SiderBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      menuList: [],
      defaultOpenKeys: [],       // 默认展开
      defaultSelectedKeys: ['/'],   // 默认选中
      openKeys: [],   // 打开的菜单
    };
    SiderBar.that = this;
  }

  componentDidMount() {
    
    //const menuConfig = JSON.parse(localStorage.getItem('resMenu'))
    console.log('menuConfig',menuConfig)
    if(menuConfig){
      this.menuConfig = menuConfig
      this.handleDefaultSelect();
      const menuList = this.setMenu(menuConfig);
      this.setState({
        menuList
      });
    }
    
  }

  

  // 刷新页面，处理默认选中
  handleDefaultSelect = () => {
    let menuConfigKeys = [];
    menuConfig.forEach((item) => {
      menuConfigKeys.push(item.key);
    });
    const pathname = window.location.pathname;
    const currentKey = '/' + pathname.split('/')[1];
    const titleArray = this.selectBreadcrumb(currentKey, pathname);
    
    /*如果不修改，则会导航栏中title除了第一项均为首页*/ 

    // if (menuConfigKeys.indexOf(currentKey) === 1) {
    this.setState({
      defaultOpenKeys: [currentKey],
      defaultSelectedKeys: [pathname],
    });
    this.props.handleClick(titleArray);
    // }
  };

  // 处理菜单列表
  setMenu = (menu, pItem) => {
    var roleCode = window.localStorage.getItem('roleCode');
    return menu.map((item) => {
      if (item.menuCode === 'uas_group') {
        if (roleCode === 'admin') {
          item.title = '企业管理';
        } else {
          item.title = '组织架构';
        }
      }
      if (item.children) {
        return (
          <SubMenu key={item.key}
            title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}
          >
            {this.setMenu(item.children, item)}
          </SubMenu>
          
        )
      }
      return (
        <Menu.Item title={item.title} key={item.key} pitem={pItem}>
          <NavLink to={item.key} >
            {item.icon && <Icon type={item.icon}/>}
            <span>{item.title}</span>
          </NavLink>
        </Menu.Item>
      )
    });
  };

   // 导出出面包屑数组
   selectBreadcrumb = (currentKey, pathname) => {

     const titleArray = [];
     console.log(menuConfig);
    
     menuConfig.forEach((item) => { 
       if (item.key === pathname) {
         titleArray.push(item.title);}
       else if (item.children){
         item.children.forEach( (sItem) =>{
           if (sItem.key === pathname ){
             titleArray.push(item.title);
             titleArray.push(sItem.title);              
           }
           if (sItem.children){             
             sItem.children.forEach( (tItem) =>{
               if(tItem.key === pathname && sItem.key !== pathname){
                 titleArray.push(item.title);
                 titleArray.push(sItem.title);
                 titleArray.push(tItem.title);
               }
               else if (tItem.key === pathname) {
                 titleArray.push(tItem.title);
               }
       
                          
             })}})}});

     return titleArray; 
   };

  // 点击侧边栏
  handleClick = (item) => {
    const currentKey = '/' + item.key.split('/')[1];
    const pathname = item.key;
    const titleArray = SiderBar.that.selectBreadcrumb(currentKey, pathname);
    this.props.handleClick(titleArray);
  };

  // 收缩侧边栏
  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  // 处理菜单只打开一个
  onOpenChange = (openKeys) => {
    // 反复/点击当前一个菜单组
    if (openKeys.length === 1 || openKeys.length === 0) {
      this.setState({
        openKeys
      })
      return;
    }
    // 二次操作 最新展开的菜单['xx','newxxx']
    const latestOpenKey = openKeys[openKeys.length - 1]
    // 如果点击的还是同一个
    if (latestOpenKey.includes(openKeys[0])) {
      this.setState({
        openKeys
      })
    } else {
      this.setState({
        openKeys: [latestOpenKey],
      })
    }
  }

  render() {
    let name;
    const {openKeys} = this.state;
    if (!this.state.collapsed) {
      name = <span className="name">安安运维系统</span>;
    }
    return (
      <Sider style={{overflow:'scroll'}} collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
        <NavLink to="/">
          <div className="logo">
            <img className="logo-img" src={logoURL} alt=""/>
            {name}
          </div>
        </NavLink>
        <Menu onClick={this.handleClick} theme="dark"
          onOpenChange={this.onOpenChange.bind(this)}
          openKeys={openKeys}
          defaultOpenKeys={this.state.defaultOpenKeys}
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          mode="inline"
        >
          {this.state.menuList}
        </Menu>
      </Sider>
    );
  }
}

const mapStateToProps = () => {
  return {}
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleClick(titleArray) {
      dispatch(switchMenu(titleArray));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SiderBar);