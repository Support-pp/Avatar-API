# Avatar-API
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://dashboard.heroku.com/new?template=https://github.com/magiccoder-git/Avatar-API)
Generate avatars with your initial. This is a micro service api.

# Doku
## Getting started
1. Download the src code `git clone `https://github.com/magiccoder-git/Avatar-API`
2. Go in the folder `cd Avatar-Api`
3. Install libs `go get github.com/holys/initials-avatar` and `go get github.com/gorilla/mux`
4. Build the micro service with `go build main.go webServer.go`
5. Start the microservice ``./main`

6. Now you can start a curl request
``` 
curl -X GET \
  'http://127.0.0.1:9999/avatar?name=g&size=128' \
  -H 'cache-control: no-cache' 
```
The API is responsed with the Avatar from the inital.

## Screenshorts

![Alt text](https://i.gyazo.com/7e4c025762c89fc59f5b88fa88854fbc.png "G")
![Alt text](https://i.gyazo.com/ad3193d15b452a429ca4262f302dc7f9.png "M")
![Alt text](https://i.gyazo.com/a0af1e40a5e799060c6343ef4d7864e4.png "V")



# Legal
This is a small micro service from the magiccoder organisation. We use the same for our project, to generate your avatar. This micro service is Open Source. And you can use that without any copyright.
