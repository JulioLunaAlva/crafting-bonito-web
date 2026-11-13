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
          opacity: [0.35, 0.56, 0.35],
          scale: [0.97, 1.04, 0.97],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="pointer-events-none absolute -top-28 right-[-8%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(197,160,89,0.22)_0%,rgba(247,243,235,0)_70%)] blur-3xl sm:h-[520px] sm:w-[520px]"
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

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
        {/* Editorial Left Column with Staggered Spring Entrance */}
        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-6"
        >
          {/* First Purchase Promo Badge */}
          <motion.div variants={heroItemVariants} className="mb-4">
            <motion.a
              href="#catalogo"
              onClick={() => setIsFirstPurchase(true)}
              whileTap={{ scale: 0.97 }}
              transition={springTransition}
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-gold/45 bg-bone/95 px-3.5 py-1.5 text-[11px] font-semibold text-charcoal shadow-sm transition-colors hover:border-gold"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold" />
              <span className="truncate sm:whitespace-normal">
                10% OFF en tu 1ra compra en pedidos desde $1,500 MXN
              </span>
            </motion.a>
          </motion.div>

          <motion.div variants={heroItemVariants} className="flex items-center gap-3">
            <span className="h-px w-8 shrink-0 bg-gold" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sage sm:text-[11px] sm:tracking-[0.22em]">
              Catálogo de Eventos 2026 &amp; Blanca Navidad · México
            </span>
          </motion.div>

          <motion.h1
            variants={heroItemVariants}
            className="mt-4 font-serif text-[clamp(2.45rem,8.5vw,4.5rem)] font-semibold leading-[0.98] tracking-tight text-charcoal sm:mt-6"
          >
            Momentos de Luz
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
            , pensadas para iluminar bodas, baby showers, bautizos, cumpleaños, regalos
            corporativos y nuestra edición estacional Blanca Navidad. Personaliza aroma,
            empaque y etiqueta con cotización inmediata.
          </motion.p>

          {/* Editorial CTAs */}
          <motion.div
            variants={heroItemVariants}
            className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <motion.a
              href="#catalogo"
              onClick={() => setActiveCollection('eventos')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={springTransition}
              className="group inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-full bg-charcoal px-7 py-3.5 text-sm font-semibold tracking-wide text-bone shadow-md transition-colors hover:bg-charcoal/90 sm:w-auto"
            >
              <span>Explorar Eventos 2026</span>
              <ArrowDownRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </motion.a>

            <motion.a
              href="#catalogo"
              onClick={() => setActiveCollection('navidad')}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={springTransition}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-charcoal/20 bg-transparent px-6 py-3.5 text-sm font-medium text-charcoal transition-colors hover:border-gold/60 hover:bg-bone/70 sm:w-auto"
            >
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              <span>Ver Colección Blanca Navidad</span>
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
            {/* Rotating Circular Atelier Seal */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 -top-5 z-20 hidden h-24 w-24 items-center justify-center rounded-full bg-cream/90 p-1 shadow-sm backdrop-blur-sm sm:flex"
            >
              <motion.svg
                viewBox="0 0 120 120"
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                className="h-full w-full"
              >
                <defs>
                  <path
                    id="atelier-circle"
                    d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
                  />
                </defs>
                <text className="fill-charcoal/80 text-[9.3px] font-semibold uppercase tracking-[0.23em]">
                  <textPath href="#atelier-circle" startOffset="0%">
                    ARTESANÍA MEXICANA · 100% CERA DE SOYA ·
                  </textPath>
                </text>
              </motion.svg>
              <span className="absolute h-2 w-2 rounded-full bg-gold" />
            </div>

            {/* Main Arch Framed Portrait with gentle upward scroll parallax */}
            <motion.div
              style={{ y: archY }}
              className="editorial-frame relative overflow-hidden rounded-t-[190px] rounded-b-3xl bg-bone p-2.5 will-change-transform sm:rounded-t-[230px] sm:p-3"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-[180px] rounded-b-2xl bg-cream sm:rounded-t-[218px]">
                <img
                  src={`${import.meta.env.BASE_URL}images/events/hero-unicornios.jpg`}
                  alt="Velas artesanales de cera de soya Crafting Bonito para eventos y recuerdos"
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
              className="mt-4 flex items-center gap-3.5 rounded-2xl border border-charcoal/10 bg-bone p-2.5 shadow-craft-card will-change-transform sm:absolute sm:-bottom-6 sm:-left-10 sm:mt-0 sm:w-52 sm:flex-col sm:items-stretch sm:gap-2"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-full">
                <img
                  src={`${import.meta.env.BASE_URL}images/events/ositos-vaso.jpg`}
                  alt="Recuerdos de ositos en vaso de cristal Crafting Bonito"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="px-1 pb-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                  Atelier · Todo el Año
                </p>
                <p className="mt-0.5 font-serif text-base font-semibold leading-tight text-charcoal">
                  Eventos Sociales &amp; Regalos Corporativos
                </p>
              </div>
            </motion.div>

            {/* Editorial Caption below Arch */}
            <p className="mt-5 text-center font-serif text-sm italic text-charcoal/65 sm:mt-8 sm:text-right">
              49 modelos artesanales entre Eventos 2026 y Blanca Navidad.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
