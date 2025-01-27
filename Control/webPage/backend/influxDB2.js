//modules
const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const {OrgsAPI, BucketsAPI} = require("@influxdata/influxdb-client-apis")

//environment variables
const org = "FinalYearProject"
const url = "http://localhost:8086"

const token = "6DtS_IGRd21tiPNi3Q_mAS5zSOVw5wij08IYmITVEGQ2yUcWPO_Z6k030b368ilOu9i_XzSEOvFYXNG5-_wDpg=="

const client = new InfluxDB({ url, token });

function dataFormatting(parameters, values) {
  dataArray = [];
  for (i = 0; i < parameters.length; i++) {
    dataObject = new Object();
    dataObject[parameters[i]] = values[i];
    dataArray.push(dataObject);
  }
  return dataArray;
}

//initialization function
async function createBucket(name){
  const orgsAPI = new OrgsAPI(client);
  const organizations = await orgsAPI.getOrgs({org})
 // console.log(organizations.orgs)

  const orgID = organizations.orgs[0].id
  const  bucketsAPI = new BucketsAPI(client)
  try{
    const buckets = await bucketsAPI.getBuckets({orgID,name})
    console.log(`Bucket ${buckets['buckets'][0]['name']} already exists`)
  }
  catch(e){
    if(e instanceof HttpError && e.statusCode == 404){
      const bucket = await bucketsAPI.postBuckets({body:{orgID, name}})
      console.log(`Bucket ${bucket['name']} was created successfully`)
    }
    else{
      throw e
    }
  }
}

function writeToDB(datapoint){
  let writeClient = client.getWriteApi(org,datapoint['bucket'],datapoint['precision']) 
  let point = new Point(datapoint['measurement'])
    .tag(datapoint['tagName'],datapoint['tagValue'])
    .intField(datapoint['fieldName'],datapoint['value'])
  writeClient.writePoint(point);

  void setTimeout(()=>{
    writeClient.close()
  },5)
 
}

function searchQuery(){  
let queryClient = client.getQueryApi(org)
let fluxQuery = `from(bucket: "orientation")
 |> range(start: -10m)
 |> filter(fn: (r) => r._measurement == "dondondon")`

queryClient.queryRows(fluxQuery, {
  next: (row, tableMeta) => {
    const tableObject = tableMeta.toObject(row)
    console.log(tableObject)
  },
  error: (error) => {
    console.error('\nError', error)
  },
  complete: () => {
    console.log('\nSuccess')
}})
}


async function createBucket(name){
  const orgsAPI = new OrgsAPI(client);
  const organizations = await orgsAPI.getOrgs({org})
 // console.log(organizations.orgs)

  const orgID = organizations.orgs[0].id
  const  bucketsAPI = new BucketsAPI(client)
  try{
    const buckets = await bucketsAPI.getBuckets({orgID,name})
    console.log(`Bucket ${buckets['buckets'][0]['name']} already exists`)
  }
  catch(e){
    if(e instanceof HttpError && e.statusCode == 404){
      const bucket = await bucketsAPI.postBuckets({body:{orgID, name}})
      console.log(`Bucket ${bucket['name']} was created successfully`)
    }
    else{
      throw e
    }
  }
}


module.exports = {dataFormatting,writeToDB};