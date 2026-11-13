import {
  FIRST_PURCHASE_DISCOUNT_RATE,
  FIRST_PURCHASE_MIN_SUBTOTAL,
  FREE_PACKAGING_THRESHOLD,
  MIN_ORDER_PER_MODEL,
  PACKAGING_OPTIONS,
  SCENT_OPTIONS,
} from '../data/products';
import {
  CustomerInfo,
  ItemPricingBreakdown,
  PackagingId,
  Product,
  QuoteItem,
  ScentId,
} from '../types/quote';

export function formatMXN(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getScentOption(scentId: ScentId) {
  return SCENT_OPTIONS.find((s) => s.id === scentId) ?? SCENT_OPTIONS[0];
}

export function getPackagingOption(packagingId: PackagingId) {
  return PACKAGING_OPTIONS.find((p) => p.id === packagingId) ?? PACKAGING_OPTIONS[0];
}

export function calculateItemPricing(
  product: Product,
  rawQuantity: number,
  scentId: ScentId,
  packagingId: PackagingId
): ItemPricingBreakdown {
  const quantity = Math.max(MIN_ORDER_PER_MODEL, Math.floor(rawQuantity || MIN_ORDER_PER_MODEL));

  let activeTier: 1 | 2 | 3 = 1;
  let tierLabel = '10 – 25 pzas';
  let baseUnitPrice = product.prices.tier1;

  if (quantity > 50) {
    activeTier = 3;
    tierLabel = '+50 pzas';
    baseUnitPrice = product.prices.tier3;
  } else if (quantity >= 26) {
    activeTier = 2;
    tierLabel = '26 – 50 pzas';
    baseUnitPrice = product.prices.tier2;
  }

  const scent = getScentOption(scentId);
  const packaging = getPackagingOption(packagingId);

  const scentUnitPrice = scent.price;
  const basePackagingPrice = packaging.basePrice;

  // Regla automática: si la cantidad de ese modelo es mayor a 25 piezas,
  // el empaque seleccionado pasa automáticamente a $0 MXN y se desbloquea etiqueta personalizada.
  const isFreePackagingUnlocked = quantity > FREE_PACKAGING_THRESHOLD;
  const isCustomLabelUnlocked = isFreePackagingUnlocked;

  const packagingUnitPrice = isFreePackagingUnlocked ? 0 : basePackagingPrice;

  const finalUnitPrice = baseUnitPrice + scentUnitPrice + packagingUnitPrice;
  const lineSubtotal = finalUnitPrice * quantity;

  const volumeSavings = Math.max(0, product.prices.tier1 - baseUnitPrice) * quantity;
  const packagingSavings = isFreePackagingUnlocked ? basePackagingPrice * quantity : 0;
  const totalItemSavings = volumeSavings + packagingSavings;

  const piecesToFreePackaging = isFreePackagingUnlocked
    ? 0
    : FREE_PACKAGING_THRESHOLD + 1 - quantity;

  const piecesToTier3 = quantity > 50 ? 0 : 51 - quantity;

  return {
    quantity,
    activeTier,
    tierLabel,
    baseUnitPrice,
    scentUnitPrice,
    basePackagingPrice,
    packagingUnitPrice,
    isFreePackagingUnlocked,
    isCustomLabelUnlocked,
    piecesToFreePackaging,
    piecesToTier3,
    finalUnitPrice,
    lineSubtotal,
    volumeSavings,
    packagingSavings,
    totalItemSavings,
  };
}

export interface QuoteSummary {
  totalModels: number;
  totalPieces: number;
  baseCandlesSubtotal: number;
  subtotal: number;
  isFirstPurchase: boolean;
  isFirstPurchaseEligible: boolean;
  amountToUnlockFirstPurchase: number;
  firstPurchaseProgressPct: number;
  potentialFirstPurchaseDiscount: number;
  firstPurchaseDiscount: number;
  discountedSubtotal: number;
  totalSavings: number;
  requiresInvoice: boolean;
  ivaAmount: number;
  grandTotal: number;
  depositAmount: number;
  remainingAmount: number;
}

export function calculateQuoteSummary(
  items: QuoteItem[],
  requiresInvoice: boolean,
  isFirstPurchase = false
): QuoteSummary {
  let totalPieces = 0;
  let baseCandlesSubtotal = 0;
  let subtotal = 0;
  let totalSavings = 0;

  for (const item of items) {
    const pricing = calculateItemPricing(
      item.product,
      item.quantity,
      item.scent,
      item.packaging
    );
    totalPieces += pricing.quantity;
    baseCandlesSubtotal += pricing.baseUnitPrice * pricing.quantity;
    subtotal += pricing.lineSubtotal;
    totalSavings += pricing.totalItemSavings;
  }

  const isFirstPurchaseEligible = subtotal >= FIRST_PURCHASE_MIN_SUBTOTAL;
  const amountToUnlockFirstPurchase = Math.max(0, FIRST_PURCHASE_MIN_SUBTOTAL - subtotal);
  const firstPurchaseProgressPct = Math.min(
    100,
    Math.round((subtotal / FIRST_PURCHASE_MIN_SUBTOTAL) * 100)
  );

  // Regla financiera: 10% únicamente sobre el subtotal base de las velas cuando subtotal >= $1,500 MXN
  const potentialFirstPurchaseDiscount =
    Math.round(baseCandlesSubtotal * FIRST_PURCHASE_DISCOUNT_RATE * 100) / 100;

  const firstPurchaseDiscount =
    isFirstPurchase && isFirstPurchaseEligible ? potentialFirstPurchaseDiscount : 0;

  const discountedSubtotal = Math.max(0, Math.round((subtotal - firstPurchaseDiscount) * 100) / 100);
  const ivaAmount = requiresInvoice
    ? Math.round(discountedSubtotal * 0.16 * 100) / 100
    : 0;
  const grandTotal = Math.round((discountedSubtotal + ivaAmount) * 100) / 100;
  const depositAmount = Math.round(grandTotal * 0.5 * 100) / 100;
  const remainingAmount = Math.round((grandTotal - depositAmount) * 100) / 100;

  return {
    totalModels: items.length,
    totalPieces,
    baseCandlesSubtotal,
    subtotal,
    isFirstPurchase,
    isFirstPurchaseEligible,
    amountToUnlockFirstPurchase,
    firstPurchaseProgressPct,
    potentialFirstPurchaseDiscount,
    firstPurchaseDiscount,
    discountedSubtotal,
    totalSavings,
    requiresInvoice,
    ivaAmount,
    grandTotal,
    depositAmount,
    remainingAmount,
  };
}

export function buildWhatsAppMessage(
  items: QuoteItem[],
  requiresInvoice: boolean,
  customerInfo: CustomerInfo,
  isFirstPurchase = false
): string {
  const summary = calculateQuoteSummary(items, requiresInvoice, isFirstPurchase);
  const lines: string[] = [
    '✨ *COTIZACIÓN CRAFTING BONITO — MOMENTOS DE LUZ* ✨',
    '',
  ];

  const name = (customerInfo.name ?? '').trim();
  const eventDate = (customerInfo.eventDate ?? '').trim();
  const city = (customerInfo.city ?? '').trim();

  const hasOptionalData = Boolean(name || eventDate || city);

  if (hasOptionalData) {
    lines.push('📋 *Datos del Pedido:*');
    if (name) lines.push(`• Cliente / Empresa: ${name}`);
    if (eventDate) lines.push(`• Fecha del evento: ${eventDate}`);
    if (city) lines.push(`• Ciudad / Alcaldía de envío: ${city}`);
    lines.push('');
  }

  lines.push(`🕯️ *Detalle del Pedido (${summary.totalPieces} piezas totales):*`);
  lines.push('');

  items.forEach((item, index) => {
    const pricing = calculateItemPricing(
      item.product,
      item.quantity,
      item.scent,
      item.packaging
    );
    const scent = getScentOption(item.scent);
    const packaging = getPackagingOption(item.packaging);

    const collectionLabel =
      item.product.collection === 'eventos' ? 'Eventos 2026' : 'Blanca Navidad';

    lines.push(
      `${index + 1}. *${item.product.name}* (${item.product.category} · ${collectionLabel})`
    );
    lines.push(`   • Cantidad: ${pricing.quantity} pzas (Nivel ${pricing.tierLabel})`);
    lines.push(
      `   • Aroma: ${scent.name}${scent.price > 0 ? ` (+${formatMXN(scent.price)} c/u)` : ' (Incluido)'}`
    );

    if (pricing.isFreePackagingUnlocked) {
      lines.push(
        `   • Empaque: ${packaging.name} — *$0 MXN (¡Incluido gratis por +25 pzas!)*`
      );
      if (item.customLabelMessage.trim()) {
        lines.push(`   • Etiqueta personalizada: "${item.customLabelMessage.trim()}"`);
      } else {
        lines.push('   • Etiqueta personalizada: Incluida (por definir diseño)');
      }
    } else {
      lines.push(
        `   • Empaque: ${packaging.name}${
          pricing.packagingUnitPrice > 0
            ? ` (+${formatMXN(pricing.packagingUnitPrice)} c/u)`
            : ' ($0)'
        }`
      );
    }

    lines.push(
      `   • Precio unitario final: ${formatMXN(pricing.finalUnitPrice)} | Subtotal: *${formatMXN(
        pricing.lineSubtotal
      )} MXN*`
    );
    if (pricing.totalItemSavings > 0) {
      lines.push(`   • Ahorro aplicado: ${formatMXN(pricing.totalItemSavings)} MXN`);
    }
    lines.push('');
  });

  lines.push('━━━━━━━━━━━━━━━━━━━━━━');
  lines.push(`• Subtotal modelos: ${formatMXN(summary.subtotal)} MXN`);
  if (summary.totalSavings > 0) {
    lines.push(`• Ahorro por volumen y empaques: ${formatMXN(summary.totalSavings)} MXN`);
  }
  if (summary.firstPurchaseDiscount > 0) {
    lines.push(
      `• Descuento 1ra compra (10%): -${formatMXN(summary.firstPurchaseDiscount)} MXN`
    );
    lines.push(`• Subtotal con descuento: ${formatMXN(summary.discountedSubtotal)} MXN`);
  }
  lines.push(
    `• Factura (+16% IVA): ${
      summary.requiresInvoice ? `Sí (+${formatMXN(summary.ivaAmount)} MXN)` : 'No requerida'
    }`
  );
  lines.push(`• *TOTAL ESTIMADO: ${formatMXN(summary.grandTotal)} MXN*`);
  lines.push(`• *Anticipo 50% para apartar fecha: ${formatMXN(summary.depositAmount)} MXN*`);
  lines.push(`• Restante contra fotos de entrega: ${formatMXN(summary.remainingAmount)} MXN`);
  lines.push('━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('');
  lines.push(
    '📌 *Notas:* Pedido con mínimo 15 días de anticipación. Envío por cotizar según ubicación. ¿Me ayudan a confirmar disponibilidad para mi fecha?'
  );

  return lines.join('\n');
}
