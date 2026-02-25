// ════════════════════════════════════════════════════════
// PDV MÁGICO PRO v4.0 — VERSÃO PROFISSIONAL COMPLETA
// Sistema Profissional de Ponto de Venda com Controle de Caixa
// ════════════════════════════════════════════════════════

const APP_NAME   = "PDV Mágico Pro";
const APP_VER    = "4.0.0";
const TRIAL_DAYS = 7;
const PRICE      = 29.90;

// ── SUPABASE CONFIG ──
const SB_URL  = 'https://qdrassirutbfvhvepwdd.supabase.co';
const SB_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkcmFzc2lydXRiZnZodmVwd2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5ODA2ODUsImV4cCI6MjA4NzU1NjY4NX0.9zPKrANHVDLOLm-e7yANAu4vr8s9QjsX_tG72AygKEM';

let sb = null;
let useLocal = true;
let currentUser = null;

// ══════════════════════════════════════
// BANCO DE EMOJIS AVANÇADO
// ══════════════════════════════════════
const EMOJI_DB = [
    {char:'🍔',keys:['hamburguer','burger','lanche','fast','comida'],cat:'alimento'},
    {char:'🍕',keys:['pizza','massa','italiana','queijo'],cat:'alimento'},
    {char:'🌭',keys:['hotdog','cachorro','quente','salsicha'],cat:'alimento'},
    {char:'🍟',keys:['batata','frita','chips','salgado'],cat:'alimento'},
    {char:'🥪',keys:['sanduiche','misto','natural'],cat:'alimento'},
    {char:'🌮',keys:['taco','mexicano','burrito'],cat:'alimento'},
    {char:'🍣',keys:['sushi','peixe','japones','japao'],cat:'alimento'},
    {char:'🍤',keys:['camarao','empanado','frutos','mar'],cat:'alimento'},
    {char:'🍦',keys:['sorvete','casquinha','gelado'],cat:'alimento'},
    {char:'🍩',keys:['donut','rosquinha','padaria'],cat:'alimento'},
    {char:'🍪',keys:['cookie','biscoito','bolacha'],cat:'alimento'},
    {char:'🍫',keys:['chocolate','cacau','barra'],cat:'alimento'},
    {char:'🍬',keys:['bala','doce','caramelo'],cat:'alimento'},
    {char:'🍭',keys:['pirulito','doce','candy'],cat:'alimento'},
    {char:'🍰',keys:['bolo','torta','sobremesa','fatia'],cat:'alimento'},
    {char:'🎂',keys:['bolo','aniversario','festa'],cat:'alimento'},
    {char:'🍎',keys:['maca','fruta','vermelha'],cat:'alimento'},
    {char:'🍌',keys:['banana','fruta','amarela'],cat:'alimento'},
    {char:'🍇',keys:['uva','fruta','roxo'],cat:'alimento'},
    {char:'🥥',keys:['coco','tropical'],cat:'alimento'},
    {char:'🍉',keys:['melancia','verao','fruta'],cat:'alimento'},
    {char:'🍓',keys:['morango','vermelho','doce'],cat:'alimento'},
    {char:'🥩',keys:['carne','bife','churrasco','proteina'],cat:'alimento'},
    {char:'🍗',keys:['frango','coxa','asas','assado'],cat:'alimento'},
    {char:'🥓',keys:['bacon','porco'],cat:'alimento'},
    {char:'🥚',keys:['ovo','ovos','clara'],cat:'alimento'},
    {char:'☕',keys:['cafe','coffee','expresso','capuccino'],cat:'bebida'},
    {char:'🥤',keys:['suco','refrigerante','bebida','copo'],cat:'bebida'},
    {char:'🍺',keys:['cerveja','beer','alcool'],cat:'bebida'},
    {char:'🍷',keys:['vinho','taca'],cat:'bebida'},
    {char:'🍸',keys:['drink','coquetel','cocktail'],cat:'bebida'},
    {char:'🧃',keys:['caixinha','néctar','suco'],cat:'bebida'},
    {char:'🧉',keys:['mate','chimarrao','erva'],cat:'bebida'},
    {char:'💧',keys:['agua','mineral','garrafa'],cat:'bebida'},
    {char:'👕',keys:['camisa','camiseta','roupa','vestuario'],cat:'vestuario'},
    {char:'👖',keys:['calca','jeans','bermuda'],cat:'vestuario'},
    {char:'👗',keys:['vestido','saia','blusa'],cat:'vestuario'},
    {char:'👟',keys:['tenis','sapato','calcado','esporte'],cat:'vestuario'},
    {char:'👒',keys:['chapeu','boné','gorro'],cat:'vestuario'},
    {char:'🧥',keys:['casaco','jaqueta','blaser'],cat:'vestuario'},
    {char:'📱',keys:['celular','smartphone','iphone','android'],cat:'eletronico'},
    {char:'💻',keys:['notebook','laptop','computador'],cat:'eletronico'},
    {char:'⌚',keys:['relogio','smartwatch','pulso'],cat:'eletronico'},
    {char:'📺',keys:['televisao','tv','monitor'],cat:'eletronico'},
    {char:'🎮',keys:['videogame','jogo','console','controle'],cat:'eletronico'},
    {char:'🔋',keys:['bateria','pilha','energia','carregador'],cat:'eletronico'},
    {char:'🎧',keys:['fone','headphone','audio','musica'],cat:'eletronico'},
    {char:'🖨️',keys:['impressora','printer'],cat:'eletronico'},
    {char:'🧼',keys:['sabao','detergente','limpeza','sabonete'],cat:'limpeza'},
    {char:'🧹',keys:['vassoura','varrer','limpar'],cat:'limpeza'},
    {char:'🧺',keys:['cesto','lavanderia','roupa'],cat:'limpeza'},
    {char:'🧴',keys:['shampoo','condicionador','higiene'],cat:'limpeza'},
    {char:'🪣',keys:['balde','limpeza'],cat:'limpeza'},
    {char:'💊',keys:['remedio','pilula','farmacia','medicamento'],cat:'outro'},
    {char:'📦',keys:['caixa','pacote','embalagem'],cat:'outro'},
    {char:'🎁',keys:['presente','brinde','kit'],cat:'outro'},
    {char:'📚',keys:['livro','revista','leitura'],cat:'outro'},
    {char:'✏️',keys:['lapis','caneta','escrita'],cat:'outro'},
    {char:'🔧',keys:['ferramenta','chave','reparo'],cat:'outro'},
    {char:'🌿',keys:['erva','planta','natural','organico'],cat:'outro'},
];

// ── PRODUTOS PADRÃO ──
const DEFAULT_PRODUCTS = [
    {id:1,name:'Hambúrguer Mágico',price:25.00,stock:20,emoji:'🍔',category:'alimento'},
    {id:2,name:'Poção de Cafeína',price:8.50,stock:50,emoji:'☕',category:'bebida'},
    {id:3,name:'Donut Estelar',price:12.00,stock:15,emoji:'🍩',category:'alimento'},
    {id:4,name:'Pizza Infinita',price:45.00,stock:8,emoji:'🍕',category:'alimento'},
    {id:5,name:'Sushi Zen',price:60.00,stock:10,emoji:'🍣',category:'alimento'},
    {id:6,name:'Sorvete Nuvem',price:15.00,stock:25,emoji:'🍦',category:'alimento'},
    {id:7,name:'Suco Vitamina',price:12.00,stock:40,emoji:'🥤',category:'bebida'},
    {id:8,name:'Camisa Mágica',price:89.90,stock:12,emoji:'👕',category:'vestuario'},
    {id:9,name:'Fones Celestial',price:120.00,stock:5,emoji:'🎧',category:'eletronico'},
    {id:10,name:'Chocolatão',price:9.00,stock:35,emoji:'🍫',category:'alimento'},
];

// ── ESTADO GLOBAL ──
let products = [];
let salesHistory = [];
let cart = [];
let currentSaleData = null;
let currentDiscount = 0;
let saleTimerInterval = null;
let saleStartTime = null;
let suggestionIndex = -1;

// ── NOVO: ESTADO DO CAIXA ──
let cashierSession = null;
let cashMovements = [];

// ══════════════════════════════════════
// FUNÇÕES UTILITÁRIAS
// ══════════════════════════════════════
function formatCurrency(val) {
    return `R$ ${parseFloat(val).toFixed(2).replace('.', ',')}`;
}

function formatDocument(doc) {
    const c = doc.replace(/\D/g,'');
    if(c.length===11) return c.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,'$1.$2.$3-$4');
    if(c.length===14) return c.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,'$1.$2.$3/$4-$5');
    return doc;
}

function formatPhone(p) {
    const c = p.replace(/\D/g,'');
    if(c.length===11) return c.replace(/(\d{2})(\d{5})(\d{4})/,'($1) $2-$3');
    if(c.length===10) return c.replace(/(\d{2})(\d{4})(\d{4})/,'($1) $2-$3');
    return p;
}

function getCatName(k) {
    return {
        alimento:'🍔 Alimento',
        bebida:'🥤 Bebida',
        limpeza:'🧼 Limpeza',
        eletronico:'📱 Eletrônico',
        vestuario:'👕 Vestuário',
        outro:'📦 Outro'
    }[k]||k;
}

function now() { 
    return new Date().toISOString().slice(0,10); 
}

function nowDateTime() {
    return new Date().toLocaleString('pt-BR');
}

function dlCSV(csv,fn) {
    const BOM='\uFEFF';
    const b=new Blob([BOM+csv],{type:'text/csv;charset=utf-8;'});
    const u=URL.createObjectURL(b);
    const a=document.createElement('a'); 
    a.href=u; 
    a.download=fn;
    document.body.appendChild(a); 
    a.click(); 
    document.body.removeChild(a);
    URL.revokeObjectURL(u);
}

// ══════════════════════════════════════
// PARTÍCULAS MÁGICAS
// ══════════════════════════════════════
function createMagicParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;
    const colors = ['#6c5ce7','#00cec9','#fd79a8','#fdcb6e','#a29bfe','#55efc4'];
    for (let i = 0; i < 24; i++) {
        const p = document.createElement('div');
        p.className = 'magic-particle';
        const size = Math.random() * 12 + 4;
        const dur  = Math.random() * 18 + 10;
        const del  = Math.random() * 10;
        p.style.cssText = `
            width:${size}px; height:${size}px;
            left:${Math.random()*100}vw;
            background:${colors[Math.floor(Math.random()*colors.length)]};
            animation-duration:${dur}s;
            animation-delay:${del}s;
            opacity:0;
        `;
        container.appendChild(p);
    }
}

// ══════════════════════════════════════
// SUPABASE INIT
// ══════════════════════════════════════
function initSB() {
    try {
        if (window.supabase && window.supabase.createClient) {
            sb = window.supabase.createClient(SB_URL, SB_KEY);
            useLocal = false;
            console.log('✅ Supabase Auth pronto');
        } else { 
            throw new Error('lib não carregada'); 
        }
    } catch(e) {
        console.warn('⚠️ Supabase indisponível — localStorage:', e.message);
        useLocal = true;
    }
}

// ══════════════════════════════════════
// AUTENTICAÇÃO
// ══════════════════════════════════════
function showLogin() { 
    document.getElementById('loginCard').style.display='block'; 
    document.getElementById('registerCard').style.display='none'; 
}

function showRegister() { 
    document.getElementById('loginCard').style.display='none'; 
    document.getElementById('registerCard').style.display='block'; 
}

function showErr(id, msg) { 
    const el=document.getElementById(id); 
    el.textContent=msg; 
    el.classList.add('show'); 
}

function hideErr(id) { 
    document.getElementById(id).classList.remove('show'); 
}

async function loginUser() {
    hideErr('loginError');
    const email = document.getElementById('loginEmail').value.trim();
    const pass  = document.getElementById('loginPassword').value;
    
    if (!email || !pass) { 
        showErr('loginError','Preencha email e senha.'); 
        return; 
    }
    
    const btn = document.getElementById('loginBtn');
    btn.disabled=true; 
    btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Entrando...';
    showLoader();
    
    try {
        if (useLocal) { 
            loginLocal(email,pass); 
        } else { 
            await loginSupabase(email,pass); 
        }
    } catch(e) {
        hideLoader();
        btn.disabled=false; 
        btn.innerHTML='<i class="fas fa-sign-in-alt"></i> Entrar no Sistema';
        showErr('loginError', e.message);
    }
}

async function loginSupabase(email, pass) {
    const { data, error } = await sb.auth.signInWithPassword({ 
        email, 
        password: pass 
    });
    
    if (error) {
        let msg = 'Email ou senha incorretos.';
        if (error.message.includes('Email not confirmed')) {
            msg = 'Confirme seu email antes de fazer login.';
        }
        throw new Error(msg);
    }
    
    const { data: profile } = await sb
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
    
    currentUser = {
        id: data.user.id, 
        email: data.user.email,
        companyName: profile?.company_name || 'Empresa',
        document: profile?.document || '', 
        phone: profile?.phone || '',
        plan: profile?.plan || 'professional',
        isTrial: profile?.is_trial ?? true,
        validUntil: profile?.valid_until || new Date(Date.now()+TRIAL_DAYS*86400000).toISOString(),
        source: 'supabase'
    };
    
    afterLogin();
}

function loginLocal(email, pass) {
    const users = JSON.parse(localStorage.getItem('pdv_users')||'[]');
    const u = users.find(x => x.email===email && x.password===pass);
    
    if (!u) throw new Error('Email ou senha incorretos.');
    if (new Date() > new Date(u.validUntil)) {
        throw new Error('Assinatura expirada.');
    }
    
    currentUser = {...u, source:'local'};
    afterLogin();
}

async function registerUser() {
    hideErr('registerError');
    const company = document.getElementById('regCompany').value.trim();
    const doc     = document.getElementById('regDocument').value.trim();
    const phone   = document.getElementById('regPhone').value.trim();
    const email   = document.getElementById('regEmail').value.trim();
    const pass    = document.getElementById('regPassword').value;
    const pass2   = document.getElementById('regConfirmPassword').value;
    const terms   = document.getElementById('regTerms').checked;
    
    if (!company||!doc||!phone||!email||!pass||!pass2) { 
        showErr('registerError','Preencha todos os campos.'); 
        return; 
    }
    if (pass !== pass2) { 
        showErr('registerError','As senhas não coincidem.'); 
        return; 
    }
    if (pass.length < 6) { 
        showErr('registerError','Senha mínima: 6 caracteres.'); 
        return; 
    }
    if (!terms) { 
        showErr('registerError','Aceite os termos de uso.'); 
        return; 
    }
    
    const btn = document.getElementById('registerBtn');
    btn.disabled=true; 
    btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Criando conta...';
    showLoader();
    
    try {
        if (useLocal) { 
            registerLocal({company,doc,phone,email,pass}); 
        } else { 
            await registerSupabase({company,doc,phone,email,pass}); 
        }
    } catch(e) {
        hideLoader();
        btn.disabled=false; 
        btn.innerHTML='<i class="fas fa-rocket"></i> Começar Período Grátis';
        showErr('registerError', e.message);
    }
}

async function registerSupabase({company,doc,phone,email,pass}) {
    const trialEnd = new Date(Date.now()+TRIAL_DAYS*86400000).toISOString();
    
    const { data, error } = await sb.auth.signUp({ 
        email, 
        password: pass 
    });
    
    if (error) {
        let msg = error.message;
        if (msg.includes('already registered')) {
            msg = 'Este email já está cadastrado.';
        }
        throw new Error(msg);
    }
    
    const uid = data.user.id;
    
    // Criar perfil
    await sb.from('profiles').upsert({
        id: uid,
        company_name: company,
        document: doc,
        phone: phone,
        plan: 'professional',
        is_trial: true,
        valid_until: trialEnd
    });
    
    // Inserir produtos padrão
    const prods = DEFAULT_PRODUCTS.map(p=>({
        ...p,
        id: undefined,
        user_id: uid
    }));
    await sb.from('products').insert(prods);
    
    hideLoader();
    showToast('Conta criada! Verifique seu email para confirmar. 📧','info',8000);
    showLogin();
    document.getElementById('loginEmail').value = email;
    document.getElementById('registerBtn').disabled=false;
    document.getElementById('registerBtn').innerHTML='<i class="fas fa-rocket"></i> Começar Período Grátis';
}

function registerLocal({company,doc,phone,email,pass}) {
    const users = JSON.parse(localStorage.getItem('pdv_users')||'[]');
    if (users.find(u=>u.email===email)) {
        throw new Error('Email já cadastrado.');
    }
    
    const trialEnd = new Date(Date.now()+TRIAL_DAYS*86400000).toISOString();
    const uid = 'LOCAL_'+Date.now();
    
    const newUser = {
        id: uid,
        email: email,
        password: pass,
        companyName: company,
        document: doc,
        phone: phone,
        plan: 'professional',
        isTrial: true,
        validUntil: trialEnd,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('pdv_users',JSON.stringify(users));
    localStorage.setItem('pdv_data_'+uid, JSON.stringify({
        products: DEFAULT_PRODUCTS,
        salesHistory: [],
        cashierSessions: [],
        cashMovements: []
    }));
    
    hideLoader();
    showToast('Conta criada com sucesso! Fazendo login... 🎉','success');
    setTimeout(()=>{
        document.getElementById('loginEmail').value=email; 
        document.getElementById('loginPassword').value=pass; 
        loginUser();
    },1200);
}

function afterLogin() {
    loadUserData();
    document.getElementById('authContainer').style.display='none';
    document.getElementById('appContainer').style.display='grid';
    updateSubscriptionStatus();
    initApp();
    showToast(`Bem-vindo, ${currentUser.companyName}! 👋`,'success');
}

async function loadUserData() {
    if (useLocal || currentUser.source==='local') {
        const d = JSON.parse(localStorage.getItem('pdv_data_'+currentUser.id)||'null');
        products = d?.products || DEFAULT_PRODUCTS;
        salesHistory = d?.salesHistory || [];
        cashMovements = d?.cashMovements || [];
        
        // Recuperar sessão de caixa aberta
        const sessions = d?.cashierSessions || [];
        cashierSession = sessions.find(s => !s.closedAt) || null;
    } else {
        try {
            // Carregar produtos
            const {data:prods} = await sb
                .from('products')
                .select('*')
                .eq('user_id',currentUser.id);
            products = prods?.length ? prods : DEFAULT_PRODUCTS;
            
            // Carregar vendas
            const {data:sales} = await sb
                .from('sales')
                .select('*')
                .eq('user_id',currentUser.id)
                .order('created_at',{ascending:false})
                .limit(100);
            salesHistory = sales || [];
            
            // Carregar sessões de caixa
            const {data:sessions} = await sb
                .from('cashier_sessions')
                .select('*')
                .eq('user_id',currentUser.id)
                .order('opened_at',{ascending:false})
                .limit(10);
            
            // Verificar se há caixa aberto
            cashierSession = sessions?.find(s => !s.closed_at) || null;
            
            // Carregar movimentações do caixa atual
            if (cashierSession) {
                const {data:movements} = await sb
                    .from('cash_movements')
                    .select('*')
                    .eq('session_id', cashierSession.id)
                    .order('created_at',{ascending:false});
                cashMovements = movements || [];
            }
        } catch(e) { 
            console.error('Erro ao carregar dados:', e);
            products = DEFAULT_PRODUCTS; 
            salesHistory = []; 
        }
    }
}

async function saveData() {
    if (!currentUser) return;
    
    if (useLocal || currentUser.source==='local') {
        // Salvar localmente
        const sessions = JSON.parse(localStorage.getItem('pdv_data_'+currentUser.id)||'{}').cashierSessions || [];
        
        // Atualizar ou adicionar sessão atual
        if (cashierSession) {
            const idx = sessions.findIndex(s => s.id === cashierSession.id);
            if (idx >= 0) {
                sessions[idx] = cashierSession;
            } else {
                sessions.push(cashierSession);
            }
        }
        
        localStorage.setItem('pdv_data_'+currentUser.id, JSON.stringify({
            products,
            salesHistory,
            cashierSessions: sessions,
            cashMovements
        }));
    } else {
        // Salvar no Supabase
        try {
            // Salvar produtos modificados
            for (const p of products) {
                if (p.id && !String(p.id).startsWith('LOCAL')) {
                    await sb
                        .from('products')
                        .upsert({...p,user_id:currentUser.id})
                        .catch(()=>{});
                }
            }
        } catch(e) {
            console.error('Erro ao salvar no Supabase:', e);
        }
    }
}

async function logout() {
    if (!confirm('Sair do sistema?')) return;
    
    await saveData();
    
    if (!useLocal && currentUser?.source!=='local') {
        await sb.auth.signOut().catch(()=>{});
    }
    
    currentUser=null; 
    cart=[]; 
    products=[]; 
    salesHistory=[];
    cashierSession=null;
    cashMovements=[];
    stopSaleTimer();
    
    document.getElementById('appContainer').style.display='none';
    document.getElementById('authContainer').style.display='flex';
    document.getElementById('loginCard').style.display='block';
    document.getElementById('registerCard').style.display='none';
    document.getElementById('loginPassword').value='';
    document.getElementById('accountModal').style.display='none';
    
    showToast('Até logo! 👋','info');
}

// ══════════════════════════════════════
// APP INIT
// ══════════════════════════════════════
function initApp() {
    setTimeout(()=>{
        renderAll();
        setupBarcodeScanner();
        setupKeyboard();
        checkLowStock();
        startSaleTimer();
        updateCashierUI();
        hideLoader();
    },600);
    
    setInterval(saveData, 30000); // Auto-save a cada 30s
    setInterval(checkLowStock, 10000);
}

function renderAll() { 
    renderPOS(); 
    renderStock(); 
    updateDashboard(); 
    generateSalesChart(); 
}

// ── NAVEGAÇÃO ──
function switchTab(tab) {
    document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach((b,i)=>{
        b.classList.remove('active');
        if(['pdv','stock','dashboard','cashier'][i]===tab){
            b.classList.add('active');
            b.classList.add('pop');
            setTimeout(()=>b.classList.remove('pop'),400);
        }
    });
    
    document.getElementById(tab).classList.add('active');
    
    if(tab==='dashboard'){
        updateDashboard();
        generateSalesChart();
    }
    if(tab==='pdv'){
        setTimeout(()=>{
            document.getElementById('barcodeInput').focus();
        },100);
    }
    if(tab==='stock'){
        filterStockTable();
    }
    if(tab==='cashier'){
        updateCashierUI();
        renderCashMovements();
    }
}

// ── SUBSCRIPTION ──
function updateSubscriptionStatus() {
    if (!currentUser) return;
    
    const el = document.getElementById('subscriptionStatus');
    const daysLeft = Math.ceil((new Date(currentUser.validUntil)-new Date())/(86400000));
    
    if (currentUser.isTrial) {
        el.innerHTML=`<i class="fas fa-star"></i><span>Trial: ${daysLeft}d restantes</span>`;
        el.style.background = daysLeft<=3?'var(--danger)':'var(--warning)';
        el.style.color = daysLeft<=3?'white':'var(--text)';
        
        if(daysLeft<=3) {
            showToast(`⚠️ Seu trial vence em ${daysLeft} dia${daysLeft===1?'':'s'}!`,'warning',5000);
        }
    } else {
        el.innerHTML=`<i class="fas fa-crown"></i><span>Plano Ativo</span>`;
        el.style.background='var(--success)'; 
        el.style.color='white';
    }
}

function openAccountModal() {
    if (!currentUser) return;
    
    document.getElementById('accountCompanyName').textContent = currentUser.companyName;
    document.getElementById('accountEmail').textContent = currentUser.email;
    document.getElementById('accountDocument').textContent = formatDocument(currentUser.document||'');
    document.getElementById('accountValidUntil').textContent = new Date(currentUser.validUntil).toLocaleDateString('pt-BR');
    document.getElementById('accountPlanStatus').textContent = currentUser.isTrial?'TRIAL (7 dias grátis)':'PROFISSIONAL';
    
    const mb = document.getElementById('modeBadge');
    mb.textContent = useLocal||currentUser.source==='local'?'💾 Modo Local (Offline)':'☁️ Modo Nuvem (Supabase)';
    mb.className = 'mode-badge '+(useLocal||currentUser.source==='local'?'mode-local':'mode-cloud');
    
    document.getElementById('accountModal').style.display='flex';
}

function showTermsModal() {
    alert(`TERMOS DE USO — ${APP_NAME} v${APP_VER}\n\n` +
    `1. Período de Teste: ${TRIAL_DAYS} dias gratuitos\n` +
    `2. Assinatura: R$ ${PRICE.toFixed(2)}/mês após o trial\n` +
    `3. Cancelamento: a qualquer momento pelo sistema\n` +
    `4. Dados: armazenados ${useLocal?'localmente':'na nuvem'}\n` +
    `5. Suporte: disponível 24/7\n\n` +
    `Ao se cadastrar, você concorda com estes termos.`);
}

// ══════════════════════════════════════
// CONTROLE DE CAIXA (NOVO)
// ══════════════════════════════════════

function updateCashierUI() {
    const isOpen = cashierSession && !cashierSession.closedAt;
    
    // Atualizar badge no PDV
    const badge = document.getElementById('cashierStatusBadge');
    if (isOpen) {
        badge.style.display = 'flex';
        badge.className = 'stat-badge cashier-open';
        badge.innerHTML = '<i class="fas fa-lock-open"></i><span>Caixa Aberto</span>';
    } else {
        badge.style.display = 'flex';
        badge.className = 'stat-badge cashier-closed';
        badge.innerHTML = '<i class="fas fa-lock"></i><span>Caixa Fechado</span>';
    }
    
    // Atualizar página de caixa
    const statusBadge = document.getElementById('cashierStatusBadgeFull');
    const openActions = document.getElementById('cashierActionsOpen');
    const closeActions = document.getElementById('cashierActionsClose');
    const details = document.getElementById('cashierDetails');
    
    if (isOpen) {
        statusBadge.className = 'cashier-status-badge cashier-open';
        statusBadge.innerHTML = '<i class="fas fa-lock-open"></i><span>Caixa Aberto</span>';
        openActions.style.display = 'none';
        closeActions.style.display = 'flex';
        details.style.display = 'block';
        
        // Preencher detalhes
        document.getElementById('cashierOperator').textContent = cashierSession.operator;
        document.getElementById('cashierOpenTime').textContent = new Date(cashierSession.openedAt).toLocaleString('pt-BR');
        document.getElementById('cashierInitial').textContent = formatCurrency(cashierSession.initialAmount);
        document.getElementById('cashierCurrent').textContent = formatCurrency(calculateCurrentBalance());
        
        // Desabilitar botão de venda se caixa fechado
        const checkoutBtn = document.getElementById('btnCheckout');
        if (checkoutBtn && !checkoutBtn.disabled) {
            checkoutBtn.disabled = false;
        }
    } else {
        statusBadge.className = 'cashier-status-badge cashier-closed';
        statusBadge.innerHTML = '<i class="fas fa-lock"></i><span>Caixa Fechado</span>';
        openActions.style.display = 'flex';
        closeActions.style.display = 'none';
        details.style.display = 'none';
        
        // Desabilitar vendas quando caixa está fechado
        const checkoutBtn = document.getElementById('btnCheckout');
        if (checkoutBtn && cart.length > 0) {
            // Não desabilitar automaticamente - permitir vendas sem caixa aberto
            // checkoutBtn.disabled = true;
        }
    }
    
    updateCashierStats();
}

function calculateCurrentBalance() {
    if (!cashierSession) return 0;
    
    let balance = cashierSession.initialAmount;
    
    // Adicionar vendas
    const sessionSales = salesHistory.filter(s => 
        s.cashierSessionId === cashierSession.id
    );
    balance += sessionSales.reduce((sum, s) => sum + s.total, 0);
    
    // Adicionar suprimentos
    const supplies = cashMovements.filter(m => 
        m.sessionId === cashierSession.id && m.type === 'supply'
    );
    balance += supplies.reduce((sum, m) => sum + m.amount, 0);
    
    // Subtrair sangrias
    const withdrawals = cashMovements.filter(m => 
        m.sessionId === cashierSession.id && m.type === 'withdrawal'
    );
    balance -= withdrawals.reduce((sum, m) => sum + m.amount, 0);
    
    return balance;
}

function openCashierModal() {
    document.getElementById('cashierOperatorInput').value = currentUser.companyName;
    document.getElementById('cashierInitialAmount').value = '';
    document.getElementById('cashierOpenNotes').value = '';
    document.getElementById('cashierOpenModal').style.display = 'flex';
}

function closeCashierOpenModal() {
    document.getElementById('cashierOpenModal').style.display = 'none';
}

async function confirmOpenCashier() {
    const amount = parseFloat(document.getElementById('cashierInitialAmount').value);
    const notes = document.getElementById('cashierOpenNotes').value.trim();
    
    if (isNaN(amount) || amount < 0) {
        showToast('Digite um valor válido para o saldo inicial', 'error');
        return;
    }
    
    showLoader();
    
    try {
        const sessionId = 'CASH_' + Date.now();
        cashierSession = {
            id: sessionId,
            userId: currentUser.id,
            operator: currentUser.companyName,
            openedAt: new Date().toISOString(),
            closedAt: null,
            initialAmount: amount,
            finalAmount: null,
            notes: notes,
            closeNotes: null
        };
        
        if (!useLocal && currentUser.source !== 'local') {
            // Salvar no Supabase
            await sb.from('cashier_sessions').insert({
                id: sessionId,
                user_id: currentUser.id,
                operator: cashierSession.operator,
                opened_at: cashierSession.openedAt,
                initial_amount: amount,
                notes: notes
            });
        }
        
        await saveData();
        updateCashierUI();
        closeCashierOpenModal();
        hideLoader();
        showToast('✅ Caixa aberto com sucesso!', 'success');
    } catch (error) {
        hideLoader();
        showToast('Erro ao abrir caixa: ' + error.message, 'error');
    }
}

function closeCashierModal() {
    if (!cashierSession) return;
    
    // Calcular totais
    const sessionSales = salesHistory.filter(s => 
        s.cashierSessionId === cashierSession.id
    );
    const totalSales = sessionSales.reduce((sum, s) => sum + s.total, 0);
    
    const supplies = cashMovements.filter(m => 
        m.sessionId === cashierSession.id && m.type === 'supply'
    );
    const totalSupplies = supplies.reduce((sum, m) => sum + m.amount, 0);
    
    const withdrawals = cashMovements.filter(m => 
        m.sessionId === cashierSession.id && m.type === 'withdrawal'
    );
    const totalWithdrawals = withdrawals.reduce((sum, m) => sum + m.amount, 0);
    
    const finalBalance = cashierSession.initialAmount + totalSales + totalSupplies - totalWithdrawals;
    
    // Preencher modal
    document.getElementById('closeCashierInitial').textContent = formatCurrency(cashierSession.initialAmount);
    document.getElementById('closeCashierSales').textContent = formatCurrency(totalSales);
    document.getElementById('closeCashierSupplies').textContent = formatCurrency(totalSupplies);
    document.getElementById('closeCashierWithdrawals').textContent = formatCurrency(totalWithdrawals);
    document.getElementById('closeCashierFinal').textContent = formatCurrency(finalBalance);
    document.getElementById('cashierCloseNotes').value = '';
    
    document.getElementById('cashierCloseModal').style.display = 'flex';
}

function closeCashierCloseModal() {
    document.getElementById('cashierCloseModal').style.display = 'none';
}

async function confirmCloseCashier() {
    const closeNotes = document.getElementById('cashierCloseNotes').value.trim();
    
    if (!confirm('Confirma o fechamento do caixa? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    showLoader();
    
    try {
        const finalBalance = calculateCurrentBalance();
        
        cashierSession.closedAt = new Date().toISOString();
        cashierSession.finalAmount = finalBalance;
        cashierSession.closeNotes = closeNotes;
        
        if (!useLocal && currentUser.source !== 'local') {
            // Atualizar no Supabase
            await sb.from('cashier_sessions')
                .update({
                    closed_at: cashierSession.closedAt,
                    final_amount: finalBalance,
                    close_notes: closeNotes
                })
                .eq('id', cashierSession.id);
        }
        
        await saveData();
        
        // Limpar sessão atual
        cashierSession = null;
        
        updateCashierUI();
        closeCashierCloseModal();
        hideLoader();
        showToast('✅ Caixa fechado com sucesso!', 'success');
    } catch (error) {
        hideLoader();
        showToast('Erro ao fechar caixa: ' + error.message, 'error');
    }
}

function openWithdrawalModal() {
    if (!cashierSession) {
        showToast('Abra o caixa primeiro', 'warning');
        return;
    }
    
    document.getElementById('withdrawalAmount').value = '';
    document.getElementById('withdrawalReason').value = '';
    document.getElementById('withdrawalModal').style.display = 'flex';
}

function closeWithdrawalModal() {
    document.getElementById('withdrawalModal').style.display = 'none';
}

async function confirmWithdrawal() {
    const amount = parseFloat(document.getElementById('withdrawalAmount').value);
    const reason = document.getElementById('withdrawalReason').value.trim();
    
    if (isNaN(amount) || amount <= 0) {
        showToast('Digite um valor válido', 'error');
        return;
    }
    
    if (!reason) {
        showToast('Informe o motivo da sangria', 'error');
        return;
    }
    
    const currentBalance = calculateCurrentBalance();
    if (amount > currentBalance) {
        showToast('Saldo insuficiente no caixa', 'error');
        return;
    }
    
    showLoader();
    
    try {
        const movement = {
            id: 'MOV_' + Date.now(),
            sessionId: cashierSession.id,
            type: 'withdrawal',
            amount: amount,
            reason: reason,
            createdAt: new Date().toISOString(),
            operator: currentUser.companyName
        };
        
        cashMovements.unshift(movement);
        
        if (!useLocal && currentUser.source !== 'local') {
            await sb.from('cash_movements').insert({
                id: movement.id,
                session_id: cashierSession.id,
                type: 'withdrawal',
                amount: amount,
                reason: reason,
                operator: currentUser.companyName
            });
        }
        
        await saveData();
        updateCashierUI();
        renderCashMovements();
        closeWithdrawalModal();
        hideLoader();
        showToast('✅ Sangria registrada!', 'success');
    } catch (error) {
        hideLoader();
        showToast('Erro ao registrar sangria: ' + error.message, 'error');
    }
}

function openSupplyModal() {
    if (!cashierSession) {
        showToast('Abra o caixa primeiro', 'warning');
        return;
    }
    
    document.getElementById('supplyAmount').value = '';
    document.getElementById('supplyReason').value = '';
    document.getElementById('supplyModal').style.display = 'flex';
}

function closeSupplyModal() {
    document.getElementById('supplyModal').style.display = 'none';
}

async function confirmSupply() {
    const amount = parseFloat(document.getElementById('supplyAmount').value);
    const reason = document.getElementById('supplyReason').value.trim();
    
    if (isNaN(amount) || amount <= 0) {
        showToast('Digite um valor válido', 'error');
        return;
    }
    
    if (!reason) {
        showToast('Informe o motivo do suprimento', 'error');
        return;
    }
    
    showLoader();
    
    try {
        const movement = {
            id: 'MOV_' + Date.now(),
            sessionId: cashierSession.id,
            type: 'supply',
            amount: amount,
            reason: reason,
            createdAt: new Date().toISOString(),
            operator: currentUser.companyName
        };
        
        cashMovements.unshift(movement);
        
        if (!useLocal && currentUser.source !== 'local') {
            await sb.from('cash_movements').insert({
                id: movement.id,
                session_id: cashierSession.id,
                type: 'supply',
                amount: amount,
                reason: reason,
                operator: currentUser.companyName
            });
        }
        
        await saveData();
        updateCashierUI();
        renderCashMovements();
        closeSupplyModal();
        hideLoader();
        showToast('✅ Suprimento registrado!', 'success');
    } catch (error) {
        hideLoader();
        showToast('Erro ao registrar suprimento: ' + error.message, 'error');
    }
}

function renderCashMovements() {
    const container = document.getElementById('cashMovementsList');
    
    if (!cashierSession || cashMovements.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;color:#b2bec3;padding:40px">
                <i class="fas fa-exchange-alt" style="font-size:2rem;opacity:.4;display:block;margin-bottom:10px"></i>
                Nenhuma movimentação registrada
            </div>
        `;
        return;
    }
    
    const sessionMovements = cashMovements.filter(m => m.sessionId === cashierSession.id);
    
    container.innerHTML = sessionMovements.map(m => `
        <div class="cash-movement-card ${m.type}">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
                <div>
                    <strong style="font-size:1.1rem">
                        ${m.type === 'withdrawal' ? '➖' : '➕'} 
                        ${formatCurrency(m.amount)}
                    </strong>
                    <div style="font-size:.85rem;color:#636e72;margin-top:4px">
                        ${m.type === 'withdrawal' ? 'Sangria' : 'Suprimento'}
                    </div>
                </div>
                <div style="text-align:right;font-size:.85rem;color:#636e72">
                    ${new Date(m.createdAt).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
            <div style="font-size:.9rem;color:var(--text)">
                <strong>Motivo:</strong> ${m.reason}
            </div>
            <div style="font-size:.85rem;color:#636e72;margin-top:4px">
                <strong>Operador:</strong> ${m.operator}
            </div>
        </div>
    `).join('');
}

function updateCashierStats() {
    if (!cashierSession) {
        document.getElementById('cashierTotalSales').textContent = 'R$ 0,00';
        document.getElementById('cashierTotalWithdrawals').textContent = 'R$ 0,00';
        document.getElementById('cashierTotalSupplies').textContent = 'R$ 0,00';
        return;
    }
    
    const sessionSales = salesHistory.filter(s => 
        s.cashierSessionId === cashierSession.id
    );
    const totalSales = sessionSales.reduce((sum, s) => sum + s.total, 0);
    
    const supplies = cashMovements.filter(m => 
        m.sessionId === cashierSession.id && m.type === 'supply'
    );
    const totalSupplies = supplies.reduce((sum, m) => sum + m.amount, 0);
    
    const withdrawals = cashMovements.filter(m => 
        m.sessionId === cashierSession.id && m.type === 'withdrawal'
    );
    const totalWithdrawals = withdrawals.reduce((sum, m) => sum + m.amount, 0);
    
    document.getElementById('cashierTotalSales').textContent = formatCurrency(totalSales);
    document.getElementById('cashierTotalWithdrawals').textContent = formatCurrency(totalWithdrawals);
    document.getElementById('cashierTotalSupplies').textContent = formatCurrency(totalSupplies);
}

// ══════════════════════════════════════
// CRONÔMETRO DE VENDA
// ══════════════════════════════════════
function startSaleTimer() {
    stopSaleTimer();
    saleStartTime = Date.now();
    saleTimerInterval = setInterval(updateTimerDisplay, 1000);
    updateTimerDisplay();
}

function stopSaleTimer() {
    if (saleTimerInterval) { 
        clearInterval(saleTimerInterval); 
        saleTimerInterval=null; 
    }
}

function updateTimerDisplay() {
    const el = document.getElementById('liveSaleTimer');
    if (!el || !saleStartTime) return;
    
    const elapsed = Math.floor((Date.now()-saleStartTime)/1000);
    const m = Math.floor(elapsed/60).toString().padStart(2,'0');
    const s = (elapsed%60).toString().padStart(2,'0');
    el.textContent = `${m}:${s}`;
}

function getSaleProcessingTime() {
    if(!saleStartTime) return '0s';
    return ((Date.now()-saleStartTime)/1000).toFixed(1)+'s';
}

// ══════════════════════════════════════
// PDV / CARRINHO
// ══════════════════════════════════════
function renderPOS() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML='';
    
    products.forEach(p=>{
        const sc = p.stock<3?'stock-low':p.stock<10?'stock-medium':'stock-high';
        const inCart = (cart.find(i=>i.id===p.id)||{qty:0}).qty;
        const card = document.createElement('div');
        card.className='product-card';
        card.setAttribute('data-product-id',p.id);
        card.onclick=()=>addToCart(p.id);
        card.innerHTML=`
            <span class="product-stock ${sc}">${p.stock}</span>
            <span class="product-emoji floating">${p.emoji}</span>
            <div class="product-name">${p.name}</div>
            ${p.category?`<div class="product-category">${getCatName(p.category)}</div>`:''}
            <div class="product-price">R$ ${p.price.toFixed(2)}</div>
            ${inCart>0?`<div style="margin-top:8px;background:var(--primary);color:white;padding:4px 10px;border-radius:10px;font-size:.8rem;font-weight:700">${inCart} no carrinho</div>`:''}
        `;
        grid.appendChild(card);
    });
}

function addToCart(id) {
    const p = products.find(x=>x.id===id);
    if (!p) return;
    
    const ci = cart.find(i=>i.id===id);
    const currentQtyInCart = ci ? ci.qty : 0;
    
    if (p.stock <= currentQtyInCart) {
        showToast(`⚠️ Estoque insuficiente de "${p.name}". Disponível: ${p.stock}`, 'warning');
        return;
    }
    
    if (ci) ci.qty++; 
    else cart.push({...p, qty:1});

    highlightProductCard(id);
    updateCartUI();
    updateNotifications();
    showToast(`✅ ${p.name} adicionado!`, 'success', 1800);
}

function highlightProductCard(id) {
    const card = document.querySelector(`[data-product-id="${id}"]`);
    if (!card) return;
    
    card.classList.add('highlight-add');
    const navBtn = document.querySelectorAll('.nav-btn')[0];
    navBtn.classList.add('pop');
    
    setTimeout(()=>{ 
        card.classList.remove('highlight-add'); 
        navBtn.classList.remove('pop'); 
    }, 650);
}

function removeFromCart(id, all=false) {
    const idx=cart.findIndex(i=>i.id===id);
    if(idx<0) return;
    
    const it=cart[idx];
    if(all||it.qty<=1) cart.splice(idx,1); 
    else it.qty--;
    
    updateCartUI(); 
    updateNotifications();
}

function updateCartItemQty(id, qty) {
    if(qty<1){
        removeFromCart(id,true);
        return;
    }
    
    const ci=cart.find(i=>i.id===id);
    const p=products.find(x=>x.id===id);
    
    if(ci&&p&&qty<=p.stock){
        ci.qty=qty;
        updateCartUI();
    } else {
        showToast('Quantidade superior ao estoque disponível','warning');
    }
}

function clearCart() {
    if(!cart.length) return;
    
    if(confirm('Limpar carrinho? Todos os itens serão removidos.')){
        cart=[]; 
        currentDiscount=0;
        updateCartUI(); 
        updateNotifications();
        showToast('Carrinho limpo','info');
    }
}

function removeDiscount() {
    currentDiscount=0;
    updateCartUI();
    showToast('Desconto removido','info');
}

function updateCartUI() {
    const container=document.getElementById('cartItems');
    const totalEl=document.getElementById('cartTotal');
    const btn=document.getElementById('btnCheckout');
    const ccBtn=document.getElementById('clearCartBtn');
    const summary=document.getElementById('cartSummary');
    const discBanner=document.getElementById('discountBanner');

    if(!cart.length){
        container.innerHTML=`<div style="text-align:center;color:#b2bec3;margin-top:50px;padding:30px">
            <i class="fas fa-shopping-basket" style="font-size:3rem;margin-bottom:15px;opacity:.5"></i>
            <p style="font-size:1rem;margin-bottom:8px">Cesta vazia 🍃</p>
            <p style="font-size:.85rem">Clique nos produtos ou escaneie</p>
        </div>`;
        totalEl.textContent='R$ 0,00';
        btn.disabled=true; 
        ccBtn.disabled=true;
        summary.style.display='none';
        discBanner.classList.remove('show');
        document.getElementById('liveCartCount').textContent='0 itens';
        document.getElementById('liveCartTotal').textContent='R$ 0,00';
        return;
    }

    let sub=0, html='';
    cart.forEach(it=>{
        const tot=it.price*it.qty; 
        sub+=tot;
        html+=`<div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${it.emoji} ${it.name}</div>
                <div style="color:#636e72;font-size:.82rem">R$ ${it.price.toFixed(2)} un</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateCartItemQty(${it.id},${it.qty-1})">−</button>
                    <span style="font-weight:800;min-width:24px;text-align:center">${it.qty}</span>
                    <button class="qty-btn" onclick="updateCartItemQty(${it.id},${it.qty+1})">+</button>
                    <span style="margin-left:8px;color:var(--primary);font-weight:700">R$ ${tot.toFixed(2)}</span>
                </div>
            </div>
            <div class="remove-btn" onclick="removeFromCart(${it.id},true)" title="Remover"><i class="fas fa-trash"></i></div>
        </div>`;
    });

    const disc = sub*(currentDiscount/100);
    const total = sub-disc;

    container.innerHTML=html;
    totalEl.textContent=`R$ ${total.toFixed(2)}`;
    btn.disabled=false; 
    ccBtn.disabled=false;

    summary.style.display='block';
    document.getElementById('summarySubtotal').textContent=`R$ ${sub.toFixed(2)}`;
    
    const discRow=document.getElementById('summaryDiscountRow');
    if(currentDiscount>0){
        discRow.style.display='flex';
        document.getElementById('summaryDiscountLabel').textContent=`Desconto (${currentDiscount}%):`;
        document.getElementById('summaryDiscount').textContent=`-R$ ${disc.toFixed(2)}`;
    } else { 
        discRow.style.display='none'; 
    }
    
    document.getElementById('summaryTotal').textContent=`R$ ${total.toFixed(2)}`;

    if(currentDiscount>0){
        discBanner.classList.add('show');
        document.getElementById('discountBannerText').textContent=`🎉 Desconto de ${currentDiscount}% aplicado (−R$ ${disc.toFixed(2)})`;
    } else { 
        discBanner.classList.remove('show'); 
    }

    const totalItems=cart.reduce((a,i)=>a+i.qty,0);
    document.getElementById('liveCartCount').textContent=`${totalItems} ${totalItems===1?'item':'itens'}`;
    document.getElementById('liveCartTotal').textContent=`R$ ${total.toFixed(2)}`;
}

// ── SISTEMA DE DESCONTOS ──
function applyDiscount(pct=null) {
    if(!cart.length){
        showToast('Adicione produtos primeiro','warning');
        return;
    }
    
    if(pct===null){
        const v=prompt(`Desconto percentual (0-100):\nDesconto atual: ${currentDiscount}%`,'');
        if(v===null) return;
        pct=parseFloat(v);
        
        if(isNaN(pct)||pct<0||pct>100){
            showToast('Valor inválido (0-100)','error');
            return;
        }
    }
    
    currentDiscount=pct;
    updateCartUI();
    
    if(pct>0) showToast(`🎉 Desconto de ${pct}% aplicado!`,'success');
    else showToast('Desconto removido','info');
}

function applyDiscountToSale(p){
    applyDiscount(p);
    
    // Atualizar modal se estiver aberto
    if(document.getElementById('paymentModal').style.display==='flex'){
        const sub=cart.reduce((a,i)=>a+i.price*i.qty,0);
        const disc=sub*(currentDiscount/100);
        const total=sub-disc;
        document.getElementById('modalSubtotal').textContent=`R$ ${sub.toFixed(2)}`;
        document.getElementById('modalDiscount').textContent=`−R$ ${disc.toFixed(2)}`;
        document.getElementById('modalTotalValue').textContent=`R$ ${total.toFixed(2)}`;
    }
}

// ══════════════════════════════════════
// PAGAMENTO
// ══════════════════════════════════════
function openPaymentModal() {
    if(!cart.length){
        showToast('Carrinho vazio','warning');
        return;
    }
    
    const sub=cart.reduce((a,i)=>a+i.price*i.qty,0);
    const disc=sub*(currentDiscount/100);
    const total=sub-disc;
    
    document.getElementById('modalSubtotal').textContent=`R$ ${sub.toFixed(2)}`;
    document.getElementById('modalDiscount').textContent=`−R$ ${disc.toFixed(2)}`;
    document.getElementById('modalTotalValue').textContent=`R$ ${total.toFixed(2)}`;
    document.getElementById('paymentModal').style.display='flex';
}

function closePaymentModal(){
    document.getElementById('paymentModal').style.display='none';
}

async function processPayment(method) {
    closePaymentModal();
    showLoader();
    
    try {
        const processingTime = getSaleProcessingTime();
        let sub=0;
        const cartCopy=JSON.parse(JSON.stringify(cart));
        
        cartCopy.forEach(it=>{
            sub+=it.price*it.qty;
        });
        
        const disc=sub*(currentDiscount/100);
        let total=sub-disc;
        let pm=method;
        
        // Aplicar desconto do Pix
        if(method==='Pix'){
            total=total*0.95; 
            pm='Pix (5% OFF)';
        }

        const sid='V'+Date.now().toString().slice(-6);
        const sale={
            id:sid, 
            date:new Date().toLocaleString('pt-BR'), 
            timestamp:Date.now(),
            subtotal:sub, 
            discount:disc, 
            total,
            itemsCount:cartCopy.reduce((a,i)=>a+i.qty,0),
            items:cartCopy, 
            method:pm, 
            processingTime,
            cashierSessionId: cashierSession?.id || null
        };

        // Baixar estoque
        cartCopy.forEach(ci=>{
            const p=products.find(x=>x.id===ci.id);
            if(p) p.stock=Math.max(0,p.stock-ci.qty);
        });

        salesHistory.unshift(sale);
        currentSaleData=sale;
        cart=[]; 
        currentDiscount=0;
        
        await saveData();

        // Salvar no Supabase
        if(!useLocal && currentUser?.source!=='local'){
            try {
                await sb.from('sales').insert({
                    id:sid, 
                    user_id:currentUser.id,
                    subtotal:sub, 
                    discount:disc, 
                    total,
                    items_count:sale.itemsCount,
                    payment_method:pm,
                    cashier_session_id: cashierSession?.id || null,
                    receipt_data:{items:cartCopy, processingTime}
                });
            } catch(e){ 
                console.warn('Venda salva apenas local:',e); 
            }
        }

        // Atualizar interface
        updateCartUI(); 
        renderPOS(); 
        renderStock();
        stopSaleTimer();
        updateCashierUI();
        
        showToast(`🎉 Venda #${sid} finalizada via ${pm}!`,'success',4000);
        updateDashboard(); 
        generateSalesChart();
        
        hideLoader();
        setTimeout(() => {
            openReceiptModal();
        }, 500);
        
    } catch (error) {
        hideLoader();
        showToast('Erro ao processar venda: ' + error.message, 'error');
    }
}

// ══════════════════════════════════════
// RECIBOS
// ══════════════════════════════════════
function openReceiptModal(){
    if(!currentSaleData) {
        showToast('Nenhuma venda para exibir','warning');
        return;
    }
    
    document.getElementById('receiptId').textContent=currentSaleData.id;
    document.getElementById('receiptDate').textContent=currentSaleData.date;
    document.getElementById('receiptMethod').textContent=currentSaleData.method;
    document.getElementById('receiptTotal').textContent=`R$ ${currentSaleData.total.toFixed(2)}`;
    document.getElementById('receiptModal').style.display='flex';
}

function closeReceiptModal(){
    document.getElementById('receiptModal').style.display='none';
}

function newSale() {
    closeReceiptModal();
    currentSaleData = null;
    startSaleTimer();
    switchTab('pdv');
    document.getElementById('barcodeInput').focus();
    showToast('Nova venda iniciada! 🚀','success');
}

function goToPdv() {
    closeReceiptModal();
    switchTab('pdv');
    document.getElementById('barcodeInput').focus();
}

function printReceiptFromModal(){
    if(!currentSaleData) return;
    
    const s=currentSaleData;
    const cn = currentUser?.companyName || APP_NAME;
    const win=window.open('','ThermalReceipt','width=340,height=700,toolbar=no,menubar=no,scrollbars=yes');
    
    if(!win) {
        showToast('Permita pop-ups para imprimir','warning');
        return;
    }
    
    const items=s.items.map(it=>`
        <tr><td colspan="2">${it.qty}x ${it.name}</td></tr>
        <tr><td style="padding-left:10px;color:#555">R$ ${it.price.toFixed(2)} un</td><td style="text-align:right;font-weight:bold">R$ ${(it.price*it.qty).toFixed(2)}</td></tr>
    `).join('');
    
    win.document.write(`<!DOCTYPE html><html><head>
        <meta charset="UTF-8">
        <title>Cupom - ${s.id}</title>
        <style>
            *{margin:0;padding:0;box-sizing:border-box}
            body{font-family:'Courier New',Courier,monospace;font-size:12px;width:300px;padding:15px;color:#000}
            .center{text-align:center}.bold{font-weight:bold}
            .separator{border-top:1px dashed #000;margin:8px 0}
            table{width:100%;border-collapse:collapse}
            td{padding:2px 0}
            .total-row{font-size:15px;font-weight:bold;border-top:2px solid #000;padding-top:6px;margin-top:6px}
            .footer{margin-top:15px;text-align:center;font-size:11px;color:#444}
            .logo{font-size:18px;font-weight:bold;letter-spacing:1px}
        </style>
    </head><body>
        <div class="center">
            <div class="logo">✨ ${cn.toUpperCase()}</div>
            <div style="font-size:10px;margin-top:3px">Sistema Profissional de Vendas</div>
            <div class="separator"></div>
            <div>CUPOM NÃO FISCAL</div>
            <div class="separator"></div>
        </div>
        <div>ID: <b>${s.id}</b></div>
        <div>Data: ${s.date}</div>
        <div class="separator"></div>
        <div class="bold">ITENS DA COMPRA</div>
        <div class="separator"></div>
        <table>${items}</table>
        <div class="separator"></div>
        <table>
            <tr><td>Subtotal:</td><td style="text-align:right">R$ ${s.subtotal.toFixed(2)}</td></tr>
            ${s.discount>0?`<tr><td style="color:green">Desconto:</td><td style="text-align:right;color:green">-R$ ${s.discount.toFixed(2)}</td></tr>`:''}
            <tr class="total-row"><td>TOTAL:</td><td style="text-align:right">R$ ${s.total.toFixed(2)}</td></tr>
        </table>
        <div class="separator"></div>
        <div>Pagamento: <b>${s.method}</b></div>
        <div>Processado em: ${s.processingTime}</div>
        <div class="footer">
            <div class="separator"></div>
            Obrigado pela preferência! 🌟<br>
            Volte sempre!<br>
            <div style="margin-top:8px;font-size:10px">Gerado por ${APP_NAME} v${APP_VER}</div>
        </div>
        <script>setTimeout(()=>{window.print();},300);<\/script>
    </body></html>`);
    
    win.document.close();
    showToast('🖨️ Impressão iniciada!','success');
}

function sendViaWhatsapp(){
    if(!currentSaleData) return;
    
    const s=currentSaleData;
    const cn = currentUser?.companyName||APP_NAME;
    let t=`*✨ ${cn}*%0A`;
    t+=`*Comprovante de Venda*%0A`;
    t+=`ID: \`${s.id}\`%0A`;
    t+=`Data: ${s.date}%0A`;
    t+=`--------------------------------%0A`;
    t+=`*ITENS:*%0A`;
    s.items.forEach(i=>{
        t+=`${i.qty}x ${i.emoji} ${i.name}%0A  R$ ${(i.price*i.qty).toFixed(2)}%0A`;
    });
    t+=`--------------------------------%0A`;
    if(s.discount>0) t+=`Desconto: -R$ ${s.discount.toFixed(2)}%0A`;
    t+=`*TOTAL: R$ ${s.total.toFixed(2)}*%0A`;
    t+=`Pagamento: ${s.method}%0A`;
    t+=`--------------------------------%0A`;
    t+=`Obrigado pela preferência! 🌟%0AVolte sempre!`;
    
    window.open(`https://api.whatsapp.com/send?text=${t}`,'_blank');
    showToast('Comprovante preparado para WhatsApp 📱','success');
}

function sendViaEmail(){
    if(!currentSaleData) return;
    
    const s=currentSaleData;
    const cn = currentUser?.companyName||APP_NAME;
    let b=`${cn} — Comprovante de Venda\n`;
    b+=`${'='.repeat(40)}\n`;
    b+=`ID da Venda: ${s.id}\n`;
    b+=`Data/Hora: ${s.date}\n`;
    b+=`Forma de Pagamento: ${s.method}\n`;
    b+=`${'─'.repeat(40)}\n`;
    b+=`ITENS DA COMPRA:\n\n`;
    s.items.forEach(i=>{
        b+=`  ${i.qty}x ${i.name}\n     R$ ${i.price.toFixed(2)} un = R$ ${(i.price*i.qty).toFixed(2)}\n\n`;
    });
    b+=`${'─'.repeat(40)}\n`;
    b+=`Subtotal: R$ ${s.subtotal.toFixed(2)}\n`;
    if(s.discount>0) b+=`Desconto: -R$ ${s.discount.toFixed(2)}\n`;
    b+=`TOTAL: R$ ${s.total.toFixed(2)}\n`;
    b+=`${'='.repeat(40)}\n`;
    b+=`Tempo de processamento: ${s.processingTime}\n\n`;
    b+=`Obrigado pela preferência! 🌟\nVolte sempre!\n\n`;
    b+=`— ${APP_NAME} v${APP_VER}`;
    
    window.location.href=`mailto:?subject=${encodeURIComponent(`Comprovante ${s.id} - ${cn}`)}&body=${encodeURIComponent(b)}`;
    showToast('Cliente de email aberto com comprovante 📧','info');
}

// ══════════════════════════════════════
// ESTOQUE
// ══════════════════════════════════════
function renderStock(){
    const tbody=document.getElementById('stockTableBody');
    tbody.innerHTML='';
    
    products.forEach(p=>{
        const sc=p.stock<5?'stock-low':p.stock<15?'stock-medium':'stock-high';
        const tr=document.createElement('tr');
        tr.innerHTML=`<td><span style="font-size:1.3rem">${p.emoji}</span> ${p.name}</td>
            <td><b>R$ ${p.price.toFixed(2)}</b></td>
            <td>
                <span class="product-stock ${sc}" style="position:static;display:inline-block">${p.stock}</span>
                <input type="number" value="${p.stock}" onchange="updateStock(${p.id},this.value)"
                    style="width:65px;padding:5px 8px;border-radius:8px;border:1px solid #dfe6e9;margin-left:8px;min-width:unset;flex:unset">
            </td>
            <td>${getCatName(p.category)||'—'}</td>
            <td>
                <button onclick="editProduct(${p.id})" style="background:var(--secondary);color:white;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;margin-right:5px;font-weight:700">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteProduct(${p.id})" style="background:var(--danger);color:white;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;font-weight:700">
                    <i class="fas fa-trash"></i>
                </button>
            </td>`;
        tbody.appendChild(tr);
    });
}

function filterStockTable(){
    const q=document.getElementById('stockSearch').value.toLowerCase();
    document.querySelectorAll('#stockTableBody tr').forEach(r=>{
        r.style.display=r.textContent.toLowerCase().includes(q)?'':'none';
    });
}

async function addProduct(){
    const name=document.getElementById('newProdName').value.trim();
    const price=parseFloat(document.getElementById('newProdPrice').value);
    const stock=parseInt(document.getElementById('newProdStock').value);
    const emojiVal=document.getElementById('newProdEmoji').value.trim();
    const cat=document.getElementById('newProdCategory').value||'outro';
    
    if(!name||isNaN(price)||price<=0||isNaN(stock)||stock<0){
        showToast('Preencha os campos corretamente','error');
        return;
    }
    
    let emoji='📦';
    if(emojiVal){
        const emojiRegex=/[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/u;
        if(emojiRegex.test(emojiVal.charAt(0))) emoji=emojiVal.charAt(0);
        else {
            const found=EMOJI_DB.find(e=>e.keys.some(k=>k.includes(emojiVal.toLowerCase())));
            emoji=found?found.char:'📦';
        }
    }
    
    const newId=products.length?Math.max(...products.map(p=>typeof p.id==='number'?p.id:0))+1:1;
    const np={id:newId,name,price,stock,emoji,category:cat};
    
    if(!useLocal&&currentUser?.source!=='local'){
        try{
            const {data,error}=await sb.from('products')
                .insert({...np,id:undefined,user_id:currentUser.id})
                .select()
                .single();
            if(!error&&data) np.id=data.id;
        }catch(e){
            console.warn('Produto salvo localmente:',e);
        }
    }
    
    products.push(np);
    await saveData();
    
    document.getElementById('newProdName').value='';
    document.getElementById('newProdPrice').value='';
    document.getElementById('newProdStock').value='';
    document.getElementById('newProdEmoji').value='';
    document.getElementById('newProdCategory').value='';
    document.getElementById('emojiPreviewBadge').textContent='📦';
    
    showToast(`"${name}" ${emoji} adicionado!`,'success');
    renderStock(); 
    renderPOS(); 
    checkLowStock();
}

function editProduct(id){
    const p=products.find(x=>x.id===id);
    if(!p) return;
    
    document.getElementById('newProdName').value=p.name;
    document.getElementById('newProdPrice').value=p.price;
    document.getElementById('newProdStock').value=p.stock;
    document.getElementById('newProdEmoji').value=p.emoji;
    document.getElementById('newProdCategory').value=p.category||'';
    document.getElementById('emojiPreviewBadge').textContent=p.emoji;
    
    const btn=document.querySelector('.btn-checkout[onclick="addProduct()"]');
    if(btn){
        btn.innerHTML='<i class="fas fa-save"></i> Salvar Alterações';
        btn.setAttribute('onclick',`saveEdit(${id})`);
    }
    
    const formAdd=document.querySelector('.form-add');
    formAdd.scrollIntoView({behavior:'smooth'});
    showToast(`Editando: ${p.name}.`,'info');
}

async function saveEdit(id){
    const p=products.find(x=>x.id===id);
    if(!p) return;
    
    p.name=document.getElementById('newProdName').value.trim()||p.name;
    p.price=parseFloat(document.getElementById('newProdPrice').value)||p.price;
    p.stock=parseInt(document.getElementById('newProdStock').value)??p.stock;
    p.category=document.getElementById('newProdCategory').value||p.category;
    
    const ev=document.getElementById('newProdEmoji').value.trim();
    if(ev) p.emoji=ev.charAt(0)||p.emoji;
    
    if(!useLocal&&currentUser?.source!=='local'){
        await sb.from('products')
            .update(p)
            .eq('id',id)
            .catch(()=>{});
    }
    
    await saveData();
    
    const btn=document.querySelector('[onclick^="saveEdit"]');
    if(btn){
        btn.innerHTML='<i class="fas fa-plus-circle"></i> Adicionar';
        btn.setAttribute('onclick','addProduct()');
    }
    
    document.getElementById('newProdName').value='';
    document.getElementById('newProdPrice').value='';
    document.getElementById('newProdStock').value='';
    document.getElementById('newProdEmoji').value='';
    document.getElementById('newProdCategory').value='';
    document.getElementById('emojiPreviewBadge').textContent='📦';
    
    showToast(`"${p.name}" atualizado!`,'success');
    renderStock(); 
    renderPOS();
}

async function updateStock(id,qty){
    const p=products.find(x=>x.id===id);
    if(!p) return;
    
    p.stock=Math.max(0,parseInt(qty)||0);
    
    if(!useLocal&&currentUser?.source!=='local'){
        await sb.from('products')
            .update({stock:p.stock})
            .eq('id',id)
            .catch(()=>{});
    }
    
    await saveData();
    checkLowStock(); 
    renderStock(); 
    renderPOS();
}

async function deleteProduct(id){
    const p=products.find(x=>x.id===id);
    if(!p||!confirm(`Excluir "${p.name}"?`)) return;
    
    if(!useLocal&&currentUser?.source!=='local'){
        await sb.from('products')
            .delete()
            .eq('id',id)
            .catch(()=>{});
    }
    
    products=products.filter(x=>x.id!==id);
    cart=cart.filter(i=>i.id!==id);
    await saveData();
    
    showToast(`"${p.name}" excluído`,'info');
    renderStock(); 
    renderPOS(); 
    updateCartUI(); 
    checkLowStock();
}

function checkLowStock(){
    const n=products.filter(p=>p.stock<5).length;
    const nb=document.getElementById('stockNotification');
    const lb=document.getElementById('lowStockBadge');
    
    if(n>0){
        nb.textContent=n;
        nb.style.display='flex';
        lb.style.display='flex';
        document.getElementById('lowStockCount').textContent=`${n} produto${n>1?'s':''}`;
    } else{
        nb.style.display='none';
        lb.style.display='none';
    }
    
    document.getElementById('dashLowStock').textContent=n;
}

function exportStockCSV(){
    let csv='Produto;Preço;Estoque;Categoria;Emoji\n';
    products.forEach(p=>{
        csv+=`"${p.name}";${p.price.toFixed(2)};${p.stock};"${getCatName(p.category)}";"${p.emoji}"\n`;
    });
    dlCSV(csv,`estoque_${now()}.csv`);
    showToast('Estoque exportado! 📊','success');
}

// ── SISTEMA DE EMOJIS INTELIGENTE ──
function suggestEmoji(){
    const name=document.getElementById('newProdName').value.toLowerCase();
    const cat=document.getElementById('newProdCategory').value;
    
    if(!name) return;
    
    const found=EMOJI_DB.find(e=>e.keys.some(k=>name.includes(k)||k.includes(name.split(' ')[0])));
    
    if(found){
        document.getElementById('newProdEmoji').value=found.char;
        document.getElementById('emojiPreviewBadge').textContent=found.char;
        if(!cat && found.cat) document.getElementById('newProdCategory').value=found.cat;
    }
}

function updateEmojiPreview(){
    const val=document.getElementById('newProdEmoji').value.trim();
    const preview=document.getElementById('emojiPreviewBadge');
    
    if(!val){
        preview.textContent='📦';
        return;
    }
    
    const emojiRegex=/[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/u;
    if(emojiRegex.test(val.charAt(0))){
        preview.textContent=val.charAt(0);
    } else{
        const found=EMOJI_DB.find(e=>e.keys.some(k=>k.includes(val.toLowerCase())));
        preview.textContent=found?found.char:'❓';
    }
}

// ══════════════════════════════════════
// DASHBOARD
// ══════════════════════════════════════
function updateDashboard(){
    const today=new Date().toDateString();
    const todaySales=salesHistory.filter(s=>new Date(s.timestamp).toDateString()===today);
    const todayTotal=todaySales.reduce((a,s)=>a+s.total,0);
    
    document.getElementById('dashTotalSales').textContent=`R$ ${todayTotal.toFixed(2)}`;
    document.getElementById('dashTotalTickets').textContent=todaySales.length;
    
    const avg=todaySales.length?todayTotal/todaySales.length:0;
    document.getElementById('dashAvgTicket').textContent=`Média: R$ ${avg.toFixed(2)}`;
    
    const freq={};
    salesHistory.forEach(s=>(s.items||[]).forEach(i=>{
        freq[i.name]=(freq[i.name]||0)+i.qty;
    }));
    
    const top=Object.entries(freq).sort((a,b)=>b[1]-a[1])[0];
    document.getElementById('dashTopProduct').textContent=top?top[0].substring(0,14)+(top[0].length>14?'…':''):'-';
    document.getElementById('dashTopProductQty').textContent=top?`${top[1]} unidades`:'0 unidades';
    
    const yesterday=new Date(); 
    yesterday.setDate(yesterday.getDate()-1);
    const yesterdaySales=salesHistory.filter(s=>new Date(s.timestamp).toDateString()===yesterday.toDateString());
    const yesterdayTotal=yesterdaySales.reduce((a,s)=>a+s.total,0);
    
    const changeEl=document.getElementById('dashSalesChange');
    if(yesterdayTotal>0){
        const pct=((todayTotal-yesterdayTotal)/yesterdayTotal*100).toFixed(1);
        changeEl.textContent=`${pct>0?'+':''}${pct}% vs ontem`;
        changeEl.style.color=pct>=0?'var(--success)':'var(--danger)';
    } else { 
        changeEl.textContent='Sem dados de ontem'; 
        changeEl.style.color='var(--text-light)'; 
    }
    
    checkLowStock();
    renderSalesHistory();
}

function renderSalesHistory(){
    const tbody=document.getElementById('salesHistoryBody');
    const f=document.getElementById('salesFilter').value;
    const now2=new Date();
    let list=salesHistory;
    
    if(f==='today'){
        const d=now2.toDateString();
        list=list.filter(s=>new Date(s.timestamp).toDateString()===d);
    } else if(f==='week'){
        const w=new Date(now2-7*86400000);
        list=list.filter(s=>new Date(s.timestamp)>=w);
    } else if(f==='month'){
        const m=new Date(now2-30*86400000);
        list=list.filter(s=>new Date(s.timestamp)>=m);
    }
    
    list=list.slice(0,50);
    
    if(!list.length){
        tbody.innerHTML=`<tr><td colspan="5" style="text-align:center;color:#b2bec3;padding:40px">
            <i class="fas fa-chart-line" style="font-size:2rem;opacity:.4;display:block;margin-bottom:10px"></i>
            Nenhuma venda no período
        </td></tr>`;
        return;
    }
    
    tbody.innerHTML=list.map(s=>`<tr>
        <td>${s.date}</td>
        <td><span style="background:#f8f9ff;padding:4px 10px;border-radius:10px;font-size:.85rem;font-weight:700">${s.method}</span></td>
        <td>${s.itemsCount} itens</td>
        <td style="font-weight:900;color:var(--primary)">R$ ${s.total.toFixed(2)}</td>
        <td><button onclick="viewSale('${s.id}')" style="background:var(--primary);color:white;border:none;padding:6px 12px;border-radius:8px;cursor:pointer;font-weight:700">
            <i class="fas fa-eye"></i>
        </button></td>
    </tr>`).join('');
}

function filterSalesHistory(){
    renderSalesHistory();
}

function viewSale(id){
    const s=salesHistory.find(x=>x.id===id);
    if(!s) return;
    
    let d=`════ DETALHES DA VENDA ════\n\nID: ${s.id}\nData: ${s.date}\nPagamento: ${s.method}\nProcessado em: ${s.processingTime||'-'}\n\n── ITENS ──\n\n`;
    (s.items||[]).forEach(i=>{
        d+=`${i.qty}x ${i.emoji} ${i.name}\n   R$ ${i.price.toFixed(2)} un = R$ ${(i.price*i.qty).toFixed(2)}\n\n`;
    });
    d+=`── TOTAIS ──\n\nSubtotal: R$ ${s.subtotal.toFixed(2)}\nDesconto: R$ ${s.discount.toFixed(2)}\nTOTAL: R$ ${s.total.toFixed(2)}`;
    alert(d);
}

function generateSalesChart(){
    const el=document.getElementById('salesChart');
    const days=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    const vals=[0,0,0,0,0,0,0];
    const counts=[0,0,0,0,0,0,0];
    
    salesHistory.forEach(s=>{
        const d=new Date(s.timestamp).getDay();
        vals[d]+=s.total;
        counts[d]++;
    });
    
    const mx=Math.max(...vals,1);
    const totalWeek=vals.reduce((a,b)=>a+b,0);
    
    el.innerHTML=`
        <div style="display:flex;justify-content:space-around;align-items:flex-end;height:220px;padding:0 10px;position:relative">
            ${days.map((d,i)=>`
                <div class="chart-bar-wrap" title="${counts[i]} venda(s) — R$ ${vals[i].toFixed(2)}">
                    <div style="font-size:.7rem;color:var(--primary);font-weight:800;margin-bottom:4px;text-align:center;min-height:18px">
                        ${vals[i]>0?'R$ '+vals[i].toFixed(0):''}
                    </div>
                    <div class="chart-bar" style="height:${Math.max(Math.round((vals[i]/mx)*160),4)}px;width:34px;
                        ${vals[i]===mx&&mx>0?'background:linear-gradient(0deg,var(--primary),var(--accent));box-shadow:0 4px 15px rgba(108,92,231,.4)':''}">
                    </div>
                    <div class="chart-label">${d}</div>
                    ${counts[i]>0?`<div style="font-size:.65rem;color:var(--text-light)">${counts[i]}v</div>`:''}
                </div>
            `).join('')}
        </div>
        <div style="text-align:center;margin-top:15px;padding-top:12px;border-top:1px solid #f1f2f6">
            <span style="font-weight:700;color:var(--primary)">Total: R$ ${totalWeek.toFixed(2)}</span>
            <span style="color:var(--text-light);margin-left:15px;font-size:.85rem">${salesHistory.length} venda(s)</span>
        </div>
    `;
}

function exportSalesCSV(){
    let csv='ID;Data/Hora;Método;Nº Itens;Subtotal;Desconto;Total;Tempo\n';
    salesHistory.forEach(s=>{
        csv+=`"${s.id}";"${s.date}";"${s.method}";${s.itemsCount};"${s.subtotal.toFixed(2)}";"${s.discount.toFixed(2)}";"${s.total.toFixed(2)}";"${s.processingTime||'-'}"\n`;
    });
    dlCSV(csv,`vendas_${now()}.csv`);
    showToast('Histórico exportado! 📊','success');
}

// ══════════════════════════════════════
// SCANNER / BUSCA / VOZ
// ══════════════════════════════════════
function setupBarcodeScanner(){
    const input=document.getElementById('barcodeInput');
    
    input.addEventListener('input',function(){
        const t=this.value.toLowerCase().trim();
        if(t.length>1) showSuggestions(t); 
        else hideSuggestions();
        suggestionIndex=-1;
    });
    
    input.addEventListener('keydown',function(e){
        const items=document.querySelectorAll('.suggestion-item');
        
        if(e.key==='ArrowDown'){
            e.preventDefault();
            suggestionIndex=Math.min(suggestionIndex+1,items.length-1);
            highlightSuggestion(items);
        } else if(e.key==='ArrowUp'){
            e.preventDefault();
            suggestionIndex=Math.max(suggestionIndex-1,0);
            highlightSuggestion(items);
        } else if(e.key==='Enter'){
            e.preventDefault();
            
            if(suggestionIndex>=0&&items[suggestionIndex]){
                items[suggestionIndex].click(); 
                return;
            }
            
            const t=this.value.toLowerCase().trim();
            const f=products.find(p=>p.id==t||p.name.toLowerCase().includes(t));
            
            if(f){
                addToCart(f.id);
                this.value='';
                hideSuggestions();
                suggestionIndex=-1;
            } else {
                showToast('Produto não encontrado.','error');
            }
        } else if(e.key==='Escape'){
            hideSuggestions();
            suggestionIndex=-1;
        }
    });
    
    document.addEventListener('click',function(e){
        if(!e.target.closest('#barcodeInput')&&!e.target.closest('#suggestionsBox')){
            hideSuggestions();
        }
    });
}

function highlightSuggestion(items){
    items.forEach((it,i)=>{
        if(i===suggestionIndex) it.classList.add('active-suggestion');
        else it.classList.remove('active-suggestion');
    });
}

function showSuggestions(term){
    const box=document.getElementById('suggestionsBox');
    const list=products.filter(p=>
        p.name.toLowerCase().includes(term)||
        (p.category&&p.category.includes(term))
    ).slice(0,6);
    
    if(!list.length){
        box.style.display='none';
        return;
    }
    
    box.innerHTML=list.map(p=>`
        <div class="suggestion-item" onclick="selectSuggestion(${p.id})">
            <span style="font-size:2rem">${p.emoji}</span>
            <div style="flex:1">
                <div style="font-weight:800">${p.name}</div>
                <div style="font-size:.82rem;color:#636e72">
                    <span style="color:var(--primary);font-weight:700">R$ ${p.price.toFixed(2)}</span>
                    &nbsp;|&nbsp; Estoque: <span style="${p.stock<5?'color:var(--danger);font-weight:700':''}">${p.stock} un</span>
                </div>
            </div>
            <span style="font-size:1.4rem">+</span>
        </div>
    `).join('');
    
    box.style.display='block';
}

function hideSuggestions(){
    document.getElementById('suggestionsBox').style.display='none';
}

function selectSuggestion(id){
    addToCart(id);
    document.getElementById('barcodeInput').value='';
    hideSuggestions();
    suggestionIndex=-1;
}

function openVoiceSearch(){
    const SpeechRec=window.SpeechRecognition||window.webkitSpeechRecognition;
    
    if(!SpeechRec){
        showToast('Reconhecimento de voz não suportado','warning');
        return;
    }
    
    const R=new SpeechRec();
    R.lang='pt-BR'; 
    R.interimResults=false; 
    R.maxAlternatives=3;
    
    showToast('🎤 Ouvindo... fale o nome do produto','info',3000);
    R.start();
    
    R.onresult=function(e){
        const transcripts=Array.from(e.results[0]).map(r=>r.transcript.toLowerCase());
        let found=null;
        
        for(const t of transcripts){
            found=products.find(p=>
                p.name.toLowerCase().includes(t)||
                t.includes(p.name.toLowerCase().split(' ')[0])
            );
            if(found) break;
        }
        
        if(found){
            addToCart(found.id);
            showToast(`🎤 Adicionado: ${found.name}!`,'success');
        } else {
            showToast(`Produto "${transcripts[0]}" não encontrado.`,'warning');
        }
    };
    
    R.onerror=function(ev){
        if(ev.error==='no-speech') showToast('Nenhuma fala detectada','warning');
        else showToast('Erro no reconhecimento de voz','error');
    };
}

function openQuickProductModal(){
    document.getElementById('quickProductModal').style.display='flex';
    document.getElementById('quickProdName').focus();
}

function closeQuickProductModal(){
    document.getElementById('quickProductModal').style.display='none';
    document.getElementById('quickProdName').value='';
    document.getElementById('quickProdPrice').value='';
}

function addQuickProduct(){
    const name=document.getElementById('quickProdName').value.trim();
    const price=parseFloat(document.getElementById('quickProdPrice').value);
    
    if(!name||isNaN(price)||price<=0){
        showToast('Preencha nome e preço','error');
        return;
    }
    
    const found=EMOJI_DB.find(e=>e.keys.some(k=>name.toLowerCase().includes(k)));
    const emoji=found?found.char:'⚡';
    
    const newId=products.length?Math.max(...products.map(p=>typeof p.id==='number'?p.id:0))+1:1;
    const np={id:newId,name,price,stock:999,emoji,category:'outro'};
    
    products.push(np);
    closeQuickProductModal();
    addToCart(newId);
    showToast(`${emoji} "${name}" adicionado!`,'success');
}

// ── ATALHOS DE TECLADO ──
function setupKeyboard(){
    document.addEventListener('keydown',function(e){
        if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT') return;
        
        switch(e.key){
            case 'F1': e.preventDefault(); switchTab('pdv'); break;
            case 'F2': e.preventDefault(); switchTab('stock'); break;
            case 'F3': e.preventDefault(); switchTab('dashboard'); break;
            case 'F4': e.preventDefault(); switchTab('cashier'); break;
            case 'F5': e.preventDefault(); if(cart.length) openPaymentModal(); break;
            case 'F8': e.preventDefault(); clearCart(); break;
            case 'F9': e.preventDefault(); applyDiscount(10); break;
            case 'Escape': 
                e.preventDefault(); 
                document.querySelectorAll('.modal-overlay').forEach(m=>m.style.display='none'); 
                hideSuggestions(); 
                break;
        }
    });
    
    document.getElementById('barcodeInput').addEventListener('keydown',e=>{
        if(e.key==='F2'){
            e.preventDefault();
            openVoiceSearch();
        }
    });
}

// ── MODO ESCURO ──
function toggleDarkMode(){
    const isDark=document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode',isDark);
    document.querySelector('.dark-mode-toggle').innerHTML=isDark?'☀️':'🌙';
    
    if(isDark) applyDark(); 
    else removeDark();
    
    showToast(`Modo ${isDark?'escuro 🌙':'claro ☀️'} ativado`,'info');
}

function applyDark(){
    if(document.getElementById('dms')) return;
    
    const s=document.createElement('style'); 
    s.id='dms';
    s.textContent=`
        body{background:linear-gradient(135deg,#1a1a2e,#16213e)!important;color:#e0e0e0}
        .app-container{background:rgba(30,30,46,.92)!important}
        .content-area{background:linear-gradient(135deg,rgba(40,40,60,.9),rgba(30,30,50,.8))!important}
        .product-card,.cart-panel,.table-container,.card-metric,.chart-container,.modal-content,.stat-badge,.auth-card,.cashier-control{background:rgba(45,45,65,.97)!important;color:#e0e0e0}
        .scan-input,input:not([type=checkbox]),select,textarea{background:rgba(60,60,80,.9)!important;color:#e0e0e0!important;border-color:#6c5ce7!important}
        h2,h3{color:#a29bfe!important}
        table th{background:rgba(108,92,231,.2)!important;color:#a29bfe!important}
        tr:hover{background:rgba(108,92,231,.1)!important}
        .cart-item,.cash-movement-card{background:rgba(60,60,80,.8)!important}
        .cart-item:hover{background:rgba(108,92,231,.2)!important}
        .cart-summary{background:rgba(40,40,60,.8)!important}
        .product-category{background:rgba(60,60,80,.8)!important;color:#ccc!important}
        .quick-action-btn{background:rgba(60,60,80,.9)!important;color:#e0e0e0!important;border-color:#6c5ce7!important}
        .sidebar{background:rgba(20,20,40,.6)!important}
    `;
    document.head.appendChild(s);
}

function removeDark(){
    document.getElementById('dms')?.remove();
}

function updateNotifications(){
    const cn=document.getElementById('cartNotification');
    const n=cart.reduce((a,i)=>a+i.qty,0);
    
    if(n>0){
        cn.textContent=n;
        cn.style.display='flex';
    }else{
        cn.style.display='none';
    }
}

// ── TOAST ──
function showToast(msg, type='success', dur=3000){
    const t=document.getElementById('toast');
    t.className='toast '+type;
    t.querySelector('.toast-message').textContent=msg;
    
    const icons={
        success:'fa-check-circle',
        warning:'fa-exclamation-triangle',
        error:'fa-times-circle',
        info:'fa-info-circle'
    };
    
    t.querySelector('.toast-icon').className=`fas ${icons[type]||'fa-info-circle'} toast-icon`;
    t.classList.add('show');
    
    clearTimeout(t._to);
    t._to=setTimeout(()=>t.classList.remove('show'),dur);
}

function showLoader(){
    document.getElementById('loader').style.display='flex';
}

function hideLoader(){
    document.getElementById('loader').style.display='none';
}

// ══════════════════════════════════════
// BOOT — INICIALIZAÇÃO
// ══════════════════════════════════════
(function boot(){
    initSB();
    createMagicParticles();
    
    if(localStorage.getItem('darkMode')==='true'){
        document.body.classList.add('dark-mode');
        applyDark();
    }
    
    // Tentar restaurar sessão Supabase
    if(!useLocal){
        sb.auth.getSession().then(({data:{session}})=>{
            if(session){
                sb.from('profiles')
                    .select('*')
                    .eq('id',session.user.id)
                    .single()
                    .then(({data:profile})=>{
                        currentUser={
                            id:session.user.id, 
                            email:session.user.email,
                            companyName:profile?.company_name||'Empresa',
                            document:profile?.document||'', 
                            phone:profile?.phone||'',
                            plan:profile?.plan||'professional',
                            isTrial:profile?.is_trial??true,
                            validUntil:profile?.valid_until||new Date(Date.now()+TRIAL_DAYS*86400000).toISOString(),
                            source:'supabase'
                        };
                        
                        loadUserData().then(()=>{
                            document.getElementById('authContainer').style.display='none';
                            document.getElementById('appContainer').style.display='grid';
                            updateSubscriptionStatus();
                            initApp();
                            showToast(`Sessão restaurada! Bem-vindo, ${currentUser.companyName} 👋`,'success');
                        });
                    });
            }
        }).catch(()=>{});
    }
    
    console.log(`%c${APP_NAME} v${APP_VER}`,
        'font-size:16px;font-weight:bold;color:#6c5ce7;background:#f8f9ff;padding:5px 10px;border-radius:6px');
    console.log(`Modo: ${useLocal?'🔶 LocalStorage (Offline)':'🟢 Supabase (Nuvem)'}`);
    
    // Event listeners de login
    document.getElementById('loginPassword').addEventListener('keypress',e=>{
        if(e.key==='Enter')loginUser();
    });
    document.getElementById('loginEmail').addEventListener('keypress',e=>{
        if(e.key==='Enter')loginUser();
    });
})();
