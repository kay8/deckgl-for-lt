
import React, { Component } from 'react';
import { render } from 'react-dom';
import MapboxGLMap from 'react-map-gl';
import DeckGLOverlay from './deckgl-overlay.js';
import DeckGL, { GeoJsonLayer } from 'deck.gl';

import { json as requestJson } from 'd3-request';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

// Source data GeoJSON
const DATA_URL = './data/kyoto.geojson';

export const INITIAL_VIEW_STATE = {
  latitude: 34.986175148310799,
  longitude: 135.761313932311,
  zoom: 15,
  maxZoom: 16,
  pitch: 59,
  bearing: 0
};

class Maps extends Component {

  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        ...DeckGLOverlay.defaultViewport,
        width: 0,
        height: 0
      },
      data: null
    };

    requestJson(DATA_URL, (error, response) => {
      if (!error) {
        this.setState({ data: response });
      }
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize.bind(this));
    this._resize();
  }

  _resize() {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _onViewportChange(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  }

  _renderLayers() {
    const { viewport, data } = this.props;
    if (!data) {
      return null;
    }

    const setPointColor = (val) => {
      if (val > 4) {
        return [41, 121, 255]
      } else if (val > 3.5) {
        return [29, 233, 182]
      } else {
        return [255, 224, 178];
      }
    }

    const setPointSize = (val) => {
      if (val > 4) {
        return 100
      } else if (val > 3.5) {
        return 70
      } else {
        return 40;
      }
    }
    return [
      new GeoJsonLayer({
        id: 'geojson-layer',
        data,
        opacity: 0.4,
        stroked: true,
        filled: true,
        //fp64: false,
        getRadius: f => setPointSize(f.properties.TotalRating),
        getFillColor: f => setPointColor(f.properties.TotalRating),
        pickable: Boolean(this.props.onHover),
      })
    ];
  }

  render() {
    const { viewport, data } = this.state;
    return (
      <MapboxGLMap
        {...viewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={this._onViewportChange.bind(this)}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <DeckGLOverlay viewport={viewport}
          data={data}
        />
      </MapboxGLMap>
    );
  }
}


export default Maps;