/*
 * 아트머그 상품 페이지(부모)에서 도는 스크립트.
 * 아트머그 작가 설정의 "커스텀 메뉴" 칸(PC · 모바일)에 <script src="...">로 넣어요.
 *  - 상세설명 「내용 더 보기」 접힘을 풀어요.
 *  - 루시안 페이지(iframe)가 알려주는 높이에 맞춰 iframe 크기를 바꿔요.
 *  - iframe 안의 메뉴를 누르면 아트머그 페이지를 그 위치로 스크롤해요.
 */
(function () {
  if (window.__lucianArtmug) return;
  window.__lucianArtmug = true;

  var SOURCE = 'lucian-artmug';
  var MIN_HEIGHT = 700;

  function getIframe() { return document.querySelector('[name="lucian-root"] iframe'); }

  function injectStyle() {
    if (document.getElementById('lucian-artmug-style')) return;
    var s = document.createElement('style');
    s.id = 'lucian-artmug-style';
    s.textContent =
      '[name="lucian-root"]{padding:0!important;margin:0!important;line-height:normal!important;text-align:start!important;}' +
      '[name="lucian-root"] [name="fallback"]{display:none!important;}' +
      '[name="lucian-root"] iframe{display:block!important;width:100%!important;max-width:1180px;min-height:' + MIN_HEIGHT + 'px;margin:0 auto!important;border:0!important;}' +
      '.detailinfo,.detailinfo .showcontent{max-height:none!important;overflow:visible!important;}' +
      '.btn_open_btn,.btn_open,.btn_close{display:none!important;}';
    (document.head || document.documentElement).appendChild(s);
  }

  function unlockDetail() {
    document.querySelectorAll('.detailinfo, .showcontent').forEach(function (b) {
      b.classList.remove('showstep1');
      b.style.maxHeight = 'none';
      b.style.overflow = 'visible';
    });
  }

  window.addEventListener('message', function (e) {
    var iframe = getIframe();
    if (!iframe || e.source !== iframe.contentWindow) return;
    var d = e.data || {};
    if (d.source !== SOURCE) return;
    if (d.type === 'height') {
      var h = Math.max(MIN_HEIGHT, Math.ceil(Number(d.height) || 0));
      iframe.style.height = h + 'px';
      iframe.setAttribute('height', h);
    } else if (d.type === 'scrollTo') {
      var y = (window.scrollY || 0) + iframe.getBoundingClientRect().top + Number(d.top || 0) - 12;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
  });

  function init() { injectStyle(); unlockDetail(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  setTimeout(unlockDetail, 800);
})();
