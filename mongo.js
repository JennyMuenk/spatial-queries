print('\n');

print('Connect to database named spatial:');
use spatial_db;
print('\n');

print('Create indices:');
db.nyc_streets.createIndex({'geometry': '2dsphere'});
db.nyc_streets.getIndexes();
print('\n');

print('1) Show collections:');
show collections;
print('\n');

print('2) Get the names of all neighborhoods from Manhattan:');
var neighborhoods = db.nyc_neighborhoods.find({'properties.BORONAME': 'Manhattan'}, {'properties.NAME': 1, '_id':0});
neighborhoods.toArray().forEach(element => {
  print('\t ' + element.properties.NAME);
});
print('\t (' + neighborhoods.count() + ' rows)');
print('\n');

print('3) What is the area of Manhattan in m²?');
print('Note: MongoDB does currently not support area calculation of polygons');
print('\n');

print('4) What is the total length of all streets in New York in km?');
print('Note: MongoDB does currently not support length calculation of linestrings');
print('\n');

print('5) Through what neighborhoods in Manhattan leads 5th Avenue?');
var street = db.nyc_streets.find({'properties.NAME': '5th Ave'});
street.toArray().forEach(element => {
  var neighborhoods_5th = db.nyc_neighborhoods.find({'geometry': {$geoIntersects: {$geometry: element.geometry}}, 'properties.BORONAME': 'Manhattan'}, {'properties.NAME':1, '_id':0});
  neighborhoods_5th.toArray().forEach(element => {
    print('\t ' + element.properties.NAME);
  });
});
print('\t (' + street.count() + ' rows)');
print('Note: This is not possible with one query only.');
print('      Additional javascript code is needed to loop over streets/neighborhoods');
print('\n');

print('6) Get the named of all subway stations in Upper East Side:');
var ues = db.nyc_neighborhoods.findOne({'properties.NAME': 'Upper East Side'}, {'geometry': 1, '_id':0});
var subways = db.nyc_subway_stations.find({'geometry': {$geoIntersects: {$geometry: ues.geometry}}}).pretty();
subways.toArray().forEach(element => {
  print('\t ' + element.properties.NAME + ' [' + element.properties.COLOR + ']');
});
print('\t (' + subways.count() + ' rows)');
print('\n');

print('7) What is the closest subway station to Wall Street?');
print('Note: MongoDB does currently not support distance calculations to a LineString.');
print('      The $near operator can specify either a GeoJSON point or legacy coordinate point.');
print('\n');

print('8) What are the three closest stations to Wall Street station (red line)?');
var ws_station = db.nyc_subway_stations.findOne({'properties.NAME': 'Wall St', 'properties.COLOR': 'RED'});
var stations = db.nyc_streets.aggregate([
  {
    $geoNear: {
      near: ws_station.geometry,
      distanceField: "distance",
      num: 3,
      spherical: true,
      keys: 'geometry'
    }
  }
]);
var station_length = 0;
stations.toArray().forEach(element => {
  print('\t ' + element.properties.NAME + ': ' + element.distance + 'm');
  station_length++;
});
print('\t (' + station_length + ' rows)');
print('Note: This query is only possible because of previously created index.');
print('\n');
