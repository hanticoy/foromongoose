let formulario = document.querySelector('#formulario')
let formulario2 = document.querySelector('#formulario2')
let btnSendMsg = document.querySelector('#btnSendMsg')

btnSendMsg.addEventListener('click', function() {
    formulario.method='post'
    formulario.action='/sendmsg'
    formulario.submit()
});

function navegar(userid,blogid){
    
    formulario2.method='post'
    formulario2.action='/newpost?id=' + userid + '&bid=' + blogid ;
    formulario2.submit()
}

// let linkEditar = document.querySelectorAll('#linkEditar')

// linkEditar.forEach(element => {
//     element.addEventListener('click', function() {
//         formulario.method='post'
//         formulario.action='/mongooses/showedit?id=' + element.name
//         console.log(formulario.action);
//         formulario.submit()
//     });
// });

// let linkVer = document.querySelectorAll('#linkVer')

// linkVer.forEach(element => {
//     element.addEventListener('click', function() {
//         formulario.method='post'
//         formulario.action='/mongooses/detail?id=' + element.name
//         console.log(formulario.action);
//         formulario.submit()
//     });
// });

// let linkEliminar = document.querySelectorAll('#linkEliminar')

// linkEliminar.forEach(element => {
//     element.addEventListener('click', function() {
//         formulario.method='post'
//         formulario.action='/mongooses/borrar?id=' + element.name
//         console.log(formulario.action);
//         formulario.submit()
//     });
// });

