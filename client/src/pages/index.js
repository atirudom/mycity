import React, { Component } from 'react';
import logo from './logo.svg';
import "antd/dist/antd.css";
import FilterBox from '../components/FilterBox/FilterBox'
import ListView from '../components/ListView/ListView'

import { Layout, Menu, Breadcrumb, Icon, Col, Row } from 'antd';
import MapsView from '../components/MapsView/MapsView';
import HeaderMenu from '../components/HeaderMenu/HeaderMenu';
import withNewsDataControl from '../components/NewsContext/NewsDataWrapper';
import NewsContext from '../components/NewsContext/NewsContext'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <NewsContext.Consumer>{
        (context) => (
          <Layout>
            <div style={{ position: 'sticky', zIndex: 99, width: '100%', top: '0px' }}>
              <Header className="header" style={{display: 'flex'}}>
                <div className="logo" />
                <HeaderMenu />
                <FilterBox handleNewsTypeFilterChange={context.handleNewsTypeFilterChange}/>
              </Header>
            </div>

            <Row>
              <Col span={14}>
                <Content
                  style={{
                    background: '#fff',
                    margin: 0,
                    height: 'calc(100vh - 64px)',
                    position: 'fixed',
                    width: 'calc(58.5%)'
                  }}
                >
                  <MapsView data={context.data}/>
                </Content>
              </Col>
              <Col span={10}>
                <Content
                  style={{
                    background: '#fff',
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                    border: '1px solid #ccc'
                  }}
                >
                  <ListView data={context.data}/>
                </Content>
              </Col>
            </Row>
          </Layout>
        )}
      </NewsContext.Consumer>
    );
  }
}

export default withNewsDataControl(App);
