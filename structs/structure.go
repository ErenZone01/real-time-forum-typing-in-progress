package structs

type Users struct {
	Id       int
	Username string
	Lastname string
	Nickname string
	Age      int
	Genre    string
	Mdp      string
	Email    string
	Actif    string
	Role     string
	Error    string
}

type Typing struct {
	Sender   string
	Receiver string
	Msg      string
}

type PostStruct struct {
	Title      string `json:"Title"`
	Body       string `json:"Body"`
	Categorie1 string `json:"Categorie1"`
	Categorie2 string `json:"Categorie2"`
	Categorie3 string `json:"Categorie3"`
	Categorie4 string `json:"Categorie4"`
	Categorie5 string `json:"Categorie5"`
}
type CommentStruct struct {
	Comment   string `json:"Comment"`
	CommentId string `json:"CommentId"`
}
type LikePostStruct struct {
	Like_PostId string `json:"like_PostId"`
}
type LikeComStruct struct {
	Like_ComId string `json:"like_ComId"`
}
type RegisterStruct struct {
	Username   string `json:"Username"`
	Lastname   string `json:"Lastname"`
	Nickname   string `json:"Nickname"`
	Age        string `json:"Age"`
	Genre      string `json:"Genre"`
	Mdp        string `json:"Mdp"`
	ConfirmMdp string `json:"ConfirmMdp"`
	Email      string `json:"Email"`
}

type LoginStruct struct {
	Email    string `json:"Email"`
	Mdp      string `json:"Mdp"`
	Nickname string `json:"Nickname"`
}

type DataJson struct {
	Object string      `json:"Object"`
	Data   interface{} `json:"Data"`
}

type Message struct {
	Id       int    `json:"Id"`
	Username string `json:"Username"`
	Lastname string `json:"Lastname"`
	Nickname string `json:"Nickname"`
	Age      int    `json:"Age"`
	Genre    string `json:"Genre"`
	Mdp      string `json:"Mdp"`
	Email    string `json:"Email"`
	Actif    string `json:"Actif"`
	Role     string `json:"Role"`
	Error    string `json:"Error"`
}

type Error struct {
	Type  string
	Msg   string
	Title string
	Body  string
}

type Session struct {
	Id       int
	Users_id int
	Value    string
}

type Posts struct {
	Id          int
	Title       string
	Body        string
	N_like      int
	N_dislike   int
	N_com       int
	Users_id    int
	Filter      int
	CreatedPost string
}

type All_Forum struct {
	Users            []Users
	Posts            []Posts
	Coms             []Comments
	Mylike           []Mylike
	MyPost           []Posts
	FilterLiked      []Posts
	MyCom            []Comments
	Utilisateur      []Users
	FilterCategories []Posts
	Allsessions      map[string]Users
	MyMsg            []MsgSend
}

type FilterCategories struct {
	Filter string `json:"Filter"`
}

type Mylike struct {
	N_like int
}

type Comments struct {
	Id        int
	Body      string
	N_like    int
	N_dislike int
	Users_id  int
	Posts_id  int
}

type Appreciation_com struct {
	Id       int
	Like     string
	Dislike  string
	Users_id int
	Coms_id  int
}

type Appreciation_post struct {
	Id       int
	Like     string
	Dislike  string
	Users_id int
	Posts_id int
}

type Categories struct {
	Id       int
	Types    string
	Posts_id int
}

type MsgSend struct {
	Id          int
	UserClient  string
	MyUsernames string
	Msg         string
	Lu          string
	CreatedMsg  string
}
