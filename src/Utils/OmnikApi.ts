import axios from 'axios';
import { PowerProduction, OmnikDevice } from '../PlatformTypes';

export default class OmnikApi {
  private ip: string;
  private timeout: 5000;

  constructor(ip: string) {
    this.ip = ip;
  }

  private SplitStatusData(statusData: string): string[] {
    return statusData.split('myDeviceArray[0]')[1].split('";')[0].split(',');
  }

  public async ValidateIp(): Promise<boolean> {
    try {
      await axios.get(`http://${this.ip}/`,
        {
          timeout: this.timeout,
          auth: {
            username: 'admin',
            password: 'admin',
          },
        },
      );
      return true;

    } catch (error) {
      return false;
    }
  }

  public async GetDeviceInfo(): Promise<OmnikDevice> {
    try {
      const { data } = await axios.get(`http://${this.ip}/js/status.js`,
        {
          timeout: this.timeout,
          auth: {
            username: 'admin',
            password: 'admin',
          },
        },
      );

      const statusData = this.SplitStatusData(data);

      return {
        name: statusData[3],
        serial: statusData[0].split('="')[1],
        firmware: statusData[2],
      };

    } catch (error) { /* noop */ }
  }


  public async GetPowerProduction(): Promise<PowerProduction> {
    try {
      const { data } = await axios.get(`http://${this.ip}/js/status.js`,
        {
          timeout: this.timeout,
          auth: {
            username: 'admin',
            password: 'admin',
          },
        },
      );

      const statusData = this.SplitStatusData(data);

      return {
        now: parseInt(statusData[5]),
        total: parseInt(statusData[7]),
        today: parseInt(statusData[6]),
      };

    } catch (error) { /* noop */ }
  }
}