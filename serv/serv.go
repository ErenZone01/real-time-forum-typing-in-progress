package serv

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"
	"main.go/bd"
	"main.go/structs"
)

var user = structs.Users{}
var BD *sql.DB
var All_Forum structs.All_Forum
var Errors structs.Error

func Serve(db *sql.DB, errors structs.Error) {
	Errors = errors
	BD = db
	port := ":8080"
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("./js"))))
	http.HandleFunc("/", Handler)
	http.HandleFunc("/ws", HandlerWebsocket)
	//demarrer le serveur
	fmt.Println("server is start at : http://localhost:8080")
	err := http.ListenAndServe(port, nil)
	if err != nil {
		fmt.Println("Erreur lors du démarrage du serveur:", err)
	}
}

func SendError(w http.ResponseWriter, r *http.Request, errors structs.Error) {
	var JsonForum, err = json.Marshal(errors)
	if err != nil {
		fmt.Println("JSON error : ", err)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(JsonForum)
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" {
		//gerer les erreur 500
		if Errors.Body == "500" {
			Errors.Title = "Internal Server Error"
			errors(w, r, Errors)
			return
		}
		t, err := template.ParseFiles("templates/index.html")
		if err != nil {
			Errors.Title = "Internal Server Error"
			Errors.Body = "500"
			errors(w, r, Errors)
			return
		}
		//Recuperer tout les Utilisateurs et les mettre dans la structure
		var Allusers, err0 = bd.DataAllUser(BD)
		//Recuperer tout les Posts et les mettre dans la structure
		var Allpost, err1 = bd.DataAllPost(BD)
		//Recuperer tout les Coms et les mettre dans la structure
		var Allcom, err2 = bd.DataAllCom(BD)

		//initialisation des structures
		All_Forum.Users = Allusers
		All_Forum.Posts = Allpost
		All_Forum.Coms = Allcom

		//mise a jour des Like et dislike
		for i, v := range All_Forum.Posts {
			AllLikepost, _ := bd.DataLikePost(BD, v.Id)
			AllDislikePost, _ := bd.DataDisLikePost(BD, v.Id)
			v.N_like = len(AllLikepost)
			v.N_dislike = len(AllDislikePost)
			All_Forum.Posts[i].N_like = len(AllLikepost)
			All_Forum.Posts[i].N_dislike = len(AllDislikePost)
		}
		for i, v := range All_Forum.Coms {
			AllLikeCom, _ := bd.DataLikeCom(BD, v.Id)
			AllDislikeCom, _ := bd.DataDislikeCom(BD, v.Id)
			v.N_like = len(AllLikeCom)
			v.N_dislike = len(AllDislikeCom)
			All_Forum.Coms[i].N_like = len(AllLikeCom)
			All_Forum.Coms[i].N_dislike = len(AllDislikeCom)
		}

		presentUser := Myaccount(w, r)

		//mise à jour nmbr de post et de coms
		All_Forum.Utilisateur = []structs.Users{}
		var MyPost, err4 = bd.DataMyPost(BD, presentUser.Id)
		All_Forum.MyPost = MyPost
		var MyCom, err5 = bd.DataMyCom(BD, presentUser.Id)
		All_Forum.MyCom = MyCom
		//recuperer tous les messages
		All_Forum.MyMsg = bd.DataAllMessage(BD)

		//Nombre de commentaire et reglage de la date
		for i, v := range All_Forum.Posts {
			//enlever certains caractere de la date
			var timer = v.CreatedPost
			timer1 := strings.Split(timer, "T")
			if len(timer1) == 2 {
				timer = timer1[0] + " " + timer1[1]
			}
			timer2 := strings.Split(timer, "Z")
			if len(timer2) == 2 {
				timer = timer2[0] + " " + timer2[1]
				v.CreatedPost = timer
				Allpost[i].CreatedPost = timer
			}

			ComPost, _ := bd.DataNbrCom(BD, v.Id)
			v.N_com = len(ComPost)
			Allpost[i].N_com = len(ComPost)
			bd.SelectNbrCom(BD, v)
		}

		//calcule du nombre de like
		AllLiked, err6 := DataAllLikedPosts(BD, presentUser.Id)
		if err6 != nil {
			fmt.Println("error 1:", err)
			return
		}
		var Nlike int
		for _, v := range AllLiked {
			Nlike += v.N_like
		}
		var tab structs.Mylike
		tab.N_like = Nlike
		All_Forum.Mylike = []structs.Mylike{}
		All_Forum.Mylike = append(All_Forum.Mylike, tab)

		if presentUser.Error != "Veuillez vous connecté d'abord" {
			All_Forum.Utilisateur = append(All_Forum.Utilisateur, presentUser)
		}

		//verification de la methode utilisée
		if r.Method == "POST" {
			var respGlobale structs.DataJson
			var userLog structs.LoginStruct
			var userReg structs.RegisterStruct
			var postJson structs.PostStruct

			//recevoir le JSON
			decoder := json.NewDecoder(r.Body)
			err := decoder.Decode(&respGlobale)
			if err != nil {
				fmt.Println("Erreur de décodage JSON")
				//http.Error(w, "Erreur de décodage JSON", http.StatusBadRequest)
				return
			}

			// Répondre au client avec un JSON (ou toute autre réponse que vous souhaitez)
			response := map[string]interface{}{
				"status":  "success",
				"message": "User registered successfully",
			}
			jsonResponse, err := json.Marshal(response)
			if err != nil {
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				return
			}
			if respGlobale.Object == "Login" {
				//debut de la  partie fetch
				//attribué les données de la requete
				data := respGlobale.Data.(map[string]interface{})
				userLog.Email = data["Email"].(string)
				userLog.Nickname = data["Email"].(string)
				userLog.Mdp = data["Mdp"].(string)
				//fin de la partie fetch et attribution de userLogin dans SignIn pour se connecté
				NewUser := SignIn(userLog, BD, w, r)
				if NewUser.Error == "User not found" || NewUser.Error == "L'utilisateur est déjà connecté depuis un autre endroit." || NewUser.Error == "Your Email is incorrect" || NewUser.Error == "Your password is incorrect" || NewUser.Error == "Your password must have 1 character different to space" || NewUser.Error == "Your Nickame/Email or Password is incorrect" {
					var newerror structs.Error
					newerror.Type = "login"
					newerror.Title = "Error of Login"
					newerror.Msg = NewUser.Error
					NewUser = structs.Users{}
					SendError(w, r, newerror)
					return
				}
				All_Forum.Utilisateur = []structs.Users{}
				All_Forum.Utilisateur = append(All_Forum.Utilisateur, NewUser)
				Allusers, _ := bd.DataAllUser(BD)
				fmt.Println(NewUser.Username, " ,vous êtes connecté avec succée")
				All_Forum.Users = Allusers
				var MyPost, _ = bd.DataMyPost(BD, NewUser.Id)
				All_Forum.MyPost = MyPost
				var MyCom, _ = bd.DataMyCom(BD, NewUser.Id)
				All_Forum.MyCom = MyCom
				AllLiked, _ := DataAllLikedPosts(BD, NewUser.Id)
				var Nlike int
				for _, v := range AllLiked {
					Nlike += v.N_like
				}
				var tab structs.Mylike
				tab.N_like = Nlike
				All_Forum.Mylike = []structs.Mylike{}
				All_Forum.Mylike = append(All_Forum.Mylike, tab)
				//filtre most liked
				var Mostliked, err8 = bd.SelectMostLiked(BD)
				if err8 != nil {
					fmt.Println("error 8: ", err8)
					return
				}
				All_Forum.FilterLiked = Mostliked
				var JsonForum, err = json.Marshal(All_Forum)
				if err != nil {
					fmt.Println("JSON error : ", err)
				}
				w.Header().Set("Content-Type", "application/json")
				w.Write(JsonForum)
			} else if respGlobale.Object == "Register" {
				//debut de la  partie fetch
				data := respGlobale.Data.(map[string]interface{})
				userReg.Username = data["Username"].(string)
				userReg.Lastname = data["Lastname"].(string)
				userReg.Nickname = data["Nickname"].(string)
				userReg.Age = data["Age"].(string)
				userReg.Genre = data["Genre"].(string)
				userReg.Mdp = data["Mdp"].(string)
				userReg.ConfirmMdp = data["ConfirmMdp"].(string)
				userReg.Email = data["Email"].(string)
				// Utilisez la structure LoginRequest
				//fin de la partie fetch et attribution de userLogin dans SignUp pour se connecté
				NewUser := SignUp(userReg, BD, w, r)
				if NewUser.Error == "Allready use it, please change !" || NewUser.Error == "L'utilisateur est déjà connecté depuis un autre endroit." || NewUser.Error == "Password not correct !" || NewUser.Error == "Your Email is incorrect" || NewUser.Error == "Your password is incorrect" || NewUser.Error == "The password does not match the password confirmation" || NewUser.Error == "Your password must have 1 character different to space" || NewUser.Error == "Your Nickame must have 1 character different to space" || NewUser.Error == "Your Genre must have 1 character different to space" || NewUser.Error == "Your firstname can only contain alphabetical characters" || NewUser.Error == "Your Lastname can only contain alphabetical characters" {
					var newerror structs.Error
					newerror.Type = "register"
					newerror.Title = "Error of Register"
					newerror.Msg = NewUser.Error
					NewUser = structs.Users{}
					SendError(w, r, newerror)
					return
				}
				All_Forum.Utilisateur = []structs.Users{}
				All_Forum.Utilisateur = append(All_Forum.Utilisateur, NewUser)
				Allusers, _ = bd.DataAllUser(BD)
				fmt.Println(NewUser.Username, " ,votre compte a été crée avec succée")
				All_Forum.Users = Allusers
				var Allcom, _ = bd.DataAllCom(BD)
				All_Forum.Coms = Allcom
				AllLiked, _ := DataAllLikedPosts(BD, NewUser.Id)
				var Nlike int
				for _, v := range AllLiked {
					Nlike += v.N_like
				}
				var tab structs.Mylike
				//tab = append(tab, Nlike)
				tab.N_like = Nlike
				All_Forum.Mylike = []structs.Mylike{}
				All_Forum.Mylike = append(All_Forum.Mylike, tab)
				//filtre most liked
				var Mostliked, err8 = bd.SelectMostLiked(BD)
				if err8 != nil {
					fmt.Println("error 8: ", err8)
					return
				}
				All_Forum.FilterLiked = Mostliked

				var JsonForum, err = json.Marshal(All_Forum)
				if err != nil {
					fmt.Println("JSON error : ", err)
				}
				w.Header().Set("Content-Type", "application/json")
				w.Write(JsonForum)
			} else if respGlobale.Object == "Post" {
				//debut de la  partie fetch
				data := respGlobale.Data.(map[string]interface{})
				postJson.Title = data["Title"].(string)
				postJson.Body = data["Body"].(string)
				postJson.Categorie1 = data["Categorie1"].(string)
				postJson.Categorie2 = data["Categorie2"].(string)
				postJson.Categorie3 = data["Categorie3"].(string)
				postJson.Categorie4 = data["Categorie4"].(string)
				postJson.Categorie5 = data["Categorie5"].(string)
				//fin de la partie fetch et attribution de userLogin dans SignUp pour se connecté

				user := Myaccount(w, r)
				if user.Error == "Veuillez vous connecté d'abord" {
					var newerror structs.Error
					newerror.Type = "post"
					newerror.Title = "Error of Post"
					newerror.Msg = user.Error
					user = structs.Users{}
					SendError(w, r, newerror)
					return
				}
				var NewUser = bd.DataUser(BD, user.Email)
				var statusPost = CreatePost(w, postJson, r, NewUser)
				if !statusPost {
					var newerror structs.Error
					newerror.Type = "post"
					newerror.Title = "Error of Post"
					newerror.Msg = "Error of Post"
					SendError(w, r, newerror)
					//SendError(w,r,Errors)
					return
				}
				Allpost, _ := bd.DataAllPost(BD)
				All_Forum.Posts = Allpost
				for i, v := range All_Forum.Posts {
					//enlever certains caractere de la date
					var timer = v.CreatedPost
					timer1 := strings.Split(timer, "T")
					timer = timer1[0] + " " + timer1[1]
					timer2 := strings.Split(timer, "Z")
					timer = timer2[0] + " " + timer2[1]
					v.CreatedPost = timer
					Allpost[i].CreatedPost = timer
				}
				All_Forum.Posts = Allpost

				var MyPost, _ = bd.DataMyPost(BD, NewUser.Id)
				All_Forum.MyPost = MyPost
				var MyCom, _ = bd.DataMyCom(BD, NewUser.Id)
				All_Forum.MyCom = MyCom
				AllLiked, _ := DataAllLikedPosts(BD, NewUser.Id)
				var Nlike int
				for _, v := range AllLiked {
					Nlike += v.N_like
				}
				var tab structs.Mylike
				//tab = append(tab, Nlike)
				tab.N_like = Nlike
				All_Forum.Mylike = []structs.Mylike{}
				All_Forum.Mylike = append(All_Forum.Mylike, tab)
				//filtre most liked
				var Mostliked, err8 = bd.SelectMostLiked(BD)
				if err8 != nil {
					fmt.Println("error 8: ", err8)
					return
				}
				All_Forum.FilterLiked = Mostliked
				var JsonForum, err = json.Marshal(All_Forum)
				if err != nil {
					fmt.Println("JSON error : ", err)
				}
				w.Header().Set("Content-Type", "application/json")
				w.Write(JsonForum)
			} else if respGlobale.Object == "Add Comment" {
				var newCom structs.CommentStruct
				var data = respGlobale.Data.(map[string]interface{})
				newCom.Comment = data["Comment"].(string)
				newCom.CommentId = data["CommentId"].(string)
				user := Myaccount(w, r)
				if user.Error == "Veuillez vous connecté d'abord" {
					var newerror structs.Error
					newerror.Type = "com"
					newerror.Title = "Error of Com"
					newerror.Msg = user.Error
					user = structs.Users{}
					SendError(w, r, newerror)
					return
				}
				users := bd.DataUser(BD, user.Email)

				var statusPost = CreatCom(w, r, newCom, users.Id)
				if !statusPost {
					var newerror structs.Error
					newerror.Type = "com"
					newerror.Title = "Error of Com"
					newerror.Msg = "Error of Com"
					SendError(w, r, newerror)
					return
				}
				var MyPost, _ = bd.DataMyPost(BD, user.Id)
				for i, v := range MyPost {
					MyPost[i].Filter = 0
					v.Filter = 0
				}
				All_Forum.MyPost = MyPost
				var MyCom, _ = bd.DataMyCom(BD, user.Id)
				All_Forum.MyCom = MyCom
				AllLiked, _ := DataAllLikedPosts(BD, user.Id)
				var Nlike int
				for _, v := range AllLiked {
					Nlike += v.N_like
				}
				var tab structs.Mylike
				//tab = append(tab, Nlike)
				tab.N_like = Nlike
				var Allcom, _ = bd.DataAllCom(BD)
				All_Forum.Coms = Allcom
				//Nombre de commentaire
				for i, v := range All_Forum.Posts {
					ComPost, _ := bd.DataNbrCom(BD, v.Id)
					v.N_com = len(ComPost)
					Allpost[i].N_com = len(ComPost)
					bd.SelectNbrCom(BD, v)
				}
				MyPost, _ = bd.DataMyPost(BD, user.Id)
				All_Forum.MyPost = MyPost
				All_Forum.Mylike = []structs.Mylike{}
				All_Forum.Mylike = append(All_Forum.Mylike, tab)
				var JsonForum, err = json.Marshal(All_Forum)
				if err != nil {
					fmt.Println("JSON error : ", err)
				}
				w.Header().Set("Content-Type", "application/json")
				w.Write(JsonForum)
			} else if respGlobale.Object == "likePost" {
				var newLikePost structs.LikePostStruct
				var data = respGlobale.Data.(map[string]interface{})
				user := Myaccount(w, r)
				newLikePost.Like_PostId = data["like_PostId"].(string)
				if user.Error == "Veuillez vous connecté d'abord" {
					user.Error = ""
					http.Redirect(w, r, "/register", http.StatusSeeOther)
					return
				}
				users := bd.DataUser(BD, user.Email)
				likePost(newLikePost, users, w, r)
				AllLiked, _ := DataAllLikedPosts(BD, user.Id)
				var Nlike int
				for _, v := range AllLiked {
					Nlike += v.N_like
				}
				var tab structs.Mylike
				tab.N_like = Nlike
				All_Forum.Mylike = []structs.Mylike{}
				All_Forum.Mylike = append(All_Forum.Mylike, tab)
				var Mostliked, err8 = bd.SelectMostLiked(BD)
				//filtre most liked
				if err8 != nil {
					fmt.Println("error 8: ", err8)
					return
				}
				All_Forum.FilterLiked = Mostliked
				var JsonForum, err = json.Marshal(All_Forum)
				if err != nil {
					fmt.Println("JSON error : ", err)
				}
				w.Header().Set("Content-Type", "application/json")
				w.Write(JsonForum)
			} else if respGlobale.Object == "dislikePost" {
				var newDisLikePost structs.LikePostStruct
				var data = respGlobale.Data.(map[string]interface{})
				user := Myaccount(w, r)
				newDisLikePost.Like_PostId = data["like_PostId"].(string)
				if user.Error == "Veuillez vous connecté d'abord" {
					user.Error = ""
					//http.Redirect(w, r, "/register", http.StatusSeeOther)
					return
				}
				users := bd.DataUser(BD, user.Email)
				dislikePost(newDisLikePost, users, w, r)
				AllLiked, _ := DataAllLikedPosts(BD, user.Id)
				var Nlike int
				for _, v := range AllLiked {
					Nlike += v.N_like
				}
				var tab structs.Mylike
				//tab = append(tab, Nlike)
				tab.N_like = Nlike
				All_Forum.Mylike = []structs.Mylike{}
				All_Forum.Mylike = append(All_Forum.Mylike, tab)
				//filtre most liked
				var Mostliked, err8 = bd.SelectMostLiked(BD)
				if err8 != nil {
					fmt.Println("error 8: ", err8)
					return
				}
				All_Forum.FilterLiked = Mostliked
				w.Header().Set("Content-Type", "application/json")
				w.Write(jsonResponse)
			} else if respGlobale.Object == "Filter by category" {
				var newFilter structs.FilterCategories
				var data = respGlobale.Data.(map[string]interface{})
				// user := Myaccount(w, r)
				newFilter.Filter = data["Filter"].(string)
				var categorie = newFilter.Filter
				if categorie != "" {
					var c, _ = DataAllPostByCategory(BD, categorie)
					var final []structs.Posts
					for _, v := range c {
						var f = bd.DataPostC(BD, v.Posts_id)
						//enlever certains caractere de la date
						var timer = f.CreatedPost
						timer1 := strings.Split(timer, "T")
						timer = timer1[0] + " " + timer1[1]
						timer2 := strings.Split(timer, "Z")
						timer = timer2[0] + " " + timer2[1]
						f.CreatedPost = timer
						//filtre
						f.Filter = 1
						final = append(final, f)
					}
					All_Forum.Posts = final
				}
				var JsonForum, err = json.Marshal(All_Forum)
				if err != nil {
					fmt.Println("JSON error : ", err)
				}
				w.Header().Set("Content-Type", "application/json")
				w.Write(JsonForum)
			} else if respGlobale.Object == "Filter by Like" {
				user := Myaccount(w, r)
				if user.Error == "Veuillez vous connecté d'abord" {
					user.Error = ""
					http.Redirect(w, r, "/register", http.StatusSeeOther)
					return
				}
				var actu, _ = DataLikedPosts(BD, user.Id)
				var MyPostsLiked = []structs.Posts{}
				for _, v := range actu {
					var Prepost = bd.DataPostC(BD, v.Posts_id)
					//enlever certains caractere de la date
					var timer = Prepost.CreatedPost
					timer1 := strings.Split(timer, "T")
					timer = timer1[0] + " " + timer1[1]
					timer2 := strings.Split(timer, "Z")
					timer = timer2[0] + " " + timer2[1]
					Prepost.CreatedPost = timer
					//Filtre
					Prepost.Filter = 1
					MyPostsLiked = append(MyPostsLiked, Prepost)
				}
				All_Forum.Posts = MyPostsLiked
				var JsonForum, err = json.Marshal(All_Forum)
				if err != nil {
					fmt.Println("JSON error : ", err)
				}
				w.Header().Set("Content-Type", "application/json")
				w.Write(JsonForum)
			} else if respGlobale.Object == "Filter by Created Post" {
				user := Myaccount(w, r)
				if user.Error == "Veuillez vous connecté d'abord" {
					user.Error = ""
				}
				var myPost, _ = bd.DataMyPost(BD, user.Id)
				for i, v := range myPost {
					//enlever certains caractere de la date
					var timer = v.CreatedPost
					timer1 := strings.Split(timer, "T")
					timer = timer1[0] + " " + timer1[1]
					timer2 := strings.Split(timer, "Z")
					timer = timer2[0] + " " + timer2[1]
					v.CreatedPost = timer
					myPost[i].CreatedPost = timer
					//filtre
					myPost[i].Filter = 1
					v.Filter = 1
				}
				All_Forum.Posts = myPost
				var JsonForum, err = json.Marshal(All_Forum)
				if err != nil {
					fmt.Println("JSON error : ", err)
				}
				w.Header().Set("Content-Type", "application/json")
				w.Write(JsonForum)
			} else if respGlobale.Object == "likeCom" {
				var newDisLikeCom structs.LikeComStruct
				var data = respGlobale.Data.(map[string]interface{})
				//user := Myaccount(w, r)
				newDisLikeCom.Like_ComId = data["like_PostId"].(string)
				user := Myaccount(w, r)
				if user.Error == "Veuillez vous connecté d'abord" {
					user.Error = ""
					//http.Redirect(w, r, "/register", http.StatusSeeOther)
					return
				}

				users := bd.DataUser(BD, user.Email)
				likeCom(newDisLikeCom, users, w, r)
				w.Header().Set("Content-Type", "application/json")
				w.Write(jsonResponse)
			} else if respGlobale.Object == "dislikeCom" {
				var newDisLikeCom structs.LikeComStruct
				var data = respGlobale.Data.(map[string]interface{})
				//user := Myaccount(w, r)
				newDisLikeCom.Like_ComId = data["like_PostId"].(string)
				user := Myaccount(w, r)
				if user.Error == "Veuillez vous connecté d'abord" {
					user.Error = ""
					//http.Redirect(w, r, "/register", http.StatusSeeOther)
					return
				}
				users := bd.DataUser(BD, user.Email)
				dislikeCom(newDisLikeCom, users, w, r)
				w.Header().Set("Content-Type", "application/json")
				w.Write(jsonResponse)
			} else if respGlobale.Object == "update" {
				All_Forum = UpdateData(w, r)
				var JsonForum, err = json.Marshal(All_Forum)
				if err != nil {
					fmt.Println("JSON error : ", err)
				}
				w.Header().Set("Content-Type", "application/json")
				w.Write(JsonForum)
			} else if respGlobale.Object == "Decon" {
				Decon(w, r)
				w.Header().Set("Content-Type", "application/json")
				w.Write(jsonResponse)
			} else if respGlobale.Object == "SessionExpired" {
				data := respGlobale.Data.(map[string]interface{})
				var NewUser structs.Message
				NewUser.Email = data["Email"].(string)
				NewUser.Nickname = data["Nickname"].(string)
				user := bd.DataNickname(BD, NewUser.Nickname)
				user.Actif = "false"
				namesession := sessions[user.Id]
				bd.UpdateUser(BD, user)
				delete(sessionUser, namesession)
				delete(sessions, user.Id)
				bd.DeleteSession(BD, user.Id)
				fmt.Println(user.Username, " est déconnecté(e)")
				w.Header().Set("Content-Type", "application/json")
				w.Write(jsonResponse)
			} else if respGlobale.Object == "UpdateMsg" {
				var data = respGlobale.Data.(map[string]interface{})
				// Convertir la map en une structure Message
				message := structs.MsgSend{
					CreatedMsg:  data["CreatedMsg"].(string),
					Id:          int(data["Id"].(float64)),
					Lu:          data["Lu"].(string),
					Msg:         data["Msg"].(string),
					MyUsernames: data["MyUsernames"].(string),
					UserClient:  data["UserClient"].(string),
				}
				message.Lu = "true"
				bd.UpdateMsg(BD, message)
				All_Forum = UpdateData(w, r)
				var JsonForum, err = json.Marshal(All_Forum)
				if err != nil {
					fmt.Println("JSON error : ", err)
				}
				w.Header().Set("Content-Type", "application/json")
				w.Write(JsonForum)
			}
		} else {
			if err0 != nil || err1 != nil || err2 != nil || err4 != nil || err5 != nil {
				fmt.Println("error: ", err0)
				return
			}
			// Répondre au client avec un JSON (ou toute autre réponse que vous souhaitez)
			w.WriteHeader(http.StatusOK)
			t.Execute(w, All_Forum)
		}
	} else {
		Errors.Body = "404"
		Errors.Title = "Page not Found"
		errors(w, r, Errors)
		return
	}
}

// pour les mdp username email post commentaire nickname age genre lastname
func IsValid(s string) bool {
	eff := strings.TrimSpace(s)
	return len(eff) != 0
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var connection []*websocket.Conn

func update(w http.ResponseWriter, r *http.Request) {
	jsonData, err := json.Marshal(UpdateData(w, r))
	if err != nil {
		// Gérer l'erreur de manière appropriée
		return
	}

	for _, conn := range connection {
		err := conn.WriteMessage(websocket.TextMessage, jsonData)
		if err != nil {
			// Gérer l'erreur de manière appropriée
			break
		}
	}
}

func HandlerWebsocket(w http.ResponseWriter, r *http.Request) {
	// Mise à niveau de la connexion HTTP vers WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer conn.Close()

	// Ajouter la connexion à la liste
	connection = append(connection, conn)

	go func() {
		defer conn.Close()
		for {
			message, p, err := conn.ReadMessage()
			if err != nil {
				// La connexion s'est fermée, supprimer la connexion de la liste
				for i, c := range connection {
					if c == conn {
						connection = append(connection[:i], connection[i+1:]...)
						break
					}
				}
				break
			} else {
				switch message {
				case websocket.TextMessage:
					if string(p) == "update" {
						update(w, r)
					} else {
						// Le message est de type texte
						var newMsg structs.MsgSend
						if err := json.Unmarshal(p, &newMsg); err != nil {
							fmt.Println("Erreur de deserialisation", err)
						} else {
							if newMsg.MyUsernames != ""{
								bd.NewMesg(BD, newMsg)
								// Envoi des données au format JSON via WebSocket!
								update(w, r)
							}
						}
						var typing structs.Typing
						if err := json.Unmarshal(p, &typing); err != nil {
							fmt.Println("je ne suis pas dans le typing")
						} else {
							if typing.Sender != ""{
								jsonData, err := json.Marshal(typing)
								if err != nil {
									// Gérer l'erreur de manière appropriée
									return
								}
								for _, conn := range connection {
									err := conn.WriteMessage(websocket.TextMessage, jsonData)
									if err != nil {
										// Gérer l'erreur de manière appropriée
										break
									}
								}
							}
						}

					}
				case websocket.BinaryMessage:
					// Le message est de type binaire
					fmt.Println("Message binaire reçu:", p)
				default:
					// Type de message inconnu
					fmt.Println("Type de message inconnu:", message)
				}
			}
		}
	}()

	// Attendez indéfiniment (ou jusqu'à ce que la connexion soit fermée)
	select {}
}

func UpdateData(w http.ResponseWriter, r *http.Request) structs.All_Forum {
	//Recuperer tout les Utilisateurs et les mettre dans la structure
	var Allusers, err0 = bd.DataAllUser(BD)
	//Recuperer tout les Posts et les mettre dans la structure
	var Allpost, err1 = bd.DataAllPost(BD)
	//Recuperer tout les Coms et les mettre dans la structure
	var Allcom, err2 = bd.DataAllCom(BD)
	//Recuperer toutes les sessions
	actualiseSession()
	All_Forum.Allsessions = sessionUser

	//initialisation des structures
	All_Forum.Users = Allusers
	All_Forum.Posts = Allpost
	All_Forum.Coms = Allcom

	//mise a jour des Like et dislike
	for i, v := range All_Forum.Posts {
		AllLikepost, _ := bd.DataLikePost(BD, v.Id)
		AllDislikePost, _ := bd.DataDisLikePost(BD, v.Id)
		v.N_like = len(AllLikepost)
		v.N_dislike = len(AllDislikePost)
		All_Forum.Posts[i].N_like = len(AllLikepost)
		All_Forum.Posts[i].N_dislike = len(AllDislikePost)
	}
	for i, v := range All_Forum.Coms {
		AllLikeCom, _ := bd.DataLikeCom(BD, v.Id)
		AllDislikeCom, _ := bd.DataDislikeCom(BD, v.Id)
		v.N_like = len(AllLikeCom)
		v.N_dislike = len(AllDislikeCom)
		All_Forum.Coms[i].N_like = len(AllLikeCom)
		All_Forum.Coms[i].N_dislike = len(AllDislikeCom)
	}

	presentUser := Myaccount(w, r)

	//mise à jour nmbr de post et de coms
	All_Forum.Utilisateur = []structs.Users{}
	var MyPost, err4 = bd.DataMyPost(BD, presentUser.Id)
	All_Forum.MyPost = MyPost
	var MyCom, err5 = bd.DataMyCom(BD, presentUser.Id)
	All_Forum.MyCom = MyCom

	//Nombre de commentaire et reglage de la date
	for i, v := range All_Forum.Posts {
		//enlever certains caractere de la date
		var timer = v.CreatedPost
		timer1 := strings.Split(timer, "T")
		if len(timer1) == 2 {
			timer = timer1[0] + " " + timer1[1]
		}
		timer2 := strings.Split(timer, "Z")
		if len(timer2) == 2 {
			timer = timer2[0] + " " + timer2[1]
			v.CreatedPost = timer
			Allpost[i].CreatedPost = timer
		}
		ComPost, _ := bd.DataNbrCom(BD, v.Id)
		v.N_com = len(ComPost)
		Allpost[i].N_com = len(ComPost)
		bd.SelectNbrCom(BD, v)
	}

	//calcule du nombre de like
	AllLiked, err6 := DataAllLikedPosts(BD, presentUser.Id)
	if err6 != nil {
		//fmt.Println("error 1:", err)
		return structs.All_Forum{}
	}

	var Nlike int
	for _, v := range AllLiked {
		Nlike += v.N_like
	}

	var tab structs.Mylike
	tab.N_like = Nlike
	All_Forum.Mylike = []structs.Mylike{}
	All_Forum.Mylike = append(All_Forum.Mylike, tab)

	All_Forum.MyMsg = bd.DataAllMessage(BD)

	if err0 != nil || err1 != nil || err2 != nil || err4 != nil || err5 != nil {
		fmt.Println("error: ", err0)
		return structs.All_Forum{}
	}
	return All_Forum
}
