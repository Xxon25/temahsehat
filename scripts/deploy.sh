#!/bin/bash
# scripts/deploy.sh — Push GitHub + jalankan migrasi Supabase
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

COMMIT_MSG="${1:-chore: deploy $(date '+%Y-%m-%d %H:%M')}"
BRANCH="${2:-$(git rev-parse --abbrev-ref HEAD)}"

# ── 1. PUSH KE GITHUB ────────────────────────────────────────
echo -e "${YELLOW}[1/3] 📦 Git: staging & commit...${NC}"
git add -A

if git diff --cached --quiet; then
  echo -e "${GREEN}  ✅ Tidak ada perubahan kode baru.${NC}"
else
  git commit -m "$COMMIT_MSG"
  git push origin "$BRANCH"
  echo -e "${GREEN}  ✅ GitHub: push ke '${BRANCH}' berhasil.${NC}"
fi

# ── 2. SUPABASE DB PUSH (migrasi skema) ──────────────────────
echo -e "${YELLOW}[2/3] 🗄️  Supabase: push migrasi database...${NC}"

if ! command -v supabase &>/dev/null; then
  echo -e "${RED}  ⚠️  Supabase CLI tidak ditemukan. Install: https://supabase.com/docs/guides/cli${NC}"
else
  supabase db push
  echo -e "${GREEN}  ✅ Supabase: migrasi berhasil dijalankan.${NC}"
fi

# ── 3. SUPABASE FUNCTIONS DEPLOY (opsional) ──────────────────
echo -e "${YELLOW}[3/3] ⚡ Supabase: deploy Edge Functions (jika ada)...${NC}"

if [ -d "supabase/functions" ] && [ "$(ls -A supabase/functions)" ]; then
  supabase functions deploy
  echo -e "${GREEN}  ✅ Edge Functions berhasil di-deploy.${NC}"
else
  echo -e "  ℹ️  Tidak ada Edge Functions — dilewati."
fi

echo ""
echo -e "${GREEN}🎉 DEPLOY SELESAI — GitHub & Supabase tersinkron.${NC}"
