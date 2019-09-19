var {DynamoDB} = require('@aws-sdk/client-dynamodb-v2-node');
var db = new DynamoDB({region: 'eu-west-1', endpoint:"http://localhost:8000"})

function DynamoDBClient() {    
    this.createBusinessUnit = function(item) {
        const params =  {
            TableName: 'businessunits',
            Item: {
                'name': {'S': item }
            }
        }
        var promise = new Promise((resolve, reject) => {
            db.putItem(params, (error, data)=> {
                if(error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        return promise;
    }
    
    this.getBusinessUnits = function() {
        const params =  {
            TableName: 'businessunits',
            Select: 'ALL_ATTRIBUTES'
        }
        var promise = new Promise((resolve, reject) => {
            db.scan(params, (error, data)=> {
                if(error) {
                    reject(error);
                } else {
                    var items = data.Items
                    var bUs = []
                    items.forEach((item) => {
                        var obj = {};
                        var squads = item.squads;
                        var bUnit = item.name.S;
                        var sqds = [];
                        if(squads) {
                            sqds = squads.SS;
                        }
                        obj[bUnit] = sqds;
                        bUs.push(obj);
                    })
                    resolve(bUs);
                }
            });
        });
        return promise;
    }

    this.createSquad = function(businessunit, squadname) {
        const params =  {
            TableName: 'businessunits',
            Key: {
                'name': {
                    "S": businessunit
                } 
            },
            UpdateExpression:"add squads :squadname",
            ExpressionAttributeValues: {
                ":squadname": {'SS': [squadname]}
            },
            ReturnValues: "UPDATED_NEW"
        }
        var promise = new Promise((resolve, reject) => {
            db.updateItem(params, (error, data)=> {
                if(error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        return promise;
    }

    this.postReports = function(businessunit, squadname, buildNumber, reportJson) {
        var json = {}
        json[buildNumber] = reportJson;
        console.log(JSON.stringify(json))
        const params =  {
            TableName: 'SquadReports',
            Item: {
                'squad': {
                    "S": squadname
                },
                'businessunit': {
                    'S': businessunit
                },
                'reports': {
                    'SS': [json]
                }
            }
        }
        var promise = new Promise((resolve, reject) => {
            db.putItem(params, (error, data)=> {
                if(error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
        return promise;
    } 
}

module.exports = new DynamoDBClient();

