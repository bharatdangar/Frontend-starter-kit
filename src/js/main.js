/* Import vendors Plugin files Here
-------------------------------------------------------------------*/ 
import './vendors/vendors';  

/* Import vendors Plugin files end here
-------------------------------------------------------------------*/ 
;(function($, window, document, undefined) {
	
	//Genaral Global variables
	var $win = $(window);
	var $doc = $(document);  
	var $winW = function(){ return $(window).width(); };
	var $winH = function(){ return $(window).height(); };
	var $screensize = function(element){  
			$(element).width($winW()).height($winH()); 
		};
		

		var screencheck = function(mediasize){
			if (typeof window.matchMedia !== "undefined"){
				var screensize = window.matchMedia("(max-width:"+ mediasize+"px)");
				if( screensize.matches ) {
					return true;
				}else {
					return false;
				}
			} else { // for IE9 and lower browser
				if( $winW() <=  mediasize ) {
					return true;
				}else {  
					return false;
				}
			}
		};

	$doc.ready(function() {   
/*--------------------------------------------------------------------------------------------------------------------------------------*/		
	
	/* Remove No-js Class
	---------------------------------------------------------------------*/
	$("html").removeClass('no-js').addClass('js');
	
	console.log('hello log 9999*9999');  

	let hello = () => { 
		return "Hello World!"; 
	} 
	console.log( hello() );

 	/* Menu Icon Append prepend for responsive
	---------------------------------------------------------------------*/
	$(window).on('resize', function(){
		if (screencheck(767)) { 
			if(!$('#menu').length){  
				$('#mainmenu').prepend('<a href="#" id="menu" class="menulines-button"><span class="menulines"></span> <em>Menu</em></a>');
			}
		} else {  
			$("#menu").remove();
		}
	}).resize(); 

/*--------------------------------------------------------------------------------------------------------------------------------------*/		
});	

/*All function need to define here for use strict mode
----------------------------------------------------------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------------------------------------------------------*/
})(jQuery, window, document);