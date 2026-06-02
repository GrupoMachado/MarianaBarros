const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
const search = '                            setLoading(false);\n                        });\n                }\n            }, [session]);';
const replacement = `                            setLoading(false);
                        });

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    window.supabase.from('registos_hidratacao')
                        .select('quantidade_ml')
                        .eq('user_id', session.user.id)
                        .gte('data', today.toISOString())
                        .then(({ data }) => {
                            if (data) {
                                const sum = data.reduce((acc, curr) => acc + curr.quantidade_ml, 0);
                                setHydrationToday(sum);
                            }
                        });
                }
            }, [session]);

            const addHydration = async (amount) => {
                if (amount <= 0) return;
                setHydrationToday(prev => prev + amount);
                await window.supabase.from('registos_hidratacao').insert({
                    user_id: session.user.id,
                    quantidade_ml: amount
                });
            };`;
c = c.replace(search, replacement);
fs.writeFileSync('index.html', c);
