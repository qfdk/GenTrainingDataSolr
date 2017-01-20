var socket = io.connect("http://" + window.location['hostname'] + ":3000");

$('#url').keyup(function (e) {
  e.preventDefault()
  if (e.keyCode == 13) {
    search()
    return false;
  }
});

$('#search').on('click', function (e) {
  e.preventDefault()
  search()
})

function search() {
  $('.table tbody tr').remove()
  $('.table thead tr').remove()
  var q = document.querySelector('input[name=url]').value
  var fl = document.querySelector('input[name=fl]').value
  $.get("http://localhost:8983/solr/corejouve/select?indent=on&q=" + q +'&fl='+fl+ "&wt=json", function (data) {
    var json = JSON.parse(data)
    var docs = json.response.docs
    var isFinished = false
    docs.forEach(function (doc, index) {
      index++
      // console.log(Object.keys(doc).length);
      if (!isFinished) {
        var thead = '<tr>'
        for (var e in doc) {
          thead = thead + '<th>' + e + '</th>'
        }
        thead = thead + '<th>Relevancy</th></tr>'
        $('thead').append(thead)
        isFinished = true
      }

      var id = doc.id
      var name = doc.name_txt_en
      var des = doc.description_txt_en
      var note = '<div id="target' + index + '"></div><div id="hint' + index + '"></div>'
      var tr = '<tr class="active">'
      for (var e in doc) {
        tr = tr + '<td>' + doc[e]+ '</td>'
      }
      tr = tr + '<td>'+note+'</td></tr>'

      $('tbody').append(tr)
      $('#target' + index).raty({
        cancelHint: 'none',
        hints: ['Not relevant', 'Fair', 'Good', 'Excellent', 'Perfect'],
        start: 0,
        number: 5,
        click: function (score, e) {
          socket.emit('getNote', { id: id, name: name, score: score })
        },
        target: '#hint' + index,
        starOff: 'imgs/star-off.png',
        starOn: 'imgs/star-on.png'
      })
    }, this);
  })
}