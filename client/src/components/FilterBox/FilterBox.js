import { Form, Row, Col, Input, Button, Icon, Checkbox, Select } from 'antd';
import React from 'react'


const { Option } = Select

class AdvancedSearchForm extends React.Component {
  state = {
    expand: false,
  };

  handleFilter = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {

      const data = JSON.stringify(values)
      console.log(data)

      //TODO: get data from Server
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const handleNewsTypeFilterChange = this.props.handleNewsTypeFilterChange;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <div style={{padding: '0 100px'}}>
        <Select
          mode="multiple"
          placeholder="Type of news"
          style={{minWidth: 400}}
          onChange={handleNewsTypeFilterChange}
        >
          <Option value="traffic">Traffic</Option>
          <Option value="publictransport">Public transport</Option>
          <Option value="specialevents">Special events</Option>
          <Option value="dealdiscounts">Deal/discounts</Option>
        </Select>
      </div>
    );
  }
}

const WrappedAdvancedSearchForm = Form.create({ name: 'advanced_search' })(AdvancedSearchForm);

export default WrappedAdvancedSearchForm