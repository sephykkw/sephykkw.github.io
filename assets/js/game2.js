(function ($) {

	var totalbonus, score, level, isMute, timertime, boxnum;
	
	$.fn.game2 = function(options) {
		
		var container = $(this);

		options = $.extend({
			defaulttimertime: 90,
			boxnum: 6,
			colorlevel: 0
		}, options);
		
		init();
		
		$('.start, .retry').click(function() {
			$('.gameover').hide();
			$(this).hide();
			$('.score').text(totalbonus);
			
			gengamebox();
			
			while (nosameexist()) {
				alertpopup();
				resetgamebox();
			}		
			//set timer
			timertime = options.defaulttimertime;
			$('#timer').text(showtime(timertime));
			$('#progressbar').progressbar({value: timertime / options.defaulttimertime * 100});
			
			var timeinterval = setInterval(function(){
				timertime--;
				$('#timer').text(showtime(timertime));
				$('#progressbar').progressbar({value: Math.round(timertime / options.defaulttimertime * 100)});
				if (timertime < 0) {
					$('#timer').text(showtime(0));
					clearInterval(timeinterval);
					$('.activebox').removeClass('activebox').addClass('inactivebox');
					$('.gameover .goscore').html(totalbonus);
					$('.gameover').fadeIn(500);
					$('.retry').delay(500).fadeIn(500);
				}
			}, 1000);
		});	
			
		$(document).on('click', '.activebox', function() {
			//mark samebox
			var samecount = 1;
			$(this).addClass('counted').addClass('checked').addClass('samecolor');
			var samecountnew = boxcheck($(this), samecount, 1);
			while (samecountnew > samecount) {
				samecount = samecountnew;
				$('.samecolor').each(function() {
					if(!$(this).hasClass('checked')) {
						samecountnew = boxcheck($(this), samecountnew, 1);
						$(this).addClass('checked');
					}
				});
			}
			//success
			if(samecount > 2) {
				//score & bonus
				timertime+=0.3;
				var bonus = Math.round((samecount - 1 + Math.pow((samecount - 2), 1.2)) * 10);
				totalbonus += bonus;
				$('.score').text(totalbonus);
				//explode & generate
				$('.samecolor').each(function() {
					var boxr = parseInt($(this).attr('id').substr(1, 1));
					var boxc = parseInt($(this).attr('id').substr(3, 1));							
					$(this).removeClass('samecolor').fadeOut().remove();
					var i, j;
					j = boxr - 1;
					for(i = j; i > -1; i--) {
						var boxid = '#r' + i + 'c' + boxc;
						var k = i + 1;
						var newid = 'r' + k + 'c' + boxc;
						$(boxid).attr('id', newid).attr('style', "position: -48px").animate({top: "0px"}, rantime());
					}	
					var colId = '#c' + boxc;
					var rc = rancolor();
					$(colId).prepend('<li class="box box' + rc + ' cl' + options.colorlevel + rc + ' original activebox" id=r'+ 0 + 'c' + boxc + '>' + 0 + boxc + '</li>');
					var newboxid = '#r' + 0 + 'c' + boxc;
					$(newboxid).animate({top: "0px"}, rantime());
				});	
				//check same
				while(nosameexist()) {
					alertpopup();
					resetgamebox();
				}
			}
			//fail	
			else {
				timertime-=0.3;
			}	
			//reset
			$('.samecolor').removeClass('samecolor');
			$('.counted').removeClass('counted');
			$('.checked').removeClass('checked');
		});
		function init() {
			var html = '<div class="bar">SCORE: <span class="score">0</span></div>';
			html += '<div id="timer">0:00</div>';
			html += '<div class="mute';
			var isMute = $('.container').attr('data-mute');
			if (isMute == 'vol') {
				html += ' active';
			} 
			html += '">BGM</div>';
			html += '<div class="game_box"><ul id="game"></ul></div>';
			html += '<div class="progressbar"><div id="progressbar"></div></div>';
			html += '<div class="alertbox"><span>剩下全是单身汪</span><br/><br/>╭(╯^╰)╮</div>';
			html += '<div class="start">(´,,•ω•,,‘)<br/><span>凯凯人家来了</span></div>';
			html += '<div class="retry">(✿◡‿◡)<br/><span>再来一下下</span></div>';
			html += '<div class="gameover">\\(≧▽≦)/<br/>SCORE: <span class="goscore"></span></div>';
			html += '<div class="circle"></div>';

			container.append(html);
		  	$('.start').delay(500).fadeIn(300);

			bonusidnum = 0;
			totalbonus = 0;
			boxnum = options.boxnum;
			timertime = options.defaulttimertime;
			defaulttimertime = options.defaulttimertime;
			$("#progressbar").progressbar({value: 100});
		}
		
		function alertpopup() {
			$('.activebox').removeClass('activebox').addClass('inactivebox');
			$('.alertbox').show().delay(1000).fadeOut(200);
		}
		function rancolor() {
			return Math.floor(Math.random()*boxnum);
		}
		function rantime() {
			return Math.floor(Math.random()*300) + 150;
		}
		function gengamebox() {
			$('#game').html('');
			var i, j;
			for (i = 0; i < 7; i++) {
				$('#game').append('<li class="boxcolumn"><ul id="c' + i + '"></ul></li>');
				for (j = 0; j < 10; j++) {
					var colId = '#c' + i;
					var rc =  rancolor();
					$(colId).append('<li class="box box' + rc + ' cl' + options.colorlevel + rc + ' original activebox" id=r'+ j + 'c' + i + '>' + j + i + '</li>');
					var newboxid = '#r' + j + 'c' + i;
					$(newboxid).animate({top: "0px"}, rantime());
				}
			}
		}
		function resetgamebox() {
			$('#game').html('');
			var i, j;
			for (i = 0; i < 7; i++) {
				$('#game').append('<li class="boxcolumn"><ul id="c' + i + '"></ul></li>');
				for (j = 0; j < 10; j++) {
					var colId = '#c' + i;
					var rc =  rancolor();
					$(colId).append('<li class="box box' + rc + ' cl' + options.colorlevel + rc + ' activebox" id=r'+ j + 'c' + i + '>' + j + i + '</li>');
					var newboxid = '#r' + j + 'c' + i;
				}
			}
		}
		function nosameexist() {
			var count = 0;
			$('.activebox').each(function() { 
				if(boxcheck($(this), 1, 2) > 2) {count++;}
			});
			if(count == 0) return true;
		}
		function showtime(timertime) {
			var minute = Math.floor(timertime / 60);
			var second = Math.round(timertime - minute * 60);
			second = second > 9 ? second : '0' + second;
			return minute + ':' + second;
		}
		function comparecolor(boxcolor, row, col, samecount) {
			var newboxid = '#r' + row + 'c' + col;
			if((!$(newboxid).hasClass('counted'))&&($(newboxid).attr('class').substr(4, 4) == boxcolor)) {
				$(newboxid).addClass('samecolor').addClass('counted');
				samecount++;
			}
			return samecount;
		}	
		function comparecolor2(boxcolor, row, col, samecount) {
			var newboxid = '#r' + row + 'c' + col;
			if(($(newboxid).attr('class').substr(4, 4) == boxcolor)) {
				samecount++;
			}
			return samecount;
		}	
		function boxcheck($box, samecount, method) {
			var boxcolor = $box.attr('class').substr(4, 4);
			var boxr = parseInt($box.attr('id').substr(1, 1));
			var boxc = parseInt($box.attr('id').substr(3, 1));
			switch (method) {
				case 1:
					if(boxc > 0) samecount = comparecolor(boxcolor, boxr, boxc - 1, samecount);	
					if(boxc < 6) samecount = comparecolor(boxcolor, boxr, boxc + 1, samecount);	
					if(boxr > 0) samecount = comparecolor(boxcolor, boxr - 1, boxc, samecount);	
					if(boxr < 9) samecount = comparecolor(boxcolor, boxr + 1, boxc, samecount);	
					break;
				case 2:
					if(boxc > 0) samecount = comparecolor2(boxcolor, boxr, boxc - 1, samecount);	
					if(boxc < 6) samecount = comparecolor2(boxcolor, boxr, boxc + 1, samecount);	
					if(boxr > 0) samecount = comparecolor2(boxcolor, boxr - 1, boxc, samecount);	
					if(boxr < 9) samecount = comparecolor2(boxcolor, boxr + 1, boxc, samecount);	
					break;
			}
			return samecount;
		}
	}
	
})(jQuery);
