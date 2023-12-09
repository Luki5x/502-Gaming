const URL = "https://ferronia.pythonanywhere.com/"


const app = Vue.createApp({ 
    data() {
        return {
            codigo: '',
            nombre: '',
            apellido: '',
            pais: '',
            edad: '',
            juego: '',
            discord: '',
            imagen_url: '',
            imagenUrlTemp: null,
            mostrarDatosJugador: false,
        };
    },


    methods: {
        obtenerJugador() {
            fetch(URL + 'jugadores/' + this.codigo)
                .then(response =>  {
                    if (response.ok) {
                        return response.json()
                    } else {
                        
                        throw new Error('Error al obtener los datos del jugador.')
                    }
                })


                .then(data => {
                    this.nombre = data.nombre;
                    this.apellido = data.apellido;
                    this.pais = data.pais;
                    this.edad = data.edad;
                    this.juego = data.juego;
                    this.discord = data.discord;
                    this.imagen_url =  data.imagen_url;
                    this.mostrarDatosJugador = true;
                })
                .catch(error => {
                    console.log(error);
                    alert('Código no encontrado.');
                })
        },
        seleccionarImagen(event) {
            const file = event.target.files[0];
            this.imagenSeleccionada = file;
            this.imagenUrlTemp = URL.createObjectURL(file); 
        },
        guardarCambios() {
            const formData = new FormData();
            formData.append('codigo', this.codigo);
            formData.append('nombre', this.nombre);
            formData.append('apellido', this.apellido);
            formData.append('pais', this.pais);
            formData.append('edad', this.edad);
            formData.append('juego', this.juego);
            formData.append('discord', this.discord);


            if (this.imagenSeleccionada) {
                formData.append('imagen', this.imagenSeleccionada, this.imagenSeleccionada.name);
            }


            
            fetch(URL + 'jugadores/' + this.codigo, {
                method: 'PUT',
                body: formData,
            })
            .then(response => {
               
                if (response.ok) {
                    return response.json()
                } else {
                   
                    throw new Error('Error al guardar los cambios del jugador.')
                }
            })
            .then(data => {
                alert('Jugador actualizado correctamente.');
                this.limpiarFormulario();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al actualizar el jugador.');
            });
        },
        limpiarFormulario() {
            this.codigo = '';
            this.nombre = '';
            this.apellido = '';
            this.pais = '';
            this.edad = '';
            this.juego = '';
            this.discord = '';
            this.imagen_url = '';
            this.imagenSeleccionada = null;
            this.imagenUrlTemp = null;
            this.mostrarDatosJugador = false;
        }
    }
});


app.mount('#app');
