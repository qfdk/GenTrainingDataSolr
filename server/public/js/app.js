$('#download').on('click', function (e) {
  e.preventDefault()
  var json = JSON.parse(data)
  var torrentId = document.querySelector('form input[name=torrentId]').value
  // var url = "http://" + window.location['hostname'] + ":3000/download?url=" + torrentId
  socket.emit('download', { torrentId: torrentId })

})

$('#search').on('click', function (e) {
  e.preventDefault()
  var tmp = document.querySelector('form input[name=url]').value
  $.get("http://localhost:8983/solr/corejouve/select?indent=on&q=" + tmp + "&wt=json", function (data) {
    var cpt = 1
    var json = JSON.parse(data)
    var docs = json.response.docs
    docs.forEach(function (doc) {
      var id = doc.id
      var name = doc.name_txt_en
      var des = doc.description_txt_en
      var note= '<span class="glyphicon glyphicon-star" aria-hidden="true"></span>'
      var tr = '<tr class="active"><th scope="row">' + cpt + '</th><td>' + id + '</td><td>' + name + '</td><td>'+des+'</td><td>'+note+'</td></tr>'
      $('tbody').append(tr)
      cpt++
    }, this);
  })
})