define(["jquery", "bootstrap", "vendor/videojs/video",'validate'], function($) {
    $(function() {
       init_background();
	   init_form();
    });
});


var bottle1, bottle2, total, bottleSmallest, total_reached = false, step_counter = 0;

var Bottle = function(cap, init_vol){
	this.capacity = cap;	
	this.volume = init_vol;
	
	this.at_capacity = function(){
		return (this.capacity == this.volume);	
	}
	this.empty = function(){
		this.volume = 0;	
	}
	
}
	
function init_background(){
	var videoBg = $('#bg_video video');
	var bodyDim = {'width': $('body').outerWidth(true), 'height': $('body').outerHeight(true)};
	var videoWidthFactor = bodyDim['height']/486;
	var videoHeightFactor = bodyDim['width']/720;

	if(videoWidthFactor > videoHeightFactor){
		videoBg.height(bodyDim['height']);
		videoBg.width(720*videoWidthFactor); // to keep the aspect ration, multiply the video width by the height factor 
		videoBg.css({'margin-left': (bodyDim['width']/2*-1), 'left': '50%'});
	} else {
		videoBg.width(bodyDim['width']);
		videoBg.height(486*videoHeightFactor); // to keep the aspect ration, multiply the video width by the height factor 
		videoBg.css({'margin-top': (bodyDim['height']/2*-1), 'top': '50%'});
	}
	
	$('#repeating_bg').css({'width':'100%', 'height':bodyDim['height']});	
}

function init_form(){
	/*jQuery.validator.addMethod("domain", function(value, element) {
		return this.optional(element) || /^http:\/\/mycorporatedomain.com/.test(value);
	});*/
	
	$('#baileys-puzzle').validate({
		rules: {
			baileys_bottle_1: { required: true, number: true },
			baileys_bottle_2: { required: true, number: true },
			baileys_total: { required: true, number: true }
		},
		highlight: function(element) {
			$(element).parents('.control-group').addClass('error');
			
		},
		unhighlight: function(element) {
			$(element).parents('.control-group').removeClass('error');
			
		},
		errorPlacement: function(error, element) {
			// do nothing
		},
		submitHandler: function(form) {
			run_euclid(form);
			return false;
		}
	});
}

function run_euclid(form){
	b1limit = $(form).find('#baileys_bottle_1').val();
	b2limit = $(form).find('#baileys_bottle_2').val();
	total = $(form).find('#baileys_total').val();
	
	bottle1 = new Bottle(parseInt(b1limit), 0);
	bottle2 = new Bottle(parseInt(b2limit), 0);
		
	bottleSmallest = (bottle1.capacity < bottle2.capacity)? 'bottle1':'bottle2';
	try {
		while(!total_reached){
			
			if(bottle1.volume == 0) {
				
				bottle1.volume = bottle1.capacity; // fill bottle1
				step_counter++;	
			}
			
			// don't want to over fill bottle2
			if( (bottle2.volume + bottle1.volume) <= bottle2.capacity) {
				
				bottle2.volume += bottle1.volume; // empty bottle1 into bottle2
				step_counter++;
				
				total_reached = volume_check();
				
				if(bottle2.at_capacity()){
					bottle2.empty;
					step_counter++;
				}
				
				bottle1.empty();
				
			} else {
				
				var needed = bottle2.capacity - bottle2.volume;
				
				bottle1.volume -= needed; // pour enough out of bottle1 to fill bottle2
				bottle2.volume += needed;
				step_counter++;	
				total_reached = volume_check();
				
				bottle2.empty();
				step_counter++;	
			}
		}
	} catch (err) {
		alert(err);	
	}
	return false
}

function volume_check(){
	if(bottle1.volume == total || bottle2.volume == total){
		$('span#total_steps').text(step_counter);
		return true;	
	} else return false;
}