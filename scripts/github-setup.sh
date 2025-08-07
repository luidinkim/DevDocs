#!/bin/bash

# GitHub Repository Setup Script
# 사용법: ./scripts/github-setup.sh [github-username] [repo-name]

GITHUB_USER=${1}
REPO_NAME=${2:-devdocs}

if [ -z "$GITHUB_USER" ]; then
    echo "❌ GitHub 사용자명을 입력해주세요"
    echo "사용법: ./scripts/github-setup.sh [github-username] [repo-name]"
    exit 1
fi

echo "🚀 GitHub 저장소 연결 시작..."
echo "GitHub 사용자: $GITHUB_USER"
echo "저장소 이름: $REPO_NAME"
echo ""

# Git remote 설정
echo "📡 Remote origin 설정 중..."
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

# Branch 이름 확인 및 변경
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 브랜치를 main으로 변경 중..."
    git branch -M main
fi

echo ""
echo "✅ 설정 완료!"
echo ""
echo "다음 단계:"
echo "1. GitHub.com에서 저장소를 생성하세요:"
echo "   https://github.com/new"
echo ""
echo "   Repository name: $REPO_NAME"
echo "   Visibility: Public (AWS Amplify 무료 호스팅용)"
echo "   ⚠️ 'Initialize this repository' 옵션들은 모두 체크 해제!"
echo ""
echo "2. 저장소 생성 후 아래 명령어를 실행하세요:"
echo "   git push -u origin main"
echo ""
echo "3. AWS Amplify 연결:"
echo "   - AWS Amplify 콘솔 접속"
echo "   - 'New app' → 'Host web app' 선택"
echo "   - GitHub 연결 및 저장소 선택"
echo ""

# 현재 설정 확인
echo "📋 현재 Git 설정:"
git remote -v
echo ""
echo "📊 커밋 히스토리:"
git log --oneline -5