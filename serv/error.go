package serv

import (
	"html/template"
	"net/http"

	"main.go/structs"
)

func errors(w http.ResponseWriter, r *http.Request, p structs.Error) {

	var statusCode int
	switch p.Body {
	case "404":
		p.Title = "Page not Found"
		statusCode = http.StatusNotFound
	case "500":
		p.Title = "Internal Server Error"
		statusCode = http.StatusInternalServerError
	case "400":
		p.Title = "Bad request"
		statusCode = http.StatusBadRequest
	case "405":
		p.Title = "Not Allowed"
		statusCode = http.StatusMethodNotAllowed
	default:
		p.Title = "Internal Server Error"
		statusCode = http.StatusInternalServerError
	}

	w.WriteHeader(statusCode)
	if p.Body == "404" {
		t, err := template.ParseFiles("templates/index.html")
		if err != nil {
			Errors.Title = "Internal Server Error"
			Errors.Body = "500"
			errors(w, r, Errors)
			return
		}
		t.Execute(w, All_Forum)
	}
}
