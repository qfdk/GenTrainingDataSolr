var socket = io.connect("http://" + window.location['hostname'] + ":3000");

$('#query').keyup(function (e) {
  e.preventDefault()
  if (e.keyCode == 13) {
    search()
  }
});
$('#url').keyup(function (e) {
  e.preventDefault()
  if (e.keyCode == 13) {
    search()
  }
});
$('#fl').keyup(function (e) {
  e.preventDefault()
  if (e.keyCode == 13) {
    search()
  }
});

$('#search').on('click', function (e) {
  e.preventDefault()
  search()
})

function search() {
  $('.table tbody tr').remove()
  $('.table thead tr').remove()
  var q = document.querySelector('input[id=query]').value
  var fl = document.querySelector('input[id=fl]').value
  var otherParams = document.querySelector('input[id=otherParams]').value
  var url = document.querySelector('input[id=url]').value
  //check query does not contain &.*
  if(q.indexOf('&') != -1){
    alert ("The query must only contain key words for your search");
    return;
  }
  if(otherParams.length!=0 &&  otherParams.indexOf("&")==-1){
   alert("the other parameters must contain a &, like '&sort=id ASC' for example");
   return;
  }
  if(otherParams.indexOf("&q=")!=-1){
   alert("the other parameters must not contain a query, put it in the q field");
   return;
  } 
 
  $.get(url+'/select?indent=on&q=' + q + otherParams+ '&fl=' + fl + "&wt=json", function (data) {
     var json = JSON.parse(data)
     var docs = json.response.docs
     var isFinished = false
     docs.forEach(function (doc, index) {
      index++
      if (!isFinished) {
        var thead = '<tr>'
        for (var e in doc) {
          thead = thead + '<th>' + e + '</th>'
        }
        thead = thead + '<th>Relevancy</th></tr>'
        $('thead').append(thead)
        isFinished = true
      }
      var name = doc.name_txt_en
      var note = '<div id="target' + index + '"></div><div id="hint' + index + '"></div>'
      var tr = '<tr class="active">'
      for (var e in doc) {
        tr = tr + '<td>' + doc[e] + '</td>'
      }
      tr = tr + '<td>' + note + '</td></tr>'
      $('tbody').append(tr)
      $('#target' + index).raty({
        cancelHint: 'none',
        hints: ['Not relevant', 'Fair', 'Good', 'Excellent', 'Perfect'],
        start: 0,
        number: 5,
        click: function (score, e) {
          socket.emit('getNote', { id:doc.id, name: q, score: score })
        },
        target: '#hint' + index,
        starOff: 'imgs/star-off.png',
        starOn: 'imgs/star-on.png'
      })
     }, this);
  })
}
