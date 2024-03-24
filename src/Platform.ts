import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';
import { OmnikAccessory, OmnikDevice } from './PlatformTypes';
import CurrentPowerProduction from './Accessories/CurrentPowerProduction';
import TotalYield from './Accessories/TotalYield';
import TodayYield from './Accessories/TodayYield';
import OmnikApi from './Utils/OmnikApi';

export class OmnikPlugin implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;
  public readonly accessories: PlatformAccessory[] = [];
  private heartBeatInterval;
  private devices: OmnikAccessory[] = [];
  private omnikApi: OmnikApi;
  private device: OmnikDevice;


  constructor(public readonly log: Logger, public readonly config: PlatformConfig, public readonly api: API) {
    this.heartBeatInterval = (config.pollInterval || 5) * 60 * 1000; // minutes to miliseconds
    this.api.on('didFinishLaunching', () => {
      this.initialise();
    });
  }

  public configureAccessory(accessory: PlatformAccessory) {
    this.accessories.push(accessory);
  }

  private validateConfig(): boolean {
    return !!this.config.ip;
  }

  private async initialise() {
    if (!this.validateConfig()) {
      this.log.error('Configuration error. Please provide your Omnik-inverter\'s IP address');
      return;
    }

    this.omnikApi = new OmnikApi(this.config.ip);

    if (!await this.omnikApi.ValidateIp()) {
      this.log.error('Your Omnik inverter\'s IP address seems to be incorrect. No connection possible');
      return;
    }

    this.device = await this.omnikApi.GetDeviceInfo();
    this.setupAccessoires();

    await this.heartBeat();

    setInterval(() => {
      this.heartBeat();
    }, this.heartBeatInterval);
  }

  private setupAccessoires() {
    const currentPowerProductionName = 'Current Power Production';
    const currentPowerProductionUuid = this.api.hap.uuid.generate('omnik-inverter-current-power-production');
    const currentPowerProductionExistingAccessory = this.accessories.find(accessory => accessory.UUID === currentPowerProductionUuid);
    if (currentPowerProductionExistingAccessory) {
      this.devices.push(new CurrentPowerProduction(this.config, this.log, this.api, currentPowerProductionExistingAccessory, this.device));
    } else {
      this.log.info(`${currentPowerProductionName} added as accessory`);
      const accessory = new this.api.platformAccessory(currentPowerProductionName, currentPowerProductionUuid);
      this.devices.push(new CurrentPowerProduction(this.config, this.log, this.api, accessory, this.device));
      this.api.registerPlatformAccessories('homebridge-omnik', 'Omnik', [accessory]);
    }

    const totalProductionName = 'Total Yield in kWh';
    const totalProductionUuid = this.api.hap.uuid.generate('omnik-inverter-total-production');
    const totalProductionExistingAccessory = this.accessories.find(accessory => accessory.UUID === totalProductionUuid);
    if (totalProductionExistingAccessory) {
      this.devices.push(new TotalYield(this.config, this.log, this.api, totalProductionExistingAccessory, this.device));
    } else {
      this.log.info(`${totalProductionName} added as accessory`);
      const accessory = new this.api.platformAccessory(totalProductionName, totalProductionUuid);
      this.devices.push(new TotalYield(this.config, this.log, this.api, accessory, this.device));
      this.api.registerPlatformAccessories('homebridge-omnik', 'Omnik', [accessory]);
    }

    const todayProductName = 'Today Yield in kWh';
    const todayProductionUuid = this.api.hap.uuid.generate('omnik-inverter-today-production');
    const todayProductionExistingAccessory = this.accessories.find(accessory => accessory.UUID === todayProductionUuid);
    if (todayProductionExistingAccessory) {
      this.devices.push(new TodayYield(this.config, this.log, this.api, todayProductionExistingAccessory, this.device));
    } else {
      this.log.info(`${todayProductName} added as accessory`);
      const accessory = new this.api.platformAccessory(todayProductName, todayProductionUuid);
      this.devices.push(new TodayYield(this.config, this.log, this.api, accessory, this.device));
      this.api.registerPlatformAccessories('homebridge-omnik', 'Omnik', [accessory]);
    }
  }

  private async heartBeat() {
    try {
      const powerProductionInfo = await this.omnikApi.GetPowerProduction();
      this.log.debug('heart beat');
      this.devices.forEach((device: OmnikAccessory) => {
        device.beat(powerProductionInfo);
      });

    } catch (error) {
      this.log.error('Failed to update data, no connection possible with your inverter');
    }
  }
}
