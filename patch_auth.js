const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Modifying AuthModal definition
const authModalRegex = /function AuthModal\(\{ onAuth \}\) \{([\s\S]*?)(?=function useUserData\(\))/;
let authModalCode = code.match(authModalRegex)[0];

// Replace isLogin with authMode
authModalCode = authModalCode.replace('const [isLogin, setIsLogin] = useState(true);', 'const [authMode, setAuthMode] = useState("login"); // login | register | recovery');

// In handleSubmit
authModalCode = authModalCode.replace('if (!isLogin) {', 'if (authMode === "register") {');
authModalCode = authModalCode.replace('if (isLogin) {', `if (authMode === "recovery") {
                    res = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
                    if (!res.error) {
                        setError('✅ Verifique sua caixa de entrada!');
                        setLoading(false);
                        return;
                    }
                } else if (authMode === "login") {`);
authModalCode = authModalCode.replace('} else if (!isLogin && !res.data.session) {', '} else if (authMode === "register" && !res.data.session) {');
authModalCode = authModalCode.replace("<h2>{isLogin ? 'Iniciar Sessão' : 'Criar Conta'}</h2>", "<h2>{authMode === 'login' ? 'Iniciar Sessão' : authMode === 'register' ? 'Criar Conta' : 'Recuperar Acesso'}</h2>");
authModalCode = authModalCode.replace('Acesse seus desafios, guarde favoritos e acompanhe o seu progresso diariamente.', '{authMode === "recovery" ? "Insira seu email para receber o link de redefinição." : "Acesse seus desafios, guarde favoritos e acompanhe o seu progresso diariamente."}');

authModalCode = authModalCode.replace('</form>', `</form>
                        {authMode === 'login' && (
                            <div style={{ textAlign: 'right', marginTop: '12px' }}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setAuthMode('recovery'); setError(''); }} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', textDecoration: 'underline' }}>Esqueci minha senha</a>
                            </div>
                        )}`);

authModalCode = authModalCode.replace('<div className="auth-toggle" onClick={() => { setIsLogin(!isLogin); setError(""); }}>', '<div className="auth-toggle" onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setError(""); }}>');
authModalCode = authModalCode.replace('{loading ? "Carregando..." : (isLogin ? "Entrar no Portal" : "Concluir Cadastro")}', '{loading ? "Carregando..." : (authMode === "login" ? "Entrar no Portal" : authMode === "register" ? "Concluir Cadastro" : "Enviar Link de Recuperação")}');
authModalCode = authModalCode.replace('{isLogin ? <React.Fragment>Novo por aqui? <span>Criar Conta</span></React.Fragment> : <React.Fragment>Já tem uma conta? <span>Iniciar Sessão</span></React.Fragment>}', '{authMode === "login" ? <React.Fragment>Novo por aqui? <span>Criar Conta</span></React.Fragment> : <React.Fragment>Já tem uma conta? <span>Iniciar Sessão</span></React.Fragment>}');

authModalCode = authModalCode.replace(/<div className="input-group">\s*<label>Senha<\/label>/g, `{authMode !== 'recovery' && (
                            <div className="input-group">
                                <label>Senha</label>`);
authModalCode = authModalCode.replace(/placeholder="••••••" \/>\s*<\/div>/g, `placeholder="••••••" />
                            </div>
                        )}`);

code = code.replace(authModalRegex, authModalCode);

// Inject recoveryMode to App state
const appStateRegex = /function App\(\) \{\s*const \[session, setSession\] = useState\(null\);\s*const \[authLoading, setAuthLoading\] = useState\(true\);/;
code = code.replace(appStateRegex, `function App() {
            const [session, setSession] = useState(null);
            const [authLoading, setAuthLoading] = useState(true);
            const [recoveryMode, setRecoveryMode] = useState(false);`);

// Handle PASSWORD_RECOVERY event
const eventRegex = /const \{ data: \{ subscription \} \} = supabase\.auth\.onAuthStateChange\(\(event, session\) => \{\s*if \(event === 'INITIAL_SESSION'\) return;/;
code = code.replace(eventRegex, `const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                    if (event === 'INITIAL_SESSION') return;
                    if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true);`);

// Inject Recovery Modal UI into App return
const appReturnRegex = /return \(!session\) \? <AuthModal \/> : \(\s*<div className="app-container">/;
const recoveryModalHtml = `return (!session) ? <AuthModal /> : (
                <div className="app-container">
                    {recoveryMode && (
                        <div className="fixed inset-0 z-[15000] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
                            <div className="auth-card" style={{ maxWidth: '400px', width: '100%', position: 'relative' }}>
                                <h2>Definir Nova Senha</h2>
                                <div className="auth-header-desc">
                                    Insira a sua nova senha abaixo.
                                </div>
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const pwd = e.target.newPwd.value;
                                    if(pwd.length < 6) return alert('A senha deve ter pelo menos 6 caracteres.');
                                    const { error } = await supabase.auth.updateUser({ password: pwd });
                                    if(error) alert('Erro: ' + error.message);
                                    else { alert('Senha atualizada com sucesso!'); setRecoveryMode(false); }
                                }}>
                                    <div className="input-group">
                                        <label>Nova Senha</label>
                                        <input type="password" name="newPwd" className="ob-input" placeholder="••••••" required />
                                    </div>
                                    <button type="submit" className="ob-submit-btn mt-4">Salvar Nova Senha</button>
                                </form>
                            </div>
                        </div>
                    )}`;
code = code.replace(appReturnRegex, recoveryModalHtml);

fs.writeFileSync('index.html', code);
console.log('Done patching Auth');
