var socket = io.connect("http://" + window.location['hostname'] + ":3000");

$('#download').on('click', function (e) {
  e.preventDefault()
  $.get('/download',function(data){
    console.log(data);
    $('#rest').append(data);
  });
})

$('#search').on('click', function (e) {
  e.preventDefault()
  $('.table tbody tr').remove()
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
        click: function (score, e) {
          // alert(score-1)
          socket.emit('getNote', {id:id,name:name,score:score })
        },
        target: '#hint' + index,
        starOff: 'imgs/star-off.png',
        starOn: 'imgs/star-on.png'
      })
    }, this);
  })
})