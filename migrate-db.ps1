# Smart Mudik 2026 - Database Migration Script
# Usage: ./migrate-db.ps1 [VPS_USER] [VPS_IP]

param (
    [string]$VpsUser,
    [string]$VpsIp
)

$ErrorActionPreference = "Stop"

# Database Configuration (From your .env)
$DB_NAME = "mudik_db"
$LOCAL_BACKUP_PATH = "./backup_db.sql"

Write-Host "--- Starting Database Migration ---" -ForegroundColor Cyan

# 1. Dump Local Database
Write-Host "[1/3] Dumping local database..." -ForegroundColor Yellow
Write-Host "Please enter your local PostgreSQL password when prompted." -ForegroundColor Gray
# Use -W to force password prompt if not in env
try {
    # Using pg_dump
    pg_dump -U postgres -d $DB_NAME -h localhost -p 5432 -f $LOCAL_BACKUP_PATH
}
catch {
    Write-Host "Failed to dump database. Make sure pg_dump is in your PATH." -ForegroundColor Red
    return
}

# 2. Transfer to VPS
if ($VpsUser -and $VpsIp) {
    Write-Host "[2/3] Transferring backup to VPS ($VpsIp)..." -ForegroundColor Yellow
    scp $LOCAL_BACKUP_PATH "${VpsUser}@${VpsIp}:~/data/backup_db.sql"

    # 3. Restore to Docker Container on VPS
    Write-Host "[3/3] Restoring to Docker container on VPS..." -ForegroundColor Yellow
    # Note: Container name is usually projectname-db-1
    ssh "${VpsUser}@${VpsIp}" "docker exec -i smart-mudik-2026-db-1 psql -U postgres -d $DB_NAME < ~/data/backup_db.sql"
    
    # 4. Run Prisma Migrate Deploy
    Write-Host "[BONUS] Running Prisma Migrate Deploy on VPS..." -ForegroundColor Cyan
    ssh "${VpsUser}@${VpsIp}" "docker exec smart-mudik-2026-backend-1 npx prisma migrate deploy"

    Write-Host "SUCCESS! Database and Schema migrated to VPS." -ForegroundColor Green
}
else {
    Write-Host "[SKIP] VPS info not provided. Backup saved to $LOCAL_BACKUP_PATH" -ForegroundColor Yellow
}
