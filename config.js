/*
 * ─────────────────────────────────────────────
 *  루시안 채팅창 CSS 상세페이지 — 설정 파일
 *  평소에는 이 파일만 고치면 돼요.
 * ─────────────────────────────────────────────
 */
window.LUCIAN = {
  // 기본 가격 (원)
  basePrice: 210000,

  // 운영 슬롯 : true = 진행중(●) / false = 비었음(○)
  slots: {
    normal: [true, false, false, false],
    fast:   [true, false, false]
  },

  // 추가 옵션 — price에 숫자를 넣으면 "+00,000원", 글자를 넣으면 그대로 보여요.
  addons: [
    { name: '빠른 마감',               price: '견적 문의' },
    { name: '치지직 / SOOP 2가지 사용', price: '견적 문의' },
    { name: '유튜브 사용',             price: '견적 문의' }
  ],

  // 작업물 이미지 (위 = 예전, 아래 = 최신)
  works: [
    { src: 'works/chat01.jpg' },
    { src: 'works/chat02.jpg' },
    { src: 'works/chat03.jpg' },
    { src: 'works/chat04.jpg' },
    { src: 'works/chat05.jpg' },
    { src: 'works/chat06.jpg' },
    { src: 'works/chat07.jpg' },
    { src: 'works/chat08.jpg' },
    { src: 'works/chat09.jpg' }
  ]
};
