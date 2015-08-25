var ol = require('openlayers');
var React = require('react');
var Redux = require('redux');
var ReactRedux = require('react-redux');
var createStore = Redux.createStore;
var Provider = ReactRedux.Provider;
var connect = ReactRedux.connect;


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


// React component
var PlaceList = React.createClass( {
  render: function() {
    var onSelectClick = this.props.onSelectClick;
    var selected = this.props.selected;
    var createItem = function(place, index) {
      // extract link text
      var name = place.name.replace(/<(?:.|\n)*?>/g, '');
      var selclass = (name==selected) ? 'selected' : '';
      return <li key={name} className={selclass} onClick={onSelectClick}>{name}</li>;
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

function selectAction(place) {
  return {
    type: 'select',
    place: place
  };
}

// Reducer:
function placeSelector(state, action) {
  if (typeof state === 'undefined') {
    state = {places: [], selected: []};
  }
  switch(action.type){
    case 'visible':
      return {places: action.places, selected: state.selected};
    case 'select':
      return {places: state.places, selected: action.place};
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
      dispatch(selectAction(name))
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
      return React.createElement(App, null)
    }
  ),
  document.getElementById('root')
);

// OL callbacks
function updateVisiblePlaces() {
  var extent = map.getView().calculateExtent(map.getSize());
  var places = placeLayer.getSource().getFeaturesInExtent(extent).map(function(feature) {
    return feature.getProperties();
  });
  store.dispatch(visiblePlacesAction(places))
}
placeLayer.on('change', updateVisiblePlaces);
map.on('moveend', updateVisiblePlaces);


module.exports = PlaceList;
