package main

import (
	"fmt"
	"os"
	"github.com/go-ini/ini"
	"log"
)

func main()  {
	cfg, err := ini.Load("config.ini")
	if err != nil {
		fmt.Printf("Fail to read file: %v", err)
		os.Exit(1)
	}

	log.Println("App Mode: " + cfg.Section("").Key("app_mode").String())
	StartWebserver(cfg.Section("server").Key("http_port").MustInt(80))
}