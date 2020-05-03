import React,{PureComponent} from 'react'
import {Form,Input,Tree,Row,Col} from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config'

const Item = Form.Item
const {TreeNode} = Tree

export default class BindMenu extends PureComponent{

  static propTypes = {
    role:PropTypes.object.isRequired
  }

  constructor(props){
    super(props)
    const {menus} = this.props.role
    this.state ={
      checkedKeys:menus
    }
  }

  //为父组件获取最新menus的方法
  getMenus = () => this.state.checkedKeys

  getTreeNodes = (menuList) => {
    return menuList.reduce((pre,item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children?this.getTreeNodes(item.children):null}
        </TreeNode>)
      return pre
    },[])
  }

  //选中某个复选框
  onCheck = (checkedKeys) => {
    
    this.setState({checkedKeys})
  }

  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList)
  }
  
  //根据新传入的role来更新checkedKeys状态，在render之前调用，初始显示不会调用
  componentWillReceiveProps(nextProps){
    console.log(' componentWillReceiveProps()',nextProps)
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys:menus
    })
  }

  render(){
    console.log('AuthForm render()')
    
    const {roleName,roleCode} = this.props.role
    
    const {checkedKeys} = this.state
  
    const formItemLayout = {
      labelCol:{span:8},
      wrapperCol:{span:16}
    }
  
    return (
      <div>
        <Row gutter={2}>
          <Col span={12}>
            <Item label="角色名称"  {...formItemLayout}>
              <Input value={roleName} disabled/>
            </Item>
          </Col>
          <Col span={12}>
            <Item label="角色编码"  {...formItemLayout}>
              <Input value={roleCode} disabled/>
            </Item>
          </Col>
        </Row>
        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </div>
       
      
    )
  }
}