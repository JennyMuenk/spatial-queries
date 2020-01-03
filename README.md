# spatial-queries

[![Build Status](https://travis-ci.com/JennyMuenk/spatial-queries.svg?branch=master)](https://travis-ci.com/JennyMuenk/spatial-queries)

Running spatial queries on PostgreSQL with PostGIS extension and MongoDB to compare these spatial databases.

This repository is part of my term paper "Spatial Databases" for "Big Data Tools WS 19/20" at Karlsruher Institute for Technology.

The data located under ``/data`` can be downloaded from <a href="https://postgis.net/workshops/postgis-intro/">PostGIS workshop</a>. The shapefiles were converted to GeoJSON format. Since MongoDB uses <a href="https://de.wikipedia.org/wiki/World_Geodetic_System_1984"> WGS84</a> as GeoJSON format, the files ``*_wgs84.geojson`` were adjusted for MongoDB.
