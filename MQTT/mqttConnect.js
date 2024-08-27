const mqtt = require('mqtt');

const MQTT_BROKER = 'mqtts://3685792e82304816bc0095541d47f9d8.s1.eu.hivemq.cloud:8883';
const LIGHT_TOPIC = 'light/control';

const client = mqtt.connect(MQTT_BROKER, {
    username: 'zm.ziadmohamed',
    password: '2_y9Y9iTP7nLdLL'
});

client.on('connect', () => {
    console.log('Connected to MQTT broker');
});

client.on('error', (err) => {
    console.error('MQTT Error:', err);
});

client.on('offline', () => {
    console.log('MQTT client is offline');
});

client.on('reconnect', () => {
    console.log('MQTT client is reconnecting');
});

const publishLightControl = async (color, mode) => {
    const message = JSON.stringify({ color, mode });

    // Return a promise that resolves when the message is published
    return new Promise((resolve, reject) => {
        client.publish(LIGHT_TOPIC, message, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve('Message published');
            }
        });
    });
};

module.exports = { publishLightControl };
