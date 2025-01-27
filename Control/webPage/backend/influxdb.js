//modules
const { InfluxDB, Point, HttpError } = require("@influxdata/influxdb-client");
const {OrgsAPI, BucketsAPI} = require("@influxdata/influxdb-client-apis")

//environment variables
const org = "FinalYearProject"
const url = "http://localhost:8086"

const token = "6DtS_IGRd21tiPNi3Q_mAS5zSOVw5wij08IYmITVEGQ2yUcWPO_Z6k030b368ilOu9i_XzSEOvFYXNG5-_wDpg=="

const client = new InfluxDB({ url, token });




//delete a bucket 
//bucketsAPI.deleteBucketsID({bucketID})
