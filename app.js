function lucianStart(C) {
  C = C || {};
  var SOURCE = 'lucian-artmug';
  var inFrame = window.self !== window.top;
  if (!inFrame) document.documentElement.classList.add('standalone');

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var won = function (n) { return Number(n).toLocaleString('ko-KR'); };

  /* ── 설정 반영 ── */
  if (C.basePrice) $('#basePrice').textContent = won(C.basePrice);

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

  /* ── 문구 영역 (data.json) ── */
  var list = function (arr) { return Array.isArray(arr) ? arr : []; };
  var paras = function (t) { return String(t || '').split('\n').map(function (p) { return '<p>' + p + '</p>'; }).join(''); };
  $('#alert').innerHTML = list(C.alert).map(function (t) { return '<p>' + t + '</p>'; }).join('');
  if (!list(C.alert).length) $('#alert').style.display = 'none';
  $('#included').innerHTML = list(C.included).map(function (t) { return '<li>' + t + '</li>'; }).join('');
  $('#basics').innerHTML = list(C.basics).map(function (t, i) { return '<li><span>' + (i + 1) + '</span>' + t + '</li>'; }).join('');
  $('#steps').innerHTML = list(C.process).map(function (p) { return '<li><b>' + p.title + '</b><span>' + p.text + '</span></li>'; }).join('');
  $('#notices').innerHTML = list(C.notices).map(function (n, i) {
    return '<details' + (i === 0 ? ' open' : '') + '><summary>' + n.title + '</summary>' + paras(n.text) + '</details>';
  }).join('');

  var works = $('#worksList');
  if (C.works && C.works.length) {
    C.works.forEach(function (w) {
      var f = document.createElement('figure');
      var box = document.createElement('div');
      box.className = 'work-box';
      var img = document.createElement('img');
      img.src = w.src; img.alt = w.title || '작업물';
      img.addEventListener('load', postHeight);
      box.appendChild(img);
      if (w.gif) {
        var anim = document.createElement('img');
        anim.className = 'work-gif'; anim.alt = '';
        anim.addEventListener('load', function () { if (f.classList.contains('on')) anim.classList.add('ready'); });
        box.appendChild(anim);
        var hint = document.createElement('span');
        hint.className = 'work-play'; hint.textContent = '▶';
        box.appendChild(hint);
        f.__gif = { el: anim, src: w.gif };
      }
      f.appendChild(box);
      if (w.title) { var c = document.createElement('figcaption'); c.textContent = w.title; f.appendChild(c); }
      works.appendChild(f);
    });

    /* 마우스를 올리면(모바일은 터치) 크게 + GIF 재생 */
    var setOrigin = function (f) {
      var wr = works.getBoundingClientRect(), r = f.getBoundingClientRect();
      var cx = (r.left + r.width / 2 - wr.left) / wr.width, cy = (r.top + r.height / 2 - wr.top) / wr.height;
      var ox = cx < 0.34 ? 'left' : cx > 0.66 ? 'right' : 'center';
      var oy = cy < 0.34 ? 'top' : cy > 0.66 ? 'bottom' : 'center';
      f.style.transformOrigin = ox + ' ' + oy;
    };
    var open = function (f) {
      if (f.classList.contains('on')) return;
      $$('figure.on', works).forEach(close);
      setOrigin(f);
      f.classList.add('on');
      var g = f.__gif;
      if (g) {
        g.el.classList.remove('ready');
        g.el.src = '';
        g.el.src = g.src;   // 처음부터 재생
        if (g.el.complete && g.el.naturalWidth) g.el.classList.add('ready');
      }
    };
    var close = function (f) {
      f.classList.remove('on');
      if (f.__gif) { f.__gif.el.classList.remove('ready'); f.__gif.el.removeAttribute('src'); }
    };
    $$('figure', works).forEach(function (f) {
      var lastType = 'mouse';
      f.addEventListener('pointerdown', function (e) { lastType = e.pointerType; });
      f.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') open(f); });
      f.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') close(f); });
      f.addEventListener('click', function () {
        if (lastType === 'mouse') return;   // 마우스는 올리기만 해도 열려요
        f.classList.contains('on') ? close(f) : open(f);
      });
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
        window.parent.postMessage({ source: SOURCE, type: 'scrollTo', top: top - 80 }, '*');
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

  /* ── 상단 메뉴 따라오기 (아트머그 iframe 안: 부모가 알려주는 스크롤 위치로 이동) ── */
  if (inFrame) {
    var nav = $('#nav');
    window.addEventListener('message', function (e) {
      if (e.source !== window.parent) return;
      var d = e.data || {};
      if (d.source !== 'lucian-artmug-parent' || d.type !== 'viewport') return;
      var pageH = $('.page').getBoundingClientRect().height;
      var y = Math.max(0, Math.min(-Number(d.iframeTop || 0), pageH - 120));
      nav.style.transform = 'translateY(' + y + 'px)';
    });
    window.parent.postMessage({ source: SOURCE, type: 'ready' }, '*');
  }

  applyPreview();
  render();
}

(function () {
  fetch('data.json?t=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(lucianStart)
    .catch(function () { lucianStart({}); });
})();
