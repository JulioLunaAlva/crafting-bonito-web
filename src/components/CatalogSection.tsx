import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useQuoteStore } from '../store/useQuoteStore';
import { CatalogFilter, CollectionFilter } from '../types/quote';
import { ProductCard } from './ProductCard';
import { springTransition } from './ui/SpotlightCard';

const COLLECTION_TABS: { id: CollectionFilter; label: string; count: number }[] = [
  {
    id: 'eventos',
    label: 'Eventos y Recuerdos 2026',
    count: PRODUCTS.filter((p) => p.collection === 'eventos').length,
  },
  {
    id: 'navidad',
    label: 'Colección Blanca Navidad',
    count: PRODUCTS.filter((p) => p.collection === 'navidad').length,
  },
  {
    id: 'todas',
    label: 'Todas las Velas',
    count: PRODUCTS.length,
  },
];

const SUB_FILTERS: { id: CatalogFilter; label: string }[] = [
  { id: 'Todas', label: 'Todas' },
  { id: 'Velas Solas', label: 'Velas Solas' },
  { id: 'Velas en Vaso', label: 'Velas en Vaso' },
  { id: 'Baby Shower & Infantil', label: 'Baby Shower & Infantil' },
  { id: 'Bodas & Minimalista', label: 'Bodas & Minimalista' },
  { id: 'Acabado Dorado', label: 'Acabado Dorado' },
];

function matchesSubFilter(product: (typeof PRODUCTS)[number], filter: CatalogFilter): boolean {
  switch (filter) {
    case 'Todas':
      return true;
    case 'Velas Solas':
      return product.category === 'Velas Solas';
    case 'Velas en Vaso':
      return product.category === 'Velas en Vaso';
    case 'Baby Shower & Infantil':
      return (
        product.occasion === 'Baby Shower' || product.occasion === 'Cumpleaños y Mascotas'
      );
    case 'Bodas & Minimalista':
      return (
        product.occasion === 'Bodas y Bautizos' ||
        product.occasion === 'Minimalista / Corporativo'
      );
    case 'Acabado Dorado':
      return Boolean(product.isGoldHandPainted);
    default:
      return true;
  }
}

export function CatalogSection() {
  const activeCollection = useQuoteStore((s) => s.activeCollection);
  const setActiveCollection = useQuoteStore((s) => s.setActiveCollection);
  const [activeFilter, setActiveFilter] = useState<CatalogFilter>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTier, setPreviewTier] = useState<1 | 2 | 3>(1);

  const collectionProducts = useMemo(() => {
    if (activeCollection === 'todas') return PRODUCTS;
    return PRODUCTS.filter((p) => p.collection === activeCollection);
  }, [activeCollection]);

  const filterCounts = useMemo(() => {
    const counts: Record<CatalogFilter, number> = {
      Todas: collectionProducts.length,
      'Velas Solas': 0,
      'Velas en Vaso': 0,
      'Baby Shower & Infantil': 0,
      'Bodas & Minimalista': 0,
      'Acabado Dorado': 0,
    };

    for (const p of collectionProducts) {
      if (p.category === 'Velas Solas') counts['Velas Solas'] += 1;
      if (p.category === 'Velas en Vaso') counts['Velas en Vaso'] += 1;
      if (p.occasion === 'Baby Shower' || p.occasion === 'Cumpleaños y Mascotas') {
        counts['Baby Shower & Infantil'] += 1;
      }
      if (
        p.occasion === 'Bodas y Bautizos' ||
        p.occasion === 'Minimalista / Corporativo'
      ) {
        counts['Bodas & Minimalista'] += 1;
      }
      if (p.isGoldHandPainted) counts['Acabado Dorado'] += 1;
    }
    return counts;
  }, [collectionProducts]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return collectionProducts.filter((product) => {
      if (!matchesSubFilter(product, activeFilter)) return false;

      if (!q) return true;
      return (
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.occasion.toLowerCase().includes(q)
      );
    });
  }, [collectionProducts, activeFilter, searchQuery]);

  const handleCollectionChange = (nextCollection: CollectionFilter) => {
    setActiveCollection(nextCollection);
    // Evitar filtros incompatibles con 0 resultados al cambiar de colección
    if (
      nextCollection === 'navidad' &&
      (activeFilter === 'Baby Shower & Infantil' || activeFilter === 'Bodas & Minimalista')
    ) {
      setActiveFilter('Todas');
    } else if (nextCollection === 'eventos' && activeFilter === 'Acabado Dorado') {
      setActiveFilter('Todas');
    }
  };

  const handleSubFilterChange = (nextFilter: CatalogFilter) => {
    setActiveFilter(nextFilter);
    // Si el sub-filtro pertenece únicamente a otra colección, cambiamos automáticamente para no mostrar vacío
    if (
      (nextFilter === 'Baby Shower & Infantil' || nextFilter === 'Bodas & Minimalista') &&
      activeCollection === 'navidad'
    ) {
      setActiveCollection('eventos');
    } else if (nextFilter === 'Acabado Dorado' && activeCollection === 'eventos') {
      setActiveCollection('navidad');
    }
  };

  const sectionMeta =
    activeCollection === 'eventos'
      ? {
          eyebrow: 'Catálogo Interactivo · 22 Modelos Todo el Año',
          title: 'Catálogo de Eventos — Momentos de Luz 2026',
        }
      : activeCollection === 'navidad'
      ? {
          eyebrow: 'Edición Especial de Temporada · 27 Modelos',
          title: 'Colección Blanca Navidad',
        }
      : {
          eyebrow: `Catálogo Completo · ${PRODUCTS.length} Modelos Artesanales`,
          title: 'Eventos 2026 & Blanca Navidad',
        };

  return (
    <section
      id="catalogo"
      className="relative border-t border-charcoal/[0.07] bg-cream/60 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={springTransition}
          className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"
        >
          <div>
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-sage">
              {sectionMeta.eyebrow}
            </span>
            <h2 className="mt-2 font-serif text-[clamp(1.95rem,6vw,3rem)] font-semibold leading-tight tracking-tight text-charcoal">
              {sectionMeta.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-charcoal/70 sm:text-base">
              Compra mínima de <strong className="text-charcoal">10 piezas por modelo</strong>.
              Haz clic en{' '}
              <span className="font-medium text-charcoal">“Personalizar y Cotizar”</span> para
              ajustar cantidad, aroma, empaque y ver tu ahorro al instante.
            </p>
          </div>

          {/* Preview Tier Switcher */}
          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            <span className="font-mono text-[10px] uppercase tracking-wider text-charcoal/60">
              Visualizar precios por volumen:
            </span>
            <div className="inline-flex max-w-full rounded-full border border-charcoal/[0.1] bg-bone p-1 shadow-craft-inset">
              {[
                { tier: 1 as const, label: '10–25 pzas' },
                { tier: 2 as const, label: '26–50 pzas' },
                { tier: 3 as const, label: '+50 pzas' },
              ].map((t) => {
                const isSelected = previewTier === t.tier;
                return (
                  <motion.button
                    key={t.tier}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPreviewTier(t.tier)}
                    className={`relative min-h-[40px] rounded-full px-3 py-1.5 font-mono text-xs font-medium transition-colors sm:px-3.5 ${
                      isSelected ? 'text-bone' : 'text-charcoal/70 hover:text-charcoal'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="volume-preview-pill"
                        transition={springTransition}
                        className="absolute inset-0 rounded-full bg-charcoal shadow-sm"
                      />
                    )}
                    <span className="relative z-10 whitespace-nowrap">{t.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Primary Collection Selector */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {COLLECTION_TABS.map((col) => {
            const isSelected = activeCollection === col.id;
            return (
              <motion.button
                key={col.id}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCollectionChange(col.id)}
                className={`relative inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors sm:px-5 sm:text-sm ${
                  isSelected
                    ? 'border-charcoal text-bone'
                    : 'border-charcoal/[0.12] bg-bone/80 text-charcoal/75 hover:border-charcoal/30 hover:text-charcoal'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="collection-tab-pill"
                    transition={springTransition}
                    className="absolute inset-0 rounded-full bg-charcoal shadow-sm"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                  {col.id === 'navidad' && <Sparkles className="h-3.5 w-3.5 text-gold" />}
                  <span>{col.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${
                      isSelected
                        ? 'bg-bone/15 text-gold'
                        : 'bg-charcoal/[0.06] text-charcoal/60'
                    }`}
                  >
                    {col.count}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Sub-Filter Bar + Search */}
        <div className="mt-4 flex flex-col justify-between gap-4 rounded-2xl border border-charcoal/[0.08] bg-bone/90 p-3 shadow-craft-inset md:flex-row md:items-center">
          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
            {SUB_FILTERS.map((filter) => {
              const isActive = activeFilter === filter.id;
              const count =
                filter.id === 'Acabado Dorado' && activeCollection === 'eventos'
                  ? PRODUCTS.filter((p) => p.isGoldHandPainted).length
                  : (filter.id === 'Baby Shower & Infantil' ||
                      filter.id === 'Bodas & Minimalista') &&
                    activeCollection === 'navidad'
                  ? PRODUCTS.filter((p) => matchesSubFilter(p, filter.id)).length
                  : filterCounts[filter.id];

              return (
                <motion.button
                  key={filter.id}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSubFilterChange(filter.id)}
                  className={`relative inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                    isActive ? 'text-bone' : 'text-charcoal/70 hover:text-charcoal'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="catalog-filter-pill"
                      transition={springTransition}
                      className="absolute inset-0 rounded-xl bg-charcoal shadow-sm"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
                    {filter.id === 'Acabado Dorado' && (
                      <Sparkles className="h-3.5 w-3.5 text-gold" />
                    )}
                    {filter.label}
                    <span
                      className={`font-mono text-[11px] tabular-nums ${
                        isActive ? 'text-gold' : 'text-charcoal/45'
                      }`}
                    >
                      {count}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/45" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar modelo (ej. Unicornio, Vaso)..."
              className="w-full rounded-xl border border-charcoal/[0.1] bg-cream/70 py-2 pl-10 pr-4 text-sm text-charcoal placeholder:text-charcoal/45 focus:border-gold focus:bg-bone focus:outline-none"
            />
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div
            layout
            className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  previewTier={previewTier}
                  index={idx}
                  showCollectionTag={activeCollection === 'todas'}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="mt-12 rounded-2xl border border-charcoal/[0.08] bg-bone p-12 text-center">
            <p className="font-serif text-2xl font-medium text-charcoal">
              No encontramos modelos con los filtros actuales
            </p>
            <p className="mt-2 text-sm text-charcoal/65">
              Intenta con otro término o restablece los filtros para explorar toda la colección.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCollection('todas');
                setActiveFilter('Todas');
                setSearchQuery('');
              }}
              className="mt-5 rounded-full bg-charcoal px-5 py-2 text-xs font-semibold text-bone"
            >
              Ver los {PRODUCTS.length} modelos
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
