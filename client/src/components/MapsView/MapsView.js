import { List, Avatar, Icon, Modal, Button } from 'antd';
import React from 'react'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import iconUrlList from './IconUrl'

const mapStyles = {
  width: '100%',
  height: '100%',
};

var allMarkers = []

class MapsView extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentLatLng: {
        lat: -37.808308327685346,
        lng: 144.9660499820618
      },
      isMarkerShown: false,
      allMarkers: [{
        lat: 0,
        lng: 0,
        iconUrl: '',
        rawData: ''
      }],
      i: 0,
      visible: false
    }
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.data) {
      this.setMarkers(this.props.data)
      if (this.state.allMarkers !== allMarkers) {
        this.setState({ allMarkers })
      }
    }

    if (prevProps.data !== this.props.data) {
      allMarkers = []
      this.setMarkers(this.props.data)
      this.forceUpdate()
      console.log("MARKERS: ", allMarkers)
    }

  }

  componentDidMount() {
    // this.getGeoLocation() // require secure call
  }

  setMarkers = (data) => {
    for (let i = 0; i < data.length; i++) {
      const lat = data[i].locationLat
      const lng = data[i].locationLng
      const iconUrl = iconUrlList[data[i].type]
      const rawData = data[i]
      allMarkers.push({
        lat, lng, iconUrl, rawData
      });
    }
  }

  getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({
            currentLatLng: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          })
        }
      )
    } else {
      error => console.log("ERROR: " + error)
    }
  }

  showModal = (i) => {
    this.setState({
      visible: true,
      i
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const { currentLatLng } = this.state
    
    return (
      <div>
        <Map
          google={this.props.google}
          zoom={14}
          style={mapStyles}
          initialCenter={{ lat: currentLatLng.lat, lng: currentLatLng.lng }}
          center={{ lat: currentLatLng.lat, lng: currentLatLng.lng }}
        >
          {this.state.allMarkers.map((marker, i) => (
            <Marker
              position={{ lat: marker.lat, lng: marker.lng }}
              key={i}
              icon={{
                url: marker.iconUrl,
              }}
              onClick={() => {
                this.showModal(i)
              }}
            />
          ))}
        </Map>

        {this.state.allMarkers.length !== 0 ? <Modal
          title={this.state.allMarkers[this.state.i].rawData.topic}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button type="primary" onClick={this.handleOk}>
              OK
            </Button>,
          ]}
        >
          <p>(from {this.state.allMarkers[this.state.i].rawData.fromtime} to {this.state.allMarkers[this.state.i].rawData.totime})</p>
          <p>{this.state.allMarkers[this.state.i].rawData.description}</p>
        </Modal> : null}
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBXMasJbjUDo0rtb3qZuuEaNKkhhkN7hbM'
})(MapsView);