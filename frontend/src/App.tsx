import React, { useState } from 'react';
import './App.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function App() {
  const [longUrl, setLongUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!longUrl.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/api/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl, slug: slug || undefined }),
      });
      const data = await res.json();
      if (res.ok) {
        setShortUrl(data.shortUrl);
      } else {
        alert(data.error || 'Erro');
      }
    } catch (error) {
      alert('Erro de conexão');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStats() {
    const s = slug || shortUrl.split('/').pop();
    try {
      const res = await fetch(`${API}/api/stats/${s}`);
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      } else {
        alert(data.error || 'Erro ao buscar estatísticas');
      }
    } catch (error) {
      alert('Erro de conexão ao buscar estatísticas');
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(shortUrl);
    alert('Link copiado!');
  }

  return (
    <div className="app">
      <header className="header">
        <div className="brand-logo">Encurtador</div>
        <div className="header-tagline">Desenvolvido para o desafio da ComHub</div>
      </header>

      <main className="main">
        <h1 className="main-title">Encurte aqui sua URL</h1>
        
        
        <div className="card">
          <form onSubmit={handleCreate} className="url-form">
            <div className="input-group">
              <input
                type="url"
                value={longUrl}
                onChange={e => setLongUrl(e.target.value)}
                placeholder="Cole sua URL aqui..."
                className="url-input"
                required
              />
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="Slug personalizado (opcional)"
                className="slug-input"
              />
            </div>
            <button 
              type="submit" 
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Processando...' : 'Encurtar'}
            </button>
          </form>
        </div>

        {/* Result Card */}
        {shortUrl && (
          <div className="result-container">
            <div className="card result-card">
              <h3>URL encurtada com sucesso!</h3>
              <div className="short-url-container">
                <input 
                  type="text" 
                  value={shortUrl} 
                  readOnly 
                  className="short-url-input"
                />
                <button onClick={copyToClipboard} className="copy-btn">
                  Copiar
                </button>
              </div>
              <div className="result-actions">
                <a 
                  href={shortUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="test-btn"
                  onClick={() => {
                    setTimeout(() => handleStats(), 1000); // dá tempo do backend registrar o clique
                  }}
                >
                  Testar Link
                </a>
                <button onClick={handleStats} className="stats-btn">
                  Ver Estatísticas
                </button>
                <button onClick={handleStats} className="stats-btn">
                  Atualizar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Card */}
        {stats && (
          <div className="stats-container">
            <div className="card stats-card">
              <h3>Análise de Cliques</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <span className="stat-number">{stats.clicks}</span>
                    <span className="stat-label">Cliques totais</span>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">🔗</div>
                  <div className="stat-info">
                    <span className="stat-slug">{stats.slug}</span>
                    <span className="stat-label">Slug</span>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">📅</div>
                  <div className="stat-info">
                    <span className="stat-date">
                      {new Date(stats.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="stat-label">Criado em</span>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <a 
                  href={shortUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="test-btn"
                  style={{ textDecoration: 'none' }}
                  onClick={() => {
                    setTimeout(() => handleStats(), 1000);
                  }}
                >
                  Ir para o site
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; Copyright ComHub Conectando Soluções - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}