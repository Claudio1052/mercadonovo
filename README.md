# PDV Mágico Pro ✨

Sistema inteligente de Ponto de Venda (PDV) com interface moderna e integração com Supabase.

## 🚀 Funcionalidades

- **Autenticação**: Login e cadastro com trial de 7 dias
- **PDV Inteligente**: Busca por voz, código de barras, sugestões automáticas
- **Gestão de Estoque**: CRUD completo com categorias e emojis
- **Carrinho Avançado**: Descontos, múltiplos pagamentos
- **Dashboard**: Métricas em tempo real e histórico de vendas
- **Recibos**: Impressão, WhatsApp e Email

## 📋 Pré-requisitos

1. Navegador moderno (Chrome, Firefox, Edge)
2. Conta no [Supabase](https://supabase.com) (gratuito)

## ⚙️ Configuração do Supabase

### 1. Criar Projeto
- Acesse [supabase.com/dashboard](https://supabase.com/dashboard)
- Clique em "New Project"
- Anote a **URL** e **anon key**

### 2. Configurar Banco de Dados
- Vá em **SQL Editor**
- Cole o conteúdo de `supabase_schema.sql`
- Execute o script

### 3. Atualizar Credenciais
No arquivo `index.html`, atualize:
```javascript
const SUPABASE_URL = 'SUA_URL_AQUI';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_AQUI';
```

## 🎮 Como Usar

1. Abra `index.html` no navegador
2. Cadastre-se (7 dias grátis)
3. Comece a vender!

## ⌨️ Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| F1 | Ir para PDV |
| F2 | Ir para Estoque / Busca por voz |
| F3 | Ir para Dashboard |
| F5 | Finalizar venda |
| F8 | Limpar carrinho |
| F9 | Aplicar 10% desconto |
| ESC | Fechar modais |

## 📁 Arquivos

```
velvet-andromeda/
├── index.html          # Aplicação principal
├── supabase_schema.sql # Schema do banco de dados
└── README.md           # Esta documentação
```

## 🔒 Segurança

> ⚠️ As credenciais no código são para demonstração. Em produção:
> - Use variáveis de ambiente
> - Configure RLS no Supabase adequadamente
> - Implemente autenticação real com Supabase Auth

## 📄 Licença

MIT License - Use livremente!
