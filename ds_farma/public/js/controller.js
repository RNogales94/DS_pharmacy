const initial_activity = "initial_activity";
var current_activity = initial_activity;

document.getElementById('form_activity').style.display = 'none';


function changeActivity(id){
  document.getElementById(current_activity).style.display = 'none';
  document.getElementById(id).style.display = 'block';
  current_activity = id;
}
