from flask import Flask, request, jsonify
from flask import request
from flask_cors import CORS
import mysql.connector
from werkzeug.utils import secure_filename
import os
import time



app = Flask(__name__)
CORS(app)


class Jugadores:
    # Constructor de la clase
    def __init__(self, host, user, password, database):
       
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password
        )
        self.cursor = self.conn.cursor()
        
        
        try:
            self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:
            
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err


        self.cursor.execute('''CREATE TABLE IF NOT EXISTS jugadores (
            codigo INT PRIMARY KEY,
            nombre VARCHAR(255) NOT NULL,
            apellido VARCHAR(255) NOT NULL,
            pais VARCHAR(255) NOT NULL,
            edad INT NOT NULL,
            juego VARCHAR(255) NOT NULL,
            imagen_url VARCHAR(255),
            discord VARCHAR(255) NOT NULL)''')
        self.conn.commit()


        
        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)


    #----------------------------------------------------------------
    def listar_jugadores(self):
        self.cursor.execute("SELECT * FROM jugadores")
        jugadores = self.cursor.fetchall()
        return jugadores


    #----------------------------------------------------------------
    def consultar_jugador(self, codigo):
        
        self.cursor.execute(f"SELECT * FROM jugadores WHERE codigo = {codigo}")
        return self.cursor.fetchone()


    #----------------------------------------------------------------
    def mostrar_jugador(self, codigo):
       
        jugador = self.consultar_jugador(codigo)
        if jugador:
            print("-" * 40)
            print(f"Código....: {jugador['codigo']}")
            print(f"Nombre....: {jugador['nombre']}")
            print(f"Apellido..: {jugador['apellido']}")
            print(f"Edad......: {jugador['edad']}")
            print(f"Juego.....: {jugador['juego']}")
            print(f"Imagen....: {jugador['imagen_url']}")
            print(f"Discrod...: {jugador['discord']}")
            print("-" * 40)
        else:
            print("Jugador no encontrado.")
    #----------------------------------------------------------------
    def agregar_jugador(self, codigo, nombre, apellido, pais, edad, juego, imagen, discord):


        self.cursor.execute(f"SELECT * FROM jugadores WHERE codigo = {codigo}")
        jugador_existe = self.cursor.fetchone()
        if jugador_existe:
            return False
        
        sql = "INSERT INTO jugadores (codigo, nombre, apellido, pais, edad, juego, imagen_url, discord) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        valores = (codigo, nombre, apellido, pais, edad, juego, imagen, discord)
        self.cursor.execute(sql,valores)
        self.conn.commit()
        return True

    #----------------------------------------------------------------
    def eliminar_jugador(self, codigo):
       
        self.cursor.execute(f"DELETE FROM jugadores WHERE codigo = {codigo}")
        self.conn.commit()
        return self.cursor.rowcount > 0

    #----------------------------------------------------------------
    def modificar_jugador(self, codigo, nuevo_nombre, nuevo_apellido, nuevo_pais, nueva_edad, nuevo_juego, nueva_imagen, nuevo_discord):
        sql = "UPDATE jugadores SET nombre = %s, apellido = %s, pais = %s, edad = %s, juego = %s, imagen_url = %s, discord = %s WHERE codigo = %s"
        valores = (nuevo_nombre, nuevo_apellido, nuevo_pais, nueva_edad, nuevo_juego, nueva_imagen, nuevo_discord, codigo)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0



jugadores = Jugadores(host='ferronia.mysql.pythonanywhere-services.com', user='ferronia', password='502gaming', database='ferronia$jugadoresDB')


# Carpeta para guardar las imagenes
ruta_destino = '/home/ferronia/static/img/'


#--------------------------------------------------------------------
@app.route("/jugadores", methods=["GET"])
def listar_jugador():
    lista_jugadores = jugadores.listar_jugadores()
    return jsonify(lista_jugadores)


#--------------------------------------------------------------------
@app.route("/jugadores/<int:codigo>", methods=["GET"])
def mostrar_jugador(codigo):
    jugadores.mostrar_jugador(codigo)
    jugador = jugadores.consultar_jugador(codigo)
    if jugador:
        return jsonify(jugador)
    else:
        return "Jugador no encontrado", 404


@app.route("/jugadores", methods=["POST"])
def agregar_producto():
    codigo = request.form['codigo']
    nombre = request.form['nombre']
    apellido = request.form['apellido']
    pais = request.form['pais']
    edad = request.form['edad']
    juego = request.form['juego']
    imagen = request.files['imagen']
    discord = request.form['discord']
    nombre_imagen = secure_filename(imagen.filename)

    nombre_base, extension = os.path.splitext(nombre_imagen)
    nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}"
    imagen.save(os.path.join(ruta_destino, nombre_imagen))

    if jugadores.agregar_jugador(codigo, nombre, apellido, pais, edad, juego, nombre_imagen, discord):
       return jsonify({"mensaje": "Jugador agregado"}), 201
    else:
       return jsonify({"mensaje": "Jugador ya existe"}), 400

@app.route("/jugadores/<int:codigo>", methods=["DELETE"])
def eliminar_jugador(codigo):
    
    jugador = jugadores.consultar_jugador(codigo)
    if jugador:
        ruta_imagen = os.path.join(ruta_destino, jugador['imagen_url'])
        if os.path.exists(ruta_imagen):
            os.remove(ruta_imagen)

        if jugadores.eliminar_jugador(codigo):
            return jsonify({"mensaje": "Jugador eliminado"}), 200
        else:
            return jsonify({"mensaje": "Error al eliminar el jugador"}), 500
    else:
        return jsonify({"mensaje": "Jugador no encontrado"}), 404


@app.route("/jugadores/<int:codigo>", methods=["PUT"])
def modificar_jugador(codigo):
    
    nuevo_nombre = request.form.get("nombre")
    nuevo_apellido = request.form.get("apellido")
    nuevo_pais = request.form.get("pais")
    nueva_edad = request.form.get("edad")
    nuevo_juego = request.form.get("juego")
    nuevo_discord = request.form.get("discord")
  
    imagen = request.files['imagen']
    nombre_imagen = secure_filename(imagen.filename)

    nombre_base, extension = os.path.splitext(nombre_imagen)
    nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}"
    imagen.save(os.path.join(ruta_destino, nombre_imagen))

    if jugadores.modificar_jugador(codigo, nuevo_nombre, nuevo_apellido, nuevo_pais, nueva_edad, nuevo_juego, nombre_imagen, nuevo_discord):
        return jsonify({"mensaje": "Jugador modificado"}), 200
    else:
        return jsonify({"mensaje": "Jugador no encontrado"}), 404
    
   
if __name__ == "__main__":
    app.run(debug=True)
