const fs = require('fs')
const path = require('path')
const express = require('express')


function WebServer(port, portSockets, scoreID, musicianList) {

    (function ctor() {

      const scorePath = path.join(__dirname, "scores", scoreID, "public");

      const app = express()
      app.get('/', function(req, res) {
        let data = fs.readFileSync('html/pre.html', 'utf8');
        let muso = fs.readFileSync('html/muso.template', 'utf8');

        for(let i=0;i<musicianList.length;++i) {
          data += muso.replaceAll("${}", ""+i);
        }
        data += fs.readFileSync('html/post.html', 'utf8');

        res.send(data);
      });
      app.use(express.static('public_html'))
      app.use('/scores', express.static(scorePath));
      app.listen(port, '0.0.0.0', () => {
        console.log(`Listening on port ${port}`);
      });
    })();


    return {

    }
}


module.exports = WebServer;
