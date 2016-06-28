(function ($) {

	var bonusidnum, totalbonus, score, level, isMute;
	
	$.fn.game2 = function(options) {
		
		options = $.extend({
			timertime: 90,
			defaulttimertime: 90,
			boxnum: 5
			//wWidth: $(window).width(),
			//wHeight: $(window).height()
		}, options);
		
		init();
		
		$('.start_btn').click(function() {
			$('.finalscore').hide().html('');
			$(this).hide();
			$('.bonuslist').html('');
			totalbonus = bonusidnum= 0;
			$('#scoreboard').text('S: ' + totalbonus);
			
			gengamebox();
			while (nosameexist()) {
				alertpopup();
				resetgamebox();
			}		
			//set timer
			timertime = defaulttimertime;
			$('#timer').text(showtime(timertime));
			$('#progressbar').progressbar({value: timertime / defaulttimertime * 100});
			
			$timeinterval = setInterval(function(){
				timertime--;
				$('#timer').text(showtime(timertime));
				$('#progressbar').progressbar({value: Math.round(timertime / defaulttimertime * 100)});
				if (timertime < 0) {
					$('#timer').text(showtime(0));
					clearInterval($timeinterval);
					$('.activebox').removeClass('activebox').addClass('inactivebox');
					$('.finalscore').html('YOUR SCORE<br />' + totalbonus).fadeIn(500);
					$('.start_btn').delay(500).fadeIn(500);
				}
			}, 1000);
		});	
			
		$(document).on('click', '.activebox', function() {
			var theEvent = window.event || arguments.callee.caller.arguments[0];	var x = theEvent.pageX - 50,
					y = theEvent.pageY - 20;
			//mark samebox
			$samecount = 1;
			$(this).addClass('counted').addClass('checked').addClass('samecolor');
			$samecountnew = boxcheck($(this), $samecount, 1);
			while ($samecountnew > $samecount) {
				$samecount = $samecountnew;
				$('.samecolor').each(function() {
					if(!$(this).hasClass('checked')) {
						$samecountnew = boxcheck($(this), $samecountnew, 1);
						$(this).addClass('checked');
					}
				});
			}
			//succeed
			if($samecount > 2) {
				//score & bonus
				timertime+=0.3;
				var bonus = Math.round(($samecount - 1 + Math.pow(($samecount - 2), 1.2)) * 10);
				$position = 'left:' + x + 'px;top:' + y + 'px';
				$('.bonuslist').append('<div class="bonus" id="bonus' + bonusidnum + '">+' + bonus + '</div>');
				$bonusid = '#bonus' + bonusidnum;
				$($bonusid).attr('style', $position).show().delay(500).effect('drop', { direction: "right" });
				bonusidnum++;
				totalbonus += bonus;
				$('#scoreboard').text('S: ' + totalbonus);
				//explode & generate
				$('.samecolor').each(function() {
					$boxr = parseInt($(this).attr('id').substr(1, 1));
					$boxc = parseInt($(this).attr('id').substr(3, 1));							
					$(this).removeClass('samecolor').effect('explode', 400).remove();
					var i, j;
					j = $boxr - 1;
					for(i = j; i > -1; i--) {
						$boxid = '#r' + i + 'c' + $boxc;
						var k = i + 1;
						$newid = 'r' + k + 'c' + $boxc;
						$($boxid).attr('id', $newid).attr('style', "position: -38px").animate({top: "0px"}, rantime());
					}	
					$colId = '#c' + $boxc;
					$($colId).prepend('<li class="box box' + rancolor() + ' original activebox" id=r'+ 0 + 'c' + $boxc + '>' + 0 + $boxc + '</li>');
					$newboxid = '#r' + 0 + 'c' + $boxc;
					$($newboxid).animate({top: "0px"}, rantime());
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
			bonusidnum = 0;
			totalbonus = 0;
			boxnum = options.boxnum;
			timertime = options.timertime;
			defaulttimertime = options.defaulttimertime;
			$("#progressbar").progressbar({value: 100});
		}
		
		function alertpopup() {
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
			for (i = 0; i < 10; i++) {
				$('#game').append('<li class="boxcolumn"><ul id="c' + i + '"></ul></li>');
				for (j = 0; j < 10; j++) {
					$colId = '#c' + i;
					$($colId).append('<li class="box box' + rancolor() + ' original activebox" id=r'+ j + 'c' + i + '>' + j + i + '</li>');
					$newboxid = '#r' + j + 'c' + i;
					$($newboxid).animate({top: "0px"}, rantime());
				}
			}
		}
		function resetgamebox() {
			$('#game').html('');
			var i, j;
			for (i = 0; i < 10; i++) {
				$('#game').append('<li class="boxcolumn"><ul id="c' + i + '"></ul></li>');
				for (j = 0; j < 10; j++) {
					$colId = '#c' + i;
					$($colId).append('<li class="box box' + rancolor() + ' activebox" id=r'+ j + 'c' + i + '>' + j + i + '</li>');
					$newboxid = '#r' + j + 'c' + i;
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
		function showtime($timertime) {
			$minute = Math.floor($timertime / 60);
			$second = Math.round($timertime - $minute * 60);
			$second = $second > 9 ? $second : '0' + $second;
			return $minute + ':' + $second;
		}
		function comparecolor($boxcolor, $row, $col, $samecount) {
			$newboxid = '#r' + $row + 'c' + $col;
			if((!$($newboxid).hasClass('counted'))&&($($newboxid).attr('class').substr(4, 4) == $boxcolor)) {
				$($newboxid).addClass('samecolor').addClass('counted');
				$samecount++;
			}
			return $samecount;
		}	
		function comparecolor2($boxcolor, $row, $col, $samecount) {
			$newboxid = '#r' + $row + 'c' + $col;
			if(($($newboxid).attr('class').substr(4, 4) == $boxcolor)) {
				$samecount++;
			}
			return $samecount;
		}	
		function boxcheck($box, $samecount, $method) {
			$boxcolor = $box.attr('class').substr(4, 4);
			$boxr = parseInt($box.attr('id').substr(1, 1));
			$boxc = parseInt($box.attr('id').substr(3, 1));
			switch ($method) {
				case 1:
					if($boxc > 0) $samecount = comparecolor($boxcolor, $boxr, $boxc - 1, $samecount);	
					if($boxc < 9) $samecount = comparecolor($boxcolor, $boxr, $boxc + 1, $samecount);	
					if($boxr > 0) $samecount = comparecolor($boxcolor, $boxr - 1, $boxc, $samecount);	
					if($boxr < 9) $samecount = comparecolor($boxcolor, $boxr + 1, $boxc, $samecount);	
					break;
				case 2:
					if($boxc > 0) $samecount = comparecolor2($boxcolor, $boxr, $boxc - 1, $samecount);	
					if($boxc < 9) $samecount = comparecolor2($boxcolor, $boxr, $boxc + 1, $samecount);	
					if($boxr > 0) $samecount = comparecolor2($boxcolor, $boxr - 1, $boxc, $samecount);	
					if($boxr < 9) $samecount = comparecolor2($boxcolor, $boxr + 1, $boxc, $samecount);	
					break;
			}
			return $samecount;
		}
	}
	
})(jQuery);
