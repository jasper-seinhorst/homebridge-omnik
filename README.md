# Homebridge Omnik
[![npm](https://img.shields.io/npm/dt/homebridge-omnik.svg)](https://www.npmjs.com/package/homebridge-omnik)
[![npm](https://img.shields.io/npm/v/homebridge-omnik.svg)](https://www.npmjs.com/package/homebridge-omnik)

This Homebridge plugin connects your Omnik Converter with Homekit. The plugin provides three key sensors: Current Power Production (in Watts), Today's Yield (in kWh), and Total Yield (in kWh). With these sensors, you can effortlessly create automations in your Apple Home based on your solar panel yield.

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