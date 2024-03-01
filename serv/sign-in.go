package serv

import (
	"database/sql"
	"fmt"
	"net/http"

	"golang.org/x/crypto/bcrypt"
	"main.go/bd"
	"main.go/structs"
)

func SignIn(userLog structs.LoginStruct, db *sql.DB, w http.ResponseWriter, r *http.Request) structs.Users {
	//initialisation des variables
	var Allusers, _ = bd.DataAllUser(BD)
	var Mdp = userLog.Mdp
	var Email = userLog.Email
	var Nickname = userLog.Nickname
	var Newuser structs.Users
	Newuser.Mdp = Mdp
	Newuser.Email = Email
	Newuser.Nickname = Nickname
	Newuser.Role = "utilisateur"
	Newuser.Actif = "true"
	Newuser.Error = ""

	//verification de si l'email ou le password est vide
	if !IsValidMail(Newuser.Email) {
		if !IsValid(Newuser.Nickname) || !IsAlphaNum(Newuser.Nickname) {
			fmt.Println("3")
			// Newuser.Error = "Your Nickame must have 1 character different to space"
			// return Newuser
			Newuser.Error = "Your Nickame or Your Email is incorrect"
			return Newuser
		}
	}
	// if !IsValid(Newuser.Nickname) || strings.Contains(Newuser.Nickname, "@") {
	// 	Newuser.Error = "Your Email is incorrect"
	// 	fmt.Println("je suis arrivé dans le nickname")
	// 	return Newuser
	// }
	if !IsValid(Newuser.Mdp) {
		Newuser.Error = "Your password must have 1 character different to space"
		return Newuser
	}

	//verification si l'utilisateur n'est pas deja enregistré
	for i, v := range Allusers {
		auth := bcrypt.CompareHashAndPassword([]byte(v.Mdp), []byte(Newuser.Mdp))
		if (v.Email == Newuser.Email || v.Nickname == Newuser.Nickname) && auth == nil {
			var presentUser structs.Users
			if v.Email == Newuser.Email {
				presentUser = bd.DataUser(db, Newuser.Email)
			} else if v.Nickname == Newuser.Nickname {
				presentUser = bd.DataNickname(db, Newuser.Nickname)
			}
			actif := session(w, r, presentUser, db)
			if !actif {
				Newuser = structs.Users{}
				Newuser.Error = "L'utilisateur est déjà connecté depuis un autre endroit."
				return Newuser
			}
			presentUser.Actif = "true"
			bd.UpdateUser(BD, presentUser)
			return presentUser
		} else if i == len(Allusers)-1 {
			fmt.Println("les autres sont actives")
			Newuser.Error = "Your Nickame/Email or Password is incorrect"
			return Newuser
		}
	}
	//sinon retourner une structure vide avec un message d'erreur
	Newuser = structs.Users{}
	Newuser.Error = "User not found"
	return Newuser
}
