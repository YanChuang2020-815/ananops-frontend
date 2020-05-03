import React,{Component} from 'react'
import {Transfer} from 'antd'
import PropTypes from 'prop-types'

export default class BindUser extends Component{

  static propTypes = {
    setUserIdList:PropTypes.func.isRequired,
    allUserSet:PropTypes.array.isRequired,
    alreadyBindUserIdSet:PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
    const alreadySet = this.props.alreadyBindUserIdSet.map(item=>item.key)
    this.state = {
      targetKeys: alreadySet,
      selectedKeys: [],
      disabled: false,
    }
  }
  

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys },()=> {
      this.props.setUserIdList(this.state.targetKeys)
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
    const alreadySet = nextProps.alreadyBindUserIdSet.map(item=>item.key)
    this.setState({
      targetKeys:alreadySet
    })
  }

  render(){
    const { targetKeys, selectedKeys, disabled } = this.state;
    const allUserSet = this.props.allUserSet
    return (
      
      <Transfer
        dataSource={allUserSet}
        titles={['用户列表', '已选用户']}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={this.handleChange}
        onSelectChange={this.handleSelectChange}
        //onScroll={this.handleScroll}
        render={item => `${item.userName} - ${item.userId}`}
        disabled={disabled}
        listStyle={{
          width: 300,
          height: 300,
        }}
      />
        
    )
  }
}