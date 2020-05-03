import React,{Component} from 'react'
import {Form,Input,InputNumber} from 'antd'
import PropTypes from 'prop-types'
import { Map ,Marker} from 'react-amap'
import AMap from 'AMap'
import './index.styl'

const Item = Form.Item
const mapKey = '39bada67340836f36927de9606b96370'

class Add extends Component{
    //接收父组件参数
    static propTypes = {
      setSubmit:PropTypes.func.isRequired,
      addDetail:PropTypes.object,
    }

    constructor (props) {
      super(props)
      this.state = {
          signAddrList:{
              name:'',
              addr:'',
              longitude: 0,
              latitude: 0
          },
          geocoder:'',
          searchContent:'',
          isChose:false
      }
    }

    //改变数据通用方法(单层)

    changeData = (value, key) => {
        let { signAddrList } = this.state
        signAddrList[key] = value
        this.setState({
            signAddrList:signAddrList
        })
    }

    placeSearch = (e) => {
        this.setState({searchContent:e})
    }

    searchPlace = (e) => {
        console.log(1234,e)
    }

    componentWillMount() {
      this.props.setSubmit(this.props.form)
    }

    setLocation = () => {
      const {
        form,
      } = this.props
      const { signAddrList } = this.state
      form.setFieldsValue({
        longitude: signAddrList.longitude,
        latitude: signAddrList.latitude
      })
    }

    render(){
      const addDetail = this.props.addDetail;
      const formItemLayout = {
        labelCol:{span:5},
        wrapperCol:{span:15}
      }
      const {getFieldDecorator} = this.props.form;
      let { changeModal , saveAddressDetail } = this.props
      let { signAddrList } = this.state
      const selectAddress = {
          created:(e) => {
              let auto
              let geocoder
              window.AMap.plugin('AMap.Autocomplete',() => {
                  auto = new window.AMap.Autocomplete({input:'tipinput'});
              })

              window.AMap.plugin(["AMap.Geocoder"],function(){
                  geocoder= new AMap.Geocoder({
                      radius:1000, //以已知坐标为中心点，radius为半径，返回范围内兴趣点和道路信息
                      extensions: "all"//返回地址描述以及附近兴趣点和道路信息，默认"base"
                  });
              });

              window.AMap.plugin('AMap.PlaceSearch',() => {
                  let place = new window.AMap.PlaceSearch({})
                  let _this = this
                  window.AMap.event.addListener(auto,"select",(e) => {
                      place.search(e.poi.name)
                      geocoder.getAddress(e.poi.location,function (status,result) {
                          if (status === 'complete'&&result.regeocode) {
                              let address = result.regeocode.formattedAddress;
                              let data = result.regeocode.addressComponent
                              let name = data.township +data.street + data.streetNumber
                              _this.changeData(address,'addr')
                              _this.changeData(name,'name')
                              _this.changeData(e.poi.location.lng,'longitude')
                              _this.changeData(e.poi.location.lat,'latitude')
                              _this.setState({isChose:true})
                          }
                          _this.setLocation();
                      })
                  })
              })
          },
          click:(e) => {
              const _this = this
              var geocoder
              var infoWindow
              var lnglatXY=new AMap.LngLat(e.lnglat.lng,e.lnglat.lat);
              let content = '<div>定位中....</div>'
              window.AMap.plugin(["AMap.Geocoder"],function(){
                  geocoder= new AMap.Geocoder({
                      radius:1000, //以已知坐标为中心点，radius为半径，返回范围内兴趣点和道路信息
                      extensions: "all"//返回地址描述以及附近兴趣点和道路信息，默认"base"
                  });
                  geocoder.getAddress(e.lnglat,function (status,result) {
                      if (status === 'complete'&&result.regeocode) {
                          let address = result.regeocode.formattedAddress;
                          let data = result.regeocode.addressComponent
                          let name = data.township +data.street + data.streetNumber
                        
                          _this.changeData(address,'addr')
                          _this.changeData(name,'name')
                          _this.changeData(e.lnglat.lng,'longitude')
                          _this.changeData(e.lnglat.lat,'latitude')
                          _this.setState({isChose:true})
                      }
                      _this.setLocation()
                  })
              });
              
          }
      }

      return (
        <Form {...formItemLayout}>
          <Item label="名称">
            {getFieldDecorator('name',{
              initialValue: addDetail.name,
              rules:[{
                required:true,
                message:"请输入内容",
              }]
            })(
              <Input placeholder="请输入内容" />
            )}   
          </Item>
          <Item label="编码">
            {getFieldDecorator('code',{
              initialValue: addDetail.code,
              rules:[{
                required:true,
                message:"请输入内容",
              }]
            })( 
              <Input placeholder="请输入内容" />
            )}  
          </Item>
          <Item label="排序">
            {getFieldDecorator('sort',{
              initialValue:  addDetail.sort,
              rules:[{
                required:true,
                message:"请输入内容",
              }]
            })( 
              <Input placeholder="请输入内容"/>
            )} 
          </Item>
          <Item label="备注">
            {getFieldDecorator('mark',{
              initialValue:  addDetail.mark
            })( 
              <Input placeholder="请输入内容"/>
            )} 
          </Item>
          <Item label="经度">
            {getFieldDecorator('longitude',{
              initialValue: addDetail.longitude
            })( 
              <Input placeholder="请在地图中选取位置"/>
            )}
          </Item>
          <Item label="纬度">
            {getFieldDecorator('latitude',{
              initialValue: addDetail.latitude
            })( 
              <Input placeholder="请在地图中选取位置"/>
            )}
          </Item>
          <Item>
            <div style={{ width: '400px', height: '400px', position: 'relative', marginLeft: 30}}>
              {
                  this.state.isChose ? <Map amapkey={mapKey}
                                            plugins={["ToolBar", 'Scale']}
                                            events={selectAddress}
                                            center={ [ signAddrList.longitude,signAddrList.latitude] }
                                            zoom={15}>
                      <Marker position={[ signAddrList.longitude,signAddrList.latitude]}/>
                  </Map> : <Map amapkey={mapKey}
                                plugins={["ToolBar", 'Scale']}
                                events={selectAddress}
                                zoom={15}>
                      <Marker position={[ signAddrList.longitude,signAddrList.latitude]}/>
                  </Map>
              }
                <div className='map-detail'>
                  <Input id="tipinput"
                    placeholder='请输入关键字: '
                    onChange={(e) => this.placeSearch(e.target.value)}
                    onKeyDown={(e) => this.searchPlace(e)} />
                </div>
              </div>
          </Item>
        </Form>
      )
    }
}
export default Form.create()(Add)