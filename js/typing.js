 const typingStruct = {
     sender: "",
     receiver: "",
     msg: "",
 }
 export const typing = (socket, sender, receiver) => {
     var currentTyping = typingStruct;
     currentTyping.sender = sender;
     currentTyping.receiver = receiver;
     currentTyping.msg = " is typing..."
     socket.send(currentTyping)
 }

 var idTyping;

 export const TypeRealTime = (data) => {
     if (idTyping != null) {
         clearTimeout(idTyping)
     }
     let test2 = document.getElementById(`lenMsg${newUser.Nickname}`);
     if (test2 != null) {
         test2.style.display = "none"
         var typing = document.getElementById(`typing${newUser.Nickname}`);
         typing.textContent = ""
         typing.textContent = `${data.Sender}${data.Msg}`
     }
     idTyping = setTimeout(() => {
         if (typing != null) {
             typing.textContent = ""
                 //afficher le nbr de msg
             var lenMsg = document.getElementById(`lenMsg${newUser.Nickname}`);
             lenMsg.style.display = "block"
             idTyping = null
         }
     }, 1000);
 }