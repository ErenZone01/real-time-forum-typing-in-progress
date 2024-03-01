package serv

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"regexp"
	"strconv"

	"golang.org/x/crypto/bcrypt"
	"main.go/bd"
	"main.go/structs"
)

func SignUp(userReg structs.RegisterStruct ,db *sql.DB, w http.ResponseWriter, r *http.Request) structs.Users {
	//recuperer le user
	var Allusers, _ = bd.DataAllUser(db)
	var Username = userReg.Username
	var Lastname = userReg.Lastname
	var Nickname = userReg.Nickname
	var Age = userReg.Age
	var Genre = userReg.Genre
	var Mdp = userReg.Mdp
	var Email = userReg.Email
	var CMdp = userReg.ConfirmMdp
	var Newuser structs.Users

	var power = IsValidMail(Email)
	if !power {
		Newuser.Error = "Your Email is incorrect"
		return Newuser
	}

	if !IsValid(Mdp) {
		Newuser.Error = "Your password must have 1 character different to space"
		return Newuser
	}

	if Mdp != CMdp {
		Newuser.Error = "The password does not match the password confirmation"
		return Newuser
	}

	//hashage de mdp
	passe := []byte(Mdp)
	cons := 10
	HashPass, err := bcrypt.GenerateFromPassword(passe, cons)
	if err != nil {
		fmt.Println("Erreur lors de la génération du hachage:", err)
		os.Exit(0)
	}
	hash := string(HashPass)

	//initialisation
	Ages, err := strconv.Atoi(Age)
	if err != nil {
		Newuser.Error = "Your Age is incorrect"
		return Newuser
	}

	Newuser.Username = Username
	Newuser.Lastname = Lastname
	Newuser.Nickname = Nickname
	Newuser.Age = Ages
	Newuser.Genre = Genre
	Newuser.Mdp = hash
	Newuser.Email = Email
	Newuser.Error = ""
	Newuser.Actif="true"

	//verification de si l'email ou le password eest vide
	if !IsValid(Newuser.Email) {
		Newuser.Error = "Your Email is incorrect"
		return Newuser
	} else if !IsValid(Newuser.Mdp) {
		Newuser.Error = "Your password must have 1 character different to space"
		return Newuser
	} else if !IsAlpha(Newuser.Username) {
		fmt.Println("1")
		Newuser.Error = "Your firstname can only contain alphabetical characters"
		return Newuser
	} else if !IsAlpha(Newuser.Lastname) {
		fmt.Println("2")
		Newuser.Error = "Your Lastname can only contain alphabetical characters"
		return Newuser
	} else if !IsValid(Newuser.Nickname) || !IsAlphaNum(Newuser.Nickname) {
		fmt.Println("3")
		Newuser.Error = "Your Nickame must have 1 character different to space"
		return Newuser
	} else if !IsValid(Newuser.Genre) && !(Newuser.Genre == "Female" || Newuser.Genre == "Male") {
		fmt.Println("4")
		Newuser.Error = "Your Genre must have 1 character different to space"
		return Newuser
	}

	//verification si l'utilisateur n'est pas deja enregistré
	for _, v := range Allusers {
		if v.Nickname == Newuser.Nickname || v.Email == Newuser.Email {
			Newuser = structs.Users{}
			Newuser.Error = "Allready use it, please change !"
			return Newuser
		}
	}
	bd.NewUser(db, Newuser) //Inserer le nouvelle utilisateur dans  la base de donnée
	presentUser := bd.DataUser(db, Newuser.Email)
	actif := session(w, r, presentUser, db)
	if !actif {
		bd.DeleteUser(BD, presentUser.Id)
		Newuser = structs.Users{}
		Newuser.Error = "L'utilisateur est déjà connecté depuis un autre endroit."
		return Newuser
	}
	return presentUser
}
func IsAlpha(t string) bool {
	c := 0
	var actif = false;
	for _, val := range t {
		if ((val >= 'a' && val <= 'z') || (val >= 'A' && val <= 'Z')){
			actif = true
			c++
		}
		 if actif {
			if val == ' ' {
				c++
			}
		 }
	}
	return (len(t) == c)
}
func IsAlphaNum(t string) bool {
	c := 0
	for _, val := range t {
		if (val >= 'a' && val <= 'z') || (val >= 'A' && val <= 'Z') {
			c++
		} else if val >= '0' && val <= '9' {
			c++
		}
	}
	if Num(t) {
		return false
	}
	return (len(t) == c)
}

func Num(t string) bool {
	c := 0
	for _, val := range t {
		if val >= '0' && val <= '9' {
			c++
		}
	}
	return (len(t) == c)
}

func IsValidMail(t string) bool {
	//si l'email contient que des chiffres lettres et 2 caracteres speciaux
	emailRegex := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
	return emailRegex.MatchString(t)
}
