(function () {
  var C = window.LUCIAN || {};
  var SOURCE = 'lucian-artmug';
  var inFrame = window.self !== window.top;
  if (!inFrame) document.documentElement.classList.add('standalone');

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var won = function (n) { return Number(n).toLocaleString('ko-KR'); };

  /* ── 설정 반영 ── */
  if (C.basePrice) $('#basePrice').textContent = won(C.basePrice);

  var addons = $('#addons');
  (C.addons || []).forEach(function (a) {
    var li = document.createElement('li');
    var p = typeof a.price === 'number' ? '+' + won(a.price) + '원' : (a.price || '견적 문의');
    li.innerHTML = '<span></span><span></span>';
    li.children[0].textContent = a.name;
    li.children[1].textContent = p;
    addons.appendChild(li);
  });

  function drawSlots(el, arr) {
    (arr || []).forEach(function (full) {
      var d = document.createElement('span');
      d.className = 'dot' + (full ? ' full' : '');
      d.title = full ? '진행중' : '비었음';
      el.appendChild(d);
    });
  }
  drawSlots($('#slotNormal'), C.slots && C.slots.normal);
  drawSlots($('#slotFast'), C.slots && C.slots.fast);

  var works = $('#worksList');
  if (C.works && C.works.length) {
    C.works.forEach(function (w) {
      var f = document.createElement('figure');
      var img = document.createElement('img');
      img.src = w.src; img.alt = w.title || '작업물'; img.loading = 'lazy';
      img.addEventListener('load', postHeight);
      f.appendChild(img);
      if (w.title) { var c = document.createElement('figcaption'); c.textContent = w.title; f.appendChild(c); }
      works.appendChild(f);
    });
  } else {
    works.innerHTML = '<div class="empty">작업물을 준비하고 있어요.</div>';
  }

  /* ── 옵션 / 미리보기 ── */
  var state = {
    viewerNick: 'O', streamerNick: 'O', viewerIcon: 'O',
    viewerAlign: '좌', streamerAlign: '우', donationAlign: '중앙', platform: '치지직'
  };
  var alignClass = { '좌': '', '중앙': 'al-c', '우': 'al-r' };

  function applyPreview(changedKey) {
    var chat = $('#chat');
    chat.classList.toggle('no-icon', state.viewerIcon === 'X');
    $$('.msg', chat).forEach(function (m) {
      var t = m.getAttribute('data-type');
      var a = t === 'viewer' ? state.viewerAlign : t === 'streamer' ? state.streamerAlign : state.donationAlign;
      m.classList.remove('al-c', 'al-r');
      if (alignClass[a]) m.classList.add(alignClass[a]);
      var who = $('.who', m);
      var showNick = t === 'streamer' ? state.streamerNick === 'O' : state.viewerNick === 'O';
      $('.nick', m).style.display = showNick ? '' : 'none';
      var hasIcon = t !== 'streamer' && state.viewerIcon === 'O';
      who.classList.toggle('hide', !showNick && !hasIcon);
      if (changedKey) { m.classList.remove('pop'); void m.offsetWidth; m.classList.add('pop'); }
    });
    var sn = ($('#f_ko') && $('#f_ko').value.trim()) || '스트리머';
    $('[data-streamer]').textContent = sn;
  }

  $$('.seg').forEach(function (seg) {
    var key = seg.getAttribute('data-key');
    seg.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      $$('button', seg).forEach(function (x) { x.classList.toggle('on', x === b); });
      state[key] = b.getAttribute('data-v');
      applyPreview(key);
      render();
    });
  });

  /* ── 신청 양식 ── */
  var labels = [
    ['viewerNick', '시청자 닉네임 표기 (O/X)'],
    ['streamerNick', '스트리머 닉네임 표기 (O/X)'],
    ['viewerIcon', '시청자 아이콘(구독,후원랭킹 등) 표기 (O/X)'],
    ['viewerAlign', '시청자 채팅 정렬 위치 (좌/중앙/우)'],
    ['streamerAlign', '스트리머 채팅 정렬 위치 (좌/중앙/우)'],
    ['donationAlign', '후원 채팅 정렬 위치 (좌/중앙/우)'],
    ['platform', '방송 플랫폼 (치지직/SOOP)']
  ];
  var short = {
    viewerNick: '시청자 닉네임', streamerNick: '스트리머 닉네임', viewerIcon: '시청자 아이콘',
    viewerAlign: '시청자 정렬', streamerAlign: '스트리머 정렬', donationAlign: '후원 정렬', platform: '플랫폼'
  };
  var v = function (id) { return $('#' + id).value.trim(); };

  function buildText() {
    return [
      '[ 디자인 신청 양식 ]',
      '',
      '1. 방송 정보',
      '- 채널 주소 : ' + v('f_url'),
      '- 활동명(한글) : ' + v('f_ko'),
      '- 활동명(영문) : ' + v('f_en'),
      '',
      '2. 상세 옵션'
    ].concat(labels.map(function (l) { return '- ' + l[1] + ' : ' + state[l[0]]; })).concat([
      '',
      '3. 희망 마감일(기본 마감일 15일, 빠른마감시 추가금) : ' + v('f_due'),
      '',
      '4. 컨셉 설명 :',
      v('f_concept'),
      '',
      '5. 자료 전달 : ' + v('f_drive')
    ]).join('\n');
  }

  function render() {
    $('#picked').innerHTML = labels.map(function (l) {
      return '<li><span>' + short[l[0]] + '</span><b>' + state[l[0]] + '</b></li>';
    }).join('');
    $('#out').textContent = buildText();
    postHeight();
  }

  $$('#form input, #form textarea').forEach(function (el) {
    el.addEventListener('input', function () { render(); if (el.id === 'f_ko') applyPreview(); });
  });

  $('#copyBtn').addEventListener('click', function () {
    var text = buildText();
    var msg = $('#copyMsg');
    var done = function () { msg.textContent = '복사했어요! 아트머그 문의 창에 붙여 넣어 주세요.'; };
    var fallback = function () {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); }
      catch (e) { msg.textContent = '복사가 안 되면 위 내용을 길게 눌러 직접 복사해 주세요.'; }
      document.body.removeChild(ta);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else fallback();
  });

  /* ── 메뉴 이동 (아트머그 iframe 안에서는 부모 페이지를 스크롤) ── */
  $$('[data-go]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.getElementById(a.getAttribute('data-go'));
      if (!target) return;
      e.preventDefault();
      if (inFrame) {
        var top = target.getBoundingClientRect().top + (window.scrollY || 0);
        window.parent.postMessage({ source: SOURCE, type: 'scrollTo', top: top }, '*');
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── 높이 전달 (아트머그 iframe 크기 자동 맞춤) ── */
  var lastH = 0;
  function postHeight() {
    if (!inFrame) return;
    var h = Math.ceil($('.page').getBoundingClientRect().height);
    if (Math.abs(h - lastH) < 2) return;
    lastH = h;
    window.parent.postMessage({ source: SOURCE, type: 'height', height: h }, '*');
  }
  if ('ResizeObserver' in window) new ResizeObserver(postHeight).observe(document.body);
  window.addEventListener('load', postHeight);
  $$('details').forEach(function (d) { d.addEventListener('toggle', postHeight); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(postHeight);

  applyPreview();
  render();
})();
