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
    var json = JSON.parse(data)
    var docs = json.response.docs
    docs.forEach(function (doc, index) {
      index++
      var id = doc.id
      var name = doc.name_txt_en
      var des = doc.description_txt_en
      var note = '<div id="target' + index + '"></div><div id="hint' + index + '"></div>'
      var tr = '<tr class="active"><th scope="row">' + index + '</th><td>' + id + '</td><td>' + name + '</td><td>' + des + '</td><td>' + note + '</td></tr>'
      $('tbody').append(tr)
      $('#target' + index).raty({
        cancelHint: 'none',
        hints: ['Not relevant', 'Fair', 'Good', 'Excellent', 'Perfect'],
        start: 0,
        number: 5,
        click:function(score,e){
          // alert(score-1)
        },
        target: '#hint' + index,
        starOff: 'imgs/star-off.png',
        starOn: 'imgs/star-on.png'
      })
    }, this);
  })
})