const URL = "https://ferronia.pythonanywhere.com/"



fetch(URL + 'jugadores')
    .then(function (response) {
        if (response.ok) {
            return response.json(); 
    } else {
           
            throw new Error('Error al obtener los jugadores.');
        }
    })
    .then(function (data) {
        let tablaJugadores = document.getElementById('tablaJugadores');


       
        for (let jugador of data) {
            let fila = document.createElement('tr');
            fila.innerHTML = '<td>' + jugador.codigo + '</td>' +
                '<td>' + jugador.nombre + '</td>' +
                '<td>' + jugador.apellido + '</td>' +
                '<td>' + jugador.pais + '</td>' +
                '<td align="right">' + jugador.edad + '</td>' +
                '<td align="right">' + jugador.juego + '</td>' +
                '<td><img src=https://www.pythonanywhere.com/user/ferronia/files/home/ferronia/static/img/' + jugador.imagen_url +' alt="Imagen del jugador" style="width: 100px;"></td>' +
                '<td align="right">' + jugador.discord + '</td>';
            
            
            tablaJugadores.appendChild(fila);
        }
    })
    .catch(function (error) {
        // En caso de error
        alert('Error al agregar el jugador.');
        console.error('Error:', error);
    })
