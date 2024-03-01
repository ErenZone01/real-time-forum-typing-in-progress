package serv

import (
	"net/http"

	"main.go/bd"
	"main.go/structs"
)

func Decon(w http.ResponseWriter, r *http.Request) {
	//Bloquer les methodes Get
	if r.Method == "GET" {
		Errors.Title = "Bad Request"
		Errors.Body = "405"
		errors(w, r, Errors)
		return
	}

	// Déconnectez l'utilisateur et supprimez la session de la base de données
	var users = Myaccount(w, r)
	if users.Error == "Veuillez vous connecté d'abord" {
		Errors.Title = "Bad Request"
		Errors.Body = "400"
		errors(w, r, Errors)
		return
	}
	user = bd.DataUser(BD, users.Email)
	users.Actif = "false"
	bd.UpdateUser(BD, users)
	session, _ := r.Cookie("session")
	delete(sessions, user.Id)
	delete(sessionUser, session.Value)
	if session != nil {
		sessionMutex.Lock()
		delete(sessions, user.Id)
		sessionMutex.Unlock()
	}
	// Supprimez le cookie de session
	deleteCookies(w, r)
	bd.DeleteSession(BD, user.Id)

	user = structs.Users{}
	user.Error = "Vous êtes deconnecté avec succée"
}
