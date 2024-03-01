package serv

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gofrs/uuid/v5"
	"main.go/bd"
	"main.go/structs"
)

var (
	sessionMutex sync.Mutex
	sessions     = make(map[int]string)
	sessionUser  = make(map[string]structs.Users)
)

func actualiseSession() {
	var Allsession, err = bd.DataSession(BD)
	if err != nil {
		fmt.Println("session have problems")
		return
	}
	for i := 0; i < len(Allsession); i++ {
		sessionUser[Allsession[i].Value] = bd.DataUserById(BD, Allsession[i].Users_id)
		sessions[bd.DataUserById(BD, Allsession[i].Users_id).Id] = Allsession[i].Value
	}
}

func session(w http.ResponseWriter, r *http.Request, users structs.Users, BD *sql.DB) bool {
	sessionMutex.Lock()
	userID_s := bd.DataUser(BD, users.Email)
	userID := userID_s.Id
	actualiseSession()
	_, exists := sessions[userID]
	if exists {
		sessionMutex.Unlock()
		return false
	}
	users.Actif = "true"

	//Créez une nouvelle session
	sessionID := generateSessionID()
	sessionUser[sessionID] = users
	sessions[userID] = sessionID

	//enregistrer la session dans la base de donnée
	var newSessionBD structs.Session
	newSessionBD.Users_id = userID
	newSessionBD.Value = sessionID
	bd.NewSession(BD, newSessionBD)

	sessionMutex.Unlock()
	expiration := time.Now().Add(2 * time.Hour)
	All_Forum.Allsessions = sessionUser
	//Stockez l'identifiant de session dans un cookie
	http.SetCookie(w, &http.Cookie{
		Name:    "session",
		Value:   sessionID,
		Expires: expiration,
	})
	return true
}

func generateSessionID() string {
	//Create a Version 4 UUID.
	u2, err := uuid.NewV4()
	if err != nil {
		log.Fatalf("failed to generate UUID: %v", err)
	}
	//log.Printf("generated Version 4 UUID %v", u2)
	u3, err := uuid.FromString(u2.String())
	if err != nil {
		log.Fatalf("failed to parse UUID %q: %v", u2.String(), err)
	}
	//log.Printf("successfully parsed UUID %v", u3)
	return u3.String()
}

func Myaccount(w http.ResponseWriter, r *http.Request) structs.Users {
	var session, _ = r.Cookie("session")
	if session == nil || session.Value == "" {
		user := structs.Users{}
		user.Error = "Veuillez vous connecté d'abord"
		return user
	}
	var _, e = sessionUser[session.Value]
	if !e {
		user := structs.Users{}
		user.Error = "Veuillez vous connecté d'abord"
		return user
	}
	var user = sessionUser[session.Value]
	user.Actif = "true"
	expiration := time.Now().Add(2 * time.Hour)
	//Stockez l'identifiant de session dans un cookie
	http.SetCookie(w, &http.Cookie{
		Name:    "session",
		Value:   session.Value,
		Expires: expiration,
	})
	return user
}

func deleteCookies(w http.ResponseWriter, r *http.Request) {
	//nom du cookie
	// var userOnline = Myaccount(w, r)
	// userOnline.Actif = "false"
	// bd.UpdateUser(BD, userOnline)
	cookieName := "session"
	//Créez un cookie avec une date deja expiré
	expiration := time.Now().AddDate(0, 0, -1)
	deletecookie := http.Cookie{
		Name:    cookieName,
		Value:   "",
		Expires: expiration,
		Path:    "/",
	}
	http.SetCookie(w, &deletecookie)
	fmt.Println("Cookie supprimé avec succés!")
}
