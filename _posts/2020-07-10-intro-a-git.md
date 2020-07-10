---
layout: slides
title: "Introducción a GIT"
date: 2020-07-10
author: Blanca López
image: /assets/images/intro-git.png
imageAltText: GIT
categories: tools
tags: [git, workflow, introduction, slides]
---

<!--more-->

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vSuKaUGBZwnE35G4cFaRVNw8JcCH0yGik3Ubl598Hm1N_CQ3fajt1Ts-JRclLJxXIS0c9g6ze5fV0QX/embed?start=false&loop=false&delayms=3000" frameborder="0" width="618" height="400" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

Otros comandos útiles

```bash
# obtener solo el nombre de los archivos con diferencias entre los commits
git diff -–name-only commit1 commit2
```

```bash
# Display a git tree in terminal
# A solution is to create an Alias in your .gitconfig and call it easily:
[alias]
    tree = log --graph --decorate --pretty=oneline --abbrev-commit
```

```bash
# prune local tracking branches that do not exist on remote anymore
git fetch --prune
git branch -r | awk '{print $1}' | egrep -v -f /dev/fd/0 <(git branch -vv | grep origin) | awk '{print $1}' | xargs git branch -d
```
