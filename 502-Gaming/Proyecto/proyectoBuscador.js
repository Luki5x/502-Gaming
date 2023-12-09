// function funcionBuscar() {
//     var elementoBuscado = document.getElementById("juego");
//     var titulo = elementoBuscado.value;

//     fetch(`https://www.cheapshark.com/api/1.0/deals?title=${titulo}`)
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);

//         for (let i = 0; i < data.length; i++) {
//             const elemento = data[i];
//             const juego = `<div class="description">
//                 <h1>${elemento.title}</h1>
//                 <h2>Precio de Oferta: $${elemento.salePrice}</h2>
//                 <h2>Precio Normal: $${elemento.normalPrice}</h2>
//                 <h2>Rating en Steam: ${elemento.steamRatingText}</h2>
//                 <h3><a href="https://www.cheapshark.com/redirect?dealID=${elemento.dealID}" target="_blank">Ir a Tienda</h3></a></div>
//                 <img src="${elemento.thumb}" width="200px"></img>`;

//             const nuevoDiv = document.createElement('div');
//             nuevoDiv.className = 'resultados';
//             nuevoDiv.innerHTML = juego;
//             document.body.appendChild(nuevoDiv);
//         }
//     });
// }