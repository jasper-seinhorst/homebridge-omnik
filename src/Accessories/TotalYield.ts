import { Service, PlatformAccessory, PlatformConfig, Logger, API, Characteristic } from 'homebridge';
import { OmnikAccessory, OmnikDevice, PowerProduction } from '../PlatformTypes';

export default class TotalYield implements OmnikAccessory {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;
  private powerService: Service;

  constructor(public config: PlatformConfig, public readonly log: Logger, public readonly api: API, public accessory: PlatformAccessory, public device: OmnikDevice) {
    this.accessory.getService(this.Service.AccessoryInformation)
      .setCharacteristic(this.Characteristic.Manufacturer, 'Omnik')
      .setCharacteristic(this.Characteristic.Model, device.name)
      .setCharacteristic(this.Characteristic.SerialNumber, device.serial);


    this.powerService = this.accessory.getService(this.Service.LightSensor) || this.accessory.addService(this.Service.LightSensor);
  }

  public beat(powerProduction: PowerProduction) {
    const consumption = powerProduction.total / 10;
    this.powerService.setCharacteristic(this.Characteristic.CurrentAmbientLightLevel, consumption);
  }
}
