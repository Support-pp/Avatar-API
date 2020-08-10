# Avatar-API

You can generate avatars based on their initial. This project use redis as cache.
The implementation can be used e.g. in web applications for default avatar creation.

## Getting started

1. Clone the github repository [Avatar-API](https://github.com/Support-pp/Avatar-API) by
   `git clone https://github.com/Support-pp/Avatar-API.git`
2. You can simply start `redis`, `cache server` and `avatar creator api` with the docker-compose command:
   `docker-compose up`
3. Service is up and running. Now we can start a curl request

```
curl -X GET \
  'http://127.0.0.1:9090/?name=g&size=128'
```

The api generate now an avatar and responde with this. The first call take a littel bit longer, because ther service generate a new avatar with the initial. The next requests will be loaded from the cache.

> Note: make sure that your font supports special characters. Our used font support that not!

## Screenshorts

<img src="./example_images/g.png" width="30%">
<img src="./example_images/m.png" width="30%">
<img src="./example_images/v.png" width="30%">

# Legal

<b>The used font is not covered by this license. </b>Please inquire about your rights.
