import apiSettings from './apisettings.json';
// Just change to a different json file to change the environment.
import apiSettingsCurrentEnvironment from './apisettings.Development.json';

import restApiRoutes from './restApiRoutes.json';


export default {
    // Also change to production here.
    isDevelopment: true,
    apiSettings: Object.assign(apiSettings, apiSettingsCurrentEnvironment),
    restApiRoutes: restApiRoutes
};
