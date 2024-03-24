# Homebridge Omnik
[![npm](https://img.shields.io/npm/dt/homebridge-omnik.svg)](https://www.npmjs.com/package/homebridge-omnik) [![npm](https://img.shields.io/npm/v/homebridge-omnik.svg)](https://www.npmjs.com/package/homebridge-omnik)

This Homebridge plugin connects your Omnik Inverter with Homekit. The plugin provides three key sensors: Current Power Production (in Watts), Today's Yield (in kWh), and Total Yield (in kWh). With these sensors, you can effortlessly create automations in your Apple Home based on your solar panel yield.

![Automation example](/assets/example_automation.png) ![Roof sensors](/assets/example_sensors.png)

## Installation
To install the *Homebridge Omnik* plugin follow these steps:

- Follow the instructions on the [Homebridge Wiki](https://homebridge.io/how-to-install-homebridge) to install Node.js and Homebridge;
- Install the *Homebridge Omnik* plugin through Homebridge Config UI X or manually;
  ```
  $ sudo npm -g i homebridge-omnik
  ```
- Edit config.json and add the *Omnik* platform. E.g;
    ```
    {
        "platform": "Omnik",
        "ip": "<<IP address of your Omnik Inverter>>",
        "pollInterval": 5
    }
    ```

## Available sensors
- **Current Power Production** Lux sensor indicating the current power production in watts.
- **Today Yield** Lux sensor reflecting today's energy yield in kWh from your solar panels.
- **Total Yield** Lux sensor displaying the total energy yield in kWh from your solar panels.

## Caveats
- While it's possible to adjust the polling interval, it appears that the inverter refreshes the metrics every 5 minutes.
- The plugin assumes that the username and password for your inverter are set to default, as per factory settings.
- The inverters lack an API but provide a web interface. This plugin connects to said interface and extracts the available values. If your inverter utilizes a different interface, resulting in the inability to retrieve values, please raise an issue so we can add support.