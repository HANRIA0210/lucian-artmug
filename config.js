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
  //  - 칸 수를 늘리거나 줄이려면 true/false 개수를 바꾸면 돼요.
  slots: {
    normal: [true, false, false, false],
    fast:   [true, false, false]
  },

  // 작업물 — src: 평소 이미지 / gif: 마우스를 올렸을 때 움직이는 이미지
  works: [
    { src: 'works/chat01.jpg', gif: 'works/chat01.gif' },
    { src: 'works/chat02.jpg', gif: 'works/chat02.gif' },
    { src: 'works/chat03.jpg', gif: 'works/chat03.gif' },
    { src: 'works/chat04.jpg', gif: 'works/chat04.gif' },
    { src: 'works/chat05.jpg', gif: 'works/chat05.gif' },
    { src: 'works/chat06.jpg', gif: 'works/chat06.gif' },
    { src: 'works/chat07.jpg', gif: 'works/chat07.gif' },
    { src: 'works/chat08.jpg', gif: 'works/chat08.gif' },
    { src: 'works/chat09.jpg', gif: 'works/chat09.gif' }
  ]
};
