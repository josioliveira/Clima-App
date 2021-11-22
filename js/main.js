const apikey = "fwFnapYmCWoXl77wUh1f0XpUD5Kz9GEs";

$(document).ready(function () {

    /* Registrar o evento keyup do input text para pesquisar cidades */
    $("#cidade").keyup(function () {

        var busca = $("#cidade").val();

        /* Só realizar a pesquisa se houver mais de 3 digitos */
        if (busca.length > 3) {

            /* Chamada HTTP GET para obter as Localizações (cidades) */
            $.get("http://dataservice.accuweather.com/locations/v1/cities/autocomplete?language=pt-br&apikey=" + apikey + "&q=" + encodeURI(busca), function (data, status) {
                var cidades = data;
                var html = "";

                for (var i = 0; i < cidades.length; i++) {
                    var cidade = cidades[i];
                    html += "<div style='padding: 10px;' onclick=\"verCidade('" + cidade.Key + "', '" + cidade.LocalizedName + " - " + cidade.AdministrativeArea.ID + "');\">";
                    html += cidade.LocalizedName + " - " + cidade.AdministrativeArea.ID;
                    html += "</div>";
                }

                $("#resultadoCidades").html(html);
            });

        }

    });

});

function verCidade(key, cidade) {

    $("#cidade").val("");
    $("#resultadoCidades").html("");

    /* GET para obter condição do tempo atual */
    $.get("http://dataservice.accuweather.com/currentconditions/v1/" + key + "?language=pt-br&apikey=" + apikey, function (data, status) { 
        var atual = data[0];
        
        var html = "<div class='card'>";
        
        html += "<div class='card-body'>";

        html += "<h5 class='card-title'>Tempo atual em " + cidade +  "</h5>";
        
        html += "<h1 style='text-align: center; padding: 18px;'>" + atual.Temperature.Metric.Value + " " + atual.Temperature.Metric.Unit + "</h1>";

        html += "<p class='card-text'>" + atual.WeatherText + "</p>";

        /* GET para obter outras informações */
        $.get("http://dataservice.accuweather.com/forecasts/v1/daily/1day/" + key + "?language=pt-br&apikey=" + apikey + "&metric=true", function (data, status) {

            var dia = data.DailyForecasts[0];

            html += "<table class='table'>";
            html += "<tbody>";
			html += "<tr><th>Minima</th><td>" + dia.Temperature.Minimum.Value + " " + dia.Temperature.Minimum.Unit + "</td></tr>";
            html += "<tr><th>Maxima</th><td>" + dia.Temperature.Maximum.Value + " " + dia.Temperature.Maximum.Unit + "</td></tr>";
            html += "<tr><th>Dia</th><td>" + dia.Day.IconPhrase + "</td></tr>";
            html += "<tr><th>Noite</th><td>" + dia.Night.IconPhrase + "</td></tr>";
            html += "</tbody>";
            html += "</table>";
            
            html += "</div>";
            html += "</div>"

            $("#detalhamento").html(html);

        });

    });

}