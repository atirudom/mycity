import { List, Avatar, Icon, Button } from 'antd';
import React from 'react'
import './HeaderMenu.css'

class HeaderMenu extends React.Component {

  render() {
    return (
      <div>
        <Button type="primary" href="/create">
          Create a Marker
        </Button>
      </div>
    )
  }
}

export default HeaderMenu