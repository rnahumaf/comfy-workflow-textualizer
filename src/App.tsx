import React, { useState, useEffect, useRef } from 'react';
import { parseWorkflow, type ParserOptions } from './utils/workflowParser';
import { SAMPLE_WORKFLOW } from './utils/sampleWorkflow';
import { 
  FileJson, 
  Copy, 
  Check, 
  Trash2, 
  Upload, 
  Sliders, 
  Moon, 
  Sun, 
  GitBranch, 
  Share2, 
  Sparkles,
  Info
} from 'lucide-react';
import './App.css';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [rawJson, setRawJson] = useState('');
  const [options, setOptions] = useState<ParserOptions>({
    includeNodeIds: true,
    preferTitles: true,
    fullChains: true,
    ignoreUnconnected: true,
  });

  const [output, setOutput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [outputTab, setOutputTab] = useState<'formatted' | 'raw'>('formatted');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toggle Tema
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Processamento do Workflow
  useEffect(() => {
    if (!rawJson.trim()) {
      setOutput('');
      setErrorMsg('');
      return;
    }

    try {
      const parsed = JSON.parse(rawJson);
      if (!parsed.nodes) {
        throw new Error("O JSON do workflow deve conter um array de 'nodes'.");
      }
      const textOutput = parseWorkflow(parsed, options);
      setOutput(textOutput);
      setErrorMsg('');
    } catch (e: any) {
      setErrorMsg(e.message || 'Erro ao processar JSON. Verifique a formatação.');
      setOutput('');
    }
  }, [rawJson, options]);

  const loadSample = () => {
    setRawJson(JSON.stringify(SAMPLE_WORKFLOW, null, 2));
  };

  const clearAll = () => {
    setRawJson('');
    setOutput('');
    setErrorMsg('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      readFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      readFile(e.target.files[0]);
    }
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        setRawJson(text);
      }
    };
    reader.readAsText(file);
  };

  const handleOptionChange = (key: keyof ParserOptions) => {
    setOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Helper para formatar a renderização visual das linhas com cores
  const renderFormattedChains = () => {
    if (!output) return null;
    
    return output.split('\n').map((line, idx) => {
      // Procurar por padrões e envolver em spans com classes específicas
      // e.g. "Load Image (IMAGE) -> (pixels) VAE Encode"
      const parts: React.ReactNode[] = [];
      
      // Regex para encontrar " -> " e " (conector) "
      // Vamos parsear a linha dividindo pelos conectores e setas
      const regex = /(\s*->\s*)|(\([^)]+\))/g;
      let lastIndex = 0;
      let match;
      let partKey = 0;

      while ((match = regex.exec(line)) !== null) {
        const textBefore = line.substring(lastIndex, match.index);
        if (textBefore) {
          parts.push(<span key={partKey++} className="node-name">{textBefore}</span>);
        }

        const matchText = match[0];
        if (matchText.includes('->')) {
          parts.push(<span key={partKey++} className="arrow"> {matchText} </span>);
        } else {
          parts.push(<span key={partKey++} className="connector">{matchText}</span>);
        }
        
        lastIndex = regex.lastIndex;
      }

      const remainingText = line.substring(lastIndex);
      if (remainingText) {
        parts.push(<span key={partKey++} className="node-name">{remainingText}</span>);
      }

      return (
        <span key={idx} className="chain-line">
          {parts}
        </span>
      );
    });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-logo">
          <GitBranch size={24} />
          <span>ComfyUI Workflow Textualizer</span>
        </div>
        <div className="header-actions">
          <button 
            className="btn-icon" 
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            title={theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
            aria-label="Alternar tema"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </header>

      <main className="app-main">
        <section className="intro-section">
          <h1>Converta Workflow em Texto Simples</h1>
          <p>
            Cole o JSON bruto exportado pelo ComfyUI (da opção de salvar workflow) ou arraste o arquivo. O sistema gera instantaneamente as conexões encadeadas em formato legível e pronto para copiar.
          </p>
        </section>

        <div className="workspace-grid">
          {/* PAINEL DE ENTRADA */}
          <div className="pane">
            <div className="pane-header">
              <div className="pane-title">
                <FileJson size={18} />
                <span>Workflow (JSON)</span>
              </div>
              <div className="pane-controls">
                <button className="btn-secondary" onClick={loadSample} title="Carrega o exemplo de workflow ComfyUI do prompt">
                  <Sparkles size={14} />
                  <span>Carregar Amostra</span>
                </button>
                {rawJson && (
                  <button className="btn-secondary" onClick={clearAll} title="Limpa o conteúdo">
                    <Trash2 size={14} />
                    <span>Limpar</span>
                  </button>
                )}
              </div>
            </div>

            <div className="options-bar">
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sliders size={12} /> OPÇÕES:
              </span>
              <label className="option-checkbox">
                <input 
                  type="checkbox" 
                  checked={options.preferTitles} 
                  onChange={() => handleOptionChange('preferTitles')} 
                />
                Preferir Títulos
              </label>
              <label className="option-checkbox">
                <input 
                  type="checkbox" 
                  checked={options.includeNodeIds} 
                  onChange={() => handleOptionChange('includeNodeIds')} 
                />
                Incluir IDs dos Nós
              </label>
              <label className="option-checkbox" title="Cria conexões completas desde as fontes originais">
                <input 
                  type="checkbox" 
                  checked={options.fullChains} 
                  onChange={() => handleOptionChange('fullChains')} 
                />
                Cadeias Completas
              </label>
              <label className="option-checkbox" title="Ocultar nós que não possuem conexões de entrada ou saída">
                <input 
                  type="checkbox" 
                  checked={options.ignoreUnconnected} 
                  onChange={() => handleOptionChange('ignoreUnconnected')} 
                />
                Ocultar Nós Soltos
              </label>
            </div>

            <div className="pane-body">
              <div 
                className={`input-wrapper ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <textarea
                  className="textarea-workflow"
                  placeholder="Cole o JSON do seu workflow ComfyUI aqui ou arraste e solte o arquivo .json..."
                  value={rawJson}
                  onChange={(e) => setRawJson(e.target.value)}
                />
                <div className="dropzone-overlay">
                  <Upload size={32} />
                  <span>Solte o arquivo de workflow aqui</span>
                </div>
              </div>

              <div className="pane-controls">
                <label className="file-upload-label">
                  <Upload size={16} />
                  <span>Carregar Arquivo JSON</span>
                  <input 
                    type="file" 
                    accept=".json" 
                    onChange={handleFileChange} 
                    ref={fileInputRef}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* PAINEL DE SAÍDA */}
          <div className="pane">
            <div className="pane-header">
              <div className="pane-title">
                <Share2 size={18} />
                <span>Resultado Processado</span>
              </div>
              
              <div className="pane-controls" style={{ gap: '0.5rem' }}>
                <div className="btn-secondary" style={{ padding: '2px', gap: 0, borderRadius: '6px' }}>
                  <button 
                    className="btn-secondary" 
                    style={{ 
                      border: 0, 
                      padding: '0.25rem 0.75rem', 
                      backgroundColor: outputTab === 'formatted' ? 'var(--bg-card)' : 'transparent',
                      color: outputTab === 'formatted' ? 'var(--accent-color)' : 'var(--text-muted)'
                    }}
                    onClick={() => setOutputTab('formatted')}
                  >
                    Formatado
                  </button>
                  <button 
                    className="btn-secondary" 
                    style={{ 
                      border: 0, 
                      padding: '0.25rem 0.75rem', 
                      backgroundColor: outputTab === 'raw' ? 'var(--bg-card)' : 'transparent',
                      color: outputTab === 'raw' ? 'var(--accent-color)' : 'var(--text-muted)'
                    }}
                    onClick={() => setOutputTab('raw')}
                  >
                    Texto Puro
                  </button>
                </div>

                {output && (
                  <button 
                    className={`btn-primary ${copySuccess ? 'copy-success' : ''}`} 
                    onClick={copyToClipboard}
                  >
                    {copySuccess ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copySuccess ? 'Copiado!' : 'Copiar Tudo'}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="pane-body">
              {errorMsg && (
                <div className="alert-box" style={{ borderLeftColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                  <Info size={18} style={{ color: '#ef4444' }} />
                  <div style={{ color: '#ef4444', fontWeight: 600 }}>{errorMsg}</div>
                </div>
              )}

              {!errorMsg && !output && (
                <div className="output-box empty">
                  Cole um workflow JSON ou carregue um arquivo para visualizar o resultado textual instantaneamente.
                </div>
              )}

              {!errorMsg && output && (
                <div className="output-container">
                  {outputTab === 'formatted' ? (
                    <div className="output-box">
                      {renderFormattedChains()}
                    </div>
                  ) : (
                    <textarea 
                      className="output-box" 
                      readOnly 
                      value={output}
                      onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                    />
                  )}
                </div>
              )}

              {output && (
                <div className="alert-box">
                  <Info size={16} />
                  <div>
                    Mapeamento instantâneo concluído com sucesso. Você pode copiar o resultado como texto simples usando o botão <strong>Copiar Tudo</strong>.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          ComfyUI Workflow Textualizer • Desenvolvido com React, TypeScript & Vite
        </p>
        <p style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
          Para diretrizes gerais de repositórios, consulte o arquivo local <a href="GUIDELINES.html" target="_blank" rel="noopener noreferrer">GUIDELINES.html</a>.
        </p>
      </footer>
    </div>
  );
}
