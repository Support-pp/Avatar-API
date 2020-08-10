"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sharp = require('sharp');
const redis = require('redis');
const express_1 = tslib_1.__importDefault(require("express"));
const app = express_1.default();
const client = redis.createClient({
    host: 'redis',
});
app.get('/', function (req, res) {
    if (req.method !== 'GET') {
        res.statusCode = 405;
        return res.end('Method not allowed');
    }
    let size;
    if (req.query.size <= 1000 && req.query.size >= 1) {
        size = req.query.size;
    }
    else {
        console.log('OV');
        size = req.query.size;
        res.statusCode = 500;
        res.send('Error the size should be between 1 and 1000');
        return;
    }
    let name = req.query.name ? req.query.name : 'xxxx';
    name = name.replace(/\s/g, '');
    const imageUrlPath = `http://api:9080/avatar?name=${name}&size=${size}`;
    client.get(imageUrlPath, (error, data) => {
        if (error) {
            console.log('Error during the fetching of image cache from Redis ', error);
            return res.end('Error');
        }
        if (data) {
            console.log(`[Cache] ${imageUrlPath}`);
            res.statusCode = 200;
            res.setHeader('X-Is-Cached', 'TRUE');
            res.setHeader('Cache-Control', 'max-age=3600');
            res.setHeader('X-Company', 'KlexHub UG (haftungsbeschränkt)');
            const binary = Buffer.from(data, 'hex');
            sharp(binary).pipe(res);
        }
        else {
            console.log('[Serving Image] Create new image');
            try {
                const httpClient = imageUrlPath.startsWith('https')
                    ? require('https')
                    : require('http');
                httpClient.get(imageUrlPath, (imageStream) => {
                    let binary = [];
                    imageStream.once('readable', () => {
                        if (imageStream.statusCode !== 200 &&
                            imageStream.statusCode !== 304) {
                            console.log(imageUrlPath, res.statusCode);
                            res.statusCode = 500;
                            return res.end('Error');
                        }
                    });
                    imageStream
                        .pipe(sharp()
                        .on('data', (chunk) => {
                        binary.push(chunk);
                    })
                        .on('error', (error) => {
                        res.statusCode = 500;
                        res.end(error.message);
                    }))
                        .pipe(res)
                        .once('finish', () => {
                        res.end(null);
                        const buffer = Buffer.concat(binary);
                        const bufferHex = buffer.toString('hex');
                        console.log('[Caching] ' + imageUrlPath);
                        client.setex(imageUrlPath, 3600, bufferHex, (error) => {
                            if (error) {
                                return console.log('Error during the caching of image ', error);
                            }
                            console.log('[Cached] ' + imageUrlPath);
                        });
                    });
                    imageStream.once('error', () => {
                        console.log(imageUrlPath, res.statusCode);
                        res.statusCode = 500;
                        return res.end('Error');
                    });
                });
            }
            catch (error) {
                if (error.name === 'TypeError [ERR_INVALID_URL]') {
                    res.statusCode = 400;
                    res.end('Incorrect URL');
                }
                else {
                    res.statusCode = 500;
                    res.end('Error');
                    console.error(error);
                }
            }
        }
    });
});
const PORT = 9090;
app.listen(PORT, () => {
    console.log(`> Cache now running (${PORT}) (...)`);
});
