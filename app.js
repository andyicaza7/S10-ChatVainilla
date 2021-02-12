const botones=document.querySelector('#botones')
const nombreusuario=document.querySelector('#nombreusuario')
const contenidoprotegido=document.querySelector('#contenidoprotegido')
const formulario = document.querySelector('#formulario')
const inputchat =document.querySelector('#inputchat')
firebase.auth().onAuthStateChanged( user=>{
    if(user)
    {
        console.log(user)
        botones.innerHTML=/*html*/`  <button class="btn btn-outline-danger" id='btncerrarsesion' style="margin-right:15px">Cerrar Sesión</button>`
        nombreusuario.innerHTML=user.displayName
        cerrarsesion()
        formulario.classList = 'input-group py-3 fixed-bottom container'
        contenidoChat(user)
    }
    else
    {
        console.log('no exite user')
        botones.innerHTML = /*html*/ `<button class="btn btn-outline-success" id='btnacceder' style="margin-left:15px">Acceder</button>`
        iniciarsesion()
        nombreusuario.innerHTML='Chatear'
        contenidoprotegido.innerHTML=/*html*/` <p class="text-center lead mt-5">Debes de Iniciar Sesión</p>`
        formulario.classList = 'input-group py-3 fixed-bottom container d-none'
    }
})

const contenidoChat = (user) =>{
    formulario.addEventListener('submit',(e) =>{
        e.preventDefault()
        console.log(inputchat.value)
        if(!inputchat.value.trim())
        {
            console.log('input vacio')
            return
        }
        firebase.firestore().collection('chat').add({
            texto:inputchat.value,
            uid:user.uid,
            fecha: Date.now()
        })
            .then(res => {console.log('mensaje guardado')})
            .catch(e=> console.log(e))
            inputchat.value=''
    })
    firebase.firestore().collection('chat').orderBy('fecha').onSnapshot(query => {
        //console.log(query)
        contenidoprotegido.innerHTML =''
        query.forEach(doc =>{
            console.log(doc.data())
            if(doc.data().uid === user.uid)
            {
                contenidoprotegido.innerHTML += ` <div class="d-flex justify-content-end">
                <span class="badge rounded-pill bg-primary">${doc.data().texto}</span>
              </div>`
            }
            else
            {
                contenidoprotegido.innerHTML += ` <div class="d-flex justify-content-start">
                <span class="badge rounded-pill bg-secondary">${doc.data().texto}</span>
              </div>`
            }
            contenidoprotegido.scrollTop=contenidoprotegido.scrollHeight
        })
    })
}

const cerrarsesion = () =>{
    const btncerrarsesion = document.querySelector('#btncerrarsesion')
    btncerrarsesion.addEventListener('click', ()=>{
        firebase.auth().signOut()
    })
}


const iniciarsesion = () =>{
    const btnacceder = document.querySelector('#btnacceder')
    btnacceder.addEventListener('click', async() => {
        console.log('me diste click')
        try{
            const provider = new firebase.auth.GoogleAuthProvider()
            await firebase.auth().signInWithPopup(provider)
        }catch(error){
            console.log(error);
        }

    })
}