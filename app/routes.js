module.exports = function(app) {

  // Front end routes
  app.get('/', function(req, res) {
    res.render('details');
  });
  app.get('/details', function(req, res) {
    res.render('details');
  });
  app.get('/powershell', function(req, res) {
    res.render('powershell');
  });
  app.get('/processes', function(req, res) {
    res.render('processes');
  });
}
