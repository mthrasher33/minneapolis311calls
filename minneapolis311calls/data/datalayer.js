var DataLayer = function () {
    var mysql = require("mysql2");

    var config = require('../config')['production'];
    var pool = mysql.createPool(config.database);


    this.getTopRentalLicenses = function(callback) {
        pool.getConnection(function (err, connection) {
            if (err) return callback(err);
            // Use the connection
            connection.query('SELECT * from RentalLicense LIMIT 100', function (err, rows, fields) {
            // And done with the connection.
                connection.release();

                callback(err, rows, fields);
            });
        })
    };


    this.rental311callsByLandlord = function (landlordName, callback) {
        pool.getConnection(function (err, connection) {
            if (err) return callback(err);
            // Use the connection
            connection.query("Call rental311callsByLandlord(?)", landlordName, function (err, rows, fields) {
                // And done with the connection.
                connection.release();
                callback(err, rows, fields);
            });
        })
    };

    this.rental311callsByAddress = function (address, callback) {
        pool.getConnection(function (err, connection) {
            if (err) return callback(err);
            // Use the connection
            connection.query("Call rental311callsByAddress(?)", address, function (err, rows, fields) {

                // And done with the connection.
                connection.release();
                callback(err, rows, fields);
            });
        })
    };

    this.PropertiesOwnedByLandlord = function (ownerName, callback) {
        pool.getConnection(function (err, connection) {
            if (err) return callback(err);
            // Use the connection
            connection.query("Call PropertiesOwnedByLandlord(?)", ownerName, function (err, rows, fields) {

                // And done with the connection.
                connection.release();
                callback(err, rows, fields);
            });
        })
    };

    this.matchPartialAddress = function (partialAddress, callback) {
        pool.getConnection(function (err, connection) {
            if (err) return callback(err);
            // Use the connection
            connection.query("SELECT Address from RentalLicense where Address LIKE CONCAT('%', ?, '%') LIMIT 10; ", partialAddress, function (err, rows, fields) {
                // And done with the connection.
                connection.release();
                callback(err, rows, fields);
            });
        })
    };

    this.matchAddressDistinct = function (address, callback) {
        pool.getConnection(function (err, connection) {
            if (err) return callback(err);
            // Use the connection
            connection.query("SELECT DISTINCT Address from RentalLicense where Address LIKE CONCAT('%', ?, '%') LIMIT 10; ", address, function (err, rows, fields) {
                // And done with the connection.
                connection.release();
                callback(err, rows, fields);
            });
        })
    };

    // bbox is an array that is east, south, west, north coordinates.
    // geom's SRID (4326) has axis order (latitude, longitude), so ST_X(geom)
    // returns latitude and ST_Y(geom) returns longitude -- the reverse of the
    // usual x/y convention. The aliases below are swapped to match.
    this.getPointsInArea = function(bbox, callback) {
        pool.getConnection(function (err, connection) {
              if (err) return callback(err);
              var q = '\
              SELECT distinct round(ST_Y(geom), 6) as x, round(ST_X(geom), 6) as y, \
              permitnumber, ContactName, App_Name, Address, num_reports from RentalLicense \
              where ST_X(geom) BETWEEN ? AND ? AND ST_Y(geom) BETWEEN ? AND ?\
              '
            var east = bbox[0], south = bbox[1], west = bbox[2], north = bbox[3];
            // Use the connection
            connection.query(q, [south, north, west, east], function (err, rows, fields) {
                // And done with the connection.
                connection.release();
                callback(err, rows, fields);
            });
        })
    };

    /*
    //  Unclear if we need any of this general stuff.  Let's leave it for a little while, until we know
    this.buildSQL = function (sql, arr) {
        return mysql.format(sql, arr);
    }

    this.buildQuery = function (sql, arr, callback, keepConn) {
        this.query(this.buildSQL(sql, arr), callback, keepConn);
    }

    // callback (err, rows)
    this.query = function (query, callback, keepConn) {
        var that = this;
        console.log("[DataLayer.query] " + query);

        pool.getConnection(function (err, connection) {
            try {
                connection.query(query, function (err, rows) {
                    if (err) {
                        console.log("[DataLayer.query] Error " + err.code);
                    } else {
                        console.log("[DataLayer.query] Query successfully ran. Executing Callback.");
                    }

                    callback(err, rows);

                    if (!keepConn) {
                        that.close(connection);
                    }
                });
            } catch (ex) {
                console.log("[Datalayer.query] Ouch... Exception here : " + JSON.stringify(ex) + "]");
            }
        });
    };

    this.close = function (connection) {
        try {
            connection.release();
        } catch (ex) { }
    }
    */


};

module.exports = new DataLayer();
