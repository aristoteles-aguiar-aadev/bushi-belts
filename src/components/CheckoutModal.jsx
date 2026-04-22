import { useMemo, useState } from "react";
import { CreditCard, DollarSign, X } from "lucide-react";
import { createPixCheckout, createCardCheckout } from "../api/checkout";

const CARD_BRANDS = {
  visa: {
    label: "",
    logo: "/brands/visa.svg",
  },
  mastercard: {
    label: "",
    logo: "/brands/mastercard.svg",
  },
  elo: {
    label: "",
    logo: "/brands/elo.svg",
  },
  amex: {
    label: "",
    logo: "/brands/amex.svg",
  },
  hipercard: {
    label: "",
    logo: "/brands/hipercard.svg",
  },
  diners: {
    label: "",
    logo: "/brands/diners.svg",
  },
  discover: {
    label: "",
    logo: "/brands/discover.svg",
  },
  jcb: {
    label: "",
    logo: "/brands/jcb.svg",
  },
  aura: {
    label: "",
    logo: "/brands/generic.svg",
  },
};

function currency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function formatPhone(value) {
  const numbers = onlyDigits(value).slice(0, 11);

  if (numbers.length <= 2) return numbers ? `(${numbers}` : "";
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)})${numbers.slice(2)}`;

  return `(${numbers.slice(0, 2)})${numbers.slice(2, 7)}-${numbers.slice(7)}`;
}

function formatCPF(value) {
  const numbers = onlyDigits(value).slice(0, 11);

  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  }

  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(
    6,
    9,
  )}-${numbers.slice(9)}`;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function validateCPF(cpf) {
  const cleanCPF = onlyDigits(cpf);

  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i += 1) {
    sum += Number(cleanCPF[i]) * (10 - i);
  }

  let firstDigit = (sum * 10) % 11;
  if (firstDigit === 10) firstDigit = 0;
  if (firstDigit !== Number(cleanCPF[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i += 1) {
    sum += Number(cleanCPF[i]) * (11 - i);
  }

  let secondDigit = (sum * 10) % 11;
  if (secondDigit === 10) secondDigit = 0;

  return secondDigit === Number(cleanCPF[10]);
}

function detectCardBrand(value) {
  const number = onlyDigits(value);

  if (/^4/.test(number)) return "visa";

  if (
    /^(5[1-5])/.test(number) ||
    /^(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(number)
  ) {
    return "mastercard";
  }

  if (/^3[47]/.test(number)) return "amex";

  if (
    /^(401178|401179|431274|438935|451416|457393|457631|457632|504175|627780|636297|636368)/.test(
      number,
    )
  ) {
    return "elo";
  }

  if (
    /^(506699|5067|4576|4011|509\d|627780|636297|636368|650\d|6516|6550)/.test(
      number,
    )
  ) {
    return "elo";
  }

  if (/^(606282|637095|637568|637599|637609|637612)/.test(number)) {
    return "hipercard";
  }

  if (/^3(?:0[0-5]|[68])/.test(number)) return "diners";
  if (/^(6011|65|64[4-9])/.test(number)) return "discover";
  if (/^35/.test(number)) return "jcb";
  if (/^50/.test(number)) return "aura";

  return "";
}

function formatCardNumber(value, brand = "") {
  const digits = onlyDigits(value).slice(0, brand === "amex" ? 15 : 19);

  if (brand === "amex") {
    const p1 = digits.slice(0, 4);
    const p2 = digits.slice(4, 10);
    const p3 = digits.slice(10, 15);
    return [p1, p2, p3].filter(Boolean).join(" ");
  }

  return digits.match(/.{1,4}/g)?.join(" ") || "";
}

function formatExpiry(value) {
  const digits = onlyDigits(value).slice(0, 4);

  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function validateExpiry(value) {
  const clean = onlyDigits(value);
  if (clean.length !== 4) return false;

  const month = Number(clean.slice(0, 2));
  const year = Number(`20${clean.slice(2)}`);

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
}

function luhnCheck(value) {
  const digits = onlyDigits(value);
  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function validateCardNumber(value, brand) {
  const digits = onlyDigits(value);

  if (!brand) return false;
  if (brand === "amex" && digits.length !== 15) return false;
  if (brand !== "amex" && (digits.length < 13 || digits.length > 19)) {
    return false;
  }

  return luhnCheck(digits);
}

function formatCVV(value, brand = "") {
  const max = brand === "amex" ? 4 : 3;
  return onlyDigits(value).slice(0, max);
}

function validateCVV(value, brand = "") {
  const digits = onlyDigits(value);

  if (brand === "amex") return digits.length === 4;
  return digits.length === 3;
}

function getInstallmentOptions(total) {
  return Array.from({ length: 10 }, (_, index) => {
    const installment = index + 1;
    const amount = total / installment;

    return {
      value: String(installment),
      label: `${installment}x de ${currency(amount)}`,
    };
  });
}

function brandLabel(brand) {
  const labels = {
    visa: "Visa",
    mastercard: "Mastercard",
    amex: "American Express",
    elo: "Elo",
    hipercard: "Hipercard",
    diners: "Diners Club",
    discover: "Discover",
    jcb: "JCB",
    aura: "Aura",
  };

  return labels[brand] || "Não identificada";
}

export default function CheckoutModal({
  open,
  onClose,
  items,
  total,
  onSuccess,
}) {
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [customer, setCustomer] = useState({
    name: "",
    cel: "",
    email: "",
    cpf: "",
  });

  const [card, setCard] = useState({
    number: "",
    holderName: "",
    expiry: "",
    cvv: "",
    installments: "1",
  });

  const [errors, setErrors] = useState({
    name: "",
    cel: "",
    email: "",
    cpf: "",
    cardNumber: "",
    holderName: "",
    expiry: "",
    cvv: "",
    installments: "",
  });

  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  const cardBrand = useMemo(() => detectCardBrand(card.number), [card.number]);
  const currentBrand = useMemo(
    () => (cardBrand ? CARD_BRANDS[cardBrand] || null : null),
    [cardBrand],
  );
  const installmentOptions = useMemo(
    () => getInstallmentOptions(total),
    [total],
  );

  if (!open) return null;

  function validateCustomerForm() {
    return {
      name: customer.name.trim() === "" ? "Informe o nome completo." : "",
      email:
        customer.email.trim() === ""
          ? "Informe o e-mail."
          : !validateEmail(customer.email)
            ? "E-mail inválido."
            : "",
      cpf:
        customer.cpf.trim() === ""
          ? "Informe o CPF."
          : !validateCPF(customer.cpf)
            ? "CPF inválido."
            : "",
      cel: onlyDigits(customer.cel).length !== 11 ? "Celular inválido." : "",
    };
  }

  function validateCardForm() {
    if (paymentMethod === "pix") {
      return {
        cardNumber: "",
        holderName: "",
        expiry: "",
        cvv: "",
        installments: "",
      };
    }

    return {
      cardNumber:
        card.number.trim() === ""
          ? "Informe o número do cartão."
          : !cardBrand
            ? "Bandeira não identificada."
            : !validateCardNumber(card.number, cardBrand)
              ? "Número do cartão inválido."
              : "",
      holderName:
        card.holderName.trim() === ""
          ? "Informe o nome impresso no cartão."
          : "",
      expiry:
        card.expiry.trim() === ""
          ? "Informe a validade."
          : !validateExpiry(card.expiry)
            ? "Validade inválida."
            : "",
      cvv:
        card.cvv.trim() === ""
          ? "Informe o CVV."
          : !validateCVV(card.cvv, cardBrand)
            ? "CVV inválido."
            : "",
      installments:
        paymentMethod === "credit" && !card.installments
          ? "Selecione o parcelamento."
          : "",
    };
  }

  function validateForm() {
    return {
      ...validateCustomerForm(),
      ...validateCardForm(),
    };
  }

  function handleNameChange(event) {
    const value = event.target.value;
    setCustomer((prev) => ({ ...prev, name: value }));

    if (errors.name) {
      setErrors((prev) => ({
        ...prev,
        name: value.trim() ? "" : prev.name,
      }));
    }
  }

  function handlePhoneChange(event) {
    const formatted = formatPhone(event.target.value);
    setCustomer((prev) => ({ ...prev, cel: formatted }));

    if (errors.cel) {
      setErrors((prev) => ({
        ...prev,
        cel: onlyDigits(formatted).length === 11 ? "" : prev.cel,
      }));
    }
  }

  function handleEmailChange(event) {
    const value = event.target.value;
    setCustomer((prev) => ({ ...prev, email: value }));

    if (errors.email) {
      setErrors((prev) => ({
        ...prev,
        email: value.trim() === "" || validateEmail(value) ? "" : prev.email,
      }));
    }
  }

  function handleCPFChange(event) {
    const formatted = formatCPF(event.target.value);
    setCustomer((prev) => ({ ...prev, cpf: formatted }));

    if (errors.cpf) {
      setErrors((prev) => ({
        ...prev,
        cpf:
          onlyDigits(formatted).length === 11 && validateCPF(formatted)
            ? ""
            : prev.cpf,
      }));
    }
  }

  function handleCardNumberChange(event) {
    const raw = event.target.value;
    const nextBrand = detectCardBrand(raw);
    const formatted = formatCardNumber(raw, nextBrand);

    setCard((prev) => ({
      ...prev,
      number: formatted,
      cvv: formatCVV(prev.cvv, nextBrand),
    }));

    if (errors.cardNumber) {
      setErrors((prev) => ({
        ...prev,
        cardNumber:
          nextBrand && validateCardNumber(formatted, nextBrand)
            ? ""
            : prev.cardNumber,
      }));
    }
  }

  function handleHolderNameChange(event) {
    const value = event.target.value.toUpperCase();
    setCard((prev) => ({ ...prev, holderName: value }));

    if (errors.holderName) {
      setErrors((prev) => ({
        ...prev,
        holderName: value.trim() ? "" : prev.holderName,
      }));
    }
  }

  function handleExpiryChange(event) {
    const formatted = formatExpiry(event.target.value);
    setCard((prev) => ({ ...prev, expiry: formatted }));

    if (errors.expiry) {
      setErrors((prev) => ({
        ...prev,
        expiry: validateExpiry(formatted) ? "" : prev.expiry,
      }));
    }
  }

  function handleCVVChange(event) {
    const formatted = formatCVV(event.target.value, cardBrand);
    setCard((prev) => ({ ...prev, cvv: formatted }));

    if (errors.cvv) {
      setErrors((prev) => ({
        ...prev,
        cvv: validateCVV(formatted, cardBrand) ? "" : prev.cvv,
      }));
    }
  }

  function handleInstallmentsChange(event) {
    const value = event.target.value;
    setCard((prev) => ({ ...prev, installments: value }));

    if (errors.installments) {
      setErrors((prev) => ({
        ...prev,
        installments: value ? "" : prev.installments,
      }));
    }
  }

  function handleBlur(field) {
    const newErrors = validateForm();
    setErrors((prev) => ({
      ...prev,
      [field]: newErrors[field],
    }));
  }

  function resetPaymentState() {
    setPaymentResult(null);
    setLoading(false);
  }

  function handleChangePaymentMethod(method) {
    setPaymentMethod(method);
    resetPaymentState();

    setErrors((prev) => ({
      ...prev,
      cardNumber: "",
      holderName: "",
      expiry: "",
      cvv: "",
      installments: "",
    }));
  }

  async function handleCheckout() {
    const newErrors = validateForm();
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) return;

    const cleanCustomer = {
      name: customer.name.trim(),
      email: customer.email.trim(),
      cpf: onlyDigits(customer.cpf),
      cel: onlyDigits(customer.cel),
    };

    try {
      setLoading(true);

      if (paymentMethod === "pix") {
        const response = await createPixCheckout({
          customer: cleanCustomer,
          items,
          total,
        });

        setPaymentResult({
          type: "pix",
          ...response,
        });
      } else {
        const response = await createCardCheckout({
          paymentMethod,
          customer: cleanCustomer,
          items,
          total,
          card: {
            number: onlyDigits(card.number),
            holderName: card.holderName.trim(),
            expiry: card.expiry,
            cvv: onlyDigits(card.cvv),
            brand: cardBrand,
            installments:
              paymentMethod === "credit" ? Number(card.installments) : 1,
          },
        });

        setPaymentResult({
          type: paymentMethod,
          ...response,
        });
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao processar pagamento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-neutral-950 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="font-serif text-3xl text-white">Checkout</div>
            <div className="text-sm text-zinc-500">
              Escolha a forma de pagamento
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-zinc-300 transition hover:border-amber-400 hover:text-amber-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!paymentResult ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => handleChangePaymentMethod("pix")}
                className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                  paymentMethod === "pix"
                    ? "border-amber-400 bg-amber-400 text-black"
                    : "border-white/10 bg-black/30 text-white hover:border-amber-400"
                }`}
              >
                <DollarSign className="h-5 w-5" />
                PIX
              </button>

              <button
                type="button"
                onClick={() => handleChangePaymentMethod("credit")}
                className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                  paymentMethod === "credit"
                    ? "border-amber-400 bg-amber-400 text-black"
                    : "border-white/10 bg-black/30 text-white hover:border-amber-400"
                }`}
              >
                <CreditCard className="h-5 w-5" />
                Cartão de crédito
              </button>

              <button
                type="button"
                onClick={() => handleChangePaymentMethod("debit")}
                className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                  paymentMethod === "debit"
                    ? "border-amber-400 bg-amber-400 text-black"
                    : "border-white/10 bg-black/30 text-white hover:border-amber-400"
                }`}
              >
                <CreditCard className="h-5 w-5" />
                Cartão de débito
              </button>
            </div>

            <div>
              <input
                value={customer.name}
                onChange={handleNameChange}
                onBlur={() => handleBlur("name")}
                placeholder="Nome completo"
                className={`w-full rounded-2xl border bg-black/30 px-4 py-3 text-white outline-none ${
                  errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-white/10 focus:border-amber-400"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                value={customer.cel}
                onChange={handlePhoneChange}
                onBlur={() => handleBlur("cel")}
                placeholder="Celular"
                inputMode="numeric"
                maxLength={14}
                className={`w-full rounded-2xl border bg-black/30 px-4 py-3 text-white outline-none ${
                  errors.cel
                    ? "border-red-500 focus:border-red-500"
                    : "border-white/10 focus:border-amber-400"
                }`}
              />
              {errors.cel && (
                <p className="mt-1 text-sm text-red-400">{errors.cel}</p>
              )}
            </div>

            <div>
              <input
                value={customer.email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur("email")}
                placeholder="E-mail"
                className={`w-full rounded-2xl border bg-black/30 px-4 py-3 text-white outline-none ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-white/10 focus:border-amber-400"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                value={customer.cpf}
                onChange={handleCPFChange}
                onBlur={() => handleBlur("cpf")}
                placeholder="CPF"
                inputMode="numeric"
                maxLength={14}
                className={`w-full rounded-2xl border bg-black/30 px-4 py-3 text-white outline-none ${
                  errors.cpf
                    ? "border-red-500 focus:border-red-500"
                    : "border-white/10 focus:border-amber-400"
                }`}
              />
              {errors.cpf && (
                <p className="mt-1 text-sm text-red-400">{errors.cpf}</p>
              )}
            </div>

            {(paymentMethod === "credit" || paymentMethod === "debit") && (
              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm text-zinc-400">Dados do cartão</div>

                  <div className="flex items-center gap-2 rounded-full border border-white/10 pl-3 pr-1 py-2">
                    {currentBrand ? (
                      <>
                        <img
                          src={currentBrand.logo}
                          alt={currentBrand.label}
                          className="h-5 w-auto object-contain"
                        />
                        <span className="text-xs font-medium text-white">
                          {currentBrand.label}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs uppercase tracking-wide text-zinc-400">
                        Bandeira
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <input
                    value={card.number}
                    onChange={handleCardNumberChange}
                    onBlur={() => handleBlur("cardNumber")}
                    placeholder="Número do cartão"
                    inputMode="numeric"
                    maxLength={cardBrand === "amex" ? 17 : 23}
                    className={`w-full rounded-2xl border bg-black/30 px-4 py-3 text-white outline-none ${
                      errors.cardNumber
                        ? "border-red-500 focus:border-red-500"
                        : "border-white/10 focus:border-amber-400"
                    }`}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    value={card.holderName}
                    onChange={handleHolderNameChange}
                    onBlur={() => handleBlur("holderName")}
                    placeholder="Nome impresso no cartão"
                    className={`w-full rounded-2xl border bg-black/30 px-4 py-3 text-white outline-none ${
                      errors.holderName
                        ? "border-red-500 focus:border-red-500"
                        : "border-white/10 focus:border-amber-400"
                    }`}
                  />
                  {errors.holderName && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.holderName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <input
                      value={card.expiry}
                      onChange={handleExpiryChange}
                      onBlur={() => handleBlur("expiry")}
                      placeholder="Validade (MM/AA)"
                      inputMode="numeric"
                      maxLength={5}
                      className={`w-full rounded-2xl border bg-black/30 px-4 py-3 text-white outline-none ${
                        errors.expiry
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/10 focus:border-amber-400"
                      }`}
                    />
                    {errors.expiry && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.expiry}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      value={card.cvv}
                      onChange={handleCVVChange}
                      onBlur={() => handleBlur("cvv")}
                      placeholder={
                        cardBrand === "amex" ? "CVV (4 dígitos)" : "CVV"
                      }
                      inputMode="numeric"
                      maxLength={cardBrand === "amex" ? 4 : 3}
                      className={`w-full rounded-2xl border bg-black/30 px-4 py-3 text-white outline-none ${
                        errors.cvv
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/10 focus:border-amber-400"
                      }`}
                    />
                    {errors.cvv && (
                      <p className="mt-1 text-sm text-red-400">{errors.cvv}</p>
                    )}
                  </div>
                </div>

                {paymentMethod === "credit" && (
                  <div>
                    <select
                      value={card.installments}
                      onChange={handleInstallmentsChange}
                      onBlur={() => handleBlur("installments")}
                      className={`w-full rounded-2xl border bg-black/30 px-4 py-3 text-white outline-none ${
                        errors.installments
                          ? "border-red-500 focus:border-red-500"
                          : "border-white/10 focus:border-amber-400"
                      }`}
                    >
                      {installmentOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-neutral-950 text-white"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.installments && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.installments}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="text-sm text-zinc-400">Total do pedido</div>
              <div className="mt-2 font-serif text-4xl text-amber-400">
                {currency(total)}
              </div>
              <div className="mt-2 text-xs text-zinc-500">
                {paymentMethod === "credit"
                  ? "Parcelamento disponível em até 10x"
                  : paymentMethod === "debit"
                    ? "Pagamento à vista no débito"
                    : "Pagamento instantâneo via PIX"}
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full rounded-full bg-amber-400 px-6 py-3 font-semibold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Processando..."
                : paymentMethod === "pix"
                  ? "Gerar PIX"
                  : paymentMethod === "credit"
                    ? "Pagar com crédito"
                    : "Pagar com débito"}
            </button>
          </div>
        ) : paymentResult.type === "pix" ? (
          <div className="space-y-5 text-center">
            <div className="font-serif text-2xl text-white">
              PIX gerado com sucesso
            </div>

            {paymentResult.qrCodeBase64 && (
              <img
                src={`data:image/png;base64,${paymentResult.qrCodeBase64}`}
                alt="QR Code PIX"
                className="mx-auto h-56 w-56 rounded-xl bg-white p-3"
              />
            )}

            <textarea
              readOnly
              value={paymentResult.copyPaste || ""}
              className="h-28 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none"
            />

            <button
              onClick={onSuccess}
              className="w-full rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-400"
            >
              Concluir pedido
            </button>
          </div>
        ) : (
          <div className="space-y-5 text-center">
            <div className="font-serif text-2xl text-white">
              Pagamento enviado com sucesso
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left">
              <p className="text-sm text-zinc-400">
                Método:{" "}
                <span className="text-white">
                  {paymentResult.type === "credit"
                    ? "Cartão de crédito"
                    : "Cartão de débito"}
                </span>
              </p>

              <p className="mt-2 text-sm text-zinc-400">
                Bandeira:{" "}
                <span className="text-white">{brandLabel(cardBrand)}</span>
              </p>

              {paymentResult.type === "credit" && (
                <p className="mt-2 text-sm text-zinc-400">
                  Parcelamento:{" "}
                  <span className="text-white">{card.installments}x</span>
                </p>
              )}

              {paymentResult.status && (
                <p className="mt-2 text-sm text-zinc-400">
                  Status:{" "}
                  <span className="text-white">{paymentResult.status}</span>
                </p>
              )}
            </div>

            <button
              onClick={onSuccess}
              className="w-full rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-400"
            >
              Concluir pedido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
