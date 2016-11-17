var MongoClient = require("mongodb").MongoClient;
var mongoUrl = process.env.MONGODB_URI;
var FileStreamRotator = require("file-stream-rotator");
var express = require("express");
var fs = require("fs");
var morgan = require("morgan");
var path = require("path");
var bodyParser = require("body-parser");

var app = express();
//var accessLogStream = fs.createWriteStream(path.join(__dirname, "log/access.log"), {flags: "a"});
var logDirectory = path.join(__dirname, "log");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var accessLogStream = FileStreamRotator.getStream({
  date_format: "YYYYMMDD",
	filename: path.join(logDirectory, "access-%DATE%.log"),
	frequency: "daily",
	verbose: false
});

app.use(morgan("combined", {stream: accessLogStream}));

app.use(bodyParser.json());
app.use("/", express.static("public"));

app.all("/", (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	next();
});

MongoClient.connect(mongoUrl || "mongodb://mongo:27017/gcmt_dev", function(err, db) {
	if (err) throw err;

	app.post("/quakes", (req, res) => {
		var params = {
			"geometry" : {
				$geoWithin: {
					$geometry: {
						type: "Polygon",
						coordinates: req.body.coordinates
					}
				}
			},
			"properties.minZoom" : {
				$lte: req.body.minZoom
			}
		};
		db.collection("quakes").find(params).toArray((err, quakes) => {
			if (err) throw err;
			res.json(quakes);
		});
	});

	app.post("/faults", (req, res) => {
		var params = {
			"geometry" : {
				$geoWithin: {
					$geometry: {
						type: "Polygon",
						coordinates: req.body.coordinates
					}
				}
			}
		};
		db.collection("faults").find(params).toArray((err, faults) => {
			if (err) throw err;
			res.json(faults);
		});
	});

	app.listen(3000, () => {
	console.log("Server running on 3000");
	});
});
