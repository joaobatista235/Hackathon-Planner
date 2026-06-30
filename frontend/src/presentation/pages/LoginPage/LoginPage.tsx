import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/application/context/AuthContext';
import { Button } from '@/presentation/components/base/Button/Button';
import { Input } from '@/presentation/components/base/Input/Input';
import './LoginPage.css';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha email e senha.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__bg" aria-hidden="true">
        <div className="login-page__orb login-page__orb--1" />
        <div className="login-page__orb login-page__orb--2" />
      </div>

      <div className="login-card">
        <div className="login-card__brand">
          <span className="login-card__brand-icon">🎓</span>
          <h1 className="login-card__brand-name">Planner</h1>
          <p className="login-card__brand-sub">Organização Escolar para Professores</p>
        </div>

        <form className="login-card__form" onSubmit={handleSubmit} noValidate>
          <Input
            id="login-email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            id="login-password"
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && (
            <p className="login-card__error" role="alert">{error}</p>
          )}

          <Button
            id="login-submit"
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            style={{ width: '100%' }}
          >
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
