const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// Inject recoveryMode to useUserData return
const returnRegex = /return React\.useMemo\(\(\) => \(\{\s*session, authLoading, logout,/;
code = code.replace(returnRegex, 'return React.useMemo(() => ({\n                recoveryMode, setRecoveryMode,\n                session, authLoading, logout,');

// Replace the <App> component rendering to include the modal
const renderAppRegex = /return \(\s*<div className="app-container">/;
const recoveryModalHtml = `return (
                <div className="app-container">
                    {ud.recoveryMode && (
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
                                    else { alert('Senha atualizada com sucesso!'); ud.setRecoveryMode(false); }
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
code = code.replace(renderAppRegex, recoveryModalHtml);

fs.writeFileSync('index.html', code);
console.log('Done patching App');
