import { motion } from 'framer-motion';
import { Gift, Leaf, Sparkles, Truck } from 'lucide-react';
import { SCENT_OPTIONS } from '../data/products';
import { springTransition } from './ui/SpotlightCard';

export function ValueBentoGrid() {
  return (
    <section id="promesa" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={springTransition}
          className="flex flex-col justify-between gap-4 border-b border-charcoal/10 pb-8 md:flex-row md:items-end"
        >
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sage">
              Nuestra Chispa &amp; Promesa
            </span>
            <h2 className="mt-2 font-serif text-[clamp(1.95rem,6vw,3rem)] font-semibold leading-tight tracking-tight text-charcoal">
              Artesanía cálida pensada para{' '}
              <span className="italic font-normal text-charcoal/80">celebrar.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-charcoal/70">
            Cada vela de Crafting Bonito se vierte, moldea y detalla a mano en nuestro taller
            mexicano para convertir bodas, baby showers, bautizos, eventos corporativos y
            celebraciones decembrinas en recuerdos memorables.
          </p>
        </motion.div>

        {/* Editorial Bento Grid with Chromatic Contrast */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* I. Bar Olfativo & Personalización (Light Bone Card, 7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={springTransition}
            className="flex flex-col justify-between rounded-3xl border border-charcoal/[0.1] bg-bone p-5 shadow-craft-card sm:p-8 md:col-span-7"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sage">
                  I · Bar Olfativo &amp; Personalización
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-semibold text-charcoal">
                  <Gift className="h-3.5 w-3.5 text-gold" />
                  Caja + Etiqueta Gratis &gt;25 pzas
                </span>
              </div>

              <h3 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-charcoal">
                Aromas, empaque y etiqueta a la medida de tu evento
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                Elige entre aromas clásicos incluidos sin costo o notas botánicas de
                colección privada. Al superar las 25 piezas por modelo, la caja craft y la
                etiqueta personalizada van incluidas en{' '}
                <strong className="font-semibold text-charcoal">$0 MXN</strong>.
              </p>
            </div>

            {/* Olfactory Perfumery Cards */}
            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {SCENT_OPTIONS.map((scent) => (
                <div
                  key={scent.id}
                  className={`flex items-start justify-between gap-3 rounded-2xl border p-3.5 ${
                    scent.tier === 'incluido'
                      ? 'border-charcoal/[0.08] bg-cream/65'
                      : 'border-gold/30 bg-gold/[0.06]'
                  }`}
                >
                  <div>
                    <p className="font-serif text-lg font-semibold leading-none text-charcoal">
                      {scent.name}
                    </p>
                    <p className="mt-1.5 text-[11px] leading-snug text-charcoal/65">
                      {scent.notes}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                      scent.price === 0
                        ? 'bg-sage/15 text-sage'
                        : 'bg-gold/20 text-charcoal'
                    }`}
                  >
                    {scent.price === 0 ? 'Incluido' : `+$${scent.price}`}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* II. El Arte del Dorado a Mano (Deep Charcoal Contrast Card, 5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ ...springTransition, delay: 0.06 }}
            className="flex flex-col justify-between overflow-hidden rounded-3xl bg-charcoal p-5 text-bone shadow-craft-hover sm:p-8 md:col-span-5"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                  II · Taller Mexicano
                </span>
                <Sparkles className="h-4 w-4 text-gold" />
              </div>

              <h3 className="mt-4 font-serif text-3xl font-semibold leading-tight text-bone">
                Hecho a mano localmente,{' '}
                <span className="italic font-normal text-gold">pincelada a pincelada.</span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-cream/75">
                Producimos en lotes cuidados en México. Nuestros diseños dorados llevan
                relieves pintados a mano en oro metálico sobre cera blanca marfil para un
                acabado irrepetible.
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <img
                src={`${import.meta.env.BASE_URL}images/brand/lifestyle-candle.jpg`}
                alt="Velas artesanales hechas a mano en Crafting Bonito"
                className="h-48 w-full object-cover object-center transition-transform duration-700 hover:scale-105"
              />
            </div>
          </motion.div>

          {/* III. Pureza Botánica (Warm Sage Tinted Card, 5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ ...springTransition, delay: 0.1 }}
            className="flex flex-col justify-between rounded-3xl border border-sage/30 bg-sage/[0.14] p-5 sm:p-8 md:col-span-5"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal/70">
                  III · Pureza Botánica
                </span>
                <Leaf className="h-4 w-4 text-sage" />
              </div>

              <h3 className="mt-4 font-serif text-3xl font-semibold leading-tight text-charcoal">
                100% Cera de soya vegana y cruelty-free
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
                Sin parafina ni derivados tóxicos del petróleo. Flama limpia, aroma
                envolvente y vasos de cristal reutilizables acompañados de empaque
                ecológico.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 border-t border-charcoal/10 pt-4">
              {['100% Cera de Soya', 'Vegana', 'Libre de Crueldad', 'Empaque Eco'].map(
                (tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-charcoal/15 bg-bone/80 px-3 py-1 text-xs font-medium text-charcoal"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </motion.div>

          {/* IV. Ritual de Pedido & Envíos a todo México (Editorial Steps, 7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ ...springTransition, delay: 0.14 }}
            className="flex flex-col justify-between rounded-3xl border border-charcoal/[0.1] bg-bone p-5 shadow-craft-card sm:p-8 md:col-span-7"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sage">
                  IV · Logística &amp; Reserva Segura
                </span>
                <h3 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-charcoal">
                  Envíos confiables a todo México
                </h3>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/10 bg-cream text-sage">
                <Truck className="h-5 w-5" strokeWidth={1.6} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-charcoal/10 pt-6 sm:grid-cols-3">
              <div>
                <span className="font-serif text-3xl italic text-gold">01</span>
                <p className="mt-1 text-sm font-semibold text-charcoal">
                  Aparta tu fecha
                </p>
                <p className="mt-1 text-xs leading-relaxed text-charcoal/65">
                  Confirma con el <strong className="text-charcoal">50% de anticipo</strong>{' '}
                  y al menos 15 días de anticipación.
                </p>
              </div>

              <div>
                <span className="font-serif text-3xl italic text-gold">02</span>
                <p className="mt-1 text-sm font-semibold text-charcoal">
                  Revisión en fotos
                </p>
                <p className="mt-1 text-xs leading-relaxed text-charcoal/65">
                  Te compartimos fotografías de tu pedido terminado antes de liquidar el 50%
                  restante.
                </p>
              </div>

              <div>
                <span className="font-serif text-3xl italic text-gold">03</span>
                <p className="mt-1 text-sm font-semibold text-charcoal">
                  Entrega protegida
                </p>
                <p className="mt-1 text-xs leading-relaxed text-charcoal/65">
                  Empaque reforzado a toda la República o punto de entrega acordado.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
