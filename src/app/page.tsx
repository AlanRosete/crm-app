'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import eyeViewPassword from '../../images/ojo.png';
import eyeClosePassword from '../../images/invisible.png';
import Image from 'next/image';

export default function LoginGlass() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        Swal.fire({ icon: 'success', title: '¡Login exitoso!', timer: 1400, showConfirmButton: false });
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'Credenciales inválidas' });
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error en login' });
    } finally {
      setLoading(false);
    }
  };

  function logoutClient() {
    localStorage.removeItem('token');
    setToken(null);
    Swal.fire({
      title: 'Logout exitoso',
      text: 'Hasta pronto 👋',
      icon: 'success',
      timer: 1200,
      showConfirmButton: false,
    });
  }

  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6">
        <div className="w-full max-w-3xl">
          <div className="flex justify-end mb-6">
            <button
              onClick={logoutClient}
              className="rounded-full px-4 py-2 text-sm font-medium bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition"
            >
              Logout
            </button>
          </div>

          <section className="glass-card p-6 rounded-2xl shadow-xl">
            <h1 className="text-3xl font-semibold mb-2">Bienvenido</h1>
            <p className="text-sm text-white/80 mb-4">Estás autenticado. Aquí iría la lista de clientes o el dashboard.</p>
          </section>
        </div>

        <style jsx>{`
          .glass-card {
            background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
            border: 1px solid rgba(255,255,255,0.06);
            box-shadow: 0 8px 30px rgba(2,6,23,0.6);
            backdrop-filter: blur(10px) saturate(140%);
            -webkit-backdrop-filter: blur(10px) saturate(140%);
            color: #fff;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 select-none">
      <main className="w-full max-w-md">
        <div className="relative">
          <div className="absolute -inset-4 blur-3xl opacity-40 rounded-3xl" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.18), rgba(16,185,129,0.12))' }} />

          <form onSubmit={handleLogin} className="glass-card relative p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6 text-white">Iniciar sesión</h2>

            <label className="block mb-4">
              <span className="text-sm text-white/80">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full px-4 py-3 rounded-lg bg-white/6 border border-white/8 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="ejemplo@correo.com"
              />
            </label>

            <label className="block mb-6">
              <span className="text-sm text-white/80">Contraseña</span>

              <div className='flex items-center gap-2'>
                <input
                type={showPassword ? 'text' : 'password'} 
                id='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 w-full px-4 py-3 rounded-lg bg-white/6 border border-white/8 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="••••••••"
                />
                <div className='bg-white/5 p-3 mt-2 rounded-lg cursor-pointer hover:bg-white/10 transition' onClick={() => setShowPassword(!showPassword)}>
                  <Image
                  src={
                    showPassword
                      ? eyeClosePassword
                      : eyeViewPassword
                  }
                  alt="Description of my image"
                  width={30}
                  height={30}
                  />
                </div>
              </div>
            </label>

            <div className="flex items-center justify-between gap-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-500 to-emerald-400 hover:from-indigo-600 hover:to-emerald-500 shadow-md transition"
                disabled={loading}
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                ) : (
                  'Entrar'
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push('/registerUX')}
                className="px-4 py-3 rounded-lg border border-white/10 bg-white/3 text-white/90 hover:bg-white/8 transition"
                disabled={loading}
              >
                Crear cuenta
              </button>
            </div>

            <p className="mt-4 text-xs text-white/60">¿Olvidaste tu contraseña? <button type="button" className="underline">Recuperarla</button></p>

            <style jsx>{`
              .glass-card {
                position: relative;
                overflow: hidden;
                background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
                border: 1px solid rgba(255,255,255,0.06);
                box-shadow: 0 10px 30px rgba(2,6,23,0.6);
                backdrop-filter: blur(12px) saturate(140%);
                -webkit-backdrop-filter: blur(12px) saturate(140%);
                color: #fff;
              }

              /* subtle top highlight */
              .glass-card::before {
                content: '';
                position: absolute;
                inset: 0;
                pointer-events: none;
                background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0));
              }
            `}</style>
          </form>
        </div>
      </main>
    </div>
  );
}
