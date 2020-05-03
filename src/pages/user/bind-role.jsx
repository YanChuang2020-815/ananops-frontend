import React,{Component} from 'react'
import {Transfer} from 'antd'
import PropTypes from 'prop-types'

export default class BindRole extends Component{

  static propTypes = {
    setRoleIdList:PropTypes.func.isRequired,
    allRoleSet:PropTypes.array.isRequired,
    alreadyBindRoleIdSet:PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
    const alreadySet = this.props.alreadyBindRoleIdSet.map(item=>item.key)
    this.state = {
      targetKeys: alreadySet,
      selectedKeys: [],
      disabled: false,
    }
  }
  

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys },()=> {
      this.props.setRoleIdList(this.state.targetKeys)
    });
    console.log('targetKeys: ', nextTargetKeys);
    console.log('direction: ', direction);
    console.log('moveKeys: ', moveKeys);
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });

    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  };

  // handleScroll = (direction, e) => {
  //   console.log('direction:', direction);
  //   console.log('target:', e.target);
  // }

  componentWillReceiveProps(nextProps){
    console.log(' componentWillReceiveProps()',nextProps)
    const alreadySet = nextProps.alreadyBindRoleIdSet.map(item=>item.key)
    this.setState({
      targetKeys:alreadySet
    })
  }

  render(){
    const { targetKeys, selectedKeys, disabled } = this.state;
    const allRoleSet = this.props.allRoleSet
    console.log('props传入得到所有角色allroleset',allRoleSet)
    console.log('props传入得到已绑定角色alreadyRoleSet',targetKeys)
    return (
      
      <Transfer
        dataSource={allRoleSet}
        titles={['角色列表', '已选角色']}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={this.handleChange}
        onSelectChange={this.handleSelectChange}
        //onScroll={this.handleScroll}
        render={item => `${item.roleName} - ${item.roleId}`}
        disabled={disabled}
        listStyle={{
          width: 350,
          height: 300,
        }}
      />
        
    )
  }
}