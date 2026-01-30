// ============================================
// PDV MÁGICO PRO - JAVASCRIPT APPLICATION
// v2.4.0 - Complete & Fixed
// ============================================

// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = 'https://kbucnveojexlxlnefmdo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtidWNudmVvamV4bHhsbmVmbWRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTUzOTgsImV4cCI6MjA4NTI3MTM5OH0.usSiBO518-4rdkvVxq1QAi71hCLTicIurfAu2N0gShs';

let supabase;
try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase initialized');
} catch (error) {
    console.error('❌ Supabase initialization error:', error);
}

// --- APP CONSTANTS ---
const APP_NAME = "PDV Mágico Pro";
const APP_VERSION = "2.4.0";
const MONTHLY_PRICE = 29.90;
const TRIAL_DAYS = 7;

// --- STATE ---
let currentUser = null;
let isAuthenticated = false;
let products = [];
let salesHistory = [];
let cart = [];
let currentSaleData = null;
let currentDiscount = 0;
let saleStartTime = null;
let isDarkMode = false;

// --- DEFAULT PRODUCTS ---
const defaultProducts = [
    { id: 1, name: 'Hambúrguer Mágico', price: 25.00, stock: 20, emoji: '🍔', category: 'alimento' },
    { id: 2, name: 'Poção de Cafeína', price: 8.50, stock: 50, emoji: '☕', category: 'bebida' },
    { id: 3, name: 'Donut Estelar', price: 12.00, stock: 15, emoji: '🍩', category: 'alimento' },
    { id: 4, name: 'Pizza Infinita', price: 45.00, stock: 8, emoji: '🍕', category: 'alimento' },
    { id: 5, name: 'Sushi Zen', price: 60.00, stock: 10, emoji: '🍣', category: 'alimento' },
    { id: 6, name: 'Sorvete Nuvem', price: 15.00, stock: 25, emoji: '🍦', category: 'alimento' },
    { id: 7, name: 'Pipoca Dourada', price: 10.00, stock: 30, emoji: '🍿', category: 'alimento' },
    { id: 8, name: 'Suco Vitamina', price: 12.00, stock: 40, emoji: '🥤', category: 'bebida' },
    { id: 9, name: 'Camisa Mágica', price: 89.90, stock: 12, emoji: '👕', category: 'vestuario' },
    { id: 10, name: 'Fones Celestial', price: 120.00, stock: 5, emoji: '🎧', category: 'eletronico' },
];

// --- EMOJI DATABASE ---
const emojiDB = [
    { char: '🍔', keys: 'hamburguer burger lanche', category: 'alimento' },
    { char: '🍕', keys: 'pizza massa italiana', category: 'alimento' },
    { char: '🌭', keys: 'hotdog cachorro quente', category: 'alimento' },
    { char: '🍟', keys: 'batata frita chips', category: 'alimento' },
    { char: '🍩', keys: 'donut rosquinha doce', category: 'alimento' },
    { char: '🍪', keys: 'cookie biscoito', category: 'alimento' },
    { char: '🍫', keys: 'chocolate barra', category: 'alimento' },
    { char: '🍦', keys: 'sorvete casquinha', category: 'alimento' },
    { char: '☕', keys: 'cafe coffee expresso', category: 'bebida' },
    { char: '🥤', keys: 'suco refrigerante bebida', category: 'bebida' },
    { char: '🍺', keys: 'cerveja beer', category: 'bebida' },
    { char: '🍷', keys: 'vinho taca', category: 'bebida' },
    { char: '🍎', keys: 'maca fruta', category: 'alimento' },
    { char: '🍌', keys: 'banana fruta', category: 'alimento' },
    { char: '👕', keys: 'camisa roupa', category: 'vestuario' },
    { char: '👖', keys: 'calca jeans', category: 'vestuario' },
    { char: '👟', keys: 'tenis sapato', category: 'vestuario' },
    { char: '📱', keys: 'celular smartphone', category: 'eletronico' },
    { char: '💻', keys: 'notebook laptop', category: 'eletronico' },
    { char: '🎧', keys: 'fone headphone', category: 'eletronico' },
    { char: '🧼', keys: 'sabao detergente', category: 'limpeza' },
    { char: '🧹', keys: 'vassoura limpeza', category: 'limpeza' },
    { char: '📦', keys: 'caixa pacote', category: 'outro' },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

function showLoader() { document.getElementById('loader').style.display = 'flex'; }
function hideLoader() { document.getElementById('loader').style.display = 'none'; }

function showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');

    toast.className = 'toast ' + type;
    const icons = { success: 'fa-check-circle', warning: 'fa-exclamation-triangle', error: 'fa-times-circle', info: 'fa-info-circle' };
    toastIcon.className = 'fas ' + (icons[type] || icons.success) + ' toast-icon';
    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => toast.classList.remove('show'), duration);
}

function getCategoryName(key) {
    const categories = { alimento: '🍔 Alimento', bebida: '🥤 Bebida', limpeza: '🧼 Limpeza', eletronico: '📱 Eletrônico', vestuario: '👕 Vestuário', outro: '📦 Outro' };
    return categories[key] || key;
}

// ============================================
// SUPABASE FUNCTIONS
// ============================================

async function supabaseLogin(email, password) {
    showLoader();
    try {
        if (!supabase) throw new Error('Supabase not initialized');

        const passwordHash = simpleHash(password);
        const { data, error } = await supabase.from('users').select('*').eq('email', email).eq('password_hash', passwordHash);

        if (error) throw error;
        if (!data || data.length === 0) { hideLoader(); showToast('Email ou senha incorretos', 'error'); return null; }

        const user = data[0];
        hideLoader();
        return {
            id: user.id, email: user.email, companyName: user.company_name || 'Minha Empresa',
            document: user.document || '', phone: user.phone || '', createdAt: user.created_at,
            plan: user.plan || 'professional', status: user.status || 'active',
            validUntil: user.valid_until || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            isTrial: user.is_trial !== false
        };
    } catch (error) {
        console.error('Login error:', error);
        hideLoader();
        showToast('Erro ao fazer login: ' + error.message, 'error');
        return null;
    }
}

async function supabaseRegister(userData) {
    showLoader();
    try {
        if (!supabase) throw new Error('Supabase not initialized');

        const { data: existing } = await supabase.from('users').select('id').eq('email', userData.email);
        if (existing && existing.length > 0) { hideLoader(); showToast('Email já cadastrado', 'error'); return null; }

        const trialEnd = new Date(); trialEnd.setDate(trialEnd.getDate() + TRIAL_DAYS);
        const passwordHash = simpleHash(userData.password);

        const { data: newUser, error } = await supabase.from('users').insert([{
            email: userData.email, password_hash: passwordHash, company_name: userData.companyName || 'Minha Empresa',
            document: userData.document || '', phone: userData.phone || '', plan: 'professional',
            status: 'active', valid_until: trialEnd.toISOString(), is_trial: true
        }]).select();

        if (error) throw error;
        if (!newUser || !newUser[0]) throw new Error('User not created');

        await createDefaultProducts(newUser[0].id);
        hideLoader();

        return {
            id: newUser[0].id, email: newUser[0].email, companyName: newUser[0].company_name,
            document: newUser[0].document, phone: newUser[0].phone, createdAt: newUser[0].created_at,
            plan: newUser[0].plan, status: newUser[0].status, validUntil: newUser[0].valid_until, isTrial: true
        };
    } catch (error) {
        console.error('Register error:', error);
        hideLoader();
        showToast('Erro ao criar conta: ' + error.message, 'error');
        return null;
    }
}

async function createDefaultProducts(userId) {
    if (!supabase || !userId) return;
    try {
        const productsData = defaultProducts.map(p => ({ user_id: userId, name: p.name, price: p.price, stock: p.stock, emoji: p.emoji, category: p.category }));
        await supabase.from('products').insert(productsData);
    } catch (error) { console.error('createDefaultProducts error:', error); }
}

async function loadUserProducts(userId) {
    if (!supabase || !userId) return [...defaultProducts];
    try {
        const { data, error } = await supabase.from('products').select('*').eq('user_id', userId);
        if (error) throw error;
        if (!data || data.length === 0) { await createDefaultProducts(userId); return [...defaultProducts]; }
        return data.map(p => ({ id: p.id, name: p.name, price: parseFloat(p.price), stock: p.stock, emoji: p.emoji || '📦', category: p.category, _supabaseId: p.id }));
    } catch (error) { console.error('loadUserProducts error:', error); return [...defaultProducts]; }
}

async function saveProductToSupabase(product, userId) {
    if (!supabase || !userId) return;
    try {
        if (product._supabaseId) {
            await supabase.from('products').update({ name: product.name, price: product.price, stock: product.stock, emoji: product.emoji, category: product.category }).eq('id', product._supabaseId).eq('user_id', userId);
        } else {
            const { data } = await supabase.from('products').insert([{ user_id: userId, name: product.name, price: product.price, stock: product.stock, emoji: product.emoji, category: product.category }]).select();
            if (data && data[0]) product._supabaseId = data[0].id;
        }
    } catch (error) { console.error('saveProductToSupabase error:', error); }
}

async function deleteProductFromSupabase(productId, userId) {
    if (!supabase || !userId) return;
    try { await supabase.from('products').delete().eq('id', productId).eq('user_id', userId); } catch (error) { console.error('deleteProductFromSupabase error:', error); }
}

async function recordSaleToSupabase(sale, userId) {
    if (!supabase || !userId) return;
    try {
        await supabase.from('sales').insert([{
            id: sale.id, user_id: userId, subtotal: sale.subtotal, discount: sale.discount,
            total: sale.total, items_count: sale.itemsCount, payment_method: sale.method, processing_time: sale.processingTime
        }]);
    } catch (error) { console.error('recordSaleToSupabase error:', error); }
}

async function loadSalesHistory(userId, filter = 'all') {
    if (!supabase || !userId) return [];
    try {
        let query = supabase.from('sales').select('*').eq('user_id', userId).order('sale_date', { ascending: false });
        if (filter !== 'all') {
            const now = new Date(); let start = new Date();
            if (filter === 'today') start.setHours(0, 0, 0, 0);
            else if (filter === 'week') start.setDate(now.getDate() - 7);
            else if (filter === 'month') start.setMonth(now.getMonth() - 1);
            query = query.gte('sale_date', start.toISOString());
        }
        const { data, error } = await query;
        if (error) throw error;
        return (data || []).map(s => ({ id: s.id, date: new Date(s.sale_date).toLocaleString('pt-BR'), timestamp: new Date(s.sale_date).getTime(), subtotal: parseFloat(s.subtotal), discount: parseFloat(s.discount), total: parseFloat(s.total), itemsCount: s.items_count, method: s.payment_method, processingTime: parseFloat(s.processing_time) || 0 }));
    } catch (error) { console.error('loadSalesHistory error:', error); return []; }
}

async function updateProductStock(productId, newStock, userId) {
    if (!supabase || !userId) return;
    try { await supabase.from('products').update({ stock: newStock }).eq('id', productId).eq('user_id', userId); } catch (error) { console.error('updateProductStock error:', error); }
}

// ============================================
// AUTHENTICATION
// ============================================

function showLogin() { document.getElementById('loginCard').style.display = 'block'; document.getElementById('registerCard').style.display = 'none'; }
function showRegister() { document.getElementById('loginCard').style.display = 'none'; document.getElementById('registerCard').style.display = 'block'; }
function showTerms() { document.getElementById('termsModal').style.display = 'flex'; }
function closeTermsModal() { document.getElementById('termsModal').style.display = 'none'; }

async function loginUser(email, password) {
    if (!email || !password) { showToast('Preencha email e senha', 'error'); return; }
    const user = await supabaseLogin(email, password);
    if (user) {
        currentUser = user; isAuthenticated = true;
        products = await loadUserProducts(user.id);
        salesHistory = await loadSalesHistory(user.id);
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('appContainer').style.display = 'grid';
        localStorage.setItem('pdv_current_user', JSON.stringify(user));
        initApp();
        showToast(`Bem-vindo, ${user.companyName}! 👋`, 'success');
    }
}

async function registerUser(userData) {
    if (!userData.email || !userData.password || !userData.confirmPassword) { showToast('Preencha todos os campos', 'error'); return; }
    if (userData.password !== userData.confirmPassword) { showToast('Senhas não coincidem', 'error'); return; }
    if (userData.password.length < 6) { showToast('Senha deve ter pelo menos 6 caracteres', 'error'); return; }

    const newUser = await supabaseRegister(userData);
    if (newUser) {
        showToast('Conta criada! 🎉', 'success');
        currentUser = newUser; isAuthenticated = true;
        products = await loadUserProducts(newUser.id);
        salesHistory = [];
        localStorage.setItem('pdv_current_user', JSON.stringify(newUser));

        setTimeout(() => {
            document.getElementById('authContainer').style.display = 'none';
            document.getElementById('appContainer').style.display = 'grid';
            initApp();
        }, 1000);
    }
}

function logout() {
    if (confirm('Sair do sistema?')) {
        currentUser = null; isAuthenticated = false; cart = []; products = [...defaultProducts]; salesHistory = [];
        localStorage.removeItem('pdv_current_user');
        document.getElementById('appContainer').style.display = 'none';
        document.getElementById('authContainer').style.display = 'flex';
        showLogin();
        showToast('Até logo! 👋', 'info');
    }
}

function openAccountModal() {
    if (!currentUser) return;
    document.getElementById('accountCompanyName').textContent = currentUser.companyName;
    document.getElementById('accountEmail').textContent = currentUser.email;
    document.getElementById('accountDocument').textContent = currentUser.document || 'Não informado';
    document.getElementById('accountValidUntil').textContent = new Date(currentUser.validUntil).toLocaleDateString('pt-BR');
    document.getElementById('accountPlanStatus').textContent = currentUser.isTrial ? 'TRIAL' : 'PROFISSIONAL';
    document.getElementById('accountModal').style.display = 'flex';
}

function closeAccountModal() { document.getElementById('accountModal').style.display = 'none'; }

function updateSubscriptionStatus() {
    if (!currentUser) return;
    const statusEl = document.getElementById('subscriptionStatus');
    const daysLeft = Math.ceil((new Date(currentUser.validUntil) - new Date()) / (1000 * 60 * 60 * 24));
    if (currentUser.isTrial) {
        statusEl.innerHTML = `<i class="fas fa-star"></i> <span>Trial: ${daysLeft} dias</span>`;
        statusEl.style.background = daysLeft <= 3 ? 'var(--danger)' : 'var(--warning)';
    } else {
        statusEl.innerHTML = `<i class="fas fa-crown"></i> <span>Plano Ativo</span>`;
        statusEl.style.background = 'var(--success)';
    }
}

// ============================================
// NAVIGATION
// ============================================

function switchTab(tabId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    const btnIndex = ['pdv', 'stock', 'dashboard'].indexOf(tabId);
    if (btnIndex >= 0) document.querySelectorAll('.nav-btn')[btnIndex].classList.add('active');

    if (tabId === 'dashboard') { updateDashboard(); renderSalesHistory(); }
    if (tabId === 'pdv') { setTimeout(() => { document.getElementById('barcodeInput').focus(); startSaleTimer(); }, 100); }
    if (tabId === 'stock') renderStock();
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    showToast(isDarkMode ? 'Modo escuro ativado 🌙' : 'Modo claro ativado ☀️', 'info');
}

// ============================================
// PDV FUNCTIONS
// ============================================

function renderPOS() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    products.forEach(p => {
        const stockClass = p.stock < 3 ? 'stock-low' : p.stock < 10 ? 'stock-medium' : 'stock-high';
        const cartItem = cart.find(i => i.id === p.id);
        const inCart = cartItem ? cartItem.qty : 0;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-product-id', p.id);
        card.onclick = () => addToCart(p.id);
        card.innerHTML = `
            <span class="product-stock ${stockClass}">${p.stock} un</span>
            <span class="product-emoji floating">${p.emoji}</span>
            <div class="product-name">${p.name}</div>
            ${p.category ? `<div class="product-category">${getCategoryName(p.category)}</div>` : ''}
            <div class="product-price">R$ ${p.price.toFixed(2)}</div>
            ${inCart > 0 ? `<div style="margin-top:10px;background:#6c5ce7;color:white;padding:5px 10px;border-radius:10px;font-size:0.8rem;">${inCart} no carrinho</div>` : ''}
        `;
        grid.appendChild(card);
    });
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const cartItem = cart.find(i => i.id === id);
    const currentQty = cartItem ? cartItem.qty : 0;

    if (product.stock <= currentQty) { showToast(`Estoque insuficiente de ${product.name}`, 'warning'); return; }

    if (cartItem) { cartItem.qty++; } else { cart.push({ ...product, qty: 1 }); }

    updateCartUI();
    updateNotifications();
    renderPOS();
    showToast(`${product.name} adicionado`, 'success');
}

function removeFromCart(id, removeAll = false) {
    const index = cart.findIndex(i => i.id === id);
    if (index > -1) {
        if (removeAll || cart[index].qty <= 1) { cart.splice(index, 1); }
        else { cart[index].qty--; }
    }
    updateCartUI();
    updateNotifications();
    renderPOS();
}

function updateCartItemQuantity(id, newQty) {
    if (newQty < 1) { removeFromCart(id, true); return; }
    const cartItem = cart.find(i => i.id === id);
    const product = products.find(p => p.id === id);
    if (product && cartItem && newQty <= product.stock) { cartItem.qty = newQty; updateCartUI(); renderPOS(); }
    else { showToast('Quantidade indisponível', 'warning'); }
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm('Limpar carrinho?')) { cart = []; currentDiscount = 0; updateCartUI(); updateNotifications(); renderPOS(); showToast('Carrinho limpo', 'info'); }
}

function updateCartUI() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    const btn = document.getElementById('btnCheckout');
    const clearBtn = document.getElementById('clearCartBtn');

    if (cart.length === 0) {
        container.innerHTML = `<div style="text-align:center;color:#b2bec3;margin-top:50px;padding:30px;"><i class="fas fa-shopping-basket" style="font-size:3rem;margin-bottom:15px;opacity:0.5;"></i><p>Sua cesta está vazia 🍃</p></div>`;
        totalEl.textContent = 'R$ 0,00';
        btn.disabled = true; clearBtn.disabled = true;
        document.getElementById('liveCartCount').textContent = '0 itens';
        document.getElementById('liveCartTotal').textContent = 'R$ 0,00';
        return;
    }

    let subtotal = 0;
    let html = '';
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        html += `<div class="cart-item"><div class="cart-item-info"><div class="cart-item-name">${item.emoji} ${item.name}</div><div style="color:#636e72;font-size:0.9rem;">R$ ${item.price.toFixed(2)} un</div><div class="cart-item-qty"><button class="qty-btn" onclick="updateCartItemQuantity(${item.id}, ${item.qty - 1})">-</button><span style="font-weight:700;min-width:30px;text-align:center;">${item.qty}</span><button class="qty-btn" onclick="updateCartItemQuantity(${item.id}, ${item.qty + 1})">+</button><span style="margin-left:10px;color:var(--primary);font-weight:700;">R$ ${itemTotal.toFixed(2)}</span></div></div><div class="remove-btn" onclick="removeFromCart(${item.id}, true)"><i class="fas fa-trash"></i></div></div>`;
    });

    const discountAmount = subtotal * (currentDiscount / 100);
    const total = subtotal - discountAmount;

    container.innerHTML = html;
    totalEl.textContent = `R$ ${total.toFixed(2)}`;
    btn.disabled = false; clearBtn.disabled = false;

    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    document.getElementById('liveCartCount').textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
    document.getElementById('liveCartTotal').textContent = `R$ ${total.toFixed(2)}`;
}

function updateNotifications() {
    const cartNotif = document.getElementById('cartNotification');
    const stockNotif = document.getElementById('stockNotification');
    const lowStockBadge = document.getElementById('lowStockBadge');

    if (cart.length > 0) { cartNotif.textContent = cart.reduce((a, i) => a + i.qty, 0); cartNotif.style.display = 'flex'; }
    else { cartNotif.style.display = 'none'; }

    const lowStock = products.filter(p => p.stock < 5).length;
    if (lowStock > 0) {
        stockNotif.textContent = lowStock; stockNotif.style.display = 'flex';
        document.getElementById('lowStockCount').textContent = `${lowStock} produto${lowStock > 1 ? 's' : ''}`;
        lowStockBadge.style.display = 'flex';
    } else { stockNotif.style.display = 'none'; lowStockBadge.style.display = 'none'; }
}

function applyDiscount(percent = null) {
    if (cart.length === 0) { showToast('Adicione produtos primeiro', 'warning'); return; }
    if (percent === null) { percent = parseFloat(prompt('% de desconto:', '10')); if (isNaN(percent) || percent < 0 || percent > 100) { showToast('Desconto inválido', 'error'); return; } }
    currentDiscount = percent;
    updateCartUI();
    showToast(`Desconto de ${percent}% aplicado!`, 'success');
}

function startSaleTimer() { saleStartTime = Date.now(); }
function getSaleProcessingTime() { return saleStartTime ? ((Date.now() - saleStartTime) / 1000).toFixed(1) : 0; }

function setupBarcodeScanner() {
    const input = document.getElementById('barcodeInput');
    input.addEventListener('input', function () {
        const term = this.value.toLowerCase().trim();
        if (term.length > 1) showProductSuggestions(term); else hideSuggestions();
    });
    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const term = this.value.toLowerCase().trim();
            const found = products.find(p => p.id == term || p.name.toLowerCase().includes(term));
            if (found) { addToCart(found.id); this.value = ''; hideSuggestions(); }
            else { showToast('Produto não encontrado', 'error'); }
        }
    });
}

function showProductSuggestions(term) {
    const box = document.getElementById('suggestionsBox');
    const filtered = products.filter(p => p.name.toLowerCase().includes(term) || (p.category && p.category.includes(term))).slice(0, 5);
    if (filtered.length === 0) { box.style.display = 'none'; return; }

    box.innerHTML = filtered.map(p => `<div class="suggestion-item" onclick="selectSuggestion(${p.id})"><div class="suggestion-emoji">${p.emoji}</div><div><div style="font-weight:700;">${p.name}</div><div style="font-size:0.9rem;color:#636e72;">R$ ${p.price.toFixed(2)} | Est: ${p.stock}</div></div></div>`).join('');
    box.style.display = 'block';
}

function hideSuggestions() { document.getElementById('suggestionsBox').style.display = 'none'; }
function selectSuggestion(id) { addToCart(id); document.getElementById('barcodeInput').value = ''; hideSuggestions(); }

function openVoiceSearch() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'pt-BR';
        recognition.start();
        showToast('Ouvindo... 🎤', 'info');
        recognition.onresult = function (e) {
            const transcript = e.results[0][0].transcript.toLowerCase();
            document.getElementById('barcodeInput').value = transcript;
            const found = products.find(p => p.name.toLowerCase().includes(transcript));
            if (found) { setTimeout(() => { addToCart(found.id); document.getElementById('barcodeInput').value = ''; }, 500); }
        };
        recognition.onerror = () => showToast('Erro no reconhecimento de voz', 'error');
    } else { showToast('Voz não suportada', 'warning'); }
}

// ============================================
// PAYMENT FUNCTIONS
// ============================================

function openPaymentModal() {
    if (cart.length === 0) { showToast('Adicione produtos primeiro', 'warning'); return; }
    const subtotal = cart.reduce((a, i) => a + (i.price * i.qty), 0);
    const discountAmount = subtotal * (currentDiscount / 100);
    const total = subtotal - discountAmount;

    document.getElementById('modalSubtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('modalDiscount').textContent = `-R$ ${discountAmount.toFixed(2)}`;
    document.getElementById('modalTotalValue').textContent = `R$ ${total.toFixed(2)}`;
    document.getElementById('paymentModal').style.display = 'flex';
}

function closePaymentModal() { document.getElementById('paymentModal').style.display = 'none'; }

async function processPayment(method) {
    let subtotal = 0;
    for (const item of cart) {
        const product = products.find(p => p.id === item.id);
        if (product) {
            product.stock -= item.qty;
            if (currentUser && product._supabaseId) { await updateProductStock(product._supabaseId, product.stock, currentUser.id); }
            subtotal += (item.price * item.qty);
        }
    }

    const discountAmount = subtotal * (currentDiscount / 100);
    let total = subtotal - discountAmount;
    let paymentMethod = method;
    if (method === 'Pix') { total = total * 0.95; paymentMethod = 'Pix (5% OFF)'; }

    const sale = {
        id: 'V' + Date.now().toString().slice(-6),
        date: new Date().toLocaleString('pt-BR'),
        timestamp: Date.now(),
        subtotal, discount: discountAmount, total,
        itemsCount: cart.reduce((a, i) => a + i.qty, 0),
        items: JSON.parse(JSON.stringify(cart)),
        method: paymentMethod,
        processingTime: getSaleProcessingTime()
    };

    if (currentUser) { await recordSaleToSupabase(sale, currentUser.id); }
    salesHistory.unshift(sale);
    currentSaleData = sale;

    cart = []; currentDiscount = 0;
    updateCartUI(); renderPOS(); closePaymentModal();
    showToast(`Venda #${sale.id} finalizada! 🎉`, 'success');
    updateDashboard();
    setTimeout(openReceiptModal, 800);
}

function openReceiptModal() {
    if (!currentSaleData) return;
    document.getElementById('receiptId').textContent = currentSaleData.id;
    document.getElementById('receiptDate').textContent = currentSaleData.date;
    document.getElementById('receiptMethod').textContent = currentSaleData.method;
    document.getElementById('receiptTotal').textContent = `R$ ${currentSaleData.total.toFixed(2)}`;
    document.getElementById('receiptModal').style.display = 'flex';
}

function closeReceiptModal() {
    document.getElementById('receiptModal').style.display = 'none';
    currentSaleData = null; saleStartTime = null;
    setTimeout(() => { document.getElementById('barcodeInput').focus(); startSaleTimer(); }, 300);
}

function printReceipt() {
    if (!currentSaleData) return;
    const win = window.open('', 'Receipt', 'width=300,height=600');
    win.document.write(`<html><head><title>Cupom ${currentSaleData.id}</title><style>body{font-family:monospace;font-size:12px;padding:15px;}</style></head><body><center><strong>${APP_NAME}</strong><br>${currentSaleData.date}<br>ID: ${currentSaleData.id}</center><hr>${currentSaleData.items.map(i => `${i.qty}x ${i.name}<br>R$ ${(i.price * i.qty).toFixed(2)}`).join('<br>')}<hr><strong>TOTAL: R$ ${currentSaleData.total.toFixed(2)}</strong><br>Pagamento: ${currentSaleData.method}<hr><center>Obrigado!</center><script>setTimeout(()=>{window.print();window.close();},300);<\/script></body></html>`);
    win.document.close();
}

function sendViaWhatsapp() {
    if (!currentSaleData) return;
    let text = `*${APP_NAME}*%0AID: ${currentSaleData.id}%0ATotal: R$ ${currentSaleData.total.toFixed(2)}%0APagamento: ${currentSaleData.method}`;
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

function sendViaEmail() {
    if (!currentSaleData) return;
    const subject = encodeURIComponent(`Comprovante ${currentSaleData.id}`);
    const body = encodeURIComponent(`${APP_NAME}\nID: ${currentSaleData.id}\nTotal: R$ ${currentSaleData.total.toFixed(2)}\nPagamento: ${currentSaleData.method}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// ============================================
// STOCK FUNCTIONS
// ============================================

function renderStock() {
    const tbody = document.getElementById('stockTableBody');
    tbody.innerHTML = '';

    products.forEach(p => {
        const stockClass = p.stock < 5 ? 'stock-low' : p.stock < 15 ? 'stock-medium' : 'stock-high';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.emoji} ${p.name}</td>
            <td>R$ ${p.price.toFixed(2)}</td>
            <td><span class="product-stock ${stockClass}" style="position:static;">${p.stock}</span></td>
            <td>${getCategoryName(p.category || 'outro')}</td>
            <td>
                <button class="quick-action-btn" onclick="editProduct(${p.id})" style="padding:8px 12px;"><i class="fas fa-edit"></i></button>
                <button class="quick-action-btn" onclick="deleteProduct(${p.id})" style="padding:8px 12px;background:var(--danger);color:white;border-color:var(--danger);"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function addProduct() {
    const name = document.getElementById('newProdName').value.trim();
    const price = parseFloat(document.getElementById('newProdPrice').value) || 0;
    const stock = parseInt(document.getElementById('newProdStock').value) || 0;
    const category = document.getElementById('newProdCategory').value || 'outro';
    let emoji = document.getElementById('newProdEmoji').value.trim() || '📦';

    if (!name) { showToast('Digite o nome do produto', 'error'); return; }
    if (price <= 0) { showToast('Preço inválido', 'error'); return; }

    // Get first emoji if text was entered
    const emojiMatch = emoji.match(/(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u);
    if (emojiMatch) emoji = emojiMatch[0];

    const newProduct = { id: Date.now(), name, price, stock, emoji, category };

    if (currentUser) { await saveProductToSupabase(newProduct, currentUser.id); }
    products.push(newProduct);

    // Clear inputs
    document.getElementById('newProdName').value = '';
    document.getElementById('newProdPrice').value = '';
    document.getElementById('newProdStock').value = '';
    document.getElementById('newProdCategory').value = '';
    document.getElementById('newProdEmoji').value = '';
    document.getElementById('emojiPreview').textContent = '📦';

    renderStock(); renderPOS(); updateNotifications();
    showToast(`${name} adicionado!`, 'success');
}

async function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newName = prompt('Nome:', product.name);
    if (newName === null) return;

    const newPrice = parseFloat(prompt('Preço:', product.price));
    if (isNaN(newPrice)) return;

    const newStock = parseInt(prompt('Estoque:', product.stock));
    if (isNaN(newStock)) return;

    product.name = newName || product.name;
    product.price = newPrice;
    product.stock = newStock;

    if (currentUser && product._supabaseId) { await saveProductToSupabase(product, currentUser.id); }

    renderStock(); renderPOS(); updateNotifications();
    showToast('Produto atualizado!', 'success');
}

async function deleteProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (!confirm(`Excluir ${product.name}?`)) return;

    if (currentUser && product._supabaseId) { await deleteProductFromSupabase(product._supabaseId, currentUser.id); }
    products = products.filter(p => p.id !== id);

    renderStock(); renderPOS(); updateNotifications();
    showToast('Produto excluído!', 'info');
}

function filterStockTable() {
    const search = document.getElementById('stockSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#stockTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(search) ? '' : 'none';
    });
}

function exportStockCSV() {
    let csv = 'Nome,Preço,Estoque,Categoria\n';
    products.forEach(p => { csv += `"${p.name}",${p.price},${p.stock},"${p.category || 'outro'}"\n`; });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'estoque.csv'; a.click();
    showToast('Estoque exportado!', 'success');
}

function populateEmojiList() {
    const datalist = document.getElementById('emojiList');
    emojiDB.forEach(item => {
        const option = document.createElement('option');
        option.value = item.char;
        option.label = `${item.char} ${item.keys}`;
        datalist.appendChild(option);
    });
}

function filterEmojiList() {
    const input = document.getElementById('newProdEmoji').value.toLowerCase();
    const preview = document.getElementById('emojiPreview');
    const found = emojiDB.find(e => e.keys.includes(input) || e.char === input);
    preview.textContent = found ? found.char : '📦';
}

function suggestEmoji() {
    const name = document.getElementById('newProdName').value.toLowerCase();
    const emojiInput = document.getElementById('newProdEmoji');
    const preview = document.getElementById('emojiPreview');
    const categorySelect = document.getElementById('newProdCategory');

    const found = emojiDB.find(e => e.keys.split(' ').some(k => name.includes(k)));
    if (found) {
        emojiInput.value = found.char;
        preview.textContent = found.char;
        if (!categorySelect.value) categorySelect.value = found.category;
    }
}

// ============================================
// DASHBOARD FUNCTIONS
// ============================================

function updateDashboard() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todaySales = salesHistory.filter(s => new Date(s.timestamp) >= today);

    const totalToday = todaySales.reduce((a, s) => a + s.total, 0);
    const ticketsToday = todaySales.length;
    const lowStockCount = products.filter(p => p.stock < 5).length;

    document.getElementById('dashTotalSales').textContent = `R$ ${totalToday.toFixed(2)}`;
    document.getElementById('dashTotalTickets').textContent = ticketsToday;
    document.getElementById('dashLowStock').textContent = lowStockCount;

    // Find top product
    const productSales = {};
    salesHistory.forEach(s => {
        if (s.items) s.items.forEach(i => { productSales[i.name] = (productSales[i.name] || 0) + i.qty; });
    });
    const top = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('dashTopProduct').textContent = top ? top[0].substring(0, 15) : '-';
}

function renderSalesHistory() {
    const tbody = document.getElementById('salesHistoryBody');
    tbody.innerHTML = '';

    salesHistory.slice(0, 50).forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${s.date}</td><td>${s.method}</td><td>${s.itemsCount}</td><td style="font-weight:700;color:var(--primary);">R$ ${s.total.toFixed(2)}</td>`;
        tbody.appendChild(tr);
    });
}

async function filterSalesHistory() {
    const filter = document.getElementById('salesFilter').value;
    if (currentUser) { salesHistory = await loadSalesHistory(currentUser.id, filter); }
    renderSalesHistory();
    updateDashboard();
}

function exportSalesCSV() {
    let csv = 'ID,Data,Método,Itens,Total\n';
    salesHistory.forEach(s => { csv += `"${s.id}","${s.date}","${s.method}",${s.itemsCount},${s.total}\n`; });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'vendas.csv'; a.click();
    showToast('Vendas exportadas!', 'success');
}

function generateSalesChart() {
    // Simple bar chart using canvas
    const canvas = document.getElementById('salesChart');
    const ctx = canvas.getContext('2d');

    // Get last 7 days sales
    const days = [];
    const totals = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i);
        const dayStr = d.toLocaleDateString('pt-BR', { weekday: 'short' });
        days.push(dayStr);

        const dayStart = new Date(d); dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(d); dayEnd.setHours(23, 59, 59, 999);
        const dayTotal = salesHistory.filter(s => { const t = new Date(s.timestamp); return t >= dayStart && t <= dayEnd; }).reduce((a, s) => a + s.total, 0);
        totals.push(dayTotal);
    }

    const maxTotal = Math.max(...totals, 1);
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 250;
    const barWidth = (width - 80) / 7;
    const chartHeight = height - 40;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    // Draw bars
    totals.forEach((t, i) => {
        const barHeight = (t / maxTotal) * chartHeight * 0.8;
        const x = 40 + i * barWidth + 10;
        const y = chartHeight - barHeight;

        const gradient = ctx.createLinearGradient(x, y, x, chartHeight);
        gradient.addColorStop(0, '#6c5ce7');
        gradient.addColorStop(1, '#00cec9');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 20, barHeight);

        // Day label
        ctx.fillStyle = '#636e72';
        ctx.font = '12px Nunito';
        ctx.textAlign = 'center';
        ctx.fillText(days[i], x + (barWidth - 20) / 2, height - 10);

        // Value label
        if (t > 0) {
            ctx.fillStyle = '#2d3436';
            ctx.fillText(`R$${t.toFixed(0)}`, x + (barWidth - 20) / 2, y - 5);
        }
    });
}

function checkLowStock() {
    const lowStock = products.filter(p => p.stock < 5);
    if (lowStock.length > 0) { updateNotifications(); }
}

// ============================================
// QUICK PRODUCT MODAL
// ============================================

function openQuickProductModal() { document.getElementById('quickProductModal').style.display = 'flex'; }
function closeQuickProductModal() { document.getElementById('quickProductModal').style.display = 'none'; }

async function addQuickProduct() {
    const name = document.getElementById('quickProdName').value.trim();
    const price = parseFloat(document.getElementById('quickProdPrice').value) || 0;

    if (!name || price <= 0) { showToast('Preencha nome e preço', 'error'); return; }

    const newProduct = { id: Date.now(), name, price, stock: 999, emoji: '⚡', category: 'outro' };
    if (currentUser) { await saveProductToSupabase(newProduct, currentUser.id); }
    products.push(newProduct);

    addToCart(newProduct.id);
    closeQuickProductModal();
    document.getElementById('quickProdName').value = '';
    document.getElementById('quickProdPrice').value = '';
    renderPOS(); renderStock();
    showToast(`${name} adicionado e no carrinho!`, 'success');
}

function quickSale() {
    if (cart.length > 0) openPaymentModal();
    else { document.getElementById('barcodeInput').focus(); showToast('Adicione produtos primeiro', 'info'); }
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            if (e.key === 'F2' && document.getElementById('pdv').classList.contains('active')) { e.preventDefault(); openVoiceSearch(); }
            return;
        }

        switch (e.key) {
            case 'F1': e.preventDefault(); switchTab('pdv'); break;
            case 'F2': e.preventDefault(); switchTab('stock'); break;
            case 'F3': e.preventDefault(); switchTab('dashboard'); break;
            case 'F5': e.preventDefault(); if (cart.length > 0) openPaymentModal(); break;
            case 'F8': e.preventDefault(); clearCart(); break;
            case 'F9': e.preventDefault(); applyDiscount(10); break;
            case 'Escape': e.preventDefault(); closeAllModals(); break;
        }
    });
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
}

// ============================================
// PARTICLES
// ============================================

function createMagicParticles() {
    const container = document.getElementById('particles-container');
    const colors = ['#6c5ce7', '#00cec9', '#fd79a8', '#fdcb6e'];
    for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = 'magic-particle';
        p.style.width = p.style.height = `${Math.random() * 10 + 5}px`;
        p.style.left = `${Math.random() * 100}vw`;
        p.style.top = `${Math.random() * 100}vh`;
        p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        p.style.animation = `float ${Math.random() * 10 + 10}s ease-in-out infinite`;
        p.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(p);
    }
}

// ============================================
// RENDERING
// ============================================

function renderAll() {
    renderPOS();
    renderStock();
    updateCartUI();
    updateNotifications();
    updateDashboard();
    renderSalesHistory();
}

// ============================================
// INITIALIZATION
// ============================================

function initApp() {
    showLoader();
    setTimeout(() => {
        populateEmojiList();
        renderAll();
        setupBarcodeScanner();
        setupKeyboardShortcuts();
        updateSubscriptionStatus();
        generateSalesChart();
        hideLoader();
        showToast(`${APP_NAME} carregado! ✨`, 'success');
    }, 500);

    setInterval(() => {
        const el = document.getElementById('liveProcessingTime');
        if (saleStartTime && cart.length > 0) el.textContent = `${getSaleProcessingTime()}s`;
        else el.textContent = '0s';
    }, 1000);

    setInterval(checkLowStock, 10000);
}

function init() {
    console.log(`${APP_NAME} v${APP_VERSION}`);

    const savedUser = localStorage.getItem('pdv_current_user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            isAuthenticated = true;
            document.getElementById('authContainer').style.display = 'none';
            document.getElementById('appContainer').style.display = 'grid';

            loadUserProducts(currentUser.id).then(p => { products = p; renderPOS(); renderStock(); });
            loadSalesHistory(currentUser.id).then(s => { salesHistory = s; renderSalesHistory(); updateDashboard(); generateSalesChart(); });

            initApp();
            return;
        } catch (e) { localStorage.removeItem('pdv_current_user'); }
    }

    document.getElementById('authContainer').style.display = 'flex';

    document.getElementById('loginForm').addEventListener('submit', e => {
        e.preventDefault();
        loginUser(document.getElementById('loginEmail').value.trim(), document.getElementById('loginPassword').value);
    });

    document.getElementById('registerForm').addEventListener('submit', e => {
        e.preventDefault();
        registerUser({
            companyName: document.getElementById('regCompany').value.trim(),
            document: document.getElementById('regDocument').value.trim(),
            phone: document.getElementById('regPhone').value.trim(),
            email: document.getElementById('regEmail').value.trim(),
            password: document.getElementById('regPassword').value,
            confirmPassword: document.getElementById('regConfirmPassword').value
        });
    });

    createMagicParticles();
}

// Start
document.addEventListener('DOMContentLoaded', init);
