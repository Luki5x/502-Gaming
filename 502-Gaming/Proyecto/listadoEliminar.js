const URL = "https://ferronia.pythonanywhere.com/"
const app = Vue.createApp({
    data() {
        return {
            jugadores: []
        }
    },
    methods: {
        obtenerJugadores() {
            
            fetch(URL + 'jugadores')
                .then(response => {
                    
                    if (response.ok) { return response.json(); }
                })
                .then(data => {
                    
                    this.jugadores = data;
                })
                .catch(error => {
                    console.log('Error:', error);
                    alert('Error al obtener los jugadores.');
                });
        },
        eliminarJugador(codigo) {
            if (confirm('¿Estás seguro de que quieres eliminar este jugador?')) {
                fetch(URL + `jugadores/${codigo}`, { method: 'DELETE' })
                    .then(response => {
                        if (response.ok) {
                            this.jugadores = this.jugadores.filter(jugador => jugador.codigo !== codigo);
                            alert('Jugador eliminado correctamente.');
                        }
                    })
                    .catch(error => {
                        alert(error.message);
                    });
            }
        }
    },
    mounted() {
        
        this.obtenerJugadores();
    }
});
app.mount('body');
