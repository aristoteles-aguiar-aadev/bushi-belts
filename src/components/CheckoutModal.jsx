import { useState } from 'react';
import { ArrowUpRight, LockKeyhole, X } from 'lucide-react';
import { createCheckout } from '../api/checkout';
import { useDialog } from '../hooks/useDialog';
export default function CheckoutModal({ open, onClose, items, total }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const ref = useDialog(open, onClose);
  if (!open) return null;
  async function checkout() {
    setLoading(true); setError('');
    try { window.location.assign(await createCheckout(items)); }
    catch { setError('Não foi possível abrir o pagamento. Tente novamente em instantes.'); setLoading(false); }
  }
  return <div className="dialog-backdrop" onClick={event => { if(event.target === event.currentTarget) onClose(); }}><div className="checkout-panel" ref={ref} role="dialog" aria-modal="true" aria-labelledby="checkout-title" tabIndex={-1}>
    <button className="checkout-close" aria-label="Fechar checkout" onClick={onClose}><X size={20}/></button>
    <span className="eyebrow"><LockKeyhole size={14}/> PRÓXIMO PASSO</span><h2 id="checkout-title">Sua Bushi está quase lá.</h2>
    <p>Continue no ambiente do Mercado Pago para informar seus dados e escolher entre os meios de pagamento disponíveis.</p>
    <div className="checkout-total"><span>{items.reduce((sum,item)=>sum+item.qty,0)} peça(s)</span><strong>{new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(total)}</strong></div>
    {error && <p className="checkout-error" role="alert">{error}</p>}
    <button className="primary-link" disabled={loading || !items.length} onClick={checkout}>{loading ? 'Abrindo pagamento…' : 'Continuar no Mercado Pago'}<ArrowUpRight size={18}/></button>
    <p className="checkout-note">A sacola permanece salva. A criação do pagamento não confirma a compra. Frete e prazo precisam ser combinados com a loja antes do pagamento.</p>
  </div></div>;
}
