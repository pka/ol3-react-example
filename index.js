var React = require('react');
var Redux = require('redux');
var ReactRedux = require('react-redux');
var createStore = Redux.createStore;
var Provider = ReactRedux.Provider;
var connect = ReactRedux.connect;

 // data extracted from http://www.geoforall.org/locations/OSGEoLabs.json
var places = [
  { "name": "<a href=\"http:\/\/lsi.iiit.ac.in\/labinfo\/\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">Lab for Spatial Informatics<\/a>", "time": "2011-08-22" },
  { "name": "<a href=\"http:\/\/www.nottingham.edu.my\/Geography\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">University of Nottingham, Malaysia campus<\/a>", "time": "2012-01-09" },
  { "name": "<a href=\"http:\/\/www.up.ac.za\/cgis\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">University of Pretoria<\/a>", "time": "2012-05-15" },
  { "name": "<a href=\"http:\/\/www.geomatica.ufpr.br\/index.html\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">Federal University of Paraná<\/a>", "time": "2012-05-23" },
  { "name": "National University of San Juan", "time": "2012-06-15" },
  { "name": "<a href=\"http:\/\/www.geomaticsindia-cept.org\/\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">CEPT University<\/a>", "time": "2012-07-18" },
  { "name": "<a href=\"http:\/\/www.sigte.udg.edu\/\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">University of Girona<\/a>", "time": "2012-09-10" },
  { "name": "<a href=\"http:\/\/geospatial.ncsu.edu\/osgeorel\/\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">North Carolina State University OSGeoREL<\/a>", "time": "2012-10-18" },
  { "name": "<a href=\"http:\/\/www.umass.edu\/opensource\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">University of Massachusetts Amherst<\/a>", "time": "2012-10-18" },
  { "name": "<a href=\"http:\/\/geo.fsv.cvut.cz\/gwiki\/osgeorel\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">Czech Technical University in Prague<\/a>", "time": "2012-11-23" },
  { "name": "Kathmandu University", "time": "2012-12-24" },
  { "name": "<a href=\"http:\/\/research.ncl.ac.uk\/osgeolab\/\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">Newcastle University<\/a>", "time": "2013-01-17" },
  { "name": "National Amazonian University of Madre de Dios (UNAMAD)", "time": "2013-02-01" },
  { "name": "<a href=\"https:\/\/geospatial.ucdavis.edu\/resources\/open-source\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">University of California, Davis<\/a>", "time": "2013-02-04" },
  { "name": "<a href=\"http:\/\/geomatica.como.polimi.it\/\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">Politecnico di Milano - Polo Territoriale di Como<\/a>", "time": "2013-02-25" },
  { "name": "<a href=\"http:\/\/www.universidad.edu.uy\/\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">Universidad de la República<\/a>", "time": "2013-03-01" },
  { "name": "<a href=\"http:\/\/www.gridw.pl\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">UNEP\/GRID-Warsaw Centre<\/a>", "time": "2013-03-18" },
  { "name": "<a href=\"http:\/\/www2.warwick.ac.uk\/fac\/sci\/lifesci\/research\/facilities\/geolab\/\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">University of Warwick<\/a>", "time": "2013-03-23" },
  { "name": "<a href=\"http:\/\/www.cozcyt.gob.mx\/labsol\/\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">Laboratorio de Software Libre<\/a>", "time": "2013-04-05" },
  { "name": "<a href=\"http:\/\/www.osgl.soton.ac.uk\/\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">University of Southampton<\/a>", "time": "2013-04-30" },
  { "name": "<a href=\"http:\/\/osgeolab.unimelb.edu.au\/\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">The University of Melbourne<\/a>", "time": "2013-07-22" },
  { "name": "<a href=\"https:\/\/sites.google.com\/site\/foss4gku\/\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">University of Kansas<\/a>", "time": "2013-08-23" },
  { "name": "Kent State University", "time": "2013-08-30" },
  { "name": "<a href=\"http:\/\/www.supsi.ch\/ist_en\/settori-attivita\/geomatica.html\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">University of Applied Sciences and Arts of Southern Switzerland<\/a>", "time": "2013-09-03" },
  { "name": "<a href=\"https:\/\/gis.uncc.edu\/osgl\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">Center for Applied GIScience, University of North Carolina, Charlotte <\/a>", "time": "2013-09-05" },
  { "name": "<a href=\"http:\/\/spatialquerylab.com\/projects\/open-source-gis\/\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">Spatial {Query} Lab at Texas A&amp;M University - Corpus Christi<\/a>", "time": "2013-09-09" },
  { "name": "<a href=\"http:\/\/karlinapp.ethz.ch\/osgl\/\" class=\"external text\" rel=\"nofollow\" target=\"_blank\">ETH Zurich<\/a>", "time": "2013-09-20" }
]

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

// Action:
function selectAction(place) {
  return {
    type: 'select',
    place: place
  };
}

// Reducer:
function placeSelector(state, action) {
  if (typeof state === 'undefined') {
    state = {places: places, selected: []};
  }
  switch(action.type){
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

module.exports = PlaceList;
