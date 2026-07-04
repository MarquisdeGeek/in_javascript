
$(".ui_action_start").click(function() {
    wswSend(JSON.stringify({msg: "e_start"}));
});

$(".ui_action_stop").click(function() {
    wswSend(JSON.stringify({msg: "e_stop"}));
});

$(".ui_action_save").click(function() {
    wswSend(JSON.stringify({msg: "e_save"}));
});

$(".ui_action_reset").click(function() {
    wswSend(JSON.stringify({msg: "e_reset"}));
});

$(".ui_action_next").click(function(e) {
    const musicianIndex = $(e.currentTarget).data().musician;
    wswSend(JSON.stringify({msg: "p_in_next", musicianIndex: musicianIndex}));
});

$(".ui_action_ping").click(function(e) {
  const musicianIndex = $(e.currentTarget).data().musician;
  wswSend(JSON.stringify({msg: "p_ping", musicianIndex: musicianIndex}));
});

$(".ui_action_pingall").click(function() {
    wswSend(JSON.stringify({msg: "p_ping"}));
});

$(".ui_action_octave").click(function(e) {
  const musicianIndex = $(e.currentTarget).data().musician;
  const octave = $(e.currentTarget).data().octave;
  wswSend(JSON.stringify({msg: "p_in_octave", musicianIndex: musicianIndex, octave:octave}));
});

$(".ui_action_pause").click(function(e) {
    const musicianIndex = $(e.currentTarget).data().musician;
    wswSend(JSON.stringify({msg: "p_in_pause", musicianIndex: musicianIndex}));
  });
