package main

import (
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"strconv"
	"github.com/holys/initials-avatar"
	"strings"
)

func startWebserver(port string) {
	log.Printf("Start webserver on port :: %s", port);
	router := mux.NewRouter()
	router.HandleFunc("/avatar", Index)
	log.Fatal(http.ListenAndServe(":" + port, router))
}

func Index(w http.ResponseWriter, r *http.Request) {
	init :=  strings.Replace(r.URL.Query().Get("name"), " ", "", -1)
	size, _ :=  strconv.Atoi(string( r.URL.Query().Get("size")))

	if (size > 32767){
		w.WriteHeader(http.StatusBadRequest)
		return;
	}
	if (size > 1000){
		size = 1000
	}

	if (strconv.Itoa(size) == "" ){
		w.WriteHeader(http.StatusBadRequest)
		return;
	}

	log.Println("Generate avatar for name :: " + init)
	if (init ==""){
		w.WriteHeader(http.StatusBadRequest)
		return;
	}

	a := avatar.NewWithConfig(avatar.Config{
		FontFile: "./ONEDAY.ttf",
		FontSize: float64(size) * 75.0 / 128.0,
		MaxBytes: 128,
	})

	b, err := a.DrawToBytes(init, size)
	if (err != nil){
		log.Printf(">> ERROR")
	}
	
	w.Header().Set("Content-Type", "image/png")
	w.Header().Set("Cache-Control", "max-age=600")
	w.WriteHeader(http.StatusOK)
	w.Write(b)
}