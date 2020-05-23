# Avatar-API
Generate avatars with your initial. This is a micro service api.

# Doku
## Getting started
1. Download the src code `git clone `https://github.com/Support-pp/Avatar-API`
2. Go in the folder `cd Avatar-Api`
3. Install libs `go get github.com/holys/initials-avatar` and `go get github.com/gorilla/mux`
4. Build the micro service with `go build main.go webServer.go`
5. Start the microservice `./main`

6. Now you can start a curl request
``` 
curl -X GET \
  'http://127.0.0.1:9090/avatar?name=g&size=128' \
  -H 'cache-control: no-cache' 
```
The API is responsed with the Avatar from the inital.


You can use the docker image `docker pull supportpp/avatar-api
`
## Screenshorts

![Alt text](/example_images/g.png "G")
![Alt text](/example_images/m.png "M")
![Alt text](/example_images/v.png "V")



# Legal
This is a small micro service from the magiccoder organisation. We use the same for our project, to generate your avatar. This micro service is open source. And you can use that without any copyright.
