# PDV Mágico Pro v4.0 - Sistema Profissional de Vendas

## 🚀 Sobre o Sistema

Sistema completo e profissional de Ponto de Venda (PDV) com integração Supabase, controle de caixa, gestão de estoque e analytics avançados.

## ✨ Novidades da Versão 4.0

### 🆕 Funcionalidades Profissionais de Caixa

#### 1. **Abertura e Fechamento de Caixa**
- Sistema completo de abertura de caixa com saldo inicial
- Registro de operador responsável
- Fechamento de caixa com resumo detalhado do dia
- Validação de saldo final
- Histórico de todas as sessões de caixa

#### 2. **Sangria e Suprimento**
- **Sangria**: Retirada de dinheiro do caixa com motivo registrado
- **Suprimento**: Entrada de dinheiro no caixa (troco, reforço)
- Controle de saldo em tempo real
- Histórico completo de movimentações
- Validação de saldo disponível

#### 3. **Controle de Sessão**
- Vendas vinculadas à sessão de caixa ativa
- Cálculo automático de saldo atual
- Relatórios por sessão
- Múltiplos operadores por sessão

### 🐛 Correções de Bugs

1. **Integração Supabase Corrigida**
   - Sincronização automática de produtos
   - Salvamento correto de vendas
   - Gestão de sessões de caixa no banco
   - Fallback para localStorage quando offline

2. **Interface Melhorada**
   - Modal de pagamento não some mais prematuramente
   - Navegação pós-venda otimizada
   - Feedback visual aprimorado
   - Responsividade corrigida

3. **Gestão de Estado**
   - Auto-save a cada 30 segundos
   - Recuperação de sessão ao recarregar
   - Sincronização bidirecional com Supabase
   - Cache inteligente para modo offline

4. **Validações**
   - Verificação de estoque antes de adicionar ao carrinho
   - Validação de valores em formulários
   - Verificação de caixa aberto para operações
   - Proteção contra duplicação de dados

## 🏗️ Estrutura do Banco de Dados Supabase

### Tabelas Necessárias

```sql
-- Tabela de perfis de usuário
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    company_name TEXT NOT NULL,
    document TEXT,
    phone TEXT,
    plan TEXT DEFAULT 'professional',
    is_trial BOOLEAN DEFAULT true,
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    emoji TEXT DEFAULT '📦',
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de vendas
CREATE TABLE sales (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    items_count INTEGER NOT NULL,
    payment_method TEXT NOT NULL,
    cashier_session_id TEXT,
    receipt_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de sessões de caixa
CREATE TABLE cashier_sessions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    operator TEXT NOT NULL,
    opened_at TIMESTAMP WITH TIME ZONE NOT NULL,
    closed_at TIMESTAMP WITH TIME ZONE,
    initial_amount DECIMAL(10,2) NOT NULL,
    final_amount DECIMAL(10,2),
    notes TEXT,
    close_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de movimentações de caixa
CREATE TABLE cash_movements (
    id TEXT PRIMARY KEY,
    session_id TEXT REFERENCES cashier_sessions(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('withdrawal', 'supply')),
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT NOT NULL,
    operator TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_sales_user_id ON sales(user_id);
CREATE INDEX idx_sales_created_at ON sales(created_at DESC);
CREATE INDEX idx_cashier_sessions_user_id ON cashier_sessions(user_id);
CREATE INDEX idx_cash_movements_session_id ON cash_movements(session_id);

-- RLS (Row Level Security) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE cashier_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_movements ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can view own products"
    ON products FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sales"
    ON sales FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own cashier sessions"
    ON cashier_sessions FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own cash movements"
    ON cash_movements FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM cashier_sessions
            WHERE cashier_sessions.id = cash_movements.session_id
            AND cashier_sessions.user_id = auth.uid()
        )
    );
```

## 📋 Funcionalidades Completas

### 🛒 PDV (Ponto de Venda)
- ✅ Scanner de produtos por código ou nome
- ✅ Busca inteligente com sugestões
- ✅ Reconhecimento de voz para busca
- ✅ Carrinho de compras dinâmico
- ✅ Sistema de descontos percentuais
- ✅ Múltiplos métodos de pagamento
- ✅ Desconto automático no Pix (5%)
- ✅ Produto rápido (cadastro express)
- ✅ Timer de processamento de venda
- ✅ Validação de estoque em tempo real

### 💰 Controle de Caixa
- ✅ Abertura de caixa com saldo inicial
- ✅ Fechamento com resumo do dia
- ✅ Sangria (retirada de dinheiro)
- ✅ Suprimento (entrada de dinheiro)
- ✅ Histórico de movimentações
- ✅ Vinculação de vendas à sessão
- ✅ Cálculo automático de saldo
- ✅ Relatórios por sessão

### 📦 Gestão de Estoque
- ✅ Cadastro completo de produtos
- ✅ Sistema inteligente de sugestão de emojis
- ✅ Categorização automática
- ✅ Edição e exclusão de produtos
- ✅ Ajuste rápido de estoque
- ✅ Alertas de estoque baixo
- ✅ Exportação para CSV
- ✅ Busca e filtros

### 📊 Dashboard Analítico
- ✅ Vendas do dia vs ontem
- ✅ Ticket médio calculado
- ✅ Produto mais vendido
- ✅ Alertas de estoque crítico
- ✅ Gráfico de vendas por dia da semana
- ✅ Histórico completo de vendas
- ✅ Filtros por período
- ✅ Exportação de relatórios

### 🎯 Recursos Profissionais
- ✅ Sistema de autenticação completo
- ✅ Período trial de 7 dias
- ✅ Modo online (Supabase) e offline (LocalStorage)
- ✅ Sincronização automática
- ✅ Impressão térmica de cupons
- ✅ Envio de comprovantes via WhatsApp
- ✅ Envio de comprovantes via Email
- ✅ Atalhos de teclado (F1-F9)
- ✅ Modo escuro/claro
- ✅ Interface responsiva

## 🎨 Interface Moderna

- Design glassmorphism
- Animações suaves
- Partículas mágicas de fundo
- Feedback visual em todas as ações
- Toast notifications inteligentes
- Modais profissionais
- Badges de status em tempo real

## ⌨️ Atalhos de Teclado

- **F1** - Ir para PDV
- **F2** - Ir para Estoque / Busca por voz (no input)
- **F3** - Ir para Dashboard
- **F4** - Ir para Controle de Caixa
- **F5** - Finalizar venda (se houver itens)
- **F8** - Limpar carrinho
- **F9** - Aplicar 10% de desconto
- **ESC** - Fechar modais/sugestões
- **↑↓** - Navegar nas sugestões
- **Enter** - Selecionar/Adicionar

## 🔐 Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o SQL das tabelas (acima)
3. Configure as variáveis no código:
   ```javascript
   const SB_URL  = 'SUA_URL_AQUI';
   const SB_KEY  = 'SUA_CHAVE_ANON_AQUI';
   ```
4. Ative o Email Auth nas configurações

## 📦 Instalação

1. Faça upload do arquivo `pdv-magico-pro-v4.html` para seu servidor
2. Configure as credenciais do Supabase
3. Acesse pelo navegador
4. Crie sua conta e comece a usar!

## 🔄 Modo Offline

O sistema funciona completamente offline usando localStorage:
- Todos os dados são salvos localmente
- Sincroniza automaticamente quando online
- Ideal para locais sem internet estável

## 📱 Responsividade

- Desktop: Grade completa com todas as funcionalidades
- Tablet: Layout otimizado em 2 colunas
- Mobile: Interface simplificada em coluna única
- PWA Ready: Pode ser instalado como app

## 🎓 Fluxo de Trabalho Recomendado

### Início do Dia
1. Abrir o sistema
2. Ir para **Controle de Caixa** (F4)
3. Clicar em **Abrir Caixa**
4. Informar saldo inicial (troco)
5. Iniciar vendas no **PDV** (F1)

### Durante o Dia
- **Vendas**: Adicionar produtos → Finalizar → Escolher método de pagamento
- **Sangria**: Quando precisar retirar dinheiro (ex: guardar no cofre)
- **Suprimento**: Quando precisar adicionar troco
- **Estoque**: Ajustar quantidades conforme necessário

### Fim do Dia
1. Ir para **Controle de Caixa** (F4)
2. Clicar em **Fechar Caixa**
3. Conferir o resumo do dia
4. Confirmar fechamento
5. Ver relatórios no **Dashboard** (F3)

## 💡 Dicas Profissionais

1. **Backup Regular**: O sistema auto-salva, mas faça backups manuais exportando relatórios
2. **Conferência Diária**: Sempre confira o fechamento de caixa com o dinheiro físico
3. **Estoque Mínimo**: Configure alertas para produtos críticos
4. **Categorização**: Use categorias para análises mais precisas
5. **Emojis**: Facilitam identificação visual rápida dos produtos

## 🆘 Suporte

Para dúvidas ou problemas:
- Consulte a documentação inline no sistema
- Verifique o console do navegador para logs
- Entre em contato com o suporte técnico

## 📄 Licença

Sistema proprietário - PDV Mágico Pro v4.0
Todos os direitos reservados.

## 🎯 Próximas Atualizações

- [ ] Integração com impressoras térmicas via USB
- [ ] App mobile nativo (iOS/Android)
- [ ] Relatórios em PDF automáticos
- [ ] Sistema de múltiplos usuários/caixas
- [ ] Integração com balanças
- [ ] Leitor de código de barras USB
- [ ] API para integrações externas
- [ ] Sistema de fidelidade/cashback

---

**Desenvolvido com ❤️ e ✨ magia por PDV Mágico Pro**

*Versão 4.0.0 - Fevereiro 2026*
