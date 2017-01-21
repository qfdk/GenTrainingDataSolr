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
$('#param').keyup(function (e) {
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
$('#query').on('keyup', function (e) {
  var q = document.querySelector('input[id=query]').value
  if (q.indexOf('&') !== -1) {
    alert('Cant be used here!')
  }
})
function search() {
  $('.table tbody tr').remove()
  $('.table thead tr').remove()
  var q = document.querySelector('input[id=query]').value
  var fl = document.querySelector('input[id=fl]').value
  var url = document.querySelector('input[id=url]').value
  var param = document.querySelector('input[id=param]').value

  $.get(url + '/select?indent=on&q=' + q + '&fl=' + fl + param+'&wt=json', function (data) {
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
          socket.emit('getNote', { id: doc.id, name: q, score: score })
        },
        target: '#hint' + index,
        starOff: 'imgs/star-off.png',
        starOn: 'imgs/star-on.png'
      })
    }, this);
  })
}