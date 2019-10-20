import { Modal, Button } from 'antd';
import React from 'react'
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '100%',
};

class MapsCreatePinBtn extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      visible: false,
      selectedLatLng: {
        lat: 0,
        lng: 0
      },
      currentLatLng: {
        lat: 0,
        lng: 0
      },
    };
    this.handleMapClick = this.handleMapClick.bind(this);
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.props.selectLatLng(this.state.selectedLatLng)
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  handleMapClick = (ref, map, ev) => {
    const selectedLatLng = { lat: ev.latLng.lat(), lng: ev.latLng.lng() }
    this.setState({selectedLatLng}, () => console.log(this.state))
    // map.panTo(selectedLatLng);
  };

  componentDidMount() {
    this.getGeoLocation()
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

  render() {
    const { currentLatLng, selectedLatLng } = this.state
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Choose Location
        </Button>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={800}
        >
          <div style={{ width: 760, height: 500, position: 'relative' }}>
            <Map
              google={this.props.google}
              zoom={15}
              style={mapStyles}
              onClick={this.handleMapClick.bind(this)}
              initialCenter={{ lat: currentLatLng.lat, lng: currentLatLng.lng }}
              // center={{ lat: currentLatLng.lat, lng: currentLatLng.lng }}
            >
              <Marker position={ selectedLatLng } />
            </Map>
          </div>

        </Modal>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBXMasJbjUDo0rtb3qZuuEaNKkhhkN7hbM'
})(MapsCreatePinBtn);