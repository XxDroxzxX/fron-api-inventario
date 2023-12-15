//funciones para operaciones crud del usuario
const urlApiitems = "http://localhost:8081/items";
const headersitems= {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.token}`
};

function listaritems(){
    validaToken();
    var settings={
        method: 'GET',
        headers: headersitems,
    }
    fetch(urlApiitems, settings)
    .then(response => response.json())
    .then(function(itemss){
        
            var articulos = '';
            for(const items of itemss){
                articulos += `
                <tr>
                    <th scope="row">${items.id}</th>
                    <td>${items.nameitems}</td>
                    <td>${items.price}</td>
                    <td>${items.stock}</td>
                    <td>${items.category.nameCategory}</td>
                    <td>
                    <a href="#" onclick="verModificaritems('${items.id}')" class="btn btn-outline-warning">
                        <i class="fa-solid fa-user-pen"></i>
                    </a>
                    <a href="#" onclick="veritems('${items.id}')" class="btn btn-outline-info">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                    </td>
                </tr>`;
                
            }
            document.getElementById("listaritems").innerHTML = articulos;
    })
}

function verModificaritems(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:headersitems,
    }
    fetch(urlApiitems+"/"+id, settings)
    .then(items => items.json())
    .then(function(items){
            var cadena='';
                var settingsCategory = {
                    method: 'GET',
                    headers: headersitems,
                };
                fetch(urlApiCategory, settingsCategory)
                    .then(categories => categories.json())
                    .then(function (categories) {
                var cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modify items</h1>
                </div>
              
                <form action="" method="post" id="modificar">
                    <input type="hidden" name="id" id="id" value="${items.id}">
                    <label for="nameitems" class="form-label">Name</label>
                    <input type="text" class="form-control" name="nameitems" id="nameitems" required value="${items.nameitems}"> <br>
                    <label for="description"  class="form-label">Description</label>
                    <input type="text" class="form-control" name="description" id="description" required value="${items.description}"> <br>
                    <label for="price"  class="form-label">Price</label>
                    <input type="text" class="form-control" name="price" id="price" required value="${items.price}"> <br>
                    <label for="stock" class="form-label">Stock</label>
                    <input type="number" class="form-control" name="stock" id="stock" required value="${items.stock}"> <br>
                    <label for="idCategory" class="form-label">Categoría</label>
                        <select class="form-control" name="idCategory" id="idCategory" required>
                        ${categories.map(category => `<option value="${category.idCategory}" ${items.category.idCategory === category.idCategory ? 'selected' : ''}>${category.nameCategory}</option>`).join('')}
                        </select> <br>
                    <button type="button" class="btn btn-outline-warning" onclick="modificaritems('${items.id}')">Modificar</button>
                </form>`;
            
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalitems'))
            myModal.toggle();
        });
    })
}

async function modificaritems(id){
    validaToken();
    var myForm = document.getElementById("modificar");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApiitems+"/"+id, {
        method: 'PUT',
        headers:headersitems,
        body: JSON.stringify(jsonData)
    });
    if(request.ok){
        alertas("The items has been modified successfully!",1)
        listaritems();
    }
    else{
        const data = await request.json(); // Espera a que la promesa se resuelva
        console.log(data); // Aquí puedes manejar la data de la respuesta
        const dataArray = Object.values(data);
        console.log(dataArray); // Aquí puedes manejar la data de la respuesta
        var dataResponse='';
        for(var v of dataArray){
            dataResponse += "<li>"+v+"</li>";
        }

        alertas("Error: <br>"+dataResponse, 2)
    }
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalitems')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function veritems(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:headersitems,
    }
    fetch(urlApiitems+"/"+id, settings)
    .then(items => items.json())
    .then(function(items){
            var cadena='';
            if(items){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Información de items</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">Name: ${items.nameitems}</li>
                    <li class="list-group-item">Description: ${items.description}</li>
                    <li class="list-group-item">Price: ${items.price}</li>
                    <li class="list-group-item">Stock: ${items.stock}</li>
                    <li class="list-group-item">Stock: ${items.category.nameCategory}</li>
                </ul>`;
              
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalitems'))
            myModal.toggle();
    })
}

async function registeritems(idCategoryEnlc){
    var idCategoryEnlc = document.getElementById("idCategoryEnlc").value;

    var myForm = document.getElementById("registerFormitems");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApiitems+ "/" + idCategoryEnlc, {
        method: 'POST',
        headers:headersitems,
        body: JSON.stringify(jsonData)
    });
    if(request.ok){
        alertas("items registered", 1);
        listaritems();
    }
    else{
        const data = await request.json(); // Espera a que la promesa se resuelva
        console.log(data); // Aquí puedes manejar la data de la respuesta
        const dataArray = Object.values(data);
        console.log(dataArray); // Aquí puedes manejar la data de la respuesta
        var dataResponse='';
        for(var v of dataArray){
            dataResponse += "<li>"+v+"</li>";
        }

        alertas("Error: <br>"+dataResponse, 2)
    }
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalitems')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function createitemsForm(){
    validaToken();
    const urlApiCategory = "http://localhost:8088/categories";
    const settingsCategory = {
        method: 'GET',
        headers: headersitems, // Asegúrate de tener esta variable definida y configurada
    };
    fetch(urlApiCategory, settingsCategory)
    .then(category => category.json())
    .then(function (category) {
        var cadena = '';
        if (category) {
            console.log(category);
            cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5"><i class="fa-solid fa-user-pen"></i>items Register</h1>
            </div>
              
            <form action="" method="post" id="registerFormitems">
                <input type="hidden" name="id" id="id">
                <label for="nameitems" class="form-label"> Name</label>
                <input type="text" class="form-control" name="nameitems" id="nameitems" required> <br>
                <label for="description"  class="form-label">Description</label>
                <input type="text" class="form-control" name="description" id="description" required> <br>
                <label for="price"  class="form-label">Price</label>
                <input type="text" class="form-control" name="price" id="price" required> <br>
                <label for="stock" class="form-label">Stock</label>
                <input type="number" class="form-control" name="stock" id="stock" required> <br>
                <label for="idCategoryEnlc" class="form-label">Categoría</label>
                        <select class="form-control" name="idCategoryEnlc" id="idCategoryEnlc" required>
                            <option value="" disabled selected>Seleccionar</option>
                            ${category.map(category => `<option value="${category.idCategory}">${category.nameCategory}</option>`).join('')}
                        </select>
                        <br>
                <button type="button" class="btn btn-outline-info" onclick="registeritems()">Register</button>
            </form>`;
        }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalitems'))
            myModal.toggle();
        });
}