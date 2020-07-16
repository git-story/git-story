# GIT STORY

[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.png?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![License](https://img.shields.io/badge/License-GPL3.0-brightgreen)](./LICENSE)
[![firebase](https://img.shields.io/badge/Backend-firebase-orange)](https://firebase.google.com/?hl=ko)


## 개요
깃으로 블로그를 관리한다는 것은 의외로 귀찮습니다.

자유성이 높은 대신, 페이지 제작부터 마크다운의 제작, [Git](https://git-scm.com/)을 설치하고 설정하며 관리하기까지. 애초에 [Git](https://git-scm.com/) 이 설치되어 있지 않으면 사용할 수 없는 것입니다.

GIT-STORY 는 그런 작업들을 전부 없애주고, 하나의 블로그 플랫폼처럼 동작하는 서비스입니다.

기본적으로 제공하는 예쁜 템플릿을 가지고 블로그를 관리해 보세요.

인터넷만 된다면 핸드폰으로, PC로 글을 작성해서 커밋하세요.

플러그인으로 더욱 강력한 블로그의 기능을 쉽게 추가할 수도 있습니다.

## 빌드

### 프로젝트 다운로드

프로젝트를 다운로드 후 yarn을 이용하여 종속된 모듈을 설치하세요.

```bash
git clone https://github.com/mobbing/git-story.git
cd git-story
yarn
```

### 프로젝트 실행

다음 명령어를 사용하여 개발을 위한 컴파일, Hot-reload 를 사용할 수 있습니다.
```bash
yarn serve
```

### 프로젝트 빌드

다음 명령어를 사용하여 배포를 위한 빌드를 진행하세요.
```bash
yarn build
```

### 개발 규칙

#### 파일명

Vue 파일은 `PascalCase` 로 생성.
이외 파일은 `kebab-case` 로 생성.
폴더의 경우, vue 파일이 존재하기 위한 경우엔 `PascalCase`, 이외의 경우는 `kebab-case`로 생성

## 라이센스

[GPL 3.0](./LICENSE)

---
감사합니다.
