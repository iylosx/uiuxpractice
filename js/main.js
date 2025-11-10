$(function () {
  const $menu = $('header');
  const $links = $('header ul li a');
  const $sections = $('*[data-menu]');
  let pos = [];

  // 섹션 포지션 캐시 (리사이즈 시 갱신)
  function measure() {
    pos = $sections.map(function () {
      const $el = $(this);
      return {
        name: $el.attr('data-menu'),
        top:  Math.floor($el.offset().top),
        // padding/border 포함, 마진까지 고려하려면 outerHeight(true)
        bottom: Math.floor($el.offset().top + $el.outerHeight())
      };
    }).get();
  }

  function setActive() {
    const st = $(window).scrollTop();
    const hh = $menu.outerHeight();
    const wh = $(window).height();

    // 화면 안쪽 35% 지점(헤더 바로 아래보다 안쪽)
    const checkpoint = st + hh + wh * 0.35;

    // checkpoint가 포함된 섹션 찾기
    let current = null;
    for (let i = 0; i < pos.length; i++) {
      if (checkpoint >= pos[i].top && checkpoint < pos[i].bottom) {
        current = pos[i].name;
        break;
      }
    }

    // 맨 위/맨 아래 예외 처리
    if (!current && st < pos[0].top - hh) current = null;
    if (!current && st + wh >= pos[pos.length - 1].bottom) current = pos[pos.length - 1].name;

    $links.removeClass('active');
    if (current) $links.filter('[data-link="'+ current +'"]').addClass('active');
  }

  // 클릭 이동
  $links.on('click', function (e) {
    e.preventDefault();
    const key = $(this).attr('data-link');
    const $target = $sections.filter('[data-menu="'+ key +'"]');
    if (!$target.length) return;

    const hh = $menu.outerHeight();
    const top = Math.floor($target.offset().top - hh + 1); // 경계 오차 방지 +1
    $('html, body').animate({ scrollTop: top }, 500);
  });

  // 최초/리사이즈/스크롤
  measure();
  setActive();
  $(window).on('resize', function(){ measure(); setActive(); });
  $(window).on('scroll', setActive);
});
