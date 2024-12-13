// Tweaked from https://codepen.io/libneko/pen/NWGbEqE

function setValue (musicianIndex, value) {
    let fill = document.querySelector(`.volume .bar .bar-fill[data-musician='${musicianIndex}']`)

    fill.style.width = value + "%";


    let range = document.querySelector(`.volume input[type=range][data-musician='${musicianIndex}']`)

    range.setAttribute("value", value)
    range.dispatchEvent(new Event("change"))
}


document.addEventListener("DOMContentLoaded", () => { 

    document.querySelectorAll(".volume input[type=range]").forEach(range => {
        const musicianIndex = range.dataset.musician;

        range.addEventListener("change", (e) => {
            onVolumeChange(e);
        });

        // Дефолт
        setValue(musicianIndex, range.value);
    });
  
        
    const calculateFill = (e) => {
      // Отнимаем ширину двух 15-пиксельных паддингов из css
      let offsetX = e.offsetX
      
      if (e.type === "touchmove") {
        offsetX = e.touches[0].pageX - e.touches[0].target.offsetLeft
      }
      
      const width = e.target.offsetWidth - 30;
  
      setValue(
        Math.max(
          Math.min(
            // Отнимаем левый паддинг
            (offsetX - 15) / width * 100.0,
            100.0
          ),
          0
        )
      );
    }
    
    let barStillDown = false;
  
    document.querySelectorAll(".volume .bar-hoverbox").forEach((barHoverBox) => {

        barHoverBox.addEventListener("touchstart", (e) => {
            barStillDown = true;
        
            calculateFill(e);
          }, true);
          
          barHoverBox.addEventListener("touchmove", (e) => {
            if (barStillDown) {
              calculateFill(e);
            }
          }, true);
          
          barHoverBox.addEventListener("mousedown", (e) => {
            barStillDown = true;
            
            calculateFill(e);
          }, true);
          
          barHoverBox.addEventListener("mousemove", (e) => {
            if (barStillDown) {
              calculateFill(e);
            }
          });
          
          barHoverBox.addEventListener("wheel", (e) => {
            const newValue = +range.value + e.deltaY * 0.5;
            
            setValue(Math.max(
              Math.min(
                newValue,
                100.0
              ),
              0
            ))
          });
          
    })

    document.addEventListener("mouseup", (e) => {
      barStillDown = false;
    }, true);
    
    document.addEventListener("touchend", (e) => {
      barStillDown = false;
    }, true);
  })
  