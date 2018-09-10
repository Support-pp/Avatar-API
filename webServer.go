package main

import (
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"strconv"
	"fmt"
	"github.com/holys/initials-avatar"
)

func StartWebserver(port string) {
	log.Printf("Start webserver on port ::  %[1]d\n", port);
	router := mux.NewRouter()
	router.HandleFunc("/avatar", Index)
	log.Fatal(http.ListenAndServe(":" + port, router))
}

func Index(w http.ResponseWriter, r *http.Request) {
	init :=  r.URL.Query().Get("name")
	size, _ :=  strconv.Atoi(string( r.URL.Query().Get("size")))

	if (strconv.Itoa(size) == "" ){
		w.WriteHeader(http.StatusBadRequest)
		return;
	}
	fmt.Println("error");



	log.Println("Generate avatar for name :: " + init)
	if (init ==""){
		w.WriteHeader(http.StatusBadRequest)
		return;
	}

	a := avatar.NewWithConfig(avatar.Config{
		FontFile: "./ONEDAY.ttf",
		FontSize: float64(size) * 75.0 / 128.0,
		MaxItems: 1024,
	})
	b, _ := a.DrawToBytes(init, size)

	w.Header().Set("Content-Type", "image/png")
	w.Header().Set("Cache-Control", "max-age=600")
	w.WriteHeader(http.StatusOK)
	w.Write(b)
}
