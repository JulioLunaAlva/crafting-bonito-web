import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDownRight, Sparkles } from 'lucide-react';
import { useQuoteStore } from '../store/useQuoteStore';
import { springTransition } from './ui/SpotlightCard';

const heroContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.03,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
};

const GOLDEN_SPARKLES = [
  { id: 1, top: '12%', left: '8%', size: 6, duration: 5.5, delay: 0 },
  { id: 2, top: '24%', left: '22%', size: 4, duration: 7.2, delay: 0.8 },
  { id: 3, top: '18%', left: '46%', size: 5, duration: 6.4, delay: 1.4 },
  { id: 4, top: '65%', left: '14%', size: 5, duration: 6.8, delay: 0.5 },
  { id: 5, top: '78%', left: '38%', size: 4, duration: 5.9, delay: 1.9 },
  { id: 6, top: '14%', left: '78%', size: 6, duration: 6.2, delay: 0.3 },
  { id: 7, top: '34%', left: '91%', size: 5, duration: 7.5, delay: 1.1 },
  { id: 8, top: '54%', left: '54%', size: 4, duration: 5.8, delay: 2.1 },
  { id: 9, top: '72%', left: '88%', size: 6, duration: 6.6, delay: 0.7 },
  { id: 10, top: '86%', left: '62%', size: 4, duration: 7.1, delay: 1.6 },
  { id: 11, top: '42%', left: '6%', size: 4, duration: 6.3, delay: 2.4 },
  { id: 12, top: '8%', left: '62%', size: 5, duration: 5.7, delay: 1.2 },
];

export function Hero() {
  const setIsFirstPurchase = useQuoteStore((s) => s.setIsFirstPurchase);
  const setActiveCollection = useQuoteStore((s) => s.setActiveCollection);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const archY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const secondaryY = useTransform(scrollYProgress, [0, 1], [0, 22]);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative overflow-hidden border-b border-charcoal/[0.08] bg-cream pt-8 pb-14 sm:pt-14 sm:pb-24"
    >
      {/* Warm ambient candlelight aura */}
      <motion.div
        aria-hidden="true"
        animate={{
          opacity: [0.35, 0.58, 0.35],
          scale: [0.97, 1.04, 0.97],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="pointer-events-none absolute -top-28 right-[-8%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(197,160,89,0.24)_0%,rgba(247,243,235,0)_70%)] blur-3xl sm:h-[520px] sm:w-[520px]"
      />
      <motion.div
        aria-hidden="true"
        animate={{
          opacity: [0.22, 0.4, 0.22],
          scale: [1.02, 0.96, 1.02],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="pointer-events-none absolute -bottom-24 left-[-10%] h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,rgba(125,138,123,0.16)_0%,rgba(247,243,235,0)_72%)] blur-3xl sm:h-[420px] sm:w-[420px]"
      />

      {/* Subtle Floating Golden Candlelight & Snow Sparkles (60fps GPU-only) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {GOLDEN_SPARKLES.map((s) => (
          <motion.span
            key={s.id}
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.15, 0.65, 0.15],
              scale: [0.85, 1.2, 0.85],
            }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute rounded-full bg-gold shadow-[0_0_10px_2px_rgba(197,160,89,0.45)]"
          />
        ))}
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
        {/* Editorial Left Column with Staggered Spring Entrance */}
        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6"
        >
          {/* First Purchase Promo Badge */}
          <motion.div variants={heroItemVariants} className="mb-4 flex flex-wrap items-center gap-2">
            <motion.a
              href="#catalogo"
              onClick={() => setIsFirstPurchase(true)}
              whileTap={{ scale: 0.97 }}
              transition={springTransition}
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-gold/55 bg-bone/95 px-3.5 py-1.5 text-[11px] font-semibold text-charcoal shadow-sm transition-colors hover:border-gold"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold" />
              <span className="truncate sm:whitespace-normal">
                10% OFF en tu 1ra compra en pedidos desde $1,500 MXN
              </span>
            </motion.a>
          </motion.div>

          <motion.div variants={heroItemVariants} className="flex items-center gap-3">
            <span className="h-px w-8 shrink-0 bg-gold" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold sm:text-[11px] sm:tracking-[0.22em]">
              Colección Especial de Temporada · Hecho en México
            </span>
          </motion.div>

          <motion.h1
            variants={heroItemVariants}
            className="mt-4 font-serif text-[clamp(2.45rem,8.5vw,4.5rem)] font-semibold leading-[0.98] tracking-tight text-charcoal sm:mt-6"
          >
            Blanca Navidad
            <span className="mt-1.5 block font-normal italic text-charcoal/85">
              Hecho a mano con intención.
            </span>
          </motion.h1>

          <motion.p
            variants={heroItemVariants}
            className="mt-5 max-w-xl text-[15px] leading-relaxed text-charcoal/75 sm:mt-6 sm:text-[17px]"
          >
            Velas escultóricas vertidas artesanalmente en{' '}
            <strong className="font-semibold text-charcoal">
              100% cera de soya natural
            </strong>
            , pensadas para iluminar posadas, bodas decembrinas y regalos corporativos
            por volumen. Descubre también nuestra línea permanente para eventos sociales
            todo el año.
          </motion.p>

          {/* Editorial CTAs */}
          <motion.div
            variants={heroItemVariants}
            className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <motion.a
              href="#catalogo"
              onClick={() => setActiveCollection('navidad')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={springTransition}
              className="group inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-full bg-charcoal px-7 py-3.5 text-sm font-semibold tracking-wide text-bone shadow-md transition-colors hover:bg-charcoal/90 sm:w-auto"
            >
              <Sparkles className="h-4 w-4 text-gold" />
              <span>Explorar Blanca Navidad</span>
              <ArrowDownRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </motion.a>

            <motion.a
              href="#catalogo"
              onClick={() => setActiveCollection('eventos')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={springTransition}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-charcoal/20 bg-transparent px-6 py-3.5 text-sm font-medium text-charcoal transition-colors hover:border-gold/60 hover:bg-bone/70 sm:w-auto"
            >
              <span>Catálogo de Eventos 2026</span>
            </motion.a>
          </motion.div>

          {/* Magazine-style Editorial Rules Strip */}
          <motion.div
            variants={heroItemVariants}
            className="mt-10 grid grid-cols-3 divide-x divide-charcoal/15 border-y border-charcoal/15 py-4 sm:mt-12 sm:py-5"
          >
            <div className="pr-2.5 sm:pr-5">
              <p className="font-serif text-xl font-semibold tabular-nums text-charcoal sm:text-3xl">
                10 pzas
              </p>
              <p className="mt-1 text-[11px] leading-snug text-charcoal/65 sm:text-xs">
                Mínimo por modelo con precios escalonados
              </p>
            </div>

            <div className="px-2.5 sm:px-5">
              <p className="font-serif text-xl font-semibold tabular-nums text-gold sm:text-3xl">
                +25 pzas
              </p>
              <p className="mt-1 text-[11px] leading-snug text-charcoal/65 sm:text-xs">
                Caja craft y etiqueta gratis <strong className="text-charcoal">$0</strong>
              </p>
            </div>

            <div className="pl-2.5 sm:pl-5">
              <p className="font-serif text-xl font-semibold tabular-nums text-charcoal sm:text-3xl">
                50%
              </p>
              <p className="mt-1 text-[11px] leading-snug text-charcoal/65 sm:text-xs">
                Anticipo para apartar fecha (15 días antes)
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Visual Editorial Right Column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.12 }}
          className="relative lg:col-span-6"
        >
          <div className="relative mx-auto max-w-md lg:ml-auto lg:mr-4 lg:max-w-[460px]">
            {/* Official Atelier Medallion Seal */}
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ ...springTransition, delay: 0.25 }}
              className="pointer-events-none absolute -right-2 -top-4 z-20 flex h-20 w-20 items-center justify-center rounded-full border border-gold/50 bg-bone/95 p-1 shadow-craft-card backdrop-blur-sm sm:-right-5 sm:-top-6 sm:h-28 sm:w-28 sm:p-1.5"
            >
              <img
                src={`${import.meta.env.BASE_URL}images/brand/logo-cb.png`}
                alt="Sello Crafting Bonito Ciudad de México"
                className="h-full w-full rounded-full object-cover"
              />
            </motion.div>

            {/* Main Arch Framed Portrait with gentle upward scroll parallax */}
            <motion.div
              style={{ y: archY }}
              className="editorial-frame relative overflow-hidden rounded-t-[190px] rounded-b-3xl bg-bone p-2.5 will-change-transform sm:rounded-t-[230px] sm:p-3"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-[180px] rounded-b-2xl bg-cream sm:rounded-t-[218px]">
                <img
                  src={`${import.meta.env.BASE_URL}images/brand/hero-candle.jpg`}
                  alt="Velas artesanales de cera de soya Colección Blanca Navidad"
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
            </motion.div>

            {/* Secondary Offset Studio Print */}
            <motion.div
              style={{ y: secondaryY }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.22 }}
              className="mt-4 flex items-center gap-3.5 rounded-2xl border border-gold/30 bg-bone p-2.5 shadow-craft-card will-change-transform sm:absolute sm:-bottom-6 sm:-left-10 sm:mt-0 sm:w-52 sm:flex-col sm:items-stretch sm:gap-2"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-full">
                <img
                  src={`${import.meta.env.BASE_URL}images/brand/velas-solas-cover.jpg`}
                  alt="Velas escultóricas pintadas a mano en dorado"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="px-1 pb-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                  Edición Navidad · Autor
                </p>
                <p className="mt-0.5 font-serif text-base font-semibold leading-tight text-charcoal">
                  Acentos pintados a mano en dorado
                </p>
              </div>
            </motion.div>

            {/* Editorial Caption below Arch */}
            <p className="mt-5 text-center font-serif text-sm italic text-charcoal/65 sm:mt-8 sm:text-right">
              Colección Blanca Navidad (27 modelos) &amp; Catálogo de Eventos 2026 (22 modelos).
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
