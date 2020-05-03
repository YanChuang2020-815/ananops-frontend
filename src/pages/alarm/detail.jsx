import React,{Component} from 'react'
import {List,Card,Icon} from 'antd'
import LinkButton from '../../components/link-button'

const Item = List.Item

export default class DetailAlarm extends Component{
  render(){
  
    const title = (
      <LinkButton onClick={()=>this.props.history.goBack()}>
        <Icon type='arrow-left' style={{fontSize:20}}/>
      </LinkButton>
    )
  
    return (
      <Card title={title}>
        <List>
          <Item>
              <span className='left'>设备ID：</span>
              <span>111</span>
            </Item>
            <Item>
              <span className='left'>报警员工ID：</span>
              <span>87592222</span>
            </Item>
            <Item>
              <span className='left'>警报等级：</span>
              <span>3</span>
            </Item>
            <Item>
              <span className='left'>警报类型：</span>
              <span>自然老化</span>
            </Item>
            <Item>
              <span className='left'>报警描述：</span>
              <span>通风口管道老化</span>
            </Item>
        </List>
      </Card>
    )
  }
}