import { API } from 'homebridge';
import { OmnikPlugin } from './Platform';

export = (api: API) => {
  api.registerPlatform('Omnik', OmnikPlugin);
};
