export interface IAirPollution {
  coord: number[];
  list: AirPollutinList[];
}

export interface AirPollutinList {
  dt: number;
  main: Main;
  components: AirPollutinComponents;
}

export interface Main {
  aqi: number;
}

export interface AirPollutinComponents {
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
}
