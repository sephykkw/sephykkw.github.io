(function ($) {

	var t, iCount, score, missCount, diff, tCount, level;
	
	$.fn.game1 = function(options) {
		
		var container = $(this);
		options = $.extend({
			iMax: 1000,
			iWidth: 40,
			bMgLeft: 10,
			bMgRight: 10,
			bMgBottom: 105,
			bWidth: 100,
			perfectB: 20,
			greatB: 10,
			missMax: 5,
			target: [0, 500, 600, 700],
			createSpd: [0, 750, 700, 650],
			fallSpd: [0, 900, 850, 800],
			wWidth: $(window).width(),
			wHeight: $(window).height()
		}, options);
		
		init();
		$('.start').on('mouseup', function() {
			container.addClass('active');
			$('.start, .gameover, .gameclear').hide();
			level = 1;
			resetData();
			loadGame();
		});
		$('.next').on('mouseup', function() {
			container.addClass('active');
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
		
		function init() {
			var html = '<div class="bar">SCORE: <span class="score">0</span></div>';
			html += '<div class="lv">LEVEL <span class="level">1</span></div>';
			html += '<div class="miss">5</div>';
			html += '<div class="start">START</div>';
			html += '<div class="next">NEXT</div>';
			html += '<div class="gameclear">GAME CLEAR</div>';
			html += '<div class="gameover">GAMEOVER<br/>SCORE: <span class="goscore"></span></div>';
			html += '<div class="box"></div>';
			html += '<div class="ground"></div>';
			container.append(html);
		  $('.start').delay(500).fadeIn(300);
		}
		function loadGame() {
			$('.box').css('left', (options.wWidth - options.bWidth - options.bMgLeft - options.bMgRight) / 2 + 'px').fadeIn(500);
			$('.ground').fadeIn(500);
			setTimeout(createItem, 2000);
		}
		function resetData() {
			iCount = 0;
			tCount = 0;
			score = 0;
			diff = 0;
			missCount = options.missMax;
			$('.score').html(score);
			$('.miss').html(missCount);
			$('.level').html(level);
		}
		function createItem() {
			var html = '<div class="item item' + randItem() + '" id="i' + toId(iCount) + '"></div>';
			container.append(html);
			var $this = $('#i' + toId(iCount));
			$this.css('left', randX());
			var thisSpd = randFallSpd();
			$this.animate({'top': options.wHeight - options.iWidth - options.bMgBottom + 'px'}, {duration: thisSpd, easing: 'easeInSine', complete: function() {
				var iP = $this.offset().left + options.iWidth / 2;
				if (iP > $('.box').offset().left && iP < $('.box').offset().left + options.bWidth + options.bMgLeft + options.bMgRight) {
					if (iP > $('.box').offset().left + options.bMgLeft && iP < $('.box').offset().left + options.bMgLeft + options.bWidth) {
						score += options.perfectB;
						appendTip('perfect');
					} else {
						score += options.greatB;
						appendTip('great');
					}
					$('.score').html(score);
					$this.animate({'opacity': '0'}, 500);
					setTimeout(function() {
						$this.remove();
					}, 500);
					if(score > options.target[level]) {
						clearTimeout(t);
						clearGame();
						return;
					}
				} else {
					var src1 = $('.box').css('backgroundImage');
					var src2 = src1.replace('gif', 'png');
					$('.box').css('backgroundImage', src2);
					setTimeout(function() {
						$('.box').css('backgroundImage', src1);
					}, 1000);
					var missSpd  = ( (options.bMgBottom) / (options.wHeight - options.iWidth - options.bMgBottom) ) * thisSpd / 2;
					missCount--;
					appendTip('miss');
					$this.animate({'top': options.wHeight - options.iWidth + 'px'}, missSpd, 'linear', function() {
						$this.animate({'opacity': '0'}, 500);
						setTimeout(function() {
							$this.remove();
						}, 500);
					});
				}
			}});
			iCount++;
			if (iCount < options.iMax && missCount > -1) {
				$('.miss').html(missCount);
				t = setTimeout(createItem, randTime(options.createSpd[level]));
			} 
			else {
				clearTimeout(t);
				finishGame();
			}
		}
		function clearGame() {
			$('.tip, .item').stop(true).remove();
			$('.box, .ground').hide();
			container.removeClass('active');
			if (level < options.target.length - 1) {
				$('.gameclear').html('LEVEL ' + level + '<br/>CLEAR').fadeIn(300);
				var html = '<div class="gift" id="gift' + level + '"></div>';
				container.append(html);
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
			$('.box, .ground').hide();
			$('.goscore').html(score);
			$('.gameover').show();
			$('.start').html('RETRY').show();
			container.removeClass('active');
		}
		function appendTip(rank) {
			$('.tip').stop(true).remove();
			var html = '<div class="tip tip-' + rank + '" id="t' + toId(tCount) + '">' + rank.toUpperCase() + '</div>';
			container.append(html);
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
			return Math.floor(Math.random() * 500) + options.createSpd[level];
		}
		function randItem() {
			return Math.floor(Math.random() * 3);
		}
		function randX() {
			return (Math.floor(Math.random() * (options.wWidth - options.iWidth - options.bMgRight - options.bMgLeft)) + options.iWidth / 2 + options.bMgLeft) + 'px';
		}
		function randFallSpd() {
			return Math.floor(Math.random() * 500) + options.fallSpd[level];
		}
	}
	
})(jQuery);
