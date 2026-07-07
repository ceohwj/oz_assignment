# Git 커밋 수정, Rebase, Force Push 정리 가이드

이 문서는 이미 커밋했거나 GitHub에 push한 내용을 수정하는 방법을 정리한 가이드입니다. Git을 처음 보는 사람도 이해할 수 있도록, 개념 → 상황별 사용법 → 실수 복구 순서로 구성했습니다.

---

## 1. Git이 보는 것은 “폴더”가 아니라 “파일”이다

Git은 폴더 자체를 추적하지 않습니다. Git은 파일의 변경사항만 추적합니다.

예를 들어 새 폴더를 만들었더라도 그 안에 파일이 없으면 `git status`에 표시되지 않습니다.

```bash
git status
```

새 폴더를 Git에 포함하고 싶다면 그 안에 파일이 있어야 합니다.

예를 들어 빈 폴더를 유지하고 싶다면 관례적으로 `.gitkeep` 파일을 넣습니다.

```bash
touch JavaScript/.gitkeep
git add JavaScript/.gitkeep
git commit -m "Add JavaScript folder"
```

또는 실제 파일을 추가하면 됩니다.

```bash
touch JavaScript/app.js
git add JavaScript/app.js
git commit -m "Add JavaScript app file"
```

---

## 2. `.DS_Store`는 보통 Git에 올리지 않는다

macOS에서는 폴더를 열 때 `.DS_Store`라는 숨김 파일이 자동으로 생길 수 있습니다. 이 파일은 Finder 설정 정보라서 프로젝트 코드와 관련이 없습니다.

Git 상태에서 이런 식으로 보일 수 있습니다.

```text
Untracked files:
  .DS_Store
  JavaScript/.DS_Store
```

또는 이미 Git에 올라간 `.DS_Store`가 삭제되면 이렇게 보일 수 있습니다.

```text
deleted: HTML/.DS_Store
```

### `.DS_Store`를 삭제하는 방법

```bash
find . -name .DS_Store -delete
```

### 앞으로 Git이 `.DS_Store`를 무시하게 하기

`.gitignore`에 추가합니다.

```bash
echo .DS_Store >> .gitignore
git add .gitignore
git commit -m "Ignore DS_Store files"
```

이미 Git에 올라간 `.DS_Store`를 추적 대상에서 제거하려면 다음 명령을 사용합니다.

```bash
git rm --cached HTML/.DS_Store
```

파일 자체를 로컬에서 삭제하고 싶다면 `--cached` 없이 `git rm`을 사용할 수 있습니다.

```bash
git rm HTML/.DS_Store
```

---

## 3. `git status` 읽는 법

`git status`는 현재 작업 디렉토리 상태를 보여줍니다.

예시:

```text
Changes not staged for commit:
  modified: Git/Day_02.md

Untracked files:
  .DS_Store
  JavaScript/
```

의미는 다음과 같습니다.

| 표시 | 의미 |
|---|---|
| `modified` | Git이 추적 중인 파일이 수정됨 |
| `deleted` | Git이 추적 중인 파일이 삭제됨 |
| `Untracked files` | Git이 아직 추적하지 않는 새 파일 또는 폴더 |
| `Changes not staged` | 변경은 되었지만 아직 커밋 대상에 올라가지 않음 |
| `Changes to be committed` | `git add`로 staging 된 상태 |

커밋하기 전에 항상 다음 명령으로 상태를 확인하는 습관이 좋습니다.

```bash
git status
```

---

## 4. `git add .`를 조심해야 하는 이유

`git add .`는 현재 디렉토리 아래의 모든 변경사항을 staging 합니다.

즉, 내가 의도한 파일뿐 아니라 `.DS_Store`, 다른 과제 파일, 삭제된 파일까지 같이 커밋에 들어갈 수 있습니다.

특정 파일만 커밋하고 싶다면 반드시 파일 경로를 직접 지정하는 것이 안전합니다.

```bash
git add Git/Day_02.md
```

여러 파일만 선택해서 추가할 수도 있습니다.

```bash
git add HTML/Day01/resume.html JavaScript/Day01/calculator.js
```

staging 된 파일만 확인하려면 다음 명령을 사용합니다.

```bash
git diff --staged --name-status
```

예상한 파일만 보이면 커밋하면 됩니다.

```bash
git commit -m "Submit Git Day02 assignment"
```

---

## 5. 가장 최근 커밋을 수정하는 방법: `git commit --amend`

가장 최근 커밋의 내용이나 메시지를 바꾸고 싶을 때는 `git commit --amend`를 사용합니다.

### 5.1 최근 커밋에 특정 파일 수정사항만 추가하기

예를 들어 `Git/Day_02.md`만 최근 커밋에 다시 넣고 싶다면 다음 순서로 합니다.

```bash
git status
git add Git/Day_02.md
git diff --staged --name-status
git commit --amend --no-edit
```

`--no-edit`은 기존 커밋 메시지를 그대로 유지한다는 뜻입니다.

### 5.2 최근 커밋 메시지도 바꾸기

```bash
git add Git/Day_02.md
git commit --amend -m "Submit Git Day02 assignment"
```

이 명령은 최근 커밋의 내용과 커밋 메시지를 함께 수정합니다.

---

## 6. 이미 GitHub에 push한 커밋을 수정했을 때

이미 push한 커밋을 `--amend`나 `rebase`로 수정하면 커밋 해시가 바뀝니다.

이때 일반 push를 하면 보통 아래처럼 거절됩니다.

```text
! [rejected] main -> main (non-fast-forward)
error: failed to push some refs
```

이유는 GitHub의 커밋 기록과 내 로컬 커밋 기록이 달라졌기 때문입니다.

이때는 다음 명령으로 원격 브랜치를 덮어써야 합니다.

```bash
git push --force-with-lease origin main
```

`--force-with-lease`는 일반 `--force`보다 안전합니다. 원격 브랜치에 내가 모르는 새 변경사항이 생겼다면 push를 막아줍니다.

---

## 7. `git push --force-with-lease`가 하는 일

`git push --force-with-lease`는 GitHub의 현재 브랜치를 내 로컬 브랜치 상태로 교체합니다.

즉, 이 명령 자체가 폴더를 바꾸는 것은 아닙니다. 이미 내 로컬 커밋 안에 들어간 변경사항이 GitHub에 반영되는 것입니다.

예를 들어 내 최신 커밋에 다음 변경이 들어있다면:

```text
D  HTML/.DS_Store
M  HTML/Day01/resume.html
M  JavaScript/Day01/calculator.js
A  JavaScript/Day02/Day02.js
```

force push 후 GitHub에도 이 변경들이 반영됩니다.

표시의 의미는 다음과 같습니다.

| 표시 | 의미 |
|---|---|
| `D` | 삭제됨 |
| `M` | 수정됨 |
| `A` | 새로 추가됨 |

커밋에 무엇이 들어갔는지 확인하려면 다음 명령을 사용합니다.

```bash
git show --name-status HEAD
```

---

## 8. `stale info` 에러가 나올 때

`git push --force-with-lease`를 했는데 아래처럼 실패할 수 있습니다.

```text
! [rejected] main -> main (stale info)
error: failed to push some refs
```

이 뜻은 로컬 Git이 알고 있는 `origin/main` 정보가 최신이 아니라는 것입니다.

먼저 원격 정보를 새로 가져옵니다.

```bash
git fetch origin
```

그다음 다시 확인합니다.

```bash
git log --oneline --graph --decorate --all -5
```

문제가 없다면 다시 push 합니다.

```bash
git push --force-with-lease origin main
```

---

## 9. 과거 커밋을 수정하는 방법: Interactive Rebase

가장 최근 커밋이 아니라, 이전 커밋을 수정하고 싶다면 `interactive rebase`를 사용합니다.

예를 들어 최근 3개 커밋 중 하나를 수정하려면 다음 명령을 실행합니다.

```bash
git rebase -i HEAD~3
```

그러면 에디터가 열리고 이런 화면이 나옵니다.

```text
pick d26c7d8 Add JavaScript
pick f38a2e7 Add Day01 HTML files and update Day 02 notes
pick 4a79f38 Submit HTML Day01 assignment
```

수정하고 싶은 커밋의 `pick`을 `edit`으로 바꿉니다.

예를 들어 `f38a2e7` 커밋을 수정하고 싶다면:

```text
pick d26c7d8 Add JavaScript
edit f38a2e7 Add Day01 HTML files and update Day 02 notes
pick 4a79f38 Submit HTML Day01 assignment
```

중요: `edit`을 `eidt`처럼 오타 내면 안 됩니다.

---

## 10. Vim에서 `pick`을 `edit`으로 바꾸는 방법

interactive rebase 화면은 기본적으로 Vim에서 열릴 수 있습니다.

### 입력 모드로 들어가기

```text
i
```

### `pick`을 `edit`으로 수정하기

예:

```text
pick f38a2e7 Add Day01 HTML files and update Day 02 notes
```

아래처럼 바꿉니다.

```text
edit f38a2e7 Add Day01 HTML files and update Day 02 notes
```

### 저장하고 나가기

수정이 끝나면 다음 순서로 입력합니다.

```text
Esc
:wq
Enter
```

### 저장하지 않고 나가기

실수해서 취소하고 싶다면:

```text
Esc
:q!
Enter
```

---

## 11. Rebase 중 커밋을 수정하는 흐름

예를 들어 rebase가 다음 상태에서 멈췄다고 가정합니다.

```text
interactive rebase in progress; onto 645b751
Last commands done:
   pick d26c7d8 Add JavaScript
   edit f38a2e7 Add Day01 HTML files and update Day 02 notes

You are currently editing a commit while rebasing branch 'main'.

Changes not staged for commit:
  modified: Git/Day_02.md
```

이 상태는 정상입니다. Git이 `f38a2e7` 커밋에서 멈췄고, 이제 이 커밋을 수정할 수 있다는 뜻입니다.

수정한 파일을 해당 커밋에 반영하려면:

```bash
git add Git/Day_02.md
git diff --staged --name-status
git commit --amend --no-edit
git rebase --continue
```

커밋 메시지도 바꾸고 싶다면:

```bash
git add Git/Day_02.md
git commit --amend -m "Submit Git Day02 assignment"
git rebase --continue
```

rebase가 끝나면 GitHub에 반영합니다.

```bash
git push --force-with-lease origin main
```

---

## 12. Rebase 중 새 rebase를 시작하면 안 된다

rebase 중에 다시 `git rebase -i HEAD~3`를 실행하면 아래 오류가 납니다.

```text
fatal: It seems that there is already a rebase-merge directory
I wonder if you are in the middle of another rebase.
```

이 뜻은 이미 rebase가 진행 중이라는 의미입니다.

이때 선택지는 세 가지입니다.

### 계속 진행하기

현재 수정이 끝났다면:

```bash
git rebase --continue
```

### rebase 취소하기

처음 상태로 돌아가고 싶다면:

```bash
git rebase --abort
```

### 현재 커밋 건너뛰기

해당 커밋 적용을 건너뛰려면:

```bash
git rebase --skip
```

보통은 `--continue` 또는 `--abort`를 사용합니다.

---

## 13. Rebase 전에 작업 변경사항이 있으면 막힐 수 있다

rebase를 시작할 때 작업 디렉토리에 수정사항이 있으면 아래 오류가 날 수 있습니다.

```text
error: cannot rebase: You have unstaged changes.
error: Please commit or stash them.
```

이때는 변경사항을 커밋하거나 stash 해야 합니다.

### 임시 저장하기

```bash
git stash push -u -m "temp before rebase"
```

`-u`는 untracked 파일도 함께 stash 하겠다는 뜻입니다.

### 다시 꺼내기

```bash
git stash pop
```

### rebase 취소하기

```bash
git rebase --abort
```

---

## 14. 특정 파일만 과거 커밋에 넣는 안전한 루틴

가장 안전한 전체 흐름은 다음과 같습니다.

```bash
# 1. 현재 상태 확인
git status

# 2. 최근 3개 커밋 중 수정할 커밋 선택
git rebase -i HEAD~3

# 3. 에디터에서 수정할 커밋의 pick을 edit으로 변경
# 예:
# edit f38a2e7 Add Day01 HTML files and update Day 02 notes

# 4. Git이 해당 커밋에서 멈추면 파일 수정

# 5. 원하는 파일만 staging
git add Git/Day_02.md

# 6. staging 확인
git diff --staged --name-status

# 7. 현재 커밋 수정
git commit --amend --no-edit

# 8. rebase 계속 진행
git rebase --continue

# 9. 이미 push한 브랜치라면 원격 덮어쓰기
git push --force-with-lease origin main
```

커밋 메시지도 바꾸려면 7번을 이렇게 바꿉니다.

```bash
git commit --amend -m "Submit Git Day02 assignment"
```

---

## 15. 실수로 파일이 커밋에 같이 들어갔는지 확인하는 방법

최신 커밋에 들어간 파일 목록을 확인합니다.

```bash
git show --name-status HEAD
```

변경 통계까지 보고 싶다면:

```bash
git show --stat HEAD
```

최근 커밋 목록은 다음으로 확인합니다.

```bash
git log --oneline -5
```

그래프 형태로 보고 싶다면:

```bash
git log --oneline --graph --decorate --all -10
```

---

## 16. 특정 파일을 이전 커밋 상태로 되돌리기

예를 들어 현재 커밋에서 `JavaScript/Day01/calculator.js`를 이전 커밋 상태로 되돌리고 싶다면:

```bash
git restore --source=HEAD^ -- JavaScript/Day01/calculator.js
```

그다음 해당 변경을 현재 커밋에 반영합니다.

```bash
git add JavaScript/Day01/calculator.js
git commit --amend --no-edit
```

---

## 17. 실수로 삭제한 파일 복구하기

이전 커밋에서 파일을 다시 가져올 수 있습니다.

먼저 reflog로 이전 커밋을 확인합니다.

```bash
git reflog --oneline
```

예를 들어 이전 정상 커밋 해시가 `abc1234`라면:

```bash
git checkout abc1234 -- JavaScript/Day02/Day02.js
```

복구한 파일을 새 커밋으로 추가합니다.

```bash
git add JavaScript/Day02/Day02.js
git commit -m "Restore Day02 file"
git push
```

이 방법은 히스토리를 다시 덮어쓰지 않기 때문에 비교적 안전합니다.

---

## 18. 자주 쓰는 명령어 요약

### 현재 상태 확인

```bash
git status
```

### 최근 커밋 확인

```bash
git log --oneline -5
```

### 최신 커밋의 변경 파일 확인

```bash
git show --name-status HEAD
```

### 특정 파일만 staging

```bash
git add 파일경로
```

### staging 된 파일 확인

```bash
git diff --staged --name-status
```

### 최근 커밋 내용만 수정

```bash
git commit --amend --no-edit
```

### 최근 커밋 메시지까지 수정

```bash
git commit --amend -m "새 커밋 메시지"
```

### 과거 커밋 수정 시작

```bash
git rebase -i HEAD~3
```

### rebase 계속 진행

```bash
git rebase --continue
```

### rebase 취소

```bash
git rebase --abort
```

### 이미 push한 커밋 수정 후 원격 반영

```bash
git push --force-with-lease origin main
```

### `.DS_Store` 삭제

```bash
find . -name .DS_Store -delete
```

---

## 19. 추천 작업 습관

커밋을 수정하거나 rebase를 할 때는 다음 습관을 지키는 것이 좋습니다.

1. `git status`로 현재 상태를 먼저 확인합니다.
2. `git add .` 대신 `git add 파일경로`를 사용합니다.
3. `git diff --staged --name-status`로 커밋에 들어갈 파일을 확인합니다.
4. 이미 push한 커밋을 수정했다면 `git push --force-with-lease origin main`을 사용합니다.
5. rebase 중에는 새 rebase를 시작하지 않습니다.
6. rebase 중 문제가 생기면 `git rebase --continue` 또는 `git rebase --abort` 중 하나를 선택합니다.
7. `.DS_Store`는 `.gitignore`에 넣어 Git에서 제외합니다.

---

## 20. 상황별 빠른 선택지

### 가장 최근 커밋만 수정하고 싶다

```bash
git add 수정할파일
git commit --amend --no-edit
git push --force-with-lease origin main
```

### 가장 최근 커밋 메시지만 바꾸고 싶다

```bash
git commit --amend -m "새 커밋 메시지"
git push --force-with-lease origin main
```

### 과거 커밋 하나를 수정하고 싶다

```bash
git rebase -i HEAD~3
# 수정할 커밋의 pick을 edit으로 변경

git add 수정할파일
git commit --amend --no-edit
git rebase --continue
git push --force-with-lease origin main
```

### rebase 중인데 잘못된 것 같다

```bash
git status
git rebase --abort
```

### `.DS_Store`가 계속 생긴다

```bash
echo .DS_Store >> .gitignore
find . -name .DS_Store -delete
git add .gitignore
git commit -m "Ignore DS_Store files"
```

---

## 핵심 요약

Git 커밋을 안전하게 수정하려면 “무엇을 staging 했는지”를 항상 확인해야 합니다.

가장 중요한 명령은 다음 네 가지입니다.

```bash
git status
git add 특정파일
git diff --staged --name-status
git commit --amend --no-edit
```

이미 GitHub에 push한 커밋을 수정했다면 마지막에 다음 명령을 사용합니다.

```bash
git push --force-with-lease origin main
```

과거 커밋을 수정하려면 `git rebase -i`에서 수정할 커밋만 `edit`으로 바꾸고, 해당 커밋에서 원하는 파일만 `git add`한 뒤 `git commit --amend`와 `git rebase --continue`를 사용하면 됩니다.
