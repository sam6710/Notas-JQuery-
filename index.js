if(localStorage.recordatorios != null)
    var recordatorios = JSON.parse(localStorage.getItem("recordatorios"))
else
    var recordatorios = [];

var recordatorios_pendientes = 0;

$(document).ready(function(){

    var cant_recordatorios = recordatorios.length;

    //Enter
        $(input).keypress(function(e){
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode == "13") {
                AnadirRecordatorio();
                e.preventDefault();
                cant_recordatorios ++;
                recordatorios_pendientes ++;
                $("#cantidad_pendientes").text(`${recordatorios_pendientes} pendientes de ${cant_recordatorios}`);
            }
        });
        
    //Si hay localStorage lo muestra
    if(localStorage.recordatorios != null){
        mostrarLocalStorage();
    }

    //Marcar recordatorio como hecho
    $("#lista").on("click", "#hecho", function(){
        var recordatorio = recordatorios[$(this).parent().index()]; 
        if(recordatorio.completado == false){
            recordatorio.completado = true;
            recordatorios_pendientes --;
            $(this).css("border-color", "black");
            $(this).siblings().css("text-decoration", "line-through");
        }
        else{
            recordatorio.completado = false;
            recordatorios_pendientes ++;
            $(this).css("border-color", "white");
            $(this).siblings().css("text-decoration", "none");
        }
        localStorage.recordatorios = JSON.stringify(recordatorios);
        $("#cantidad_pendientes").text(`${recordatorios.length + recordatorios_pendientes} pendientes de ${cant_recordatorios}`)
    });

    //Borrar recordatorio
    $("#lista").on("click", ".fa-square-minus", function(){
        $(this).fadeOut("normal", function(){
            $(this).parent().remove()
        });
        recordatorios.splice($(this).parent().parent().index(), 1);
        localStorage.recordatorios = JSON.stringify(recordatorios);
        cant_recordatorios --;
        recordatorios_pendientes --;

        if(recordatorios_pendientes > 0){
            $("#cantidad_pendientes").text(`${recordatorios_pendientes} pendientes de un total de ${cant_recordatorios}`);
        } else {
            $("#cantidad_pendientes").text(`0 pendientes de un total de ${cant_recordatorios}`);
        }
    });

    //Borrar Tareas
    $("#borrarTareas").click(function(){
        for(var i = 0; i < recordatorios.length; i++){
            if(recordatorios[i].completado == true){
                var li = $("li");
                li[i].remove();
                i --;
                recordatorios.splice(i+1, 1);
            }
        }
        localStorage.recordatorios = JSON.stringify(recordatorios);
        $("#cantidad_pendientes").text(`${recordatorios_pendientes} pendientes de ${cant_recordatorios}`);
    });

    cambiarPrioridad();
});


//Función para añadir recordatorios
function AnadirRecordatorio(){
    var n_recordatorio = $("input").val();
    if(n_recordatorio != ""){
        var futuro_recordatorio = {
            contenido: n_recordatorio,
            prioridad: "normal",
            completado: false,
            date: Date.now()
        };
        var li = $(`<li id='recordatorio'><button id='hecho'></button><p id='contenido'>` + n_recordatorio + `</p><div id='prioridades'>Prioridad:<button class='prioridad' id='low'>↓Low</button><button class='prioridad' id='normal'>Normal</button><button class='prioridad' id='high'>High↑</button></div><div id='tiempo'><p>⌛Añadido hace ${Math.floor(((Date.now() - futuro_recordatorio.date)/1000)/60)} minutos</p></div><i class='fa-solid fa-square-minus'></i></li>`);
        $("ul").append(li);
        $("input").val("");
        recordatorios.push(futuro_recordatorio);
        localStorage.recordatorios = JSON.stringify(recordatorios);
    }
};

//Función para cambiar la prioridad
function cambiarPrioridad(){
    $("#lista").on("click", ".prioridad", function(){
        var index = $(this).parent().parent().index();
        $(this).css("background-color", "green");
        $(this).css("color", "white");
        $(this).siblings().css("background-color", "rgb(75, 75, 75)");
        $(this).siblings().css("color", "rgb(110, 110, 110)");
        recordatorios[index].prioridad = $(this).attr("id");
        localStorage.recordatorios = JSON.stringify(recordatorios);
    });
}

//Función para mostrar el localStorage
function mostrarLocalStorage(){
    var recordatorios = JSON.parse(localStorage.getItem("recordatorios"));
    var pendientes = 0;
    for(var i = 0; i < recordatorios.length; i++){
        var ul = $("ul");
        var li = $(`<li id='recordatorio'><button id='hecho'></button><p id='contenido'>` + recordatorios[i].contenido + `</p><div id='prioridades'>Prioridad:<button class='prioridad' id='low'>↓Low</button><button class='prioridad' id='normal'>Normal</button><button class='prioridad' id='high'>High↑</button></div><div id='tiempo'><p>⌛Añadido hace ${Math.floor(((Date.now() - recordatorios[i].date)/1000)/60)} minutos</p></div><i class='fa-solid fa-square-minus'></i></li>`);
        if(recordatorios[i].completado == false){
            $(li).find("#hecho").css("border-color", "white");
            $(li).find("#contenido").css("text-decoration", "none");
            pendientes ++;
        }
        else if(recordatorios[i].completado == true){
            $(li).find("#hecho").css("border-color", "black");
            $(li).find("#contenido").css("text-decoration", "line-through");
        }
        $(ul).append(li);
        if(recordatorios[i].prioridad == "low"){
            $(li).find("#low").css("background-color", "green");
            $(li).find("#low").css("color", "white");
        }
        else if(recordatorios[i].prioridad == "normal"){
            $(li).find("#normal").css("background-color", "green");
            $(li).find("#normal").css("color", "white");
        }
        else if(recordatorios[i].prioridad == "high"){
            $(li).find("#high").css("background-color", "green");
            $(li).find("#high").css("color", "white");
        }
    }
    var cant_pendientes = document.getElementById("cantidad_pendientes");
    $(cant_pendientes).text(`${pendientes} pendientes de un total de ${recordatorios.length}`);
}
