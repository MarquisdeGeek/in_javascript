const { WebSocketServer } = require('ws')
const fs = require('fs')
const path = require('path')


function SocketServer(port, performance, archive) {
let sockserver;
let saveFileCount = 0;

    (function ctor() {
        sockserver = new WebSocketServer({ port: port })

        sockserver.on('connection', ws => {
            console.log('New client connected!');

            ws.send(getState());

            //ws.send('connection established')
            ws.on('close', () => console.log('Client has disconnected!'))
          
            ws.on('message', data => {
              // console.log(`data = : ${data}`)         
              const packet = JSON.parse(data);
              const response = processPacket(packet);

              if (response) {
                  sockserver.clients.forEach((client) => {
                    const res = { msg: "result", result: response };
                    client.send(`${JSON.stringify(res)}`)
                });
              }
            })
          
            ws.onerror = function () {
              console.error('websocket error')
            }
          })
          
    })();

    function processPacket(packet) {
        let response;

        switch(packet.msg) {
            case 'e_reset':
              response = performance.resetPiece();
              sendState();
                break;

              case 'e_start':
                response = performance.startPiece();
                break;

              case 'e_stop':
                response = performance.stopPiece();
                break;
    
            case 'e_save':
                //
                const output = archive.getArchiveAsStream();
                if (!output) return;
            
                ++saveFileCount;
                const filename = `sequence_${saveFileCount}.mid`;

                // Write into file
                // Kept as a HOWTO, as I don't want to (generally speaking)
                // save every rendition of the work to the drive.
                /*
                const filepath = path.join("recordings", filename);
                const outputBuffer = Buffer.from(output);
                fs.writeFileSync(filepath, outputBuffer);
                //*/

                // Send to browser
                const base64String = btoa(
                  new Uint8Array(output)
                    .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );
                return {
                  action: "midifile",
                  filename: filename,
                  base64String: base64String
                };
       
                
            case 'p_ping':
              response = performance.pingMusicians(packet.musicianIndex);
              break;

            case 'p_in_next':
              response = performance.nextPattern(packet.musicianIndex);
              break;
    
            case 'p_in_volume':
              response = performance.setVolume(packet.musicianIndex, packet.volume);
              break;

            case 'p_in_octave':
              response = performance.setOctave(packet.musicianIndex, parseInt(packet.octave));
              break;
  
            case 'p_in_pause':
              response = performance.pauseResume(packet.musicianIndex);
              break;
        }

        return response;
    }

    function getState() {
      const res = {
        msg: "state",
        state: performance.getState()
      };

      return JSON.stringify(res);
    }

    function sendState() {
      let msg = getState();

      sockserver.clients.forEach((client) => {
        client.send(msg)
      });
    }

    return {
      sendState
    }
}


module.exports = SocketServer;
