import {
  Form,
  Select,
  Radio,
  Button,
  DatePicker,
  Input
} from 'antd';
import React from 'react'
import MapsCreatePinBtn from './MapsCreatePinBtn';

const { Option } = Select;
const { RangePicker } = DatePicker

class CreateMarkerForm extends React.Component {
  state = {
    selectedLatLng: {
      lat: 0,
      lng: 0
    }
  };

  selectLatLng = ({ lat, lng }) => {
    this.setState({selectedLatLng: {
      lat, lng
    }})
  }
  
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      const rangeDateValue = fieldsValue['time']
      var values = {
        ...fieldsValue,
        'time': [rangeDateValue[0].format('YYYY-MM-DD'), rangeDateValue[1].format('YYYY-MM-DD')],
      }
      values = {...values, location: this.state.selectedLatLng}
      if (!err) {
        console.log('Received values of form: ', values);
        this.postData(values)
      }
      
    });

  }

  postData = (values) => {
    var data = values
    data = JSON.stringify(data)
    
    console.log(data)
    fetch("http://tutorials-env-1.vgpdkpkjze.us-west-2.elasticbeanstalk.com/api/addnews", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 6 },
    };
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="City" hasFeedback>
          {getFieldDecorator('city', {
            rules: [{ required: true, message: 'Please select your city!' }],
          })(
            <Select placeholder="select a city" style={{ width: '50%' }}>
              <Option value="melbourne">Melbourne</Option>
              <Option value="sydney">Sydney</Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item label="Type">
          {getFieldDecorator('type', {
            rules: [{ required: true, message: 'Please select a type!' }],
          })(
            <Radio.Group>
              <Radio.Button value="traffic">Traffic</Radio.Button>
              <Radio.Button value="publictransport">Public transport</Radio.Button>
              <Radio.Button value="specialevents">Special events</Radio.Button>
              <Radio.Button value="dealdiscounts">Deal/discounts</Radio.Button>
            </Radio.Group>,
          )}
        </Form.Item>

        <Form.Item label="Time">
          {getFieldDecorator('time', {
            rules: [{ required: true, message: 'Please select time!' }]
          })(
            <RangePicker />
          )}
        </Form.Item>

        <Form.Item label="Topic">
          {getFieldDecorator('topic', {
            rules: [
              {
                required: true,
                message: 'Please input your topic name',
              },
            ],
          })(<Input placeholder="input topic name" />)}
        </Form.Item>

        <Form.Item label="Description">
          {getFieldDecorator('description', {
            rules: [
              {
                required: true,
                message: 'Please input your description',
              },
            ],
          })(<Input.TextArea placeholder="input description" />)}
        </Form.Item>

        <Form.Item label="Address">
          {getFieldDecorator('address', {
            rules: [
              {
                required: true,
                message: 'Please input your address',
              },
            ],
          })(<Input placeholder="eg. Melbourne Central Station, Melbourne" />)}
        </Form.Item>

        <Form.Item label="Maps location">
          <MapsCreatePinBtn selectLatLng={this.selectLatLng}/>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 3, offset: 3 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 3, offset: 3 }}>
          <Button type="default" href="/">
            Go to home page
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedCreateMarkerForm = Form.create({ name: 'createrMarkerForm' })(CreateMarkerForm);
export default WrappedCreateMarkerForm