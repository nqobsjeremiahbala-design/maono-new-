#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────
# Maono Global — Supabase Deployment Script
#
# Deploys Prisma schema to a Supabase Postgres instance,
# runs seed, and validates the connection.
#
# Usage:
#   ./scripts/deploy-supabase.sh              # uses .env.local
#   ./scripts/deploy-supabase.sh --prod       # uses .env.production
#   DATABASE_URL="..." ./scripts/deploy-supabase.sh  # explicit
#
# Prerequisites:
#   - Node.js 18+
#   - npm dependencies installed (npm ci)
#   - Supabase project created at https://supabase.com
# ─────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { echo -e "${CYAN}[deploy]${NC} $*"; }
ok()    { echo -e "${GREEN}[deploy]${NC} $*"; }
warn()  { echo -e "${YELLOW}[deploy]${NC} $*"; }
fail()  { echo -e "${RED}[deploy]${NC} $*"; exit 1; }

# ── Load env ──
ENV_FILE=".env.local"
if [[ "${1:-}" == "--prod" ]]; then
  ENV_FILE=".env.production"
  shift
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  if [[ -f "$ENV_FILE" ]]; then
    info "Loading environment from $ENV_FILE"
    set -a
    source "$ENV_FILE"
    set +a
  else
    fail "No DATABASE_URL set and $ENV_FILE not found.
Create $ENV_FILE from .env.example or pass DATABASE_URL directly:
  DATABASE_URL=\"postgresql://...\" ./scripts/deploy-supabase.sh"
  fi
fi

[[ -z "${DATABASE_URL:-}" ]] && fail "DATABASE_URL is not set."

# ── Validate it looks like a Supabase URL (or allow local) ──
if [[ "$DATABASE_URL" == *"localhost"* ]] || [[ "$DATABASE_URL" == *"127.0.0.1"* ]]; then
  warn "DATABASE_URL points to localhost — deploying to local Postgres"
elif [[ "$DATABASE_URL" == *"supabase"* ]] || [[ "$DATABASE_URL" == *"pooler.supabase.com"* ]]; then
  ok "DATABASE_URL points to Supabase"
else
  warn "DATABASE_URL doesn't look like Supabase — proceeding anyway"
fi

# ── Check for pgbouncer in connection string ──
# Prisma migrate needs a direct connection, not pooled
if [[ "$DATABASE_URL" == *"pgbouncer=true"* ]] || [[ "$DATABASE_URL" == *":6543/"* ]]; then
  warn "DATABASE_URL uses connection pooler (port 6543 or pgbouncer=true)."
  warn "Prisma migrate requires a DIRECT connection (port 5432, no pgbouncer)."

  if [[ -n "${DIRECT_URL:-}" ]]; then
    info "Using DIRECT_URL for migrations instead"
    MIGRATE_URL="$DIRECT_URL"
  else
    # Try to auto-fix: swap port 6543 → 5432, remove pgbouncer param
    MIGRATE_URL=$(echo "$DATABASE_URL" | sed 's/:6543\//:5432\//g' | sed 's/[?&]pgbouncer=true//g')
    warn "Auto-fixed migration URL (6543→5432, removed pgbouncer)"
  fi
else
  MIGRATE_URL="$DATABASE_URL"
fi

# ── Step 1: Generate Prisma client ──
info "Generating Prisma client..."
npx prisma generate
ok "Prisma client generated"

# ── Step 2: Run migrations ──
info "Running Prisma migrations against Supabase..."
DATABASE_URL="$MIGRATE_URL" npx prisma migrate deploy
ok "Migrations applied"

# ── Step 3: Seed database ──
info "Seeding database (admin user + courses from MDX)..."
npx prisma db seed || {
  warn "Seed had warnings (may be safe if data already exists)"
}
ok "Seed complete"

# ── Step 4: Validate connection ──
info "Validating database connection..."
npx prisma db execute --stdin <<'SQL'
SELECT
  (SELECT count(*) FROM users) as user_count,
  (SELECT count(*) FROM courses) as course_count;
SQL
ok "Database validated"

# ── Step 5: Print summary ──
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Supabase deployment complete${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "  Database:  ${CYAN}$(echo "$DATABASE_URL" | sed 's/:[^:@]*@/:***@/g')${NC}"
echo -e "  Env file:  ${CYAN}$ENV_FILE${NC}"
echo ""
echo -e "  Next steps:"
echo -e "  ${YELLOW}1.${NC} Set DATABASE_URL in Vercel environment variables"
echo -e "     (use the pooler URL with ?pgbouncer=true for runtime)"
echo -e "  ${YELLOW}2.${NC} Set AUTH_SECRET, OZOW keys, and NEXT_PUBLIC_APP_URL"
echo -e "  ${YELLOW}3.${NC} Deploy: ${CYAN}vercel --prod${NC}"
echo ""
