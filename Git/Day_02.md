# Git & GitHub 정리

## 1. GitHub 기초

### GitHub이란?

GitHub은 **Git 저장소를 인터넷에서 호스팅하는 서비스**이다.  
계정을 만든 뒤 새 Repository를 생성하면 원격 저장소 주소(URL)가 발급된다.

### 원격 저장소(Remote Repository)

원격 저장소는 인터넷에 있는 Git 저장소를 의미한다.

주요 역할은 다음과 같다.

- 여러 사람이 같은 코드를 공유할 수 있다.
- 로컬 저장소의 백업 역할을 한다.
- 팀 협업의 기준점이 된다.

### 원격 저장소 연결 명령어

```bash
git remote add origin <원격_저장소_URL>
git remote -v
```

- `git remote add origin <URL>`: 현재 로컬 저장소에 원격 저장소를 등록한다.
- `git remote -v`: 등록된 원격 저장소 주소를 확인한다.

---

## 2. `git push` / `git pull`

로컬 저장소와 원격 저장소를 동기화할 때 사용하는 대표 명령어이다.

### `git push`

로컬에서 만든 커밋을 원격 저장소로 업로드한다.

```bash
git push -u origin main
```

- `origin`: 원격 저장소 이름
- `main`: 업로드할 브랜치 이름
- `-u`: 이후부터 같은 브랜치에 대해 `git push`만 입력해도 되도록 upstream을 설정

### `git pull`

원격 저장소의 변경 사항을 내려받아 로컬 저장소에 반영한다.

```bash
git pull
```

### 기본 흐름

1. 로컬에서 작업 후 커밋 생성
2. 원격 저장소로 업로드

```bash
git push -u origin main
```

3. GitHub 웹 또는 다른 팀원이 파일 수정 및 커밋 생성
4. 원격 저장소의 변경 사항을 로컬로 다운로드

```bash
git pull
```

---

## 3. Clone vs Fork

### Clone

Clone은 **원격 저장소를 그대로 내 로컬 컴퓨터로 복사**하는 방식이다.

주로 다음 상황에서 사용한다.

- 같은 저장소에 직접 push 권한이 있을 때
- 팀 내부 협업을 할 때
- 회사 또는 팀 프로젝트를 로컬에서 작업할 때

```bash
git clone <원격_저장소_URL>
```

### Fork

Fork는 **다른 사람의 저장소를 내 GitHub 계정으로 복사**하는 방식이다.

주로 다음 상황에서 사용한다.

- 원본 저장소에 직접 push 권한이 없을 때
- 오픈소스 프로젝트에 기여할 때
- 원본 저장소를 수정하지 않고 내 계정에서 실험하고 싶을 때

### Clone과 Fork 비교

| 구분 | Clone | Fork |
|---|---|---|
| 의미 | 원격 저장소를 로컬로 복사 | 다른 사람의 저장소를 내 GitHub 계정으로 복사 |
| 저장 위치 | 내 컴퓨터 | 내 GitHub 계정 |
| 주 사용 상황 | 팀 내부 협업 | 오픈소스 기여 |
| push 권한 | 원본 저장소에 권한 필요 | 내 Fork 저장소에는 push 가능 |

---

## 4. Pull Request(PR)

Pull Request는 **변경 사항을 원본 저장소에 반영해 달라고 요청하는 절차**이다.

PR에서는 보통 다음 작업을 수행한다.

- 변경 내용 설명
- 코드 리뷰 요청
- 병합 전 검증
- 이슈와 연결
- 테스트 결과 확인

### PR의 목적

PR은 단순히 코드를 합치는 기능이 아니라, 팀원이 변경 내용을 검토하고 프로젝트 품질을 유지하기 위한 협업 절차이다.

---

## 5. Code Review 기본

Code Review는 코드를 병합하기 전에 함께 확인하는 과정이다.

### Code Review의 목적

- 버그 예방
- 코드 품질 유지
- 팀 규칙 공유
- 유지보수성 향상

### 기본 원칙

- 사람보다 **코드 중심**으로 리뷰한다.
- 단순 지적이 아니라 **이유가 있는 코멘트**를 남긴다.
- 리뷰 승인 후 병합한다.

예시 코멘트:

```text
이 함수는 입력값이 비어 있을 때 예외가 발생할 수 있습니다.
초기 검증 로직을 추가하는 것이 좋겠습니다.
```

---

## 6. Issue 사용법

Issue는 프로젝트에서 할 일, 버그 리포트, 기능 요청 등을 관리하는 기능이다.

### Issue로 관리할 수 있는 것

- 해야 할 작업
- 버그 수정
- 기능 요청
- 문서 수정
- 질문 또는 논의 사항

### PR과 Issue 연결

Pull Request 설명에 특정 키워드와 Issue 번호를 적으면 PR이 병합될 때 Issue를 자동으로 닫을 수 있다.

```text
Resolve: #1234
```

또는 다음과 같은 키워드도 자주 사용한다.

```text
Closes #1234
Fixes #1234
Resolves #1234
```

---

## 7. 협업 실습: Fork & Clone 방식

Fork & Clone 방식은 원본 저장소에 직접 push 권한이 없을 때 자주 사용하는 협업 방식이다.

### 작업 순서

1. Issue 생성
2. 원본 저장소를 내 GitHub 계정으로 Fork
3. 내 Fork 저장소를 로컬로 Clone

```bash
git clone <내_포크_저장소_URL>
```

4. 원본 저장소를 `upstream`으로 연결

```bash
git remote add upstream <원본_저장소_URL>
```

5. 원본 저장소의 최신 코드 받기

```bash
git pull upstream main
```

6. 작업용 브랜치 생성

```bash
git switch -c feature/add-my-name
```

7. 코드 수정 후 커밋

```bash
git add .
git commit -m "Add my name"
```

8. 내 Fork 저장소로 push

```bash
git push origin feature/add-my-name
```

9. GitHub에서 Pull Request 생성

---

## 8. 협업 실습: Collaborator 방식

Collaborator 방식은 원본 저장소에 직접 협업자로 등록되어 작업하는 방식이다.

### 작업 순서

1. Repository collaborator 등록
2. Branch protection rules 추가
   - 예: `Require a pull request before merging`
3. 원본 저장소를 로컬로 Clone

```bash
git clone <원본_저장소_URL>
```

4. 새로운 브랜치 생성

```bash
git switch -c feature/mybranch
```

5. 작업 후 커밋

```bash
git add .
git commit -m "message"
```

6. 원격 브랜치에 push

```bash
git push origin feature/mybranch
```

7. GitHub에서 Pull Request 생성
   - `feature/mybranch` → `main`

---

## 9. 자주 사용하는 Git 명령어

## 9-1. `git show`

특정 커밋 하나를 자세히 확인할 때 사용하는 명령어이다.

확인할 수 있는 정보는 다음과 같다.

- 해당 커밋의 변경 내용(diff)
- 커밋 메시지
- 작성자
- 날짜

```bash
git show
```

`git show`는 기본적으로 `git show HEAD`와 같다.

```bash
git show HEAD
```

현재 브랜치의 최신 커밋 내용을 확인한다.

```bash
git show <커밋해시>
```

특정 커밋 하나를 지정해서 확인한다.

---

## 9-2. `git diff`

두 상태 간의 차이점만 비교해서 보여주는 명령어이다.

주요 사용 목적은 다음과 같다.

- 커밋 전 변경 사항 점검
- 병합 또는 충돌 원인 분석
- 스테이징 전후 변경 사항 확인

### 사용 예시

```bash
git diff
```

Working Directory와 Staging Area 사이의 차이를 확인한다.

```bash
git diff --staged
```

Staging Area와 HEAD 사이의 차이를 확인한다.

```bash
git diff HEAD~1 HEAD
```

직전 커밋과 현재 커밋의 차이를 확인한다.

---

## 9-3. `git blame`

파일의 각 줄이 **누가, 언제, 어떤 커밋에서 수정했는지** 추적하는 명령어이다.

주로 다음 상황에서 사용한다.

- 버그 원인을 추적할 때
- 특정 코드가 왜 작성되었는지 확인할 때
- 코드 변경 이력을 파악할 때

```bash
git blame main.py
```

`main.py` 파일의 각 줄에 대한 작성자, 수정 시점, 커밋 정보를 확인한다.

---

## 9-4. `git stash`

현재 작업 중인 변경 사항을 임시로 치워두는 명령어이다.

주로 다음 상황에서 유용하다.

- 아직 커밋하지 않았지만 잠시 다른 브랜치로 이동해야 할 때
- 긴급 수정 작업이 생겼을 때
- 현재 작업물을 임시 저장하고 싶을 때

### 사용 예시

```bash
git stash
```

현재 작업 중인 변경 사항을 임시 저장한다.

```bash
git stash list
```

저장된 stash 목록을 확인한다.

```bash
git stash pop
```

가장 최근 stash를 다시 적용하고 stash 목록에서 제거한다.

```bash
git stash apply
```

stash를 적용하지만 목록에서는 제거하지 않는다.

---

## 9-5. `git reset`

`git reset`은 브랜치의 기준을 과거 커밋으로 이동시키는 명령어이다.  
즉, **히스토리를 바꾸는 명령어**이므로 협업 브랜치에서는 주의해야 한다.

### 옵션별 차이

| 옵션 | 의미 | 변경 파일 유지 여부 | 스테이징 유지 여부 |
|---|---|---:|---:|
| `--soft` | 커밋만 취소 | 유지 | 유지 |
| `--mixed` | 커밋과 스테이징 취소 | 유지 | 취소 |
| `--hard` | 커밋, 스테이징, 파일 변경 모두 되돌림 | 삭제 | 취소 |

### 사용 예시

```bash
git reset --soft HEAD~1
```

HEAD를 한 커밋 이전으로 이동하지만 변경 내용은 유지한다.

```bash
git reset --hard HEAD~1
```

HEAD 이동, 스테이징, 파일 변경까지 모두 되돌린다.

> `--hard`는 작업 중인 변경 사항을 삭제할 수 있으므로 실행 전 반드시 확인해야 한다.

---

## 9-6. `git revert`

`git revert`는 특정 커밋을 되돌리는 **새 커밋을 생성**하는 명령어이다.

특징은 다음과 같다.

- 기존 히스토리는 그대로 유지한다.
- “이 커밋을 취소했다”는 기록이 남는다.
- 협업 중 안전하게 롤백할 때 적합하다.

```bash
git revert <커밋해시>
```

### `reset`과 `revert` 비교

| 구분 | `git reset` | `git revert` |
|---|---|---|
| 동작 방식 | 브랜치 기준을 과거로 이동 | 되돌리는 새 커밋 생성 |
| 히스토리 | 변경됨 | 보존됨 |
| 협업 브랜치 사용 | 주의 필요 | 상대적으로 안전 |
| 사용 상황 | 로컬에서 최근 커밋 정리 | 이미 공유된 커밋 롤백 |

---

## 9-7. `git commit --amend`

마지막 커밋을 고치는 옵션이다.

할 수 있는 작업은 다음과 같다.

- 가장 최근 커밋을 새 커밋으로 교체
- 커밋 메시지 수정
- 변경 파일 추가 또는 제거

### 사용 예시

```bash
git commit --amend
```

마지막 커밋을 수정한다.

```bash
git commit --amend --no-edit
```

기존 커밋 메시지는 그대로 유지하고 파일 변경만 반영한다.

> 이미 원격 저장소에 push한 커밋을 amend하면 히스토리가 바뀔 수 있으므로 협업 중에는 주의해야 한다.

---

## 10. 실무 관점 핵심 정리

### 협업 전 확인할 것

- 내가 원본 저장소에 push 권한이 있는가?
- 권한이 있으면 Collaborator 방식 사용
- 권한이 없으면 Fork & Pull Request 방식 사용
- 작업 전 항상 최신 코드를 가져오기

```bash
git pull origin main
```

또는 Fork 방식에서는 다음을 사용한다.

```bash
git pull upstream main
```

### 커밋 전 확인할 것

```bash
git status
git diff
git diff --staged
```

- 어떤 파일이 수정되었는지 확인한다.
- 의도하지 않은 변경이 포함되지 않았는지 확인한다.
- 스테이징된 변경 내용이 맞는지 확인한다.

### PR 생성 전 확인할 것

- 브랜치 이름이 작업 목적을 잘 드러내는가?
- 커밋 메시지가 명확한가?
- Issue 번호를 연결했는가?
- 코드가 정상 동작하는가?
- 불필요한 파일이 포함되지 않았는가?

---

## 11. 명령어 치트시트

| 목적 | 명령어 |
|---|---|
| 원격 저장소 등록 | `git remote add origin <URL>` |
| 원격 저장소 확인 | `git remote -v` |
| 원격 저장소로 업로드 | `git push -u origin main` |
| 원격 변경 사항 가져오기 | `git pull` |
| 저장소 복제 | `git clone <URL>` |
| 새 브랜치 생성 및 이동 | `git switch -c <브랜치명>` |
| 특정 커밋 확인 | `git show <커밋해시>` |
| 변경 사항 비교 | `git diff` |
| 스테이징된 변경 비교 | `git diff --staged` |
| 줄 단위 변경 이력 확인 | `git blame <파일명>` |
| 작업 내용 임시 저장 | `git stash` |
| stash 목록 확인 | `git stash list` |
| 최근 stash 적용 및 제거 | `git stash pop` |
| 최근 커밋 취소, 변경 유지 | `git reset --soft HEAD~1` |
| 최근 커밋과 변경 삭제 | `git reset --hard HEAD~1` |
| 특정 커밋 되돌리기 | `git revert <커밋해시>` |
| 마지막 커밋 수정 | `git commit --amend` |

---

## 12. 오늘 배운 내용 한 줄 요약

GitHub 협업의 핵심은 **브랜치를 나누고, 변경 사항을 커밋하고, Pull Request와 Code Review를 통해 안전하게 병합하는 것**이다.  
Git 명령어는 단순 암기보다 **작업 상태를 확인하고, 변경 이력을 추적하며, 안전하게 되돌리는 흐름**으로 이해하는 것이 중요하다.
