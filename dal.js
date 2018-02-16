var LoraMessage = require("./loraMesssage");
var moment = require("moment");

class Dal {

    constructor(db) {
      this.db = db
    }
  
    first(arr) {
      if(arr == null || arr.length == 0)
        return null;
      return arr[0];
    }
    
    async getLatestLoraMessageAsync(){
        var data = this.first(await this.db.allAsync("SELECT * FROM LoraMessage ORDER BY LoraMessageKey DESC LIMIT 1"));
        return data;
    }

    async emptyDatabaseAsync(){
        var emptyDatabaseStatement = `
DELETE FROM LoraMessage
`;
        await this.db.runAsync(emptyDatabaseStatement);
    }

    async createLoraMessageTableAsync(){
        var createTableStatement = `
CREATE TABLE IF NOT EXISTS LoraMessage
(
	LoraMessageKey INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	ReceivedDate TEXT NOT NULL,
	Count INTEGER NOT NULL,
	IsConnected INTEGER NOT NULL CHECK(IsConnected IN (0, 1)),
	IsGpsFixed INTEGER NOT NULL CHECK(IsGpsFixed IN (0, 1)),
	IsAltitudeWorking INTEGER NOT NULL CHECK(IsAltitudeWorking IN (0, 1)),
	IsCameraWorking INTEGER NOT NULL CHECK(IsCameraWorking IN (0, 1)),
	IsCellWorking INTEGER NOT NULL CHECK(IsCellWorking IN (0, 1)),
	IsExternalTempWorking INTEGER NOT NULL CHECK(IsExternalTempWorking IN (0, 1)),
	IsGpsWorking INTEGER NOT NULL CHECK(IsGpsWorking IN (0, 1)),
	IsGyroWorking INTEGER NOT NULL CHECK(IsGyroWorking IN (0, 1)),
	Latitude NUMERIC,
	Longitude NUMERIC,
	MslCurrentAltitudeMeters NUMERIC,
	CurrentAltitudeMeters NUMERIC,
	MaxAltitudeMeters NUMERIC,
	InternalTemperatureInFahrenheit NUMERIC,
	ExternalTemperatureInFahrenheit NUMERIC,
	MinExternalTemperatureInFahrenheit NUMERIC,
	StrengthInDecibel NUMERIC,
	BatteryPercentFull NUMERIC,
	SpeedOverGroundInKilometersPerHour NUMERIC,
	Rssi NUMERIC,
	Snr NUMERIC
);`;
        await this.db.runAsync(createTableStatement);
    }

    async insertLoraMessageAsync(lm, rssi, snr){
        var insertStatement = `
        INSERT INTO LoraMessage
        (
             Count
            ,IsConnected
            ,IsGpsFixed
            ,IsAltitudeWorking
            ,IsCameraWorking
            ,IsCellWorking
            ,IsExternalTempWorking
            ,IsGpsWorking
            ,IsGyroWorking
            ,Latitude
            ,Longitude
            ,MslCurrentAltitudeMeters
            ,CurrentAltitudeMeters
            ,MaxAltitudeMeters
            ,InternalTemperatureInFahrenheit
            ,ExternalTemperatureInFahrenheit
            ,MinExternalTemperatureInFahrenheit
            ,StrengthInDecibel
            ,BatteryPercentFull
            ,SpeedOverGroundInKilometersPerHour
            ,ReceivedDate
            ,Rssi
            ,Snr
        )
        VALUES
        (
             :Count
            ,:IsConnected
            ,:IsGpsFixed
            ,:IsAltitudeWorking
            ,:IsCameraWorking
            ,:IsCellWorking
            ,:IsExternalTempWorking
            ,:IsGpsWorking
            ,:IsGyroWorking
            ,:Latitude
            ,:Longitude
            ,:MslCurrentAltitudeMeters
            ,:CurrentAltitudeMeters
            ,:MaxAltitudeMeters
            ,:InternalTemperatureInFahrenheit
            ,:ExternalTemperatureInFahrenheit
            ,:MinExternalTemperatureInFahrenheit
            ,:StrengthInDecibel
            ,:BatteryPercentFull
            ,:SpeedOverGroundInKilometersPerHour
            ,:ReceivedDate
            ,:Rssi
            ,:Snr
        );    
        `;
        await this.db.runAsync(insertStatement,
        {
            ':Count': lm.count
            ,':IsConnected': lm.isConnected ? 1 : 0
            ,':IsGpsFixed': lm.isGpsFixed ? 1 : 0
            ,':IsAltitudeWorking': lm.isAltitudeWorking ? 1 : 0
            ,':IsCameraWorking': lm.isCameraWorking ? 1 : 0
            ,':IsCellWorking': lm.isCellWorking ? 1 : 0
            ,':IsExternalTempWorking': lm.isExternalTempWorking ? 1 : 0
            ,':IsGpsWorking': lm.isGpsWorking ? 1 : 0
            ,':IsGyroWorking': lm.isGyroWorking ? 1 : 0
            ,':Latitude': lm.latitude
            ,':Longitude': lm.longitude
            ,':MslCurrentAltitudeMeters': lm.mslCurrentAltitudeMeters
            ,':CurrentAltitudeMeters': lm.currentAltitudeMeters
            ,':MaxAltitudeMeters': lm.maxAltitudeMeters
            ,':InternalTemperatureInFahrenheit': lm.internalTemperatureInFahrenheit
            ,':ExternalTemperatureInFahrenheit': lm.externalTemperatureInFahrenheit
            ,':MinExternalTemperatureInFahrenheit': lm.minExternalTemperatureInFahrenheit
            ,':StrengthInDecibel': lm.strengthInDecibel
            ,':BatteryPercentFull': lm.batteryPercentFull
            ,':SpeedOverGroundInKilometersPerHour': lm.speedOverGroundInKilometersPerHour
            ,':ReceivedDate': moment().format()
            ,':Rssi': rssi
            ,':Snr': snr
        });
    }      
}

module.exports = Dal;