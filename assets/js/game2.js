// JavaScript Document
$(function() {
	
	var iWidth = 20;
	var bMgBottom = 30;
	var bWidth = 60;
	var perfectB = 20;
	var greatB = 15;
	var fineB = 10
	var target = [0, 800, 900, 1000];
	var fallSpd = [0, 800, 800, 800];
	
	var wWidth = $(window).width();
	var wHeight = $(window).height();
	
	var t, iCount, score, missCount, diff, tCount, level;

	orient();
	init();
	
	$('.start').on('mouseup', function() {
		$('.start, .gameover, .gameclear').hide();
		level = 1;
		resetData();
		loadGame();
	});
	$('.next').on('mouseup', function() {
		$('.next, .gameclear').hide();
		$('.gift').animate({bottom: '-250px'}, 500);
		setTimeout(function() {
			level++;
			resetData();
			loadGame();
		}, 500)
	});
	$('.box').swipe( {
		swipeStatus:function(event, phase, direction, distance, duration, fingers, fingerData, currentDirection)
		{
			if (phase == 'start') {
				diff = event.targetTouches[0].pageX - $(this).offset().left;
			}
			if (phase == 'start' || phase == 'move') {
				$('.box').css('left', event.targetTouches[0].pageX - diff + 'px');
			}
		},
		threshold: 1,
		maxTimeThreshold: null,
		fingers: 1
	});
	$(window).on( 'orientationchange', function(e){
		orient();
	}); 
	function init() {
		var html = '<div class="bar">SCORE: <span class="score">0</span></div>';
		html += '<div class="lv">LEVEL <span class="level">1</span></div>';
		html += '<div class="start">START</div>';
		html += '<div class="next">NEXT</div>';
		html += '<div class="gameclear">GAME CLEAR</div>';
		html += '<div class="gameover">GAMEOVER<br/>SCORE: <span class="goscore"></span></div>';
		html += '<div class="box"></div>';
		$('.container').append(html);
		$('.start').delay(500).fadeIn(300);
	}
	function loadGame() {
		$('.box').css('left', (wWidth - bWidth) / 2 + 'px').fadeIn(500);
		setTimeout(createItem, 2000);
	}
	function resetData() {
		iCount = 0;
		tCount = 0;
		score = 0;
		diff = 0;
		$('.score').html(score);
		$('.level').html(level);
	}
	function createItem() {
		var html = '<div class="item item' + randItem() + '" id="i' + toId(iCount) + '"></div>';
		$('.container').append(html);
		var $this = $('#i' + toId(iCount));
		$this.css('left', randX());
		var thisSpd = randFallSpd();
		$this.animate({'top': wHeight - iWidth - bMgBottom + 'px'}, {duration: thisSpd, easing: 'easeInSine', complete: function() {
			test($this);
		}});
	}
	function test($this) {
		var iP = $this.offset().left + iWidth / 2;
		var bP = $('.box').offset().left + bWidth/ 2;
		var bL = $('.box').offset().left;
		var bR = $('.box').offset().left + bWidth;
		
		if (iP > bL && iP < bR) {
				
			var offsetX = Math.max((iP - bP) * 10, 1);
			var cur = Math.abs(offsetX / 1000);
			//console.log(offsetX + ' ' + cur);
			var bool = new Parabola({
				el: $this,
				offset: [offsetX, 0],
				curvature: 0.01,
				duration: 1000,
				callback:function(){
					test($this);
				},
				stepCallback:function(x,y){
					
					if(x < -bP || x + bP > wWidth - iWidth/2) {
						console.log(x + bP);
						console.log('stp');
						bool.stop();
					}
				}
			});
			bool.start();
			
			$('.score').html(score);
			if(score > target[level]) {
				clearTimeout(t);
				clearGame();
				return;
			}
		} else {
			var missSpd  = 50;
			$this.animate({'top': wHeight - iWidth + 'px'}, missSpd, 'linear', function() {
				$this.animate({'opacity': '0'}, 500);
				setTimeout(function() {
					$this.remove();
				}, 500);
			});
			finishGame();
		}
	}
	function clearGame() {
		$('.tip, .item').stop(true).remove();
		$('.box').hide();
		if (level < target.length - 1) {
			$('.gameclear').html('LEVEL ' + level + '<br/>CLEAR').fadeIn(300);
			var html = '<div class="gift" id="gift' + level + '"></div>';
			$('.container').append(html);
			$('#gift' + level).delay(600).animate({bottom: '-180px'}, 1000).delay(300).animate({bottom: '-220px'}, 70).delay(100).animate({bottom: 0}, 300).animate({bottom: '-20px'}, 50, function() {
				setTimeout(function() {
					$('.next').fadeIn(300);
				}, 1000);
			});
		} else {
			$('.gameclear').html('GAME CLEAR').show();
			$('.start').html('RETRY').show();
		}
	}
	function finishGame() {
		$('.tip, .item').stop(true).remove();
		$('.box').hide();
		$('.goscore').html(score);
		$('.gameover').show();
		$('.start').html('RETRY').show();
	}
	function appendTip(rank) {
		$('.tip').stop(true).remove();
		var html = '<div class="tip tip-' + rank + '" id="t' + toId(tCount) + '">' + rank.toUpperCase() + '</div>';
		$('.container').append(html);
		var $this = $('#t' + toId(tCount));
		$this.fadeIn(200).delay(400).fadeOut(200);
		tCount++;
		setTimeout(function() {
			$this.remove();
		}, 800);
	}
	function toId(num) {
		if (num < 10) {
			num = '00' + num;
		} else if (num < 100) {
			num = '0' + num;
		}
		return num;
	}
	function randTime() {
		return Math.floor(Math.random() * 500) + createSpd[level];
	}
	function randItem() {
		return Math.floor(Math.random() * 3);
	}
	function randX() {
		return (Math.floor(Math.random() * (wWidth - iWidth)) + iWidth / 2) + 'px';
	}
	function randFallSpd() {
		return Math.floor(Math.random() * 500) + fallSpd[level];
	}
})

function orient() {
	if (window.orientation == 0 || window.orientation == 180) {
		$("body").attr("class", "portrait");
		orientation = 'portrait';
		return false;
	}
	else if (window.orientation == 90 || window.orientation == -90) {
		$("body").attr("class", "landscape");
		orientation = 'landscape';
		return false;
	}
}	