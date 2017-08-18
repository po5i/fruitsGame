var playing = false;
var valid = false;
var score;
var trialsLeft;
var step;
var action;
var fruits = ['apple', 'banana', 'cherries', 'grapes',
'mango', 'orange', 'peach', 'pear', 'watermelon'];
var sessionToken = "";
var endpoint = "http://localhost:8000";

$(function(){

	var code = prompt("Please enter your code");
	sessionToken = guid();

	if (code != null) {
		$.ajax({
		  method: "POST",
		  url: endpoint + "/verify_access_code/",
		  data: {
		  	access_code: code, 
		  	session_token: sessionToken 
		  }
		}).done(function(data) {
			if (data.response != "ok") {
				alert("Error, please try again.")
				return;
			}
		    $("#namevalue").html(data.data.user_name);
		    $("#coursevalue").html(data.data.course_name);
			valid = true;
		}).fail(function(error) {
			alert("Error, please try again.")
		});
	}

	$("#startreset").click(function(){
 		if(playing == true || valid == false){
 			location.reload();
 		}else{
 			playing = true;
 			score = 0;
 			$("#scorevalue").html(score);
 			$("#trialsLeft").show();
 			trialsLeft = 3;
 			addHearts();
 			$("#gameOver").hide();
 			$("#startreset").html("Reset Game");
 			startAction();
 		}
	});

	$("#fruit1").mouseover(function(){
 	score++;
 	$("#scorevalue").html(score);
 	$("#slicesound")[0].play();
 	clearInterval(action);
 	$("#fruit1").hide("explode", 500);
 	setTimeout(startAction, 500);
});

	function addHearts(){
	 	$("#trialsLeft").empty();
	 	for(i = 0; i < trialsLeft; i++){
	 		$("#trialsLeft").append('<img src="images/heart.png" class="life">');
	 	}
	}

	function startAction(){
	 	$("#fruit1").show();
	 	chooseFruit();
	 	$("#fruit1").css({
	 		'left' : Math.round(550*Math.random()), 
	 		'top' : -50
	 	});

	 	step = 1+ Math.round(5*Math.random()); 
	 	action = setInterval(function(){
	 		$("#fruit1").css('top',
			$("#fruit1").position().top + step);
			if($("#fruit1").position().top > $("#fruitsContainer").height()){
	 			if(trialsLeft > 1 ){
	 				$("#fruit1").show();
	 				chooseFruit();
	 				$("#fruit1").css({
	 					'left' : Math.round(550*Math.random()), 
	 					'top' : -50
	 				});
	 			step = 1+ Math.round(5*Math.random());
	 			trialsLeft --;
	 			addHearts();
				}else{
	 				playing = false;
	 				$("#startreset").html("Start Game");
	 				$("#gameOver").show();
	 				$("#gameOver").html('<p>Game Over!</p><p>Your score is '+ score +'</p>');
	 				$("#trialsLeft").hide();
	 				stopAction();
	 			}
	 		}
	 	}, 10);
	}

	function chooseFruit(){
	 	$("#fruit1").attr('src' , 'images/' +
		fruits[Math.round(8*Math.random())] +'.png');
	}

	function stopAction(){
 		clearInterval(action);
 		$("#fruit1").hide();

 		$.ajax({
		  method: "POST",
		  url: endpoint + "/store_score/",
		  data: {
		  	score: score, 
		  	session_token: sessionToken 
		  }
		}).done(function(data) {
			if (data.response != "ok") {
				alert("Error, please try again.")
				return;
			}
		}).fail(function(error) {
			alert("Error, please try again.")
			console.log(error);
		});
	}

	function guid() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	    s4() + '-' + s4() + s4() + s4();
	}
});