(function ($) {

	var t, iCount, score, missCount, diff, tCount, level, isMute;
	
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
			target: [0, 500, 500, 600, 600, 600, 700, 700, 700, 700, 800],
			createSpd: [0, 550, 550, 500, 500, 500, 450, 450, 450, 400, 400],
			fallSpd: [0, 700, 650, 650, 600, 600, 550, 550, 500, 500, 450],
			wWidth: $(window).width(),
			wHeight: $(window).height()
		}, options);
		
		init();
		$('.start').on('mouseup', function() {
			audio1.load();audio2.load();audio3.load();audio4.load();audio5.load();audio6.load();audio7.load();audio8.load();audio9.load();audiobgm.load();
			container.addClass('active');
			$('.start, .gameover, .gameclear, .circle').fadeOut(500);
			$('.circle').css('top', '100%');
			level = 1;
			resetData();
			$('.spec').fadeIn(500);
			setTimeout(function() {
				$('.spec').fadeOut(500, function() {
					if ($('.container').attr('data-mute') == 'vol') {
						audiobgm.play();
					}
					loadGame();
				})
			}, 3500)
		});
		$('.retry').on('mouseup', function() {
			$('.container').html('<div class="mode-panel"><div class="mode-easy mode">(,,• ₃ •,,)<br/><span>简 单</span></div><div class="mode-normal mode">(•̀ω•́ )ゝ<br/><span>挑 战</span></div></div>');
		});
		$('.next').on('mouseup', function() {
			container.addClass('active');
			$('.next, .gameclear, .circle').hide();
			$('.circle').css('top', '100%');
			$('.gift').animate({bottom: '-250px'}, 500);
			setTimeout(function() {
				level++;
				resetData();
				audiobgm.play();
				loadGame();
			}, 500)
		});
		$('.mute').on('click', function() {
			if($('.container').attr('data-mute') == 'vol') {
				$(this).removeClass('active');
				audiobgm.pause();
				$('.container').attr('data-mute', 'mute');
			} else {
				$(this).addClass('active');
				audiobgm.play();
				$('.container').attr('data-mute', 'vol');
			}
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
			html += '<div class="lv">Target : <span class="target">'+options.target[1]+'</span></div>';
			html += '<div class="miss">5</div>';
			html += '<div class="mute';
			var isMute = $('.container').attr('data-mute');
			if (isMute == 'vol') {
				html += ' active';
			} 
			html += '">BGM</div>';
			html += '<div class="start">(´,,•ω•,,‘)<br/><span>凯凯人家来了</span></div>';
			html += '<div class="retry">(✿◡‿◡)<br/><span>再来一下下</span></div>';
			html += '<div class="next">ε٩(๑> ₃ <)۶з<br/><span>继续来来来</span></div>';
			html += '<div class="gameclear"></div>';
			html += '<div class="gameover">GAMEOVER<br/>SCORE: <span class="goscore"></span></div>';
			html += '<div class="box"><div class="box-miss"></div></div>';
			html += '<div class="ground"></div>';
			html += '<div class="circle-clear circle"></div>';
			html += '<div class="circle-over circle"></div>';
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
			$('.box').css('backgroundImage', 'url("./assets/images/box-'+level+'.gif")');
			$('.box-miss').css('backgroundImage', 'url("./assets/images/box-'+level+'.png")');
			$('.circle-clear').css('backgroundImage', 'url("./assets/images/box-'+level+'.gif")');
			$('.circle-over').css('backgroundImage', 'url("./assets/images/box-'+level+'.png")');
			$('.score').html(score);
			$('.miss').html(missCount);
			$('.target').html(options.target[level]);
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
						$this.css('backgroundImage', 'url("./assets/images/item00.png")').animate({
							'opacity': '0',
							'width': '80px',
							'height': '80px',
							'top': '-=20px',
							'left': '-=20px'
						}, 500);
						if($('.box-miss').css('display') == 'none') {
							$('.box-miss').show();
						}
						setTimeout(function() {
							if($('.box-miss').css('display') != 'none') {
								$('.box-miss').hide();
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
						$this.hide();
					}
					setTimeout(function() {
						$this.remove();
					}, 500);
					if(score >= options.target[level]) {
						clearTimeout(t);
						clearGame();
						return;
					}
				} 
				else {
					if (itemClass) {
						if($('.box-miss').css('display') == 'none') {
							$('.box-miss').show();
						}
						setTimeout(function() {
							if($('.box-miss').css('display') != 'none') {
								$('.box-miss').hide();
							}
						}, 1000);
						var missSpd  = ( (options.bMgBottom) / (options.wHeight - options.iWidth - options.bMgBottom) ) * thisSpd / 2;
						missCount--;
						appendTip('miss');
					}
					$this.animate({'top': options.wHeight - options.iWidth - options.bPdBottom + 'px'}, missSpd, 'linear', function() {
						//$this.animate({'opacity': '0'}, 500);
						$this.hide();
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
			audiobgm.pause();
			$('.tip, .item').stop(true).remove();
			$('.box, .ground').hide();
			container.removeClass('active');
			if (level < options.target.length - 1) {
				audio5.play();
				$('.gameclear').html('LEVEL ' + level + '<br/>CLEAR').fadeIn(300);
				$('.next').delay(500).fadeIn(1000);
				$('.circle-clear').show().delay(500).animate({top: '40%'}, 300).animate({top: '70%'}, 200).animate({top: '45%'}, 300).animate({top: '50%'}, 300);
				$('#preload-box').css('backgroundImage', 'url("./assets/images/box-'+(level+1)+'.gif")');
				$('#preload-box-miss').css('backgroundImage', 'url("./assets/images/box-'+(level+1)+'.png")');
				//var html = '<div class="gift" id="gift' + level + '"></div>';
				//container.append(html);
				//$('#gift' + level).delay(600).animate({bottom: '-180px'}, 1000).delay(300).animate({bottom: '-220px'}, 70).delay(100).animate({bottom: 0}, 300).animate({bottom: '-20px'}, 50, function() {
				//	setTimeout(function() {
				//		$('.next').fadeIn(300);
				//	}, 1000);
				//});
			} else {
				audio6.play();
				$('.gameclear').html('恭喜通关！<br/>并获得阿诚哥的祝福❤').fadeIn(300);
				$('.retry').delay(500).fadeIn(1000);
				$('.circle-clear').show().delay(500).animate({top: '40%'}, 300).animate({top: '70%'}, 200).animate({top: '45%'}, 300).animate({top: '50%'}, 300);
			}
		}
		function finishGame() {
			audiobgm.pause();
			var id = 'audio' + Math.floor(Math.random() * 3 + 7);
			document.getElementById(id).play();
			$('.tip, .item').stop(true).remove();
			$('.box, .ground').hide();
			$('.goscore').html(score);
			$('.gameover').show();
			$('.retry').delay(500).fadeIn(1000);
			$('.circle-over').show().delay(500).animate({top: '40%'}, 300).animate({top: '70%'}, 200).animate({top: '45%'}, 300).animate({top: '50%'}, 300);
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
