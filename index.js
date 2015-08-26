var ol = require('openlayers');
var React = require('react');
var Redux = require('redux');
var ReactRedux = require('react-redux');

require("openlayers/css/ol.css");
require("./popup.css");

var createStore = Redux.createStore;
var Provider = ReactRedux.Provider;
var connect = ReactRedux.connect;


// OL map
var placeLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    //url: "http://www.geoforall.org/locations/OSGEoLabs.json" raises
    //Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at http://www.geoforall.org/locations/OSGEoLabs.json. (Reason: CORS header 'Access-Control-Allow-Origin' missing).
    url: "OSGEoLabs.json"
  })
});

map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    placeLayer
  ],
  view: new ol.View({
    center: [949282, 6002552],
    zoom: 4
  })
});

popupElement = document.getElementById('popup');
var popup = new ol.Overlay({
  element: popupElement,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});
map.addOverlay(popup);

function placeName(place) {
    // extract text from link
    return place.name.replace(/<(?:.|\n)*?>/g, '');
}

// OL callbacks
function updateVisiblePlaces() {
  var extent = map.getView().calculateExtent(map.getSize());
  var places = placeLayer.getSource().getFeaturesInExtent(extent).map(function(feature) {
    return feature.getProperties();
  });
  // Update state in Redux store
  store.dispatch(visiblePlacesAction(places))
}
placeLayer.on('change', updateVisiblePlaces);
map.on('moveend', updateVisiblePlaces);

function updateSelection(name) {
  var extent = map.getView().calculateExtent(map.getSize());
  var selected = placeLayer.getSource().getFeaturesInExtent(extent).filter(function(feature) {
    return name == placeName(feature.getProperties());
  });
  if (selected.length > 0) {
    feature = selected[0];
    popupElement.innerHTML = feature.getProperties().name;
    popup.setPosition(feature.getGeometry().getFirstCoordinate());
  }
}

// React component
var PlaceList = React.createClass( {
  render: function() {
    var onSelectClick = this.props.onSelectClick;
    var selected = this.props.selected;
    var createItem = function(place) {
      var name = placeName(place);
      var selClass = (name == selected) ? 'selected' : '';
      return <li key={name} className={selClass} onClick={onSelectClick}>{name}</li>;
    };
    return (
      <ul>
        {this.props.places.map(createItem)}
      </ul>
    );
  }
});

// Actions:
function visiblePlacesAction(places) {
  return {
    type: 'visible',
    places: places
  };
}

function selectAction(placeName) {
  return {
    type: 'select',
    placeName: placeName
  };
}

// Reducer:
function placeSelector(state, action) {
  if (typeof state === 'undefined') {
    state = {places: [], selected: null};
  }
  switch(action.type){
    case 'visible':
      return {places: action.places, selected: state.selected};
    case 'select':
      return {places: state.places, selected: action.placeName};
    default:
      return state;
  }
}

// Store:
var store = createStore(placeSelector);

// Map Redux state to component props
function mapStateToProps(state)  {
  return {
    places: state.places,
    selected: state.selected
  };
}

// Map Redux actions to component props
function mapDispatchToProps(dispatch) {
  return {
    onSelectClick: function(e) {
      name = e.dispatchMarker.split('$')[1];
      dispatch(selectAction(name));
      // Update map
      updateSelection(name)
    }
  };
}

// Connected Component:
var App = connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaceList);

React.render(
  React.createElement(Provider, {store: store}, 
    function(){
      return (<App/>)
    }
  ),
  document.getElementById('root')
);


module.exports = PlaceList;
