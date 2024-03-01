package serv

import (
	"fmt"
	"net/http"
	"strconv"

	"main.go/bd"
	"main.go/structs"
)

func CreatePost(w http.ResponseWriter, postJson structs.PostStruct, r *http.Request, Newuser structs.Users) bool {
	var title = postJson.Title
	var body = postJson.Body
	var categorie1 = postJson.Categorie1
	var categorie2 = postJson.Categorie2
	var categorie3 = postJson.Categorie3
	var categorie4 = postJson.Categorie4
	var categorie5 = postJson.Categorie5

	var Allcategorie = []string{categorie1, categorie2, categorie3, categorie4, categorie5}
	if !IsValid(title) || !IsValid(body) || (!IsValid(categorie1) && !IsValid(categorie2) && !IsValid(categorie3) && !IsValid(categorie4) && !IsValid(categorie5)) {
		return false
	}

	var post = structs.Posts{}
	post.Body = body
	post.Title = title
	post.Users_id = Newuser.Id
	bd.NewPost(BD, post)
	var post_bd, _ = bd.DataAllPost(BD)
	var newPost = post_bd[0]

	for _, v := range Allcategorie {
		if IsValid(v) {
			addCategorie(BD, v, newPost.Id)
		}
	}
	return true
}

func CreatCom(w http.ResponseWriter, f *http.Request, newCom structs.CommentStruct, user_id int) bool {
	var comment = newCom.Comment
	var id = newCom.CommentId
	var com = structs.Comments{}
	com.Body = comment
	if !IsValid(comment) {
		fmt.Println("le com est vide")
		return false
	}
	Id, err := strconv.Atoi(id)
	if err != nil {
		return false
	}
	com.Posts_id = Id
	com.Users_id = user_id
	bd.NewCom(BD, com)
	return true
}
