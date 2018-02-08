const FLAG_CONNECTED = 1; // 00000001
const FLAG_GPSFIXED = 2; // 00000010
const FLAG_ALTITUDEWORKING = 4; // 00000100
const FLAG_CAMERAWORKING = 8; // 00001000
const FLAG_CELLWORKING = 16; // 00010000
const FLAG_EXTERNALTEMPWORKING = 32; // 00100000
const FLAG_GPSWORKING = 64; // 01000000
const FLAG_GYROWORKING = 128; // 10000000

class LoraMessage {

  constructor() {
    this.count = 0;
    this.isConnected = false;
    this.isGpsFixed = false;
    this.isAltitudeWorking = false;
    this.isCameraWorking = false;
    this.isCellWorking = false;
    this.isExternalTempWorking = false;
    this.isGpsWorking = false;
    this.isGyroWorking = false;
    this.latitude = 0;
    this.longitude = 0;
    this.mslCurrentAltitudeMeters = 0;
    this.mslMaxAltitudeMeters = 0;
    this.currentAltitudeMeters = 0;
    this.maxAltitudeMeters = 0;
    this.internalTemperatureInFahrenheit = 0;
    this.externalTemperatureInFahrenheit = 0;
    this.minExternalTemperatureInFahrenheit = 0;
    this.strengthInDecibel = 0;
    this.batteryPercentFull = 0;
    this.speedOverGroundInKilometersPerHour = 0;  
  }

  toBuffer() {
    const buf = Buffer.allocUnsafe(25);
    buf.writeUInt16BE(this.count, 0, true);//Count 16 Unsigned (0->65,535)

    var flags = 0;
    flags += this.isAltitudeWorking ? FLAG_ALTITUDEWORKING : 0;
    flags += this.isCameraWorking ? FLAG_CAMERAWORKING : 0;
    flags += this.isCellWorking ? FLAG_CELLWORKING : 0;
    flags += this.isConnected ? FLAG_CONNECTED : 0;
    flags += this.isExternalTempWorking ? FLAG_EXTERNALTEMPWORKING : 0;
    flags += this.isGpsFixed ? FLAG_GPSFIXED : 0;
    flags += this.isGpsWorking ? FLAG_GPSWORKING : 0;
    flags += this.isGyroWorking ? FLAG_GYROWORKING : 0;

    buf.writeUInt8(flags, 2, true);//8 BITS -> Connected|GpsFixed|AltitudeWorking|CameraWorking|CellWorking|ExternalTempWorking|GpsWorking|GyroWorking
    buf.writeInt32BE(this.latitude * 1000000, 3, true);//Lat 32 (32.980277)
    buf.writeInt32BE(this.longitude * 1000000, 7, true);//Lng 32 (-117.058365)
    buf.writeUInt16BE(this.mslCurrentAltitudeMeters, 11, true);//MSL Altitude Meters 16 Unsigned (0->65,535)
    buf.writeUInt16BE(this.mslMaxAltitudeMeters, 13, true);//MSL Max Altitude Meters 16 Unsigned (0->65,535)
    buf.writeUInt16BE(this.currentAltitudeMeters, 15, true);//Altimeter Altitude Meters 16 Unsigned (0->65,535)
    buf.writeUInt16BE(this.maxAltitudeMeters, 17, true);//Altimeter Max Altitude Meters 16 Unsigned (0->65,535)
    buf.writeInt8(this.internalTemperatureInFahrenheit, 19, true);//Internal Temp In Fahrenheit 8 (-128=>127)
    buf.writeInt8(this.externalTemperatureInFahrenheit, 20, true);//External Temp In Fahrenheit 8 (-128=>127)
    buf.writeInt8(this.minExternalTemperatureInFahrenheit, 21, true);//External Min In Fahrenheit Temp 8 (-128=>127)
    buf.writeInt8(this.strengthInDecibel, 22, true);//Strengh DB 8 (-128=>127)
    buf.writeUInt8(this.batteryPercentFull, 23, true);//Battery % Full 8 (0=>255)
    buf.writeUInt8(this.speedOverGroundInKilometersPerHour, 24, true);//Speed Over Ground 8 Kilometers Per Hour (0->255)
    return buf;
  }

  fromBuffer(buf) {
    this.count = buf.readUInt16BE(0, true);//Count 16 Unsigned (0->65,535)
    var flags = buf.readUInt8(2, true);//8 BITS -> Connected|GpsFixed|AltitudeWorking|CameraWorking|CellWorking|ExternalTempWorking|GpsWorking|GyroWorking
    this.isAltitudeWorking = (flags & FLAG_ALTITUDEWORKING) > 0;
    this.isCameraWorking = (flags & FLAG_CAMERAWORKING) > 0;
    this.isCellWorking = (flags & FLAG_CELLWORKING) > 0;
    this.isConnected = (flags & FLAG_CONNECTED) > 0;
    this.isExternalTempWorking = (flags & FLAG_EXTERNALTEMPWORKING) > 0;
    this.isGpsFixed = (flags & FLAG_GPSFIXED) > 0;
    this.isGpsWorking = (flags & FLAG_GPSWORKING) > 0;
    this.isGyroWorking = (flags & FLAG_GYROWORKING) > 0;
    this.latitude = buf.readInt32BE(3, true) / 1000000;//Lat 32 (32.980277)
    this.longitude = buf.readInt32BE(7, true) / 1000000;//Lng 32 (-117.058365)
    this.mslCurrentAltitudeMeters = buf.readUInt16BE(11, true);//MSL Altitude Meters 16 Unsigned (0->65,535)
    this.mslMaxAltitudeMeters= buf.readUInt16BE(13, true);//MSL Max Altitude Meters 16 Unsigned (0->65,535)
    this.currentAltitudeMeters= buf.readUInt16BE(15, true);//Altimeter Altitude Meters 16 Unsigned (0->65,535)
    this.maxAltitudeMeters = buf.readUInt16BE(17, true);//Altimeter Max Altitude Meters 16 Unsigned (0->65,535)
    this.internalTemperatureInFahrenheit = buf.readInt8(19, true);//Internal Temp In Fahrenheit 8 (-128=>127)
    this.externalTemperatureInFahrenheit = buf.readInt8(20, true);//External Temp In Fahrenheit 8 (-128=>127)
    this.minExternalTemperatureInFahrenheit = buf.readInt8(21, true);//External Min In Fahrenheit Temp 8 (-128=>127)
    this.strengthInDecibel = buf.readInt8(22, true);//Strengh DB 8 (-128=>127)
    this.batteryPercentFull = buf.readUInt8(23, true);//Battery % Full 8 (0=>255)
    this.speedOverGroundInKilometersPerHour = buf.readUInt8(24, true);//Speed Over Ground 8 Kilometers Per Hour (0->255)
  }
}

/*
var x = new LoraMessage();
x.count = 1;
x.isAltitudeWorking = true;
x.isCameraWorking = true;
x.isCellWorking = true;
x.isConnected = true;
x.isExternalTempWorking = true;
x.isGpsFixed = true;
x.isGpsWorking = true;
x.isGyroWorking = false;
x.latitude = 32.980277;
x.longitude = -117.058365;
x.mslCurrentAltitudeMeters = 32000;
x.mslMaxAltitudeMeters = 32000;
x.currentAltitudeMeters = 32000;
x.maxAltitudeMeters = 32000;
x.internalTemperatureInFahrenheit = 70;
x.externalTemperatureInFahrenheit = -60;
x.minExternalTemperatureInFahrenheit = -100;
x.strengthInDecibel = 22;
x.batteryPercentFull = 78;
x.speedOverGroundInKilometersPerHour = 123;
var buf = x.toBuffer();
var y = new LoraMessage();
y.fromBuffer(buf);

console.log(buf);

var xStr = JSON.stringify(x);
var yStr = JSON.stringify(y);

if(xStr != yStr)
{
  console.log('bad');
  console.log(xStr);
  console.log(yStr);
}
else
  console.log('good');
*/

module.exports = LoraMessage;