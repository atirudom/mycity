import { List, Avatar, Icon } from 'antd';
import React from 'react'
import iconUrlList from '../MapsView/IconUrl'

var listData = []

class ListView extends React.Component {

  componentDidUpdate = (prevProps) => {

    if(prevProps.data !== this.props.data) {
      listData = []
      this.setListData(this.props.data)
      this.forceUpdate()
      
      console.log("LISTDATA: ", listData)
    }

  }

  setListData = (stateData) => {
    for (let i = 0; i < stateData.length; i++) {
      const news = stateData[i]
      listData.push({
        title: news.topic + ` ( from ${news.fromtime} to ${news.totime} )`,
        avatar: iconUrlList[news.type],
        description: news.type + ": " + news.address,
        content: news.description
      });
    }
  }

  render() {
    return (
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: page => {
            console.log(page);
          },
          pageSize: 10,
        }}
        dataSource={listData}
        footer={
          <div>
            <b>Total </b> {listData.length} items
          </div>
        }
        renderItem={item => (
          <List.Item
            key={item.title}
            extra={
              <img
                width={30}
                alt="logo"
                src={item.avatar}
              />
            }
            style={{ padding: '20px 0', height: 160 }}
          >
            <List.Item.Meta
              title={<a href={item.href}>{item.title}</a>}
              description={item.description}
            />
            {item.content}
          </List.Item>
        )}
      />
    )
  }
}

export default ListView