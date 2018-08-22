import React, { Component } from 'react';
import DeckGL, { GeoJsonLayer } from 'deck.gl';
//import 'luma.gl/debug'

export default class DeckGLOverlay extends Component {

  static get defaultViewport() {
    return {
      latitude: 34.986175148310799,
      longitude: 135.761313932311,
      zoom: 15,
      maxZoom: 16,
      pitch: 59,
      bearing: 0
    };
  }

  render() {
    const { viewport, data } = this.props;
    if (!data) {
      return null;
    }

    const setPointColor = (val) => {
      if (val > 4) {
        return [2, 119, 189]
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

    const layer = new GeoJsonLayer({
      id: 'geojson-layer',
      data,
      opacity: 0.3,
      stroked: true,
      filled: true,
      //fp64: false,
      pointRadiusScale: 30,
      //getRadius: f => setPointSize(f.properties.TotalRating),
      getFillColor: f => setPointColor(f.properties.TotalRating),
      pickable: true,
      onHover: info => console.log('Hovered:', info)
    });

    return (
      <DeckGL 
        {...viewport} 
        layers={[layer]} 
        initWebGLParameters 
        />
    );
  }
}