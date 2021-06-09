# GIT STORY

[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.png?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![License](https://img.shields.io/badge/License-GPL3.0-brightgreen)](./LICENSE)
[![firebase](https://img.shields.io/badge/Backend-firebase-orange)](https://firebase.google.com/?hl=ko)


## 개요
깃으로 블로그를 관리한다는 것은 의외로 귀찮습니다.

자유성이 높은 대신, 페이지 제작부터 마크다운의 제작, [Git](https://git-scm.com/)을 설치하고 설정하며 관리하기까지. 애초에 [Git](https://git-scm.com/) 이 설치되어 있지 않으면 사용할 수 없는 것입니다.

GIT-STORY 는 그런 작업들을 전부 없애주고, 하나의 블로그 플랫폼처럼 동작하는 서비스입니다.

Hexo 커뮤니티가 만든 수많은 테마 중 하나를 선택하세요.

인터넷만 된다면 브라우저로 접속해서 글을 작성하세요.

플러그인으로 더욱 강력한 블로그의 기능을 쉽게 추가할 수도 있습니다.


## 동작

GIT-STORY는 [hexo](https://hexo.io/)로 제작할 수 있는 정적 웹 사이트를 온라인에서 동작하도록 만드는 플랫폼입니다.

[Actions](https://github.com/features/actions)를 사용하여 새로 추가된 파일을 감지하고, 정적 웹 사이트를 빌드 후 커밋합니다.

브라우저에선 [Github API](https://docs.github.com/en/rest)를 사용해 사용자의 깃헙 파일을 관리합니다.

때문에 백엔드에선 별도의 관리가 필요하지 않은 똑똑한 플랫폼입니다.

## 빌드

### 프로젝트 다운로드

프로젝트를 다운로드 후 yarn을 이용하여 종속된 모듈을 설치하세요.

```bash
https://github.com/git-story/git-story.git
cd git-story
npm install
```

### 프로젝트 실행

다음 명령어를 사용하여 개발을 위한 컴파일, Hot-reload 를 사용할 수 있습니다.
```bash
npm run serve
```

### 프로젝트 빌드

다음 명령어를 사용하여 배포를 위한 빌드를 진행하세요.
```bash
npm run build
```


## 개발 규칙

### 파일명

Vue 파일은 `PascalCase` 로 생성.
이외 파일은 `kebab-case` 로 생성.
폴더의 경우, vue 파일이 존재하기 위한 경우엔 `PascalCase`, 이외의 경우는 `kebab-case`로 생성

### 변수, 함수명

클래스의 경우 `PascalCase` 로 작성.
이외 전부 `camelCase`로 작성.

### 클래스 사이의 공백

클래스 작성시 프로퍼티 그룹, 메소드, 컨스트럭쳐 간 공백이 필요합니다.

```typescript
class A {
// 공백
  public property1: number = 1;
  public property2: number = 2;
// 공백
  private property3: number = 3;
// 공백
  constructor() {
  }
// 공백
  public method1() {
  }
// 공백
  private method2() {
  }
// 공백
}
```

### 파일 생성

렌더링되는 모든 페이지는 `views` 폴더에 작성합니다.
각 폴더는 모두 `router`에 해당하는 경로이며 경로  폴더 안에는 vue 파일이 작성됩니다.

모듈은 모두 `plugins` 폴더에 작성합니다.

인터페이스, 타입 선언은 모두 `interface` 폴더에 작성합니다.

이미지 등 필요한 미디어는 `asset` 폴더에 작성합니다.


## 마크다운 에디터

Git-Story에서 사용하는 마크다운 에디터는 다음 레포지토리에서 볼 수 있습니다.

https://github.com/git-story/md-editor

## 라이센스

[GPL 3.0](./LICENSE)

---
감사합니다.
