const defaultColour = 'lightgrey';


function createProgress(numSlots) {
  const chart = $('.chart')[0];
  
  for (let i = 0; i < numSlots; i++) {
    const item = document.createElement('div');
    item.style.width = (90 / numSlots) + '%'; // 90 should be 100, but getting CSS to add up all the bits to 100% is not for me
    item.style.backgroundColor = defaultColour;
    item.innerHTML = i+1;
    //
    if (i == 0) {
      item.classList.add('start');
    } else if (i == numSlots - 1) {
      item.classList.add('end');
    }
    //
    chart.append(item);
  }
  
}


function updateProgress(performanceState) {
  if ($('.chart').children('div').length === 0) {
    createProgress(performanceState.patternLength);
  }
  //
  const chart = $('.chart').eq(0);

  for(let i=1;i<=performanceState.patternLength;++i) {
    const count = Math.min(performanceState.phases[i], 5);
    const redness = (150 + (count*20)).toString(16);
    const colour = count ? ("#" + redness + "0000") : defaultColour;

    chart.children('div').eq(i-1).css("background-color", colour);
  }
}
