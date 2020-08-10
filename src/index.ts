const sharp = require('sharp');
const redis = require('redis');
import express from 'express';
const app: express.Application = express();

const client = redis.createClient({
	host: 'redis',
});

app.get('/', function (req: any, res: any) {
	if (req.method !== 'GET') {
		res.statusCode = 405;
		return res.end('Method not allowed');
	}
	let size;
	if (req.query.size <= 2000 && req.query.size >= 1) {
		size = req.query.size;
	} else {
		res.statusCode = 500;
		return res.end('Error the size must be between 1 and 2000');
	}
	const name = req.query.name ? req.query.name : 'xxxx';
	const imageUrlPath = `http://api:9080/avatar?name=${name}&size=${size}`;

	// Look for the Redis cache

	client.get(imageUrlPath, (error: any, data: any) => {
		if (error) {
			console.log(
				'Error during the fetching of image cache from Redis ',
				error
			);
			return res.end('Error');
		}

		if (data) {
			console.log(`[Cache] ${imageUrlPath}`);
			// If there is a cache matching the remote resource, serve the cache to the client
			res.statusCode = 200;
			res.setHeader('X-Is-Cached', 'TRUE');
			res.setHeader('Cache-Control', 'max-age=3600');
			res.setHeader('X-Company', 'KlexHub UG (haftungsbeschränkt)');
			const binary = Buffer.from(data, 'hex');
			sharp(binary).pipe(res);
		} else {
			console.log('[Serving Image] Create new image');
			// If there is not cache

			// Grab the image from the remote address

			try {
				const httpClient = imageUrlPath.startsWith('https')
					? require('https')
					: require('http');

				httpClient.get(imageUrlPath, (imageStream: any) => {
					let binary: any[] = [];

					imageStream.once('readable', () => {
						if (
							imageStream.statusCode !== 200 &&
							imageStream.statusCode !== 304
						) {
							console.log(imageUrlPath, res.statusCode);
							res.statusCode = 500;
							return res.end('Error');
						}
					});

					imageStream
						.pipe(
							sharp()
								.on('data', (chunk: any) => {
									binary.push(chunk);
								})
								.on('error', (error: any) => {
									res.statusCode = 500;
									res.end(error.message);
								})
						)
						.pipe(res)
						.once('finish', () => {
							// Once finish, serve the client back to the client
							res.end(null);
							const buffer = Buffer.concat(binary);
							const bufferHex = buffer.toString('hex');
							// Once served, cache the binary to Redis based on the remote URL for later use cases
							console.log('[Caching] ' + imageUrlPath);
							client.setex(imageUrlPath, 3600, bufferHex, (error: any) => {
								if (error) {
									return console.log(
										'Error during the caching of image ',
										error
									);
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
			} catch (error) {
				if (error.name === 'TypeError [ERR_INVALID_URL]') {
					res.statusCode = 400;
					res.end('Incorrect URL');
				} else {
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
