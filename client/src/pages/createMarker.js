import React, { Component } from 'react';
import logo from './logo.svg';
import "antd/dist/antd.css";
import FilterBox from '../components/FilterBox/FilterBox'
import CreateMarkerForm from '../components/CreateMarkerForm/CreateMarkerForm'

import { Layout, Menu, Breadcrumb, Icon, Col, Row } from 'antd';
import MapsView from '../components/MapsView/MapsView';
import HeaderMenu from '../components/HeaderMenu/HeaderMenu';

const { Header, Content, Sider } = Layout;

class App extends Component {
  render() {
    return (
      <Layout>
        <div style={{ position: 'sticky', zIndex: 99, width: '100%', top: '0px' }}>
          <Header className="header">
            <div className="logo" />
            <HeaderMenu/>
          </Header>
        </div>

        <Row>
          <Col span={24}>
            <Content
              style={{
                background: '#fff',
                padding: 24,
                minHeight: 280,
                border: '1px solid #ccc'
              }}
            >
              <CreateMarkerForm/>
            </Content>
          </Col>
        </Row>
      </Layout>

    );
  }
}

export default App;
