//structure
var userStruct = {
    Id: 0,
    Username: "",
    Lastname: "",
    Nickname: "",
    Age: 0,
    Genre: "",
    Mdp: "",
    Email: "",
    Actif: "",
    Role: "",
    Error: "",
}

//Booleen pour verifier si la requete et les messages sont bien reçus
var IsReceive = false;

//Variable
var Allcategorie
var data;
var Allsessions;
var mysession;
var Allpost = [];
var myMsg = [];
var pageActif = true;
var currentPage;
var newUser = userStruct //structure
const loadRegistration = () => {
    currentPage = "registration"
    if (pageActif) {
        register()
    } else if (!pageActif) {
        login()
    }
}

// Fonction pour récupérer la valeur d'un cookie par son nom à l'aide d'une regex
function getCookie(nomDuCookie) {
    // Utilise une regex pour rechercher le cookie dans document.cookie
    var regex = new RegExp("(^|; )" + nomDuCookie + "=([^;]*)");
    var correspondance = document.cookie.match(regex);

    // Retourne la valeur du cookie s'il est trouvé, sinon retourne null
    return correspondance ? decodeURIComponent(correspondance[2]) : null;
}

const getUser = (sessionUser) => {
    let user = sessionUser[getCookie("session")]
    return user
};

const fetchCookies = (user) => {
    var dataJson = DataJson
    dataJson.Object = "SessionExpired"
    dataJson.Data = user
    fetch("/", {
            method: "POST",
            body: JSON.stringify(dataJson)
        })
        .then(response => response.json())
        .then(data => {
            SendData();
            loadRegistration();
        })
        .catch(data => {

        })
}

//verifier avec un temps d'intervalle les cookies et renvoie  la page d connexion en cas de probleme
const verifyCookie = () => {
    if ((getCookie("session") != null) && (getCookie("session") != mysession && (currentPage === "index"))) {
        newUser.Actif = "false";
        fetchCookies(newUser);
    }

    if ((getCookie("session") == null) && (currentPage === "index")) {
        newUser.Actif = "false";
        fetchCookies(newUser)
    }
}

setInterval(() => {
    verifyCookie();
}, 2000);

const Decon = () => {
    var deconStruct = DataJson
    deconStruct.Object = "Decon"
    deconStruct.Data = newUser

    fetch("/", {
            method: "POST",
            body: JSON.stringify(deconStruct),
        })
        .then(response => response.json())
        .then(data => {
            // Gère la réponse du serveur
            SendData()
            loadRegistration();
            // Vous pouvez effectuer d'autres actions en fonction de la réponse du serveur
        })
        .catch(error => {
            console.error("Error:", error);
            // Gère les erreurs, le cas échéant
        });

}

var currentId = "";
const IdLikePost = (Id) => {
    currentId = Id
}

const AddComment = (Id) => {
    currentId = Id;
    document.getElementById(`CommentForm ${currentId}`).addEventListener("submit", function(event) {
        event.preventDefault();
        var comment = document.getElementsByName(`Comment ${currentId}`)[0];
        var commentId = currentId;
        var newCom = ComStruct
        newCom.Comment = comment.value
        newCom.CommentId = commentId.toString()
        var newDataJSON = DataJson
        newDataJSON.Object = "Add Comment"
        newDataJSON.Data = newCom
        comment.value = ""
        fetch("/", {
                method: "POST",
                body: JSON.stringify(newDataJSON),
            })
            .then(response => response.json())
            .then(data => {
                // Gère la réponse du serveur
                if (data.Type == "com") {
                    AllError(data)
                } else {
                    var receive = document.getElementById("StatusCom")
                    if (receive != null) {
                        receive.innerHTML = `Com added`
                        receive.style.backgroundColor = "green"
                        receive.style.fontWeight = "bolder"
                        receive.style.color = "white"
                        SendData()
                    }
                }

                // Vous pouvez effectuer d'autres actions en fonction de la réponse du serveur
            })
            .catch(error => {
                console.error("Error:", error);
                // Gère les erreurs, le cas échéant
            });

        //SendData()
    })
}

const LikePOst = (Id) => {
    currentId = Id
        // document.getElementById(`LikeForm ${currentId}`).addEventListener("submit", function(event) {
    var like_PostId = currentId.toString()

    var newLike = LikePost
    newLike.like_PostId = like_PostId

    var newDataJSON = DataJson
    newDataJSON.Object = "likePost"
    newDataJSON.Data = newLike

    fetch("/", {
            method: "POST",
            body: JSON.stringify(newDataJSON),
        })
        .then(response => response.json())
        .then(data => {
            // Traiter la réponse du serveur
            SendData()
                // Mettre à jour l'interface utilisateur avec le nombre de likes, par exemple :
                //document.getElementById("likesCount").innerText = data.likes.toString();
        })
        .catch(error => {
            console.error("Error:", error);
            // Gère les erreurs, le cas échéant
        });

    // })

}

const LikeCom = (Id) => {
    currentId = Id
        // document.getElementById(`LikeForm ${currentId}`).addEventListener("submit", function(event) {
    var like_ComId = currentId.toString()

    var newLike = LikeComs
    newLike.like_PostId = like_ComId

    var newDataJSON = DataJson
    newDataJSON.Object = "likeCom"
    newDataJSON.Data = newLike

    fetch("/", {
            method: "POST",
            body: JSON.stringify(newDataJSON),
        })
        .then(response => response.json())
        .then(data => {
            // Traiter la réponse du serveur
            SendData()
                // Mettre à jour l'interface utilisateur avec le nombre de likes, par exemple :
                //document.getElementById("likesCount").innerText = data.likes.toString();
        })
        .catch(error => {
            console.error("Error:", error);
            // Gère les erreurs, le cas échéant
        });

    // })

}

const DisLikeCom = (Id) => {
    currentId = Id
        // document.getElementById(`LikeForm ${currentId}`).addEventListener("submit", function(event) {
    var like_ComId = currentId.toString()

    var newLike = LikeComs
    newLike.like_PostId = like_ComId

    var newDataJSON = DataJson
    newDataJSON.Object = "dislikeCom"
    newDataJSON.Data = newLike

    fetch("/", {
            method: "POST",
            body: JSON.stringify(newDataJSON),
        })
        .then(response => response.json())
        .then(data => {
            // Traiter la réponse du serveur

            SendData()
                // Mettre à jour l'interface utilisateur avec le nombre de likes, par exemple :
                //document.getElementById("likesCount").innerText = data.likes.toString();
        })
        .catch(error => {
            console.error("Error:", error);
            // Gère les erreurs, le cas échéant
        });

    // })

}

const DisLikePOst = (Id) => {
    currentId = Id
    var like_PostId = currentId.toString()

    var newDisLike = LikePost
    newDisLike.like_PostId = like_PostId

    var newDataJSON = DataJson
    newDataJSON.Object = "dislikePost"
    newDataJSON.Data = newDisLike

    fetch("/", {
            method: "POST",
            body: JSON.stringify(newDataJSON),
        })
        .then(response => response.json())
        .then(data => {
            // Traiter la réponse du serveur
            SendData()
                // Mettre à jour l'interface utilisateur avec le nombre de likes, par exemple :
                //document.getElementById("likesCount").innerText = data.likes.toString();
        })
        .catch(error => {
            console.error("Error:", error);
            // Gère les erreurs, le cas échéant
        });

    // })
}

function Tri(list) {
    const usersCopy = [...list];

    for (let i = 0; i < usersCopy.length - 1; i++) {
        for (let j = i + 1; j < usersCopy.length; j++) {
            const usernameA = usersCopy[i].Nickname.toUpperCase();
            const usernameB = usersCopy[j].Nickname.toUpperCase();

            if (usernameA > usernameB) {
                const temp = usersCopy[i];
                usersCopy[i] = usersCopy[j];
                usersCopy[j] = temp;
            }
        }
    }

    return usersCopy
}


function TriByFirstMsg(newUser, myMsg) {
    var actif = true
    var oldmsg = []
    var newmsg = []
    myMsg.forEach(msg => {
        if (msg.UserClient == newUser.Nickname || msg.MyUsernames == newUser.Nickname) {
            oldmsg.push(msg)
        }
    })

    for (let i = oldmsg.length - 1; i >= 0; i--) {
        for (let j = 0; j < newmsg.length; j++) {
            if ((oldmsg[i].MyUsernames == newmsg[j]) || (oldmsg[i].MyUsernames == newUser.Nickname)) {
                actif = false
                break
            }
        }
        if (actif) {
            newmsg.push(oldmsg[i].MyUsernames)
        }
        actif = true
    }
    return newmsg
}

function ListUser(abcUser, lastuser) {
    var actif = true
    var newTab = []

    for (let j = 0; j < lastuser.length; j++) {
        for (let i = 0; i < abcUser.length; i++) {
            if (abcUser[i].Nickname == lastuser[j]) {
                // actif = false
                newTab.push(abcUser[i])
                break
            }
        }

    }
    for (let i = 0; i < abcUser.length; i++) {
        for (let j = 0; j < newTab.length; j++) {
            if (abcUser[i].Nickname == newTab[j].Nickname) {
                actif = false
                break
            }
        }
        if (actif) {
            newTab.push(abcUser[i])
        }
        actif = true
    }
    return newTab
}

const NewPage = async(data) => {
        Allpost = data.Posts
        mysession = getCookie("session")
        currentPage = "index"
        Allsessions = data.Allsessions
        myMsg = data.MyMsg
            //info user
        newUser.Id = getUser(data.Allsessions).Id;
        newUser.Username = getUser(data.Allsessions).Username;
        newUser.Lastname = getUser(data.Allsessions).Lastname;
        newUser.Nickname = getUser(data.Allsessions).Nickname;
        newUser.Age = getUser(data.Allsessions).Age;
        newUser.Genre = getUser(data.Allsessions).Genre;
        newUser.Mdp = getUser(data.Allsessions).Mdp;
        newUser.Email = getUser(data.Allsessions).Email;
        newUser.Actif = getUser(data.Allsessions).Actif;
        newUser.Role = getUser(data.Allsessions).Role;
        newUser.Error = getUser(data.Allsessions).Error;
        var userConn = data.Users
        var noms = Tri(data.Users)
        data.Users = noms
        let userg = data.MyMsg
        if (userg != null) {
            var trienoms = TriByFirstMsg(newUser, data.MyMsg)
            userConn = ListUser(noms, trienoms)
        }
        const index = userConn.findIndex(user => user.Nickname === newUser.Nickname);
        if (index !== -1) {
            userConn.splice(index, 1);
        }
        //init All param

        var hidden = "";
        var Mylike = "";
        var isConnected = "";
        var NbrLike = 0;
        var NbrPost = 0;
        var NbrCom = 0;
        //Verifier si la taille de l'utilisateur est null ou non
        if (newUser.Username.length == 0) {
            hidden = "hidden";
            Mylike = "hidden"
        }

        //Verifier si la taille de Isconnected est null ou non
        if (newUser.Username.length > 0) {
            isConnected = "hidden";
        }
        if (data.Mylike != null) {
            NbrLike = data.Mylike.length
        }
        if (data.MyCom != null) {
            NbrCom = data.MyCom.length
        }
        if (data.MyPost != null) {
            NbrPost = data.MyPost.length
        }
        var oldSection = document.querySelector("body > section");
        if (oldSection !== null) {
            oldSection.remove();
            closeChatBox()
        }

        var section = document.createElement("section")
        section.innerHTML = `
        <nav>
        <div class="container">
            <a id="update">
                <div class="logo">
                    <i class="uil uil-layer-group"></i>
                    <h2 style="text-decoration: none;">Forum 01</h2>
                </div>
            </a>
           
            <div class="options">
                <div>
                    <button class="button signin" name="submit" onclick="Decon()" >Deconnection</button>
                </div>
            </div>
        </div>
    </nav>
        <section class="body-container">
                <div class="haut">
                    <div class="first-square">
                        <div class="infos-profile">
                            <div class="username-infos">
                                <div class="username-img">
                                    <img src="/static/images/avatar.jpeg" width="38" height="38" style="border-radius: 50%;" alt="">
                                </div>
                                <div class="username">
                                    <span>${newUser.Username}</span>
                                    <p>${newUser.Username}</p>
                                </div>
                            </div>

                            <div id="cacher1" class="${hidden}">
                                <div class="username-stats">
                                    
                                    <div class="stat following">
                                        <h5 id="nbrcom">${NbrCom}</h5>
                                        <span>Com</span>
                                    </div>
                                    <div class="stat posts">
                                        <h5 id="nbrpost">${NbrPost}</h5>
                                        <span>Post</span>
                                    </div>
                                </div>
                            </div>
                            <div id="isConnected" class="${isConnected}">
                                <div class="alarme">
                                    <h5>You're not connected!</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="fifth-square">
                            <!-- fifth-square -->
                            <div class="Post-elements">
                                <!-- <form action="/" method="POST">   -->
                                <div id="StatusPost"></div>
                                <form action="/" method="POST" id="PostDiv">
                                        <!-- <img src="/static/img/avatar.jpeg" width="38" height="38" style="border-radius: 50%;" alt=""> -->
                                        <div class="share-elements">
                                            <div class="post-input">
                                                <input type="text" class="titre" value="" name="title" placeholder="Title" required>
                                            </div> 
                                            <div class="post-inpu">
                                                <textarea type="text" name="body" placeholder="What's on your mind" required></textarea>
                                            </div>
                                        </div>
                                        <div class="cate"><span>Categories </span></div>
                                    <div class="Post-options">
                                        <div class="options">
                                            <div class="options-img">
                                                <label for="l1">
                                                    <i class="uil uil-football"></i>
                                                    <input type="checkbox" id="l1" name="categorie1" checked value="Sport">
                                                        <b>Sport</b>
                                                    </label>
                                            </div>
                                            <div class="options-attachement">
                                                <label for="l2">
                                                    <i class="uil uil-music"></i>
                                                    <input type="checkbox" id="l2" name="categorie2" value="Musique">
                                                        <b>Musique</b> 
                                                    </label>
                                            </div>
                                            <div class="options-video">
                                                <label for="l3">
                                                    <i class="uil uil-book-reader"></i>
                                                    <input type="checkbox" id="l3" name="categorie3" value="Manga">
                                                        <b>Manga</b> 
                                                    </label>  
                                            </div>
                                            <div class="options-hashtag">
                                                <label for="l4">
                                                    <i class="uil uil-medkit"></i>
                                                    <input type="checkbox" id="l4" name="categorie4" value="Sante">
                                                        <b>Sante</b> 
                                                    </label>
                                            </div>
                                            <div class="options-mention">
                                                <label for="l5">
                                                    <i class="uil uil-palette"></i>
                                                    <input type="checkbox" id="l5" name="categorie5" value="Arts">
                                                        <b>Arts</b> 
                                                    </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="button-shar">
                                        <input type="submit" class="buttone" name="submit" value="Post">
                                    </div>
                
                                </form>
                                <!-- </form> -->
                            </div>
                    </div>
                    <div class="sixth-square">
                        <div class="view-post-container">
                        </div>
                    </div>
                    <div class="forth-square">
                        <div class="special">
                            <br>
                            <div>
                                <h1>
                                    <span>Filter: </span>
                                    <i class="fas fa-filter"></i>
                                </h1>
                                
                            </div>
                            <hr>
                            <div class="navigation">
                                <div class="filbycat">
                                    <h4>Filter by Categories</h4>
                                </div>
                                <form action="/" method="POST" id="filterEvent">
                                    <ul style="text-decoration: none; list-style: none;align-items: center;justify-content: center;text-align: center;">
                                        <li>
                                            <label for="A1">
                                                <i class="uil uil-football"></i>
                                                <b>Sport</b>
                                                <input type="radio" id="A1" name="categorie" value="Sport">
                                            </label>
                                        </li>
                                        <li> <label for="A2">
                                        <i class="uil uil-music"></i>
                                        <b>Music </b>
                                        <input type="radio" id="A2" name="categorie" value="Musique">
                                        </label></li>
                                        <li><label for="A3">
                                        <i class="uil uil-book-reader"></i>
                                        <b>Manga</b> 
                                        <input type="radio" id="A3" name="categorie" value="Manga">
                                        </label></li>
                                        <li><label for="A4">
                                        <i class="uil uil-medkit"></i>
                                        <b>Sante</b> 
                                        <input type="radio" id="A4" name="categorie" value="Sante">
                                        </label></li>
                                        <li><label for="A5">
                                        <i class="uil uil-palette"></i>
                                        <b>Arts  </b> 
                                        <input type="radio" id="A5" name="categorie" value="Arts">
                                        </label></li>
                                    </ul>
                                    <br>
                                    <input type="submit" name="submit" value="Filter by category" id="roro"/>
                                </form>
                            </div>
                            <hr>
                            <div class="navigation">
                                <div class="filbycat">
                                    <br><br><br>
                                    <h4>Filter by Liked Posts</h4>
                                </div>
                                <div class="page-container">
                                    <div class="pages">
                                        <form id="filterLikePosts">
                                            <input type="submit" name="submit" value="Filter by Like" class="sub">
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <div class="navigation">
                                <div style="display: flex;align-items: center;justify-content: center;">
                                    <br><br><br>
                                    <h4>Filter by Created Posts</h4>
                                </div>
                                <div class="page-container">
                                    <div class="pages">
                                        <form id="filterCreatedPosts">
                                            <input type="submit" name="submit" value="Filter by Created Post" class="sub">
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
                <div id="test2" class="test2">
                             ${userConn.map(user => {
        var backgroundColor = user.Actif === 'true' ? 'green' : '#858785';
        return `<h1 onclick="ChatBox('${user.Nickname}', '${newUser.Nickname}')" > <img src="/static/images/avatar.jpeg" width="38" height="38" style="border-radius: 50%; cursor: pointer;" alt="" > <span id="profil" width="20" style="color: #070606;bottom: 12px; ">
                           ${user.Nickname} </h1> <div class="numero" id="typing${user.Nickname}"></div> <div class="numero" id="lenMsg${user.Nickname}"></div> <div id="ligne" style=" height: 12px; width: 6%; border-radius: 6px; background-color: ${backgroundColor};"></div></span>`
    }).join('<br/>')}
                    </div>
            </section>`;
    var link1 = document.createElement("link")
    var link2 = document.createElement("link")
    link1.href = "/static/style.css"
    link1.rel = "stylesheet"
    link2.href = "https://unicons.iconscout.com/release/v4.0.8/css/line.css"
    link2.rel = "stylesheet"
    document.head.append(link1)
    document.head.append(link2)
    document.body.append(section)
    AllReplacePost(data)
    data.Users.map(user => { MsgNotSee(user.Nickname) })

    document.getElementById("PostDiv").addEventListener("submit", function (event) {
        event.preventDefault();
        var title = document.getElementsByName("title")[0]
        var body = document.getElementsByName("body")[0]
        var categorie1 = document.getElementsByName("categorie1")[0];
        var categorie2 = document.getElementsByName("categorie2")[0];
        var categorie3 = document.getElementsByName("categorie3")[0];
        var categorie4 = document.getElementsByName("categorie4")[0];
        var categorie5 = document.getElementsByName("categorie5")[0];
        var Allcategorie = []
        Allcategorie.push(categorie1, categorie2, categorie3, categorie4, categorie5);
        var newCategorie = [];
        var isChecked = false
        Allcategorie.forEach((e) => {
            if (!e.checked) {
                newCategorie.push("")
            } else {
                newCategorie.push(e.value)
                isChecked = true
                e.checked = false
            }
        })
        categorie1.checked = true
        if (!isChecked) {
            var errorPost = document.getElementById("StatusPost")
            if (errorPost != null) {
                errorPost.innerHTML = `Choose at least one category !`
                return
            }
        }

        categorie1 = newCategorie[0]
        categorie2 = newCategorie[1]
        categorie3 = newCategorie[2]
        categorie4 = newCategorie[3]
        categorie5 = newCategorie[4]

        var newPost = PostStruct
        newPost.Title = title.value
        newPost.Body = body.value
        newPost.Categorie1 = categorie1
        newPost.Categorie2 = categorie2
        newPost.Categorie3 = categorie3
        newPost.Categorie4 = categorie4
        newPost.Categorie5 = categorie5

        title.value = ""
        body.value = ""

        var newDataJSON = DataJson
        newDataJSON.Object = "Post"
        newDataJSON.Data = newPost

        fetch("/", {
            method: "POST",
            body: JSON.stringify(newDataJSON),
        })
            .then(response => response.json())
            .then(data => {
                if (data.Type == "post") {
                    AllError(data)
                } else {
                    var receive = document.getElementById("StatusPost")
                    if (receive != null) {
                        receive.innerHTML = `Post added`
                        receive.style.backgroundColor = "green"
                        receive.style.fontWeight = "bolder"
                        receive.style.color = "white"
                    }
                    // AllReplacePost(data)
                    // ReplaceCom(data)
                }
                // Gère la réponse du serveur
                // Vous pouvez effectuer d'autres actions en fonction de la réponse du serveur
            })
            .catch(error => {
                console.error("Error:", error);
                // Gère les erreurs, le cas échéant
            });

    })

    document.getElementById("filterEvent").addEventListener("submit", function (event) {
        event.preventDefault();
        var A1 = document.getElementById("A1")
        var A2 = document.getElementById("A2")
        var A3 = document.getElementById("A3")
        var A4 = document.getElementById("A4")
        var A5 = document.getElementById("A5")
        var Allcategorie = []
        Allcategorie.push(A1, A2, A3, A4, A5);
        var newFilter = FilterCategorie
        Allcategorie.forEach((e) => {
            if (e.checked) {
                checkEmpty = true
                newFilter.Filter = e.value
            }
        })
        var newData = DataJson
        newData.Object = "Filter by category"
        newData.Data = newFilter

        fetch("/", {
            method: "POST",
            body: JSON.stringify(newData),
        })
            .then(reponse => reponse.json())
            .then(data => {
                ReplacePost(data)
            })
            .catch(error => {
                console.log(error);
            })
    })

    document.getElementById("filterCreatedPosts").addEventListener("submit", function (event) {
        event.preventDefault();

        var newData = DataJson
        newData.Object = "Filter by Created Post"


        fetch("/", {
            method: "POST",
            body: JSON.stringify(newData)
        })
            .then(reponse => reponse.json())
            .then(data => {
                ReplacePost(data)
            })
            .catch(error => {
                console.log(error);
            })

    })

    document.getElementById("filterLikePosts").addEventListener("click", function (event) {
        event.preventDefault();

        var newData = DataJson
        newData.Object = "Filter by Like"


        fetch("/", {
            method: "POST",
            body: JSON.stringify(newData)
        })
            .then(reponse => reponse.json())
            .then(data => {
                ReplacePost(data)

            })
            .catch(error => {
                console.log(error);
            })

    })

    document.getElementById("update").addEventListener("click", function (event) {
        event.preventDefault()
        var newData = DataJson
        newData.Object = "update"
        fetch("/", {
            method: "POST",
            body: JSON.stringify(newData)
        })
            .then(response => response.json())
            .then(data => {
                NewPage(data)
            })
            .catch(error => {
                console.log(error);
            })
    })
    var Alltitre = document.getElementsByClassName('postTitle')
    var AllPost = document.getElementsByClassName('postAll')
    var Allcom = data.Coms
    for (let i = 0; i < Alltitre.length; i++) {
        Alltitre[i].innerText = data.Posts[i].Title;
        AllPost[i].innerText = data.Posts[i].Body;
        Allcom.forEach(com => {
            if (com.Posts_id == data.Posts[i].Id) {
                data.Users.forEach(user => {
                    if (user.Id == com.Users_id) {
                        var Username = document.getElementsByClassName(`User${com.Id}`)[0]
                        var comBody = document.getElementsByClassName(`comBody${com.Id}`)[0]
                        Username.innerText = user.Nickname;
                        comBody.innerText = com.Body;
                    }
                })
            }
        })
    }
}

const ReplaceCom = (data) => {
    var Allcom = data.Coms
    var myPost = data.Posts
    var classCom = document.getElementsByClassName("Allcom")
    var nbrCom = document.getElementsByClassName("nbrOfcom")
    for (let i = myPost.length - 1; i >= 0; i--) {
        let post = myPost[i]
        classCom[i].textContent = ""
        classCom[i].innerHTML = `  ${data.Coms ? data.Coms.filter(com => com.Posts_id === post.Id).map(com => `
        ${data.Users.filter(user => user.Id === com.Users_id).map(user => ` 
            <div class="col-6" id="${com.Id}">
                <div class="comment">
                    <img src="/static/images/avatar.jpeg" width="38" height="38" style="border-radius: 50%;" alt="">
                    <span style="font-weight: bolder;font-size: 24px;" class="User${com.Id}"></span>
                    <br><br>
                    <p style="font-size: 20px;color: black;margin-left: 10px;font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;" class="comBody${com.Id}"></p>
                    <br>
                </div>
                <!--End Comment-->
                <form  id="ComLike ${com.Id}" >
                    <div class="like appreciation">
                        <input type="text" style="display: none;" name="id_ComL" value="${com.Id}">
                        <button type="button" onclick="LikeCom(${com.Id})" value="likeCom" name="submit"><i class="uil uil-heart"></i></button>
                        <span id="ComCount" value="${com.Id}">${com.N_like}</span>
                    </div>
                </form>
                <form  id="ComDisLike ${com.Id}" >
                    <div class="dislike appreciation">
                        <input type="text" style="display: none;" name="id_ComD" value="${com.Id}">
                        <button type="button" onclick="DisLikeCom(${com.Id})" value="dislikeCom" name="submit" >   
                            <i class="uil uil-thumbs-down"></i>
                        </button>
                        <span id="disComCount" value="${com.Id}">${com.N_dislike}</span>
                    </div>
                </form>
            </div>
            <br>
            <hr>
            <br>
            <!--End col -->
            `).join('')}
            `).join('') : ''}`
    }
    for (let i = 0; i < myPost.length; i++) {
        Allcom.forEach(com => {
            if (com.Posts_id == data.Posts[i].Id) {
                data.Users.forEach(user => {
                    if (user.Id == com.Users_id) {
                        var Username = document.getElementsByClassName(`User${com.Id}`)[0]
                        var comBody = document.getElementsByClassName(`comBody${com.Id}`)[0]
                        Username.innerText = user.Nickname;
                        comBody.innerText = com.Body;
                    }
                })
            }
        })
        nbrCom[i].textContent = ""
        nbrCom[i].innerHTML = data.Posts[i].N_com
    }
}

const ReplacePost = (data) => {
    var viewPost = document.getElementsByClassName("view-post-container")[0]
    viewPost.textContent = ""
    viewPost.innerHTML = ` ${data.Posts ? data.Posts.map(post => `
    <div class="view-post">
                    <div class="post-header" id="P ${post.Id}">
                        <div class="post-username">
                            <img src="/static/images/avatar.jpeg" width="38" height="38" style="border-radius: 50%;" alt="" >
                            <div class="post-user-infos">
                            ${data.Users.map(user => `
                            <span style="font-size: 28px;color: black;margin-left: 10px;font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;">
                            ${post.Users_id === user.Id ? user.Username : ''}
                        </span> 
                            `).join('')}
                                <p style="font-size: 10px;color: blue;margin-left: 10px;margin-top:10px;font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;">${post.CreatedPost}</p>
                            </div>
                        </div>
                    </div>
                    <div class="post-container">
                        <div class="post-titre">
                            <div class="post-text">
                                <p style="font-size: 25px;color: black;margin-left: 10px;font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;"><span class="postTitle"></span></p>
                            </div>
                        </div>
                        <div class="post-text">
                            <p style="font-size: 18px;color: black;margin-left: 10px;font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;margin-top: 15px;"><span class="postAll"></span></p>
                        </div>
                    </div>
                </div>
  `).join('') : ''}`
    var Alltitre = document.getElementsByClassName('postTitle')
    var AllPost = document.getElementsByClassName('postAll')
    for (let i = 0; i < Alltitre.length; i++) {
        Alltitre[i].innerText = data.Posts[i].Title;
        AllPost[i].innerText = data.Posts[i].Body;
    }
}

const AllReplacePost = (data) => {
    var viewPost = document.getElementsByClassName("view-post-container")[0]
    viewPost.textContent = ""
    viewPost.innerHTML = `  ${data.Posts ? data.Posts.map(post => `
    <div id="StatusCom"></div>
    <div class="view-post">
                    <div class="post-header" id="P ${post.Id}">
                        <div class="post-username">
                            <img src="/static/images/avatar.jpeg" width="38" height="38" style="border-radius: 50%;" alt="" >
                            <div class="post-user-infos">
                            ${data.Users.map(user => `
                            <span style="font-size: 28px;color: black;margin-left: 10px;font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;">
                            ${post.Users_id === user.Id ? user.Username : ''}
                        </span> 
                            `).join('')}
                                <p style="font-size: 10px;color: blue;margin-left: 10px;margin-top:10px;font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;">${post.CreatedPost}</p>
                            </div>
                        </div>
                    </div>
                    <div class="post-container">
                        <div class="post-titre">
                            <div class="post-text">
                                <p style="font-size: 25px;color: black;margin-left: 10px;font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;"><span class="postTitle"></span></p>
                            </div>
                        </div>
                        <div class="post-text">
                            <p style="font-size: 18px;color: black;margin-left: 10px;font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;margin-top: 15px;"><span class="postAll"></span></p>
                        </div>
                    </div>
                    <div class="post-footer">
                        <div class="post-body">
                            <div class="appreciations" >
                                <div class="comment appreciation" >
                                    <button onclick="afficher('${post.Id}');">
                                        <i class="uil uil-comment-dots" style="font-size: 23px; color: black;"></i>
                                    </button>
                                    <span style="font-size: 23px; color: black;" class="nbrOfcom">${post.N_com}</span>
                                    <span style="font-size: 23px;color: black;">comments</span>
                                </div>
                                <form  id="LikeForm ${post.Id}">
                                    <div class="like appreciation">
                                        <input type="text" style="display: none;" name="id_PostL ${post.Id}" value="${post.Id}">
                                        <!-- <input type="button" class="likePost" name="submit" value="likePost"> -->
                                        
                                        <button type="button" onclick="LikePOst(${post.Id})" value="likePost" name="submit" style="font-size: 23px; color: black;"><i class="uil uil-thumbs-up"></i></button>
                                        <span id="likesCount" value="${post.Id}" style="font-size: 23px; color: black;">${post.N_like}</span>
                                    </div>
                                </form>
                                <form id="DisLikeForm ${post.Id}">
                                    <div class="dislike appreciation" id="${post.Id}">
                                        <input type="text" style="display: none;" name="id_PostD ${post.Id}" value="${post.Id}">
                                        <button type="button" onclick="DisLikePOst(${post.Id})" value="dislikePost" name="submit" style="font-size: 23px; color: black;"><i class="uil uil-thumbs-down"></i>
                                        </button>
                                        <span id="dislikesCount" value="${post.Id}" style="font-size: 23px; color: black;">${post.N_dislike}</span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="app" style="display: none;" id="com ${post.Id}">
                        <div class="container-comment">
                            <div class="row">
                                <div class="col-6 controller">
                                    <form action="/" method="POST" id="CommentForm ${post.Id}">
                                        <textarea type="text" name="Comment ${post.Id}" class="input" placeholder="Write a comment" required></textarea>
                                        <input type="text" name="id" style="display: none;" value="${post.Id}">
                                        <input class="primaryContained float-right" onclick="AddComment(${post.Id})" type="submit" name="submit" value="Add Comment">
                                    </form>
                                </div>
                                <!-- End col -->
                            </div>
                            <!--End Row -->
                            <div class="row Allcom">
                            ${data.Coms ? data.Coms.filter(com => com.Posts_id === post.Id).map(com => `
                            ${data.Users.filter(user => user.Id === com.Users_id).map(user => ` 
                                <div class="col-6" id="${com.Id}">
                                    <div class="comment">
                                        <img src="/static/images/avatar.jpeg" width="38" height="38" style="border-radius: 50%;" alt="">
                                        <span style="font-weight: bolder;font-size: 24px;" class="User${com.Id}"></span>
                                        <br><br>
                                        <p style="font-size: 20px;color: black;margin-left: 10px;font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;" class="comBody${com.Id}"></p>
                                        <br>
                                    </div>
                                    <!--End Comment-->
                                    <form  id="ComLike ${com.Id}" >
                                        <div class="like appreciation">
                                            <input type="text" style="display: none;" name="id_ComL" value="${com.Id}">
                                            <button type="button" onclick="LikeCom(${com.Id})" value="likeCom" name="submit"><i class="uil uil-heart"></i></button>
                                            <span id="ComCount" value="${com.Id}">${com.N_like}</span>
                                        </div>
                                    </form>
                                    <form  id="ComDisLike ${com.Id}" >
                                        <div class="dislike appreciation">
                                            <input type="text" style="display: none;" name="id_ComD" value="${com.Id}">
                                            <button type="button" onclick="DisLikeCom(${com.Id})" value="dislikeCom" name="submit" >   
                                                <i class="uil uil-thumbs-down"></i>
                                            </button>
                                            <span id="disComCount" value="${com.Id}">${com.N_dislike}</span>
                                        </div>
                                    </form>
                                </div>
                                <br>
                                <hr>
                                <br>
                                <!--End col -->
                                `).join('')}
                                `).join('') : ''}
                            </div>
                            <!-- End row -->
                        </div>
                        <!--End Container -->
                    </div>
                    <!-- end App -->
                </div>
  `).join('') : ''}`
    var Alltitre = document.getElementsByClassName('postTitle')
    var AllPost = document.getElementsByClassName('postAll')
    for (let i = 0; i < Alltitre.length; i++) {
        Alltitre[i].innerText = data.Posts[i].Title;
        AllPost[i].innerText = data.Posts[i].Body;
    }
}

const AllError = (error) => {
    switch (error.Type) {
        case "login":
            var change = document.getElementById("ErrorLog")
            change.innerHTML = `${error.Msg}`
            break;
        case "register":
            var change = document.getElementById("ErrorReg")
            change.innerHTML = `${error.Msg}`
            break;
        case "post":
            var errorPost = document.getElementById("StatusPost")
            if (errorPost != null) {
                errorPost.innerHTML = `${error.Msg}, don't change the formular !`
            }
            break;
        case "com":
            var errorPost = document.getElementById("StatusCom")
            if (errorPost != null) {
                errorPost.innerHTML = `${error.Msg}, don't change the formular !`
                errorPost.style.backgroundColor = "red"
                errorPost.style.fontWeight = "bolder"
                errorPost.style.color = "white"
            }
            break;
        default:
            break;
    }
}

const FilterMsg = (Client, limitScroll) => {
    var mymsg = []
    let filtre = []
    if (myMsg != null) {
        myMsg.forEach(msg => {
            if ((msg.UserClient == Client || msg.MyUsernames == Client) && (msg.UserClient == newUser.Nickname || msg.MyUsernames == newUser.Nickname)) {
                mymsg.push(msg)
            }
        })
        for (let i = mymsg.length - 1; i >= 0; i--) {
            filtre.push(mymsg[i])
            limitScroll--
            if (limitScroll == 0) {
                break
            }
        }
        filtre = filtre.reverse()
    }
    return filtre
};

var clients = "";
var socket = new WebSocket('ws://localhost:8080/ws');

socket.addEventListener('message', async (event) => {
    data = await JSON.parse(event.data);
    Allpost = data.Posts
    myMsg = data.MyMsg;
    LoadData(data)
});

function closeChatBox(chat) {
    var chat = document.getElementById("Chatbox");
    if (chat != null) {
        var parent = chat.parentNode;
        parent.removeChild(chat);
        numberOfScroll = 10
    }
}

const ChatBox = (Client, MyUsername) => {
    var chat = document.getElementById("Chatbox")
    if (chat !== null) {
        var chat = document.getElementById("Chatbox");
        var parent = chat.parentNode;
        parent.removeChild(chat);
        numberOfScroll = 10
    }
    clients = Client

    var newChatBox = document.createElement("div")
    // newChatBox.id = Client
    newChatBox.id = "Chatbox"
    // Chatboxes[Client] = newChatBox

    newChatBox.style = "height : 500px; width :50%; background-color: #150110; position : fixed; left : 50%; top : 50%; transform: translate(-50%, -50%);"

    var closeButton = document.createElement("button")
    closeButton.innerHTML = "X"
    closeButton.style = "position: absolute; top: 0px; right: 1px; background-color: red; border: none; cursor: pointer; color: white; font-size: 20px; font-weight:bolder; width:4%; height:4.5% "
    closeButton.addEventListener("click", function (event) {
        // Fermer la boîte de chat
        clients = ""
        closeChatBox(chat);
    });

    var listMessage = document.createElement("div")
    listMessage.style = "background-color : black; height : 80%; width:100%"

    var divMsg = document.createElement("div")
    divMsg.id = "divMsgInput" + Client
    divMsg.style = "font-weight : bolder ; color: black; height : 400px; overflow: auto; padding: 1rem; background: #F7F7F7; flex-shrink: 2; box-shadow: inset 0 2rem 2rem -2rem rgba(0, 0, 0, 0.05), inset 0 -2rem 2rem -2rem rgba(0, 0, 0, 0.05);"
    var ligne = document.createElement("hr")

    //listMessage.appendChild(username)

    var contentMsg = document.createElement("div");
    contentMsg.id = "contenuMsg";
    contentMsg.style = "background: linear-gradient(249deg, rgba(0,19,36,1) 27%, rgba(9,82,121,0.6404762588629201) 88%, rgba(0,212,255,0) 100%); height : 500px; width : 100%; overflow-x: auto; overflow-y: auto; border:2px solid black; color:white; font-weight:bolder; font-size:100%";
    contentMsg.innerHTML = "<h2 style=\"margin-left:10px\">" + Client + "</h2 style=\"margin-left:10px\">";
    contentMsg.appendChild(ligne);
    contentMsg.appendChild(divMsg);

    var inputMsg = document.createElement("textarea")
    inputMsg.placeholder = "Write your message here"
    inputMsg.setAttribute("required", true)
    inputMsg.id = "msginput" + Client
    inputMsg.style = "margin-left:2%; width : 80%; height:50px; border: none; background-image: none;background-color: white;padding: 0.5rem 1rem;margin-right: 1rem;border-radius: 1.125rem;flex-grow: 2;box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1), 0rem 1rem 1rem -1rem rgba(0, 0, 0, 0.2);font-family: Red hat Display, sans-serif;font-weight: 400;letter-spacing: 0.025em;"

    var send = document.createElement("button")
    send.id = "Id" + Client
    send.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>`;
    send.style = "color : white; background-color : green; width :5%; transform: rotate(90deg); position:relative; top: -19px;"
    listMessage.appendChild(contentMsg)
    newChatBox.appendChild(listMessage)
    newChatBox.appendChild(inputMsg)
    newChatBox.appendChild(closeButton);
    newChatBox.appendChild(send)
    document.body.append(newChatBox)
    // openChatBox(Client)
    SendData()
    document.getElementById("Id" + Client).addEventListener("click", function (event) {
        SendData2(Client, MyUsername);
    })
    document.getElementById("msginput" + Client).addEventListener("keydown",  function (event) {
        typing(socket, newUser.Nickname, Client)
    })

}

var numberOfScroll = 10;
var limit = false;
var precedentHeight = 0;

function SendData2(Client, MyUsername) {
    //recuperer le message envoyer
    var mess = document.querySelector("#msginput" + Client)
    if (mess.value.length > 0) {
        //creer un objet json
        var jsondata = {
            UserClient: Client,
            MyUsernames: MyUsername,
            Msg: mess.value,
            Lu: "false"
        }
        mess.value = ""
        mess.placeholder = "Write your message here";
        socket.send(JSON.stringify(jsondata))
    } else {
        mess.placeholder = "You can't send an empty message !";
    }
}

function loadNewMessages() {
    //Chat Box chargement
    var contentMsg = document.getElementById("divMsgInput" + clients)
    let chat = document.getElementsByClassName("loader")[0]
    if (chat != null) {
        contentMsg.removeChild(chat);
    }
    if (contentMsg != null) {
        numberOfScroll += 10
        let msg = FilterMsg(clients, numberOfScroll)
        precedentHeight = contentMsg.scrollHeight;
        if (msg.length > 0) {
            contentMsg.innerHTML = '';
            // Parcourir chaque message et l'ajouter au conteneur de messages
            msg.forEach(e => {
                const messageDiv = document.createElement('div');
                var classeur = e.MyUsernames === newUser.Nickname ? 'message right' : 'ChatReceive left'
                messageDiv.className = classeur;
                var timer = e.CreatedMsg;
                timer = timer.replace("T", " ").replace("Z", "");
                e.CreatedMsg = timer;
                messageDiv.textContent = `${e.CreatedMsg}\n${e.MyUsernames} : ${e.Msg}`;
                contentMsg.appendChild(messageDiv);
                // Ajouter des sauts de ligne
                for (let i = 0; i < 3; i++) {
                    contentMsg.appendChild(document.createElement('br'));
                }
                if ((e.Lu != "true") && (e.MyUsernames != newUser.Nickname)) {
                    let dataJson = DataJson
                    dataJson.Object = "UpdateMsg"
                    dataJson.Data = e
                    fetch("/", {
                        method: "POST",
                        body: JSON.stringify(dataJson)
                    })
                        .then(response => response.json())
                        .then(data => {
                            myMsg = data.MyMsg
                            data.Users.map(user => { MsgNotSee(user.Nickname) })
                        })
                        .catch(data => {

                        })
                }
            });
            contentMsg.scrollTop = contentMsg.scrollHeight - precedentHeight
        } else {
            contentMsg.innerHTML = `Empty message`
        }
    }
}

const throttle = (func, delay) => {
    let isThrottled = false;
    let argsCache = null;

    return function () {
        const context = this;
        const args = arguments;

        if (!isThrottled) {
            // Si la fonction n'est pas throttled, sauvegardez les arguments
            isThrottled = true;
            argsCache = args;

            setTimeout(() => {
                // Appelez la fonction avec les arguments sauvegardés
                func.apply(context, argsCache);
                isThrottled = false; // Réinitialiser le throttle
                argsCache = null; // Effacer le cache d'arguments
            }, delay);
        }
    };
};

// Utilisation de la fonction throttle avec un délai de 500 millisecondes
const throttledLoadNewMessages = throttle(loadNewMessages, 2000);

function MsgNotSee(Client) {
    var nmbrMsg = 0
    if (myMsg != null) {
        myMsg.forEach(msg => {
            if (msg.MyUsernames == Client && msg.UserClient == newUser.Nickname) {
                if (msg.Lu == "false") {
                    nmbrMsg += 1
                }
            }
        })
    }

    var selectUser = document.getElementById(`lenMsg${Client}`)
    if (selectUser != null) {
        selectUser.innerHTML = nmbrMsg + " msg(s) non lue"
    }
}

const LoadData = async (data) => {
    if (data.Receiver != null){
        if (data.Receiver == newUser.Nickname){
            TypeRealTime(data)
            return
        }
        return
    }
    var allpost = data.Posts
    var allcom = data.Coms
    var userConn = data.Users
    var noms = Tri(userConn)
    if (data.MyMsg != null) {
        var trienoms = TriByFirstMsg(newUser, data.MyMsg)
        userConn = ListUser(noms, trienoms)
    }
    const index = userConn.findIndex(user => user.Nickname === newUser.Nickname);
    if (index !== -1) {
        userConn.splice(index, 1);
    }
    myMsg = data.MyMsg
    // //test2
    var test2 = document.getElementById("test2");
    if (test2 != null) {
        test2.innerHTML = ` ${userConn.map(user => {
            var backgroundColor = user.Actif === 'true' ? 'green' : '#858785';
            return `<h1 onclick="ChatBox('${user.Nickname}', '${newUser.Nickname}')" > <img src="/static/images/avatar.jpeg" width="38" height="38" style="border-radius: 50%; cursor: pointer;" alt="" > <span id="profil" width="20" style="color: #070606;bottom: 12px; ">
                               ${user.Nickname} </h1> <div class="numero" id="typing${user.Nickname}"></div> <div class="numero" id="lenMsg${user.Nickname}"></div> <div id="ligne" style=" height: 12px; width: 6%; border-radius: 6px; background-color: ${backgroundColor};"></div></span>`
          }).join('<br/>')}`;
    }

    //msg
    var contentMsg = document.getElementById("divMsgInput" + clients)
    if (contentMsg != null) {
        let msg = FilterMsg(clients, numberOfScroll)
        if (msg.length > 0) {
            contentMsg.innerHTML = '';
            // Parcourir chaque message et l'ajouter au conteneur de messages
            msg.forEach(e => {
                const messageDiv = document.createElement('div');
                var classeur = e.MyUsernames === newUser.Nickname ? 'message right' : 'ChatReceive left'
                messageDiv.className = classeur;
                var timer = e.CreatedMsg;
                timer = timer.replace("T", " ").replace("Z", "");
                e.CreatedMsg = timer;
                messageDiv.textContent = `${e.CreatedMsg}\n${e.MyUsernames} : ${e.Msg}`;
                contentMsg.appendChild(messageDiv);

                // Ajouter des sauts de ligne
                for (let i = 0; i < 3; i++) {
                    contentMsg.appendChild(document.createElement('br'));
                }
                if ((e.Lu != "true") && (e.MyUsernames != newUser.Nickname)) {
                    let dataJson = DataJson
                    dataJson.Object = "UpdateMsg"
                    dataJson.Data = e
                    fetch("/", {
                        method: "POST",
                        body: JSON.stringify(dataJson)
                    })
                        .then(response => response.json())
                        .then(data => {
                            myMsg = data.MyMsg
                            data.Users.map(user => { MsgNotSee(user.Nickname) })
                        })
                        .catch(data => {

                        })
                }

            });


        } else {
            contentMsg.innerHTML = `Empty message`
        }
        contentMsg.scrollTop = contentMsg.scrollHeight;

        contentMsg.addEventListener("scroll", function (event) {
            if (this.scrollTop === 0) {
                let chat = document.getElementsByClassName("loader")[0]
                if (chat == null) {
                    var loader = document.createElement("div")
                    loader.className = "loader"
                    contentMsg.append(loader)
                    contentMsg.scrollTop = 0;
                    // Récupération du premier enfant de l'élément parent (s'il en a un)
                    var firstChild = contentMsg.firstChild;
                    contentMsg.insertBefore(loader, firstChild)
                    throttledLoadNewMessages()
                }
            }
        })
    }
    data.Users.map(user => { MsgNotSee(user.Nickname) })

    var tablikePost = []
    var tabDislikePost = []
    //likepost
    var likePost = document.querySelectorAll("#likesCount")
    //dislikepost
    var dislikePost = document.querySelectorAll("#dislikesCount")
    if (likePost.length != 0) {
        likePost.forEach((e, i) => {
            let id = e.getAttribute('value')
            tablikePost.push(allpost[(allpost.length-1) - (id - 1)])
        })
    }

    if (dislikePost.length != 0) {
        dislikePost.forEach((e, i) => {
            let id = e.getAttribute('value')
            tabDislikePost.push(allpost[(allpost.length-1) - (id - 1)])
        })
    }
    if (likePost.length != 0) {
        tablikePost.forEach((e, i) => {
            likePost[i].innerHTML = e.N_like
        })
    }

    if (dislikePost.length != 0) {
        tabDislikePost.forEach((e, i) => {
            dislikePost[i].innerHTML = e.N_dislike
        })
    }

    var likeCom = document.querySelectorAll("#ComCount")
    var dislikeCom = document.querySelectorAll("#disComCount")

    var tabLikeCom = []
    var tabDisLikeCom = []

    if (likeCom.length != 0) {
        likeCom.forEach(function (element) {
            let id = element.getAttribute('value'); // Récupère la valeur de l'attribut 'value'
            tabLikeCom.push(allcom[id - 1]);
        });
    }

    if (dislikeCom.length != 0) {
        dislikeCom.forEach(function (element) {
            let id = element.getAttribute('value'); // Récupère la valeur de l'attribut 'value'
            tabDisLikeCom.push(allcom[id - 1]);
        });
    }

    if (likeCom.length != 0) {
        tabLikeCom.forEach((e, i) => {
            likeCom[i].innerHTML = e.N_like
        })
    }

    if (dislikeCom.length != 0) {
        tabDisLikeCom.forEach((e, i) => {
            dislikeCom[i].innerHTML = e.N_dislike
        })
    }

}

const ErrorPage = (Error) => {
    var oldSection = document.querySelector("body > section");
    if (oldSection !== null) {
        oldSection.remove();
        closeChatBox()
    }
    var section = document.createElement("section")
    section.innerHTML = `<div class="pos">
                <h1 class="err">Erreur:${Error.body}</h1>
            </div>`;
    document.body.append(section)

}

const LoginStruct = {
    Email: "",
    Mdp: "",
}

const RegisterStruct = {
    Username: "",
    Lastname: "",
    Nickname: "",
    Age: "",
    Genre: "",
    Mdp: "",
    ConfirmMdp: "",
    Email: "",
}

const PostStruct = {
    Title: "",
    Body: "",
    Categorie1: "",
    Categorie2: "",
    Categorie3: "",
    Categorie4: "",
    Categorie5: "",

}

const LikePost = {
    like_PostId: "",
}

const LikeComs = {
    like_ComId: "",
}

const ComStruct = {
    Comment: "",
    CommentId: "",
}

const DataJson = {
    Object: "",
    Data: {},
}

const FilterCategorie = {
    Filter: ""
}

const login = () => {
    pageActif = false

    var oldSection = document.querySelector("body > section");
    if (oldSection !== null) {
        oldSection.remove();
        closeChatBox()
    }
    var links = document.head.querySelectorAll("link");
    // Supprimer tous les éléments <link> dans la balise <head>
    links.forEach(function (link) {
        link.remove();
    });
    var section = document.createElement("section")
    section.innerHTML = `
                    <nav>
                    <div class="container">
                        <a onclick="login()">
                            <div class="logo">
                                <i class="uil uil-layer-group"></i>
                                <h2 style="text-decoration: none;">Forum 01</h2>
                            </div>
                        </a>
                    
                        <div class="options">
                            <div>
                                <form onclick="register()">
                                    <input type="submit" class="button signin" name="submit" value="Sign Up">
                                </form>
                            </div>
                        </div>
                    </div>
                </nav>
                    <div class="body-container">
                            <div class="login-decoration-container">
                                <div class="human">
                                    <h1>Sign In To Join Us</h1>
                                </div>
                                <div></div>
                                <div></div>
                            </div>
                            <div class="login-card-container">
                                <div class="login-card">
                                    <form class="login-card-form" id="myForm" action="/" method="POST">
                                        <div class="form-item email-field">
                                            <i class="uil uil-user user-icon"></i>
                                            <input type="text" name="Email" placeholder="Email or Nickname" class="email-input" id="email-input" required>
                                        </div>
                                        <div class="form-item password-field">
                                            <div class="password-overlay" id="password-overlay"> </div>
                                            <i class="uil uil-lock password-lock-icon"></i>
                                            <input type="password" name="Mdp" placeholder="Password..." class="password-input" id="password-input" required>
                                            <i class="uil uil-eye-slash toggle-visibility-icon"></i>
                                        </div>
                                        <input type="submit" name="submit" class="thesignin" value="Sign In" />
                                    </form>
                                    <p id="ErrorLog"></p>
                                </div>
                            </div>
                        </div>`;
    var link1 = document.createElement("link")
    var link2 = document.createElement("link")
    var link3 = document.createElement("link")
    link1.href = "/static/login.css"
    link1.rel = "stylesheet"
    link2.href = "https://unicons.iconscout.com/release/v4.0.8/css/line.css"
    link2.rel = "stylesheet"
    link3.href = "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
    link3.rel = "stylesheet"
    document.head.append(link1)
    document.head.append(link2)
    document.head.append(link3)
    document.body.append(section)
    document.body.append(section)

    document.getElementById("myForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Empêche le formulaire de se soumettre normalement

        var email = document.getElementsByClassName("email-input")[0].value;
        var mdp = document.getElementsByClassName("password-input")[0].value;
        var newLogin = LoginStruct
        newLogin.Email = email,
            newLogin.Mdp = mdp
        // Attribution des données
        var newDataJSON = DataJson
        newDataJSON.Object = "Login"
        newDataJSON.Data = newLogin
        //var formData = new FormData(event.target);

        // Effectue une requête Fetch vers le serveur Go
        fetch("/", {
            method: "POST",
            body: JSON.stringify(newDataJSON),
        })
            .then(response => response.json())
            .then(dataForm => {
                if (dataForm.Msg != undefined) {
                    AllError(dataForm)
                } else {
                    // Gère la réponse du serveur
                    NewPage(dataForm);
                    SendData();
                }
                // Vous pouvez effectuer d'autres actions en fonction de la réponse du serveur
            })
            .catch(error => {
                WriteError = ""
                console.error("Error:", error);
                // Gère les erreurs, le cas échéant
            });

        //SendData()
    });
}

const SignIn = () => {
    var email = document.getElementsByName("Email")[0]
    var mdp = document.getElementsByName("Mdp")[0]
    var packet = ["SignIn", email.value, mdp.value]
    socket.send(packet)
}

//register func
const register = () => {
    pageActif = true

    var oldSection = document.querySelector("body > section");
    if (oldSection !== null) {
        oldSection.remove();
        closeChatBox()
    }
    var links = document.head.querySelectorAll("link");
    // Supprimer tous les éléments <link> dans la balise <head>
    links.forEach(function (link) {
        link.remove();
    });
    var section = document.createElement("section")
    section.innerHTML = `
<nav>
<div class="container">
<a onclick="register()">
    <div class="logo">
        <i class="uil uil-layer-group"></i>
        <h2 style="text-decoration: none;">Forum 01</h2>
    </div>
</a>

<div class="options">
    <div>
        <form onclick="login()">
            <input type="submit" class="button signin" name="submit" value="Sign In">
        </form>
    </div>
</div>
</div>
</nav>
<div class="body-container">
    <div class="login-decoration-container">
        <div class="human">
            <h1>Sign Up To Join Us</h1>
        </div>
        <div></div>
        <div></div>
    </div>
    <div class="login-card-container">
        <div class="login-card">
            <form class="login-card-form" id="MyForm" action="/" method="POST">
                <div class="form-item email-field">
                    <i class="uil uil-user user-icon"></i>
                    <input type="text" name="Username" placeholder="firstname" class="email-input" id="email-input"
                    required>
                </div>
                <div class="form-item email-field">
                    <i class="uil uil-user user-icon"></i>
                    <input type="text" name="Lastname" placeholder="lastname" class="email-input" id="email-input"
                    required>
                </div>
                <div class="form-item email-field">
                    <i class="uil uil-user user-icon"></i>
                    <input type="text" name="Nickname" placeholder="nickname" class="email-input" id="email-input"
                    required>
                </div>
                <div class="form-item email-field">
                <i class="uil uil-user user-icon"></i>
                <input type="number" name="Age" placeholder="Age" class="email-input" value="18" id="email-input" oninput="checkPositiveValue(this)"
                required>
                </div>
                <div class="form-item email-field">
                    <i class="uil uil-envelope-alt user-icon"></i>
                    <input type="text" name="Email" placeholder="Email" class="email-input" id="email-input"
                    required>
                </div>
                <div class="form-item password-field">
                    <div class="password-overlay" id="password-overlay"> </div>
                    <i class="uil uil-lock password-lock-icon"></i>
                    <input type="password" name="Mdp" placeholder="password..." class="password-input" id="password-input"
                    required>
                    <i class="uil uil-eye-slash toggle-visibility-icon"></i>
                </div>
                <div class="form-item confirmation-password-field">
                    <div class="confirmation-password-overlay" id="confirmation-password-overlay"> </div>
                    <i class="uil uil-lock password-lock-icon"></i>
                    <input type="password" name="confirmMdp" placeholder="Confirmation password..." class="confirmation-password-input" id="confirmation-password-input"
                    required>
                    <i class="uil uil-eye-slash toggle-visibility-secondicon"></i>
                </div>
                <div class="form-item email-field">
                <label for="gender">Choose your gender:</label>
                <select id="gender" name="gender">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                </div>
                <div>
            <p id="ErrorReg"></p>
        </div>
                <input class="sasa" name="submit" value="Sign Up" type="submit" />
            </form>
        </div>
    </div>
</div>`;
    var link1 = document.createElement("link")
    var link2 = document.createElement("link")
    var link3 = document.createElement("link")
    link1.href = "../static/register.css"
    link1.rel = "stylesheet"
    link2.href = "https://unicons.iconscout.com/release/v4.0.8/css/line.css"
    link2.rel = "stylesheet"
    link3.href = "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
    link3.rel = "stylesheet"
    document.head.append(link1)
    document.head.append(link2)
    document.head.append(link3)
    document.body.append(section)

    document.getElementById("MyForm").addEventListener("submit", function (event) {
        event.preventDefault();
        let Username = document.getElementsByName("Username")[0].value;
        let Lastname = document.getElementsByName("Lastname")[0].value;
        let Nickname = document.getElementsByName("Nickname")[0].value;
        let Age = document.getElementsByName("Age")[0].value;
        let Genre = document.getElementsByName("gender")[0].value;
        let Mdp = document.getElementsByName("Mdp")[0].value;
        let ConfirmMdp = document.getElementsByName("confirmMdp")[0].value;
        let Email = document.getElementsByName("Email")[0].value;

        var newRegister = RegisterStruct
        newRegister.Username = Username
        newRegister.Lastname = Lastname
        newRegister.Nickname = Nickname
        newRegister.Age = Age
        newRegister.Genre = Genre
        newRegister.Mdp = Mdp
        newRegister.ConfirmMdp = ConfirmMdp
        newRegister.Email = Email

        var newDataJSON = DataJson
        newDataJSON.Object = "Register"
        newDataJSON.Data = newRegister

        fetch("/", {
            method: "POST",
            body: JSON.stringify(newDataJSON),
        })
            .then(response => response.json())
            .then(dataForm => {
                // Gère la réponse du serveur
                if (dataForm.Msg != undefined) {
                    AllError(dataForm)
                } else {
                    // Gère la réponse du serveur
                    //data= dataForm
                    NewPage(dataForm)
                    SendData();
                }
                // Vous pouvez effectuer d'autres actions en fonction de la réponse du serveur
            })
            .catch(error => {
                // Gère les erreurs, le cas échéant
                console.error("Error:", error);
            });
        //SendData()
    })

}

//fixer la valeur minimum de l'age
function checkPositiveValue(input) {
    // Récupérer la valeur actuelle de l'input
    let currentValue = parseInt(input.value, 10);

    // Vérifier si la valeur est négative
    if (currentValue < 18) {
        // Si la valeur est négative, réinitialiser à zéro
        input.value = 18;
    }
}

const SendData = () => {
    var message = "update"
    socket.send(message)
}

const GetUrl = () => {
    var currentUrl = window.location.href;

    // Divisez l'URL en segments en utilisant le slash comme délimiteur
    var segments = currentUrl.split('/');

    // Récupérez le dernier segment (après le dernier slash)
    var lastSegment = segments[segments.length - 1];
    return lastSegment
}

var update = DataJson
update.Object = "update"

document.addEventListener("DOMContentLoaded", function () {
    var BodyError = {
        body: ""
    }
    if (GetUrl() == "") {
        // Votre code ici
        if (getCookie("session") != null) {
            //SendData()
            //socket.addEventListener('message', async(event) => {
            fetch("/", {
                method: "POST",
                body: JSON.stringify(update)
            })
                .then(async response => response.json())
                .then(async data => {
                    // Gère la réponse du serveur
                    if (currentPage == "index") {
                        LoadData(data)
                    } else {
                        NewPage(data)
                    }
                    // Vous pouvez effectuer d'autres actions en fonction de la réponse du serveur
                })
                .catch(error => {
                    console.error("Error:", error);
                    // Gère les erreurs, le cas échéant
                });

            const dislikeForms = document.querySelectorAll('[id^="DisLikeForm"]');
            dislikeForms.forEach(form => {
                form.addEventListener("submit", function (event) {
                    event.preventDefault();
                    const postId = form.id.split(" ")[1]; // Récupérer l'ID à partir de l'ID du formulaire
                    DisLikePOst(postId);
                });
            });
            const likeForms = document.querySelectorAll('[id^="LikeForm"]');
            likeForms.forEach(form => {
                form.addEventListener("submit", function (event) {
                    event.preventDefault();
                    const postId = form.id.split(" ")[1]; // Récupérer l'ID à partir de l'ID du formulaire
                    LikePOst(postId);
                });
            });
            const dislikeComs = document.querySelectorAll('[id^="ComDisLike"]');
            dislikeComs.forEach(form => {
                form.addEventListener("submit", function (event) {
                    event.preventDefault();
                    const postId = form.id.split(" ")[1]; // Récupérer l'ID à partir de l'ID du formulaire
                    DisLikeCom(postId);
                });
            });
            const likeComs = document.querySelectorAll('[id^="ComLike"]');
            likeComs.forEach(form => {
                form.addEventListener("submit", function (event) {
                    event.preventDefault();
                    const postId = form.id.split(" ")[1]; // Récupérer l'ID à partir de l'ID du formulaire
                    LikeCom(postId);
                });
            });
            //})
        } else {
            if (currentPage != "registration") {
                loadRegistration()
            }
        }
    } else {
        BodyError.body = "404"
        ErrorPage(BodyError)
    }
});

const typingStruct = {
    sender: "",
    receiver: "",
    msg: "",
}
 const typing = async (socket, sender, receiver) => {
    var currentTyping = typingStruct;
    currentTyping.sender = sender;
    currentTyping.receiver = receiver;
    currentTyping.msg = " is typing..."
    socket.send(JSON.stringify(currentTyping))
}

var idTyping=null;

 const TypeRealTime = async (data) => {
    if (idTyping != null) {
        clearTimeout(idTyping)
    }
    let test2 = document.getElementById(`lenMsg${data.Sender}`);
    if (test2 != null) {
        test2.style.display = "none"
        var typing = document.getElementById(`typing${data.Sender}`);
        typing.textContent = ""
        typing.textContent = `${data.Sender}${data.Msg}`
    }
    var contentMsg = document.getElementById("divMsgInput" + clients)
    if (contentMsg != null){
        if (clients== data.Sender){
        let typingchat = document.getElementById("typingchat")
        if (typingchat==null){
            animationMessage(contentMsg)
        }
       } 
    }
    idTyping = setTimeout(() => {
        if (typing != null) {
            typing.textContent = ""
                //afficher le nbr de msg
            var lenMsg = document.getElementById(`lenMsg${data.Sender}`);
            lenMsg.style.display = "block"
        }
    }, 1000);
}

const animationMessage=(chat)=>{
    // Création des éléments
    const typingAnimation = document.createElement('div');
    typingAnimation.id="typingchat"
    typingAnimation.classList.add('typing-animation');

    for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    typingAnimation.appendChild(dot);
    }

    // Ajout de l'animation au corps du document
    chat.appendChild(typingAnimation);
    setTimeout(() => {
       let divtyping= document.getElementById("typingchat")
       if (divtyping!=null){
        var parent = divtyping.parentNode;
        parent.removeChild(divtyping);
       }
    }, 1000);
}