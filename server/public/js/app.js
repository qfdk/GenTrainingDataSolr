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
$('#otherParams').keyup(function (e) {
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

$('#compare').on('click', function (e) {
  e.preventDefault()
  compare()
})

/**
 * serach
 */
function search() {
  $('.table tbody tr').remove()
  $('.table thead tr').remove()

  var q = document.querySelector('input[id=query]').value
  var fl = document.querySelector('input[id=fl]').value
  var otherParams = document.querySelector('input[id=otherParams]').value
  var url = document.querySelector('input[id=url]').value

  //check query does not contain &.*
  if (q.indexOf('&') != -1) {
    alert("The query must only contain key words for your search");
    return;
  }
  if (otherParams.length != 0 && otherParams.indexOf("&") == -1) {
    alert("the other parameters must contain a &, like '&sort=id ASC' for example");
    return;
  }
  if (otherParams.indexOf("&q=") != -1) {
    alert("the other parameters must not contain a query, put it in the q field");
    return;
  }

  $.get(url + '/select?indent=on&q=' + q + otherParams + '&fl=' + fl + "&wt=json", function (data) {
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
          socket.emit('getNote', { id: doc.id, query: q, score: score })
        },
        target: '#hint' + index,
        starOff: 'imgs/star-off.png',
        starOn: 'imgs/star-on.png'
      })
    }, this);
  })
}

/**
 * compare
 */
function compare() {
  // remove all table
  $('.table tbody tr').remove()
  $('.table thead tr').remove()

  var q = document.querySelector('input[id=query]').value
  var fl = document.querySelector('input[id=fl]').value
  var rq = document.querySelector('input[id=rq]').value
  var url = document.querySelector('input[id=url]').value

  // http://localhost:8983/solr/corejouve/query?q=skirt&rq={!ltr%20model=jouvemodel%20reRankDocs=5}&fl=id,score,name_txt_en,[features]
  $.get(url + '/query?indent=on&q=' + q + '&rq=' + rq + '&fl=' + fl + "&wt=json&rows=100", function (data) {
    var json = JSON.parse(data)
    var docs = json.response.docs
    var isFinished = false

    docs.forEach(function (doc, index) {
      index++
      if (!isFinished) {

        var thead_ltr = '<tr>'
        for (var e in doc) {
          thead_ltr = thead_ltr + '<th>' + e + '</th>'
        }
        thead_ltr = thead_ltr + '</tr>'
        $('#thead_ltr').append(thead_ltr)

        var thead_solr = '<tr>'
        for (var e in doc) {
          if (e !== '[features]') {
            thead_solr = thead_solr + '<th>' + e + '</th>'

          }
        }
        thead_solr = thead_solr + '</tr>'
        $('#thead_solr').append(thead_solr)
        isFinished = true
      }

      var ltr = '<tr class="active">'
      for (var e in doc) {
        ltr = ltr + '<td>' + doc[e] + '</td>'
      }
      ltr = ltr + '</tr>'
      $('#ltr').append(ltr)

      // todo 
      // sort with map
      var solr = '<tr class="active">'
      feature = doc['[features]']
      orignalScore = feature.split(',')[0].split('=')[1]
      for (var e in doc) {
        if (e !== '[features]') {
          if (e === 'score') {
            solr = solr + '<td>' + orignalScore + '</td>'
          } else {
            solr = solr + '<td>' + doc[e] + '</td>'
          }
        }
      }
      solr = solr + '</tr>'

      $('#solr').append(solr)
    }, this);
  })
}