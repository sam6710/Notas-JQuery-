if(localStorage.recordatorios != null)
    var recordatorios = JSON.parse(localStorage.getItem("recordatorios"))
else
    var recordatorios = [];

$(document).ready(function(){

    var cant_recordatorios = recordatorios.length;
    var recordatorios_pendientes = 0;

    //Enter
    // var input = document.getElementById("input");
    // if(input.text != null){
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
    // }
        

    //Si hay localStorage lo muestra
    if(localStorage.recordatorios != null){
        mostrarLocalStorage();
    }

    //Marcar recordatorio como hecho
    $("#lista").on("click", "#hecho", function(){
        $(this).css("border-color", "black");
        $(this).siblings().css("text-decoration", "line-through");
        recordatorios_pendientes --;
        $("#cantidad_pendientes").text(`${recordatorios_pendientes} pendientes de ${cant_recordatorios}`)
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

    cambiarPrioridad();
});

//Función para añadir recordatorios
function AnadirRecordatorio(){
    var n_recordatorio = $("input").val();
    if(n_recordatorio != ""){
        var futuro_recordatorio = {
            contenido: n_recordatorio,
            prioridad: "normal",
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
    for(var i = 0; i < recordatorios.length; i++){
        var ul = $("ul");
        var li = $(`<li id='recordatorio'><button id='hecho'></button><p id='contenido'>` + recordatorios[i].contenido + `</p><div id='prioridades'>Prioridad:<button class='prioridad' id='low'>↓Low</button><button class='prioridad' id='normal'>Normal</button><button class='prioridad' id='high'>High↑</button></div><div id='tiempo'><p>⌛Añadido hace ${Math.floor(((Date.now() - recordatorios[i].date)/1000)/60)} minutos</p></div><i class='fa-solid fa-square-minus'></i></li>`);
        $(ul).append(li);
    }
    var cant_pendientes = document.getElementById("cantidad_pendientes");
    var hechos = document.getElementsByClassName("hechos");
    $(cant_pendientes).text(`${recordatorios.length - hechos} pendientes de un total de ${recordatorios.length}`);
}
