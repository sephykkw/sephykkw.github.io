(function ($) {

	var t, iCount, score, missCount, diff, tCount, level;
	
	$.fn.game1 = function(options) {
		
		var container = $(this);
		var audio1 = document.getElementById('audio1');
		var audio2 = document.getElementById('audio2');
		var audio3 = document.getElementById('audio3');
		var audio4 = document.getElementById('audio4');
		var audio5 = document.getElementById('audio5');
		var audio6 = document.getElementById('audio6');

		options = $.extend({
			iMax: 1000,
			iWidth: 40,
			bMgLeft: 30,
			bMgRight: 30,
			bMgBottom: 90,
			bPdLeft: 10,
			bPdRight: 50,
			bPdBottom: 60,
			bWidth: 100,
			perfectB: 20,
			greatB: 10,
			bombB: -30,
			missMax: 5,
			target: [0, 500, 600, 700, 800, 900, 1000],
			createSpd: [0, 550, 500, 450, 450, 400, 400],
			fallSpd: [0, 700, 650, 600, 550, 550, 500],
			wWidth: $(window).width(),
			wHeight: $(window).height()
		}, options);
		
		init();
		$('.start').on('mouseup', function() {
			audio1.load();audio2.load();audio3.load();audio4.load();audio5.load();audio6.load();audio7.load();audio8.load();audio9.load();
			container.addClass('active');
			$('.start, .gameover, .gameclear').fadeOut(500);
			level = 1;
			resetData();
			$('.spec').fadeIn(500);
			setTimeout(function() {
				$('.spec').fadeOut(500, function() {
					loadGame();
				})
			}, 3500)
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
			$('.box').css('left', (options.wWidth - options.bWidth) / 2 + 'px').fadeIn(500);
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
			var itemClass = randItem();
			var html = '<div class="item item' + itemClass + '" id="i' + toId(iCount) + '"></div>';
			container.append(html);
			var $this = $('#i' + toId(iCount));
			$this.css('left', randX());
			var thisSpd = randFallSpd();
			$this.animate({'top': options.wHeight - options.iWidth - options.bMgBottom + 'px'}, {duration: thisSpd, easing: 'easeInSine', complete: function() {
				var iP = $this.offset().left + options.iWidth / 2;
				if (iP > $('.box').offset().left && iP < $('.box').offset().left + options.bWidth) {
					if (!itemClass) {
						audio4.play();
						if(!$('.box').html()) {
							$('.box').append('<div class="box-miss"></div>');
						}
						setTimeout(function() {
							if($('.box').html()) {
								$('.box').html('');
							}
						}, 1000);
						score += options.bombB;
						missCount--;
						appendTip('bomb');
						$('.score').html(score);
					} else {
						if (audio1.currentTime==0 || audio1.ended) {
							audio1.play();
						} else if (audio2.currentTime==0 || audio2.ended) {
							audio2.play();
						} else if (audio3.currentTime==0 || audio3.ended) {
							audio3.play();
						}
						if (iP > $('.box').offset().left + options.bPdLeft && iP < $('.box').offset().left + options.bWidth - options.bPdRight) {
							score += options.perfectB;
							appendTip('perfect');
						} else {
							score += options.greatB;
							appendTip('great');
						}
						$('.score').html(score);
					}
					//$this.animate({'opacity': '0'}, 500);
					$this.addClass('bgscale');
					setTimeout(function() {
						$this.remove();
					}, 500);
					if(score > options.target[level]) {
						clearTimeout(t);
						clearGame();
						return;
					}
				} 
				else {
					if (itemClass) {
						if(!$('.box').html()) {
							$('.box').append('<div class="box-miss"></div>');
						}
						setTimeout(function() {
							if($('.box').html()) {
								$('.box').html('');
							}
						}, 1000);
						var missSpd  = ( (options.bMgBottom) / (options.wHeight - options.iWidth - options.bMgBottom) ) * thisSpd / 2;
						missCount--;
						appendTip('miss');
					}
					$this.animate({'top': options.wHeight - options.iWidth - options.bPdBottom + 'px'}, missSpd, 'linear', function() {
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
				audio5.play();
				$('.gameclear').html('LEVEL ' + level + '<br/>CLEAR').fadeIn(300);
				var html = '<div class="gift" id="gift' + level + '"></div>';
				container.append(html);
				$('#gift' + level).delay(600).animate({bottom: '-180px'}, 1000).delay(300).animate({bottom: '-220px'}, 70).delay(100).animate({bottom: 0}, 300).animate({bottom: '-20px'}, 50, function() {
					setTimeout(function() {
						$('.next').fadeIn(300);
					}, 1000);
				});
			} else {
				audio6.play();
				$('.gameclear').html('GAME CLEAR').show();
				$('.start').html('RETRY').show();
			}
		}
		function finishGame() {
			var id = 'audio' + Math.floor(Math.random() * 3 + 7);
			document.getElementById(id).play();
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
			return Math.floor(Math.random() * 6);
		}
		function randX() {
			return (Math.floor(Math.random() * (options.wWidth - options.iWidth - options.bMgRight - options.bMgLeft)) + options.bMgLeft) + 'px';
		}
		function randFallSpd() {
			return Math.floor(Math.random() * 500) + options.fallSpd[level];
		}
	}
	
})(jQuery);
