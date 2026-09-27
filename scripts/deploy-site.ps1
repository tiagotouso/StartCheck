<#
.SYNOPSIS
    Sincroniza e envia a pasta page_docs diretamente para a branch 'site' no GitHub.
.DESCRIPTION
    Este script extrai o conteúdo de page_docs e atualiza a branch remota 'site'
    para disponibilização no GitHub Pages (https://tiagotouso.github.io/StartCheck/).
#>

param(
    [string]$Remote = "origin",
    [string]$Branch = "site",
    [string]$Folder = "page_docs"
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Iniciando publicação de '$Folder' para a branch '$Branch' no remoto '$Remote'..." -ForegroundColor Cyan

# 1. Verificar se a pasta existe
if (-not (Test-Path $Folder)) {
    Write-Error "Pasta '$Folder' não encontrada!"
    exit 1
}

# 2. Verificar se git está limpo
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️  Existem alterações locais não commitadas. Salvando em commit temporário ou inclua antes de enviar." -ForegroundColor Yellow
}

# 3. Executar subtree push
try {
    Write-Host "📦 Enviando subtree '$Folder' para '$Remote/$Branch'..." -ForegroundColor Green
    git subtree push --prefix $Folder $Remote $Branch
    Write-Host "✅ Publicação concluída com sucesso! Acesse: https://tiagotouso.github.io/StartCheck/" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Falha no subtree push direto. Tentando criação/atualização de branch órfã temporária..." -ForegroundColor Yellow
    $tempBranch = "temp-site-deploy-$(Get-Random)"
    git subtree split --prefix $Folder -b $tempBranch
    git push $Remote "${tempBranch}:${Branch}" --force
    git branch -D $tempBranch
    Write-Host "✅ Publicação concluída com sucesso via branch split!" -ForegroundColor Green
}
