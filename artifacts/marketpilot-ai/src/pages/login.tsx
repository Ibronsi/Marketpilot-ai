import { useEffect, useState, type FormEvent } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/auth/auth-context';
import { Brand } from '@/components/brand';
import { supabaseConfigurationMessage } from '@/lib/supabase/client';

export default function LoginPage() {
  const { status, signIn, signUp, initializationError } = useAuth();
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') setLocation('/');
  }, [status, setLocation]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setFormMessage(null);

    try {
      if (mode === 'signup') {
        const newSession = await signUp(email.trim(), password);
        if (newSession) {
          setLocation('/');
        } else {
          setFormMessage(
            'Inscription enregistrée. Vérifiez votre boîte mail pour confirmer votre adresse.',
          );
        }
      } else {
        await signIn(email.trim(), password);
        setLocation('/');
      }
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'La demande a échoué. Réessayez.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const isConfigured = status !== 'unconfigured';
  const isReady = status === 'unauthenticated';

  return (
    <div className="login-page">
      <aside className="login-aside">
        <Link href="/" className="login-brand">
          <Brand />
        </Link>
        <div className="login-manifesto">
          <div className="eyebrow">Un espace pour entreprendre</div>
          <h1>
            Vos idées.
            <br />
            Votre prochain pas.
          </h1>
          <p>
            MarketPilot réunit marketing, prospection et vente dans un espace
            clair, conçu pour les petites équipes.
          </p>
        </div>
        <div className="login-foot">
          Un outil en construction, avec vous aux commandes.
        </div>
      </aside>
      <main className="login-content">
        <section className="login-card">
          <span className="eyebrow">Accès à votre espace</span>
          <h2>{mode === 'signin' ? 'Connexion' : 'Créer un compte'}</h2>
          <p>
            {mode === 'signin'
              ? 'Connectez-vous à votre espace MarketPilot.'
              : 'Créez un compte pour accéder à votre espace sécurisé.'}
          </p>

          {!isConfigured ? (
            <div
              className="auth-notice"
              role="status"
              data-testid="status-auth-unavailable"
            >
              <ShieldAlert size={17} />
              <div>
                <strong>Projet Supabase non configuré</strong>
                <span>{supabaseConfigurationMessage}</span>
                <span>
                  Aucun compte ne peut être créé et aucune session n’est simulée.
                  Ne saisissez pas de mot de passe avant la configuration.
                </span>
              </div>
            </div>
          ) : status === 'loading' ? (
            <div className="auth-notice" role="status">
              <ShieldAlert size={17} />
              <div>
                <strong>Vérification de la session</strong>
                <span>Patientez pendant la restauration de votre session.</span>
              </div>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <label className="auth-field" htmlFor="auth-email">
                Adresse e-mail
                <input
                  id="auth-email"
                  className="auth-input"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
              <label className="auth-field" htmlFor="auth-password">
                Mot de passe
                <input
                  id="auth-password"
                  className="auth-input"
                  type="password"
                  autoComplete={
                    mode === 'signup' ? 'new-password' : 'current-password'
                  }
                  minLength={mode === 'signup' ? 8 : undefined}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>

              {initializationError && (
                <div className="auth-error" role="alert">
                  La session n’a pas pu être vérifiée : {initializationError}
                </div>
              )}
              {formError && (
                <div className="auth-error" role="alert">
                  {formError}
                </div>
              )}
              {formMessage && (
                <div className="auth-success" role="status">
                  {formMessage}
                </div>
              )}

              <button
                type="submit"
                className="auth-submit"
                disabled={!isReady || isSubmitting}
                data-testid="button-auth-submit"
              >
                {isSubmitting
                  ? 'Veuillez patienter…'
                  : mode === 'signin'
                    ? 'Se connecter'
                    : 'Créer mon compte'}
              </button>
              <button
                type="button"
                className="auth-mode-switch"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setFormError(null);
                  setFormMessage(null);
                }}
              >
                {mode === 'signin'
                  ? 'Pas encore de compte ? Créer un compte'
                  : 'Déjà inscrit ? Se connecter'}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
