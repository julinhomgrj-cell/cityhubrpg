# 🌆 City Hub RPG — Fã Site Oficial (v4.0 Supabase)

Rede social completa para a comunidade City Hub RPG do Habbo Hotel Brasil.
Dados salvos na nuvem via **Supabase** — sincronizados em qualquer dispositivo!

## 📁 Estrutura
```
cityhub-rpg/
├── index.html       ← site completo com Supabase
├── sw.js            ← service worker PWA
├── manifest.json    ← config PWA
├── 404.html         ← redirect GitHub Pages
├── README.md
└── icons/
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-192.png
    └── icon-512.png
```

## ✨ Funcionalidades
- ☁️ Banco de dados na nuvem (Supabase) — dados em qualquer dispositivo
- 🔐 Login via verificação Habbo (sem senha)
- 🏢 Empresas com banner, logo, múltiplos cargos
- 👤 Adicionar membros ao cargo por nick com preview do avatar Habbo
- 📰 Feed social com curtidas e YouTube embed
- ⏳ Expiração automática de posts configurável pelo admin
- 📲 PWA — instalável como app no celular
- ⚙️ Painel admin completo com personalização do site

## 🚀 Deploy GitHub Pages
1. Suba todos os arquivos no repositório
2. Settings → Pages → main → / (root) → Save

## ⏳ Expiração de Posts
Configure em: Admin → 🎨 Personalizar → ⏳ Expiração de Posts
- Defina o número de dias (ex: 30)
- Posts mais antigos que X dias são deletados ao admin acessar o painel
- Use "Executar Agora" para forçar a limpeza imediata

## 🔑 Admin padrão
Usuário: `JulioHubb`
