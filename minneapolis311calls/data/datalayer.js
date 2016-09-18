var DataLayer = function () {
    var mysql = require("mysql");
    var creds = //require("./_config.js");
        {
            host: 'bowie2.c44css47zkdo.us-west-2.rds.amazonaws.com',
            user: 'master',
            password: 'fri$nDgramming',
            database: 'address_data',
            connectionLimit: 10
        };

    var pool = mysql.createPool(creds);


    this.getTopRentalLicenses = function(callback) {
        pool.getConnection(function (err, connection) {
            // Use the connection
            connection.query('SELECT * from RentalLicense LIMIT 100', function (err, rows, fields) {
                // And done with the connection.
                connection.release();
                callback(err, rows, fields);
            });
        })
    };
    // bbox is an array that is east, south, west, north coordinates
    this.getPointsInArea = function(bbox, callback) {
        pool.getConnection(function (err, connection) {
              var q = '\
              SELECT distinct round(x(geom), 6) as x, round(y(geom), 6) as y, \
              subjectname from Complaint311 \
              where st_contains(st_Envelope(geomfromtext(\'LineString(? ?, ? ?)\', 4326)), geom)\
              limit 100\
              '
            // Use the connection
            connection.query(q, bbox, function (err, rows, fields) {
                // And done with the connection.
                connection.release();
                callback(err, rows, fields);
            });
        })
    };



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
};

module.exports = new DataLayer();
