# Youtube-Comment-AI-Analysis

### 빈 폴더 만들기

폴더 이름: 'youtube-comment'로 이름 수정

> 반드시 폴더명은 `소문자`로 작성

---
### 안티그래비티를 열고 폴더 오픈

---
### Next.js 기반 코드 베이스 구축

터미널을 열고

> npx create-next-app@latest .

---
### 코드 수정

- readme.md 파일 내용 삭제
- public 폴더에 있는 이미지 삭제
- app/layout.tsx 파일에서 title, description 수정

---
### 프런트 UI 추가 기능 설치

터미널을 열고

> npx shadcn@latest init

---
### clonecn skill 설치

터미널에서

> npx skills add hunvreus/clonecn --skill clonecn

* 참고: https://github.com/hunvreus/clonecn/blob/main/README.md

---
### AI 툴킷 설치

터미널에서

> npm install ai @ai-sdk/react @ai-sdk/google zod

---
### YouTube Data API 키 받기

브라우저에서

> https://console.cloud.google.com/apis 에 접속

---
### YouTube Data API 키 저장하기

- .env.local 파일 만들기
- 복사한 API 키값을 `YOUTUBE_API_KEY=` 에 연결

---
### Gemini API 키 받기

- Google AI Studio에서 발급받은 Gemini API 키를 .env.local 파일에 저장

---
### 유튜브 영상 댓글 AI 분석 서비스 제작

프롬프트:

```
- 유튜브 댓글 수집: YouTube API를 통해 유튜브 URL 또는 비디오 ID로 댓글 가져오기
- Gemini 모델: gemini-3.1-flash-lite-preview
- 댓글 분석: Gemini API를 사용한 감정 분석(긍정/부정/중립) 및 키워드 추출
- 시각화:
	○ 감정 분포 파이 차트
	○ 시간대별 긍정,부정,중립 댓글 수
	○ 시간대별 댓글 수 라인 차트
	○ 댓글 통계 카드(총 댓글 수, 평균 길이 등)
	○ bigram 단어 쌍을 분석하고 네트워크 시각화로 나타내기
	○ 시각화는 모두 인터렉티브하게 구현
- UI: 밝은 톤의 모던한 디자인
- 에러처리 및 로딩상태 관리
	○ 분석이 진행 중일 때 화면에 로딩 효과 구현
```

- `ref_img.png` 를 디자인 시스템처럼 참고

---
### 코드 최적화

터미널에서

> npm run build

---
### 깃허브 연동 및 코드베이스 업로드

- 깃허브에 접속해서 저장소 생성

프롬프트:

> 현재 연결된 깃허브 정보를 알려줘

깃허브 정보를 확인 후:

> https://github.com/Kyonam/youtube-comments.git 이 곳에 코드 베이스를 업로드해줘

---
### Vercel 배포

- 배포시 .env.local 파일에 있는 환경 변수 등록 잊지 말 것