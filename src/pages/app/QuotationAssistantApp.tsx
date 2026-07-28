import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { 
  FileCheck2, 
  Plus, 
  Trash2, 
  Printer, 
  Download, 
  Save, 
  CheckCircle2, 
  Building2, 
  Receipt
} from 'lucide-react';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function QuotationAssistantApp() {
  const { user } = useAuth();

  const [clientName, setClientName] = useState('Rajesh Singhania');
  const [companyName, setCompanyName] = useState('Supreme Builders Ltd');
  const [clientGstin, setClientGstin] = useState('09AAACS1234F1Z1');
  const [clientAddress, setClientAddress] = useState('Plot 12, Tech Zone, Greater Noida, UP');
  const [isInterstate, setIsInterstate] = useState(false);
  const [gstRate, setGstRate] = useState(18);
  const [discountAmount, setDiscountAmount] = useState(2000);

  const [items, setItems] = useState<QuoteItem[]>([
    { id: '1', description: 'WhatsApp Business API Auto-Brochure Bot Setup', quantity: 1, unitPrice: 25000 },
    { id: '2', description: 'Meta Lead Form Instant Sync & Qualifier', quantity: 1, unitPrice: 15000 }
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: 'Custom Service / Product', quantity: 1, unitPrice: 10000 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  
  const cgstAmount = !isInterstate ? (taxableAmount * (gstRate / 2)) / 100 : 0;
  const sgstAmount = !isInterstate ? (taxableAmount * (gstRate / 2)) / 100 : 0;
  const igstAmount = isInterstate ? (taxableAmount * gstRate) / 100 : 0;
  
  const grandTotal = taxableAmount + cgstAmount + sgstAmount + igstAmount;

  const handleSaveQuotation = async () => {
    const quoteData = {
      clientName,
      companyName,
      clientGstin,
      clientAddress,
      items,
      subtotal,
      discountAmount,
      taxableAmount,
      gstRate,
      cgstAmount,
      sgstAmount,
      igstAmount,
      isInterstate,
      grandTotal,
      status: 'approved',
      validUntil: new Date(Date.now() + 86400000 * 15).toISOString().split('T')[0]
    };

    try {
      await fetch('/api/crm/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quoteData)
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.warn("Failed to save quotation", e);
    }
  };

  return (
    <AppLayout 
      title="GST Quotation Assistant" 
      subtitle="Generate professional, GST-compliant quotations with automated taxes and calculations."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Form Editor (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900 font-display">Client & GST Information</h2>
            </div>
            <span className="text-xs font-mono font-bold text-astra-navy bg-slate-100 px-2 py-0.5 rounded">
              RevAstra GST Calc
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Client Contact Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-astra-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-astra-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Client GSTIN (15 Digits)</label>
              <input
                type="text"
                value={clientGstin}
                onChange={(e) => setClientGstin(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-astra-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Billing Address</label>
              <input
                type="text"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-astra-gold"
              />
            </div>
          </div>

          {/* Tax Type Toggle */}
          <div className="flex items-center space-x-4 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <span className="text-xs font-bold text-slate-700">GST Supply Type:</span>
            <label className="inline-flex items-center text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="taxType"
                checked={!isInterstate}
                onChange={() => setIsInterstate(false)}
                className="mr-1.5 text-astra-navy"
              />
              Intrastate (CGST 9% + SGST 9%)
            </label>
            <label className="inline-flex items-center text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="taxType"
                checked={isInterstate}
                onChange={() => setIsInterstate(true)}
                className="mr-1.5 text-astra-navy"
              />
              Interstate (IGST 18%)
            </label>
          </div>

          {/* Items Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Quotation Line Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="text-xs font-bold text-astra-navy hover:text-astra-gold flex items-center"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Line Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 text-xs">
                  <div className="col-span-6">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-center font-mono"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono"
                    />
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right PDF Preview & Totals (1 col) */}
        <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono font-bold uppercase text-astra-gold tracking-widest">
                Quotation Summary
              </span>
              <span className="text-[10px] font-mono text-slate-400">GSTIN: 09AAACR9988Z1Z2</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300 font-mono">
              <div className="flex justify-between">
                <span>Subtotal Items:</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span>Special Discount:</span>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="w-24 bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-right text-xs text-astra-gold font-mono"
                />
              </div>

              <div className="flex justify-between font-bold border-t border-slate-800 pt-1 text-white">
                <span>Taxable Base Value:</span>
                <span>₹{taxableAmount.toLocaleString('en-IN')}</span>
              </div>

              {!isInterstate ? (
                <>
                  <div className="flex justify-between text-slate-400">
                    <span>CGST (9%):</span>
                    <span>₹{cgstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>SGST (9%):</span>
                    <span>₹{sgstAmount.toLocaleString('en-IN')}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-slate-400">
                  <span>IGST (18%):</span>
                  <span>₹{igstAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="border-t border-slate-700 pt-3 flex justify-between items-center text-sm font-bold text-astra-gold font-display">
                <span>Grand Total (Incl. GST):</span>
                <span className="text-xl">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {savedSuccess && (
              <div className="p-2 bg-emerald-500/20 text-emerald-300 text-xs text-center rounded border border-emerald-500/30 font-semibold flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Quotation saved successfully!
              </div>
            )}

            <button
              onClick={handleSaveQuotation}
              className="w-full bg-astra-gold text-astra-navy hover:bg-amber-400 font-bold py-2.5 rounded-lg text-xs transition flex items-center justify-center space-x-1 shadow-sm"
            >
              <Save className="w-3.5 h-3.5 mr-1" />
              <span>Save & Record Quotation</span>
            </button>

            <button
              onClick={() => window.print()}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 rounded-lg text-xs transition flex items-center justify-center space-x-1"
            >
              <Printer className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>Print / Download GST PDF</span>
            </button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
