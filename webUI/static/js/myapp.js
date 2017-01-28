/**
 * Created by qfdk on 2016/10/23.
 */
$('#go').click(function () {
    send($('#url').val());
});


function send(json) {
    // $('.table tbody tr').remove();

    $.get('http://'+window.location['hostname']+':8080/api/v1/getPath?url=' + json, function (data, b, c) {
        var paths =data.urls;

        var tmp='';

        paths.forEach(function (path,i) {

            var number = i+1;
            if (path.valided) {
                tmp='# '+number+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+path.operationType+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+path.reponseCode+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+path.codes+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+path.link;
                $('#accordion').append(generatePanel(number, tmp,"C'est une requete GET donc pas de params.", "success"));
            }else {
                tmp='# '+number+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+path.operationType+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+path.reponseCode+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+path.codes+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+path.link;
                $('#accordion').append(generatePanel(number, tmp,JSON.stringify(path.parameters), "danger"));
            }
            // if (path.valided)
            // {
            //     tmp='<tr class="success"><th scope="row">'+number+'</th><td>'+path.link+'</td> <td>'+path.reponseCode+'</td><td>'+path.codes+'</td><td>'+path.operationType+'</td></tr>';
            // }else
            // {
            //     tmp='<tr class="danger"><th scope="row">'+number+'</th><td>'+path.link+'</td> <td>'+path.reponseCode+'</td><td>'+path.codes+'</td><td>'+path.operationType+'</td></tr>';
            // }
            //
            // $('.table').append(tmp);
            tmp = "";
        });


        $('#myModal').modal('hide');

    });
}

function generatePanel(id,url_info,params,typemsg) {

   var tmp='<div class="panel panel-'+typemsg+'">';
   tmp=tmp+'<div class="panel-heading" role="tab" id="x'+id+'">';
   tmp=tmp+'<h4 class="panel-title"><a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#y'+id+'" aria-expanded="false" aria-controls="y'+id+'">'+url_info+'</a></h4>';
   tmp = tmp +'</div>';
   tmp = tmp+'<div id="y'+id+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="'+id+'"><div class="panel-body">'+params+'</div></div></div>';
   return tmp;

}