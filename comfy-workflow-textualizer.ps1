# UTF-8 Encoding
$OutputEncoding = [System.Text.Encoding]::UTF8

function Show-Header {
    Clear-Host
    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host "       ComfyUI Workflow Textualizer CLI" -ForegroundColor Green
    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host ""
}

function Show-Menu {
    Show-Header
    Write-Host "Selecione uma opção:" -ForegroundColor Yellow
    Write-Host "1) Iniciar Servidor de Desenvolvimento (npm run dev)"
    Write-Host "2) Gerar Build de Produção (npm run build)"
    Write-Host "3) Executar Instalação Limpa (npm install)"
    Write-Host "4) Sair"
    Write-Host ""
}

do {
    Show-Menu
    $choice = Read-Host "Digite sua opção (1-4)"
    
    switch ($choice) {
        "1" {
            Show-Header
            Write-Host "Iniciando servidor de desenvolvimento Vite..." -ForegroundColor Cyan
            npm run dev
            Read-Host "Pressione Enter para voltar ao menu"
        }
        "2" {
            Show-Header
            Write-Host "Gerando build de produção..." -ForegroundColor Cyan
            npm run build
            Read-Host "Pressione Enter para voltar ao menu"
        }
        "3" {
            Show-Header
            Write-Host "Instalando dependências de pacotes..." -ForegroundColor Cyan
            npm install
            Read-Host "Pressione Enter para voltar ao menu"
        }
        "4" {
            Write-Host "Saindo... Obrigado por usar o ComfyUI Workflow Textualizer!" -ForegroundColor Green
            exit 0
        }
        default {
            Write-Host "Opção inválida, tente novamente." -ForegroundColor Red
            Start-Sleep -Seconds 1
        }
    }
} while ($true)
