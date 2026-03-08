# 문서 구조 표준 (모든 PompCore 프로젝트 공통)

```
docs/
├── patchnotes/          # 버전별 패치노트
│   └── v{X.Y.Z}.md     #   양식: # v{버전} - {제목}
│                        #         **날짜:** YYYY-MM-DD
│                        #         ## 개발된 내용
│                        #         ## 기존 대비 변경된 부분
│
├── completed/           # 개발 완료 목록
│   └── README.md        #   양식: ## v{버전} (날짜)
│                        #         - [x] 완료 항목
│
├── roadmap/             # 개발 예정 목록
│   └── README.md        #   양식: ## 우선순위: High/Mid/Low
│                        #         - [ ] 예정 항목
│
├── memory/              # 프로젝트 기억 사항
│   ├── README.md        #   작업 규칙, 프로젝트 정보, 확장 포인트
│   └── {topic}.md       #   디자인 결정, 기술 선택 등 주제별 파일
│
├── design/              # 디자인 리소스
│   └── *.svg / *.png    #   로고, UI 시안, 레퍼런스
│
└── templates/           # 이식용 템플릿
    ├── PROJECT_BOOTSTRAP.md   # 새 프로젝트 세팅 가이드
    ├── AI_WORK_RULES.md       # AI 개발 환경 프롬프트
    └── DOCS_STRUCTURE.md      # 이 문서
```

## CHANGELOG.md (루트)

```markdown
# {프로젝트명} Changelog

모든 버전별 상세 패치노트는 [docs/patchnotes/](docs/patchnotes/) 참조.

## [{버전}] - {날짜}
{한줄 요약}
- 변경사항 1
- 변경사항 2
상세: [docs/patchnotes/v{버전}.md](docs/patchnotes/v{버전}.md)
```

## 새 프로젝트에 적용하는 법

1. 이 `docs/templates/` 폴더를 새 프로젝트로 복사
2. `docs/` 하위 폴더들 생성 (patchnotes, completed, roadmap, memory, design)
3. 각 폴더에 README.md 초기 파일 생성
4. AI 세션 시작 시 `AI_WORK_RULES.md` 내용을 첫 메시지로 전달
5. CHANGELOG.md를 프로젝트 루트에 생성
