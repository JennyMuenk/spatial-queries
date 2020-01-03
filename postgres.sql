\! echo '1) Show tables:';
\dt

\! echo '2) Get the name of all neighborhoods from Manhattan:';
SELECT name
FROM nyc_neighborhoods
WHERE boroname = 'Manhattan';
\! echo '';

\! echo '3) What is the area of Manhattan in km²?';
SELECT Sum(ST_Area(wkb_geometry)) / 1000000 as km_2
FROM nyc_census_blocks
WHERE boroname = 'Manhattan';
\! echo '';

\! echo '4) What is the total length of all streets in New York in km?';
SELECT Sum(ST_Length(wkb_geometry)) / 1000 as km
FROM nyc_streets;
\! echo '';

\! echo '5)Through what neighborhoods leads 5th Avenue?';
SELECT
  streets.name AS street_name,
  neighborhoods.name AS neighborhood_name,
  neighborhoods.boroname AS borough
FROM nyc_neighborhoods AS neighborhoods
JOIN nyc_streets AS streets
ON ST_Intersects(neighborhoods.wkb_geometry, streets.wkb_geometry)
WHERE streets.name = '5th Ave' AND neighborhoods.boroname = 'Manhattan';
\! echo '';

\! echo '6) Find all subway stations in Upper East Side:';
SELECT
  stations.name AS stations_name,
  stations.color AS line_color,
  neighborhoods.name AS neighborhood_name,
  neighborhoods.boroname AS borough
FROM nyc_neighborhoods AS neighborhoods
JOIN nyc_subway_stations AS stations
ON ST_Intersects(neighborhoods.wkb_geometry, stations.wkb_geometry)
WHERE neighborhoods.name = 'Upper East Side';
\! echo '';

\! echo '7) What is the closest subway station to Wall Street?';
SELECT subways.name, subways.color
FROM nyc_subway_stations AS subways,
     nyc_streets AS streets
WHERE streets.name = 'Wall St'
ORDER BY ST_Distance(subways.wkb_geometry, streets.wkb_geometry) ASC
LIMIT 1;
\! echo '';

\! echo '8) What are the three closest streets to Wall Street station (red line)?';
SELECT streets.name,
       ST_Distance(
         streets.wkb_geometry,
         (SELECT ST_AsEWKT(wkb_geometry) FROM nyc_subway_stations WHERE name = 'Wall St' AND color = 'RED')::geometry
         ) AS meters
FROM nyc_streets streets
ORDER BY streets.wkb_geometry <->
         (SELECT ST_AsEWKT(wkb_geometry) FROM nyc_subway_stations WHERE name = 'Wall St' AND color = 'RED')
LIMIT 3;
\! echo '';
