FROM golang:latest
LABEL TAG="api-avatar"
RUN mkdir /app
ADD . /app/
WORKDIR /app
RUN go get github.com/holys/initials-avatar
RUN go get github.com/gorilla/mux
RUN go get github.com/go-ini/ini
RUN go build -o main .
EXPOSE 9090
CMD ["/app/main"]