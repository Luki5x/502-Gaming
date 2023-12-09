const URL = "https://ferronia.pythonanywhere.com/"



document.getElementById('formulario').addEventListener('submit', function (event) {
    event.preventDefault(); 


    var formData = new FormData();
    formData.append('codigo', document.getElementById('codigo').value);
    formData.append('nombre', document.getElementById('nombre').value);
    formData.append('apellido', document.getElementById('apellido').value);
    formData.append('pais', document.getElementById('pais').value);
    formData.append('edad', document.getElementById('edad').value);
    formData.append('juego', document.getElementById('juego').value);
    formData.append('imagen', document.getElementById('imagenJugador').files[0]);
    formData.append('discord', document.getElementById('discord').value);
    
    
    fetch(URL + 'jugadores', {
        method: 'POST',
        body: formData 
    })


    .then(function (response) {
        if (response.ok) { 
            return response.json(); 
        } else {
            
            throw new Error('Error al agregar el jugador.');
        }
    })
    
   
    .then(function () {
        
        alert('Jugador agregado correctamente.');
    })
    .catch(function (error) {
    
        alert('Error al agregar el jugador.');
        console.error('Error:', error);
    })
    .finally(function () {
        
        document.getElementById('codigo').value = "";
        document.getElementById('nombre').value = "";
        document.getElementById('apellido').value = "";
        document.getElementById('pais').value = "";
        document.getElementById('edad').value = "";
        document.getElementById('juego').value = "";
        document.getElementById('imagenJugador').value = "";
        document.getElementById('discord').value = "";
    });
})
