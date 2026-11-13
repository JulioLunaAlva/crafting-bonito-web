import {
  CalendarClock,
  FileText,
  Flame,
  Instagram,
  MessageCircle,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { WHATSAPP_DISPLAY, WHATSAPP_PHONE } from '../data/products';

const TERMS = [
  {
    icon: Flame,
    title: 'Aromas incluidos y premium',
    body: 'Vainilla y Canela incluidos sin costo. Sándalo, Lavanda y Patchouli tienen un cargo adicional de $15 MXN por vela.',
  },
  {
    icon: ShieldCheck,
    title: 'Empaque y etiqueta >25 pzas',
    body: 'En pedidos mayores a 25 piezas de un modelo se incluye empaque craft y etiqueta personalizada sin costo.',
  },
  {
    icon: FileText,
    title: 'Facturación disponible',
    body: 'En caso de requerir factura fiscal, se adicionará el 16% correspondiente al IVA.',
  },
  {
    icon: Truck,
    title: 'Envío o punto de entrega',
    body: 'El costo de envío se cotiza por separado o se acuerda punto de entrega según tu ubicación.',
  },
  {
    icon: CalendarClock,
    title: 'Anticipación de 15 días',
    body: 'Todas las velas se producen bajo pedido artesanal; solicita tu fecha con al menos 15 días de anticipación.',
  },
  {
    icon: MessageCircle,
    title: '50% de anticipo y liquidación',
    body: 'Para confirmar fecha se requiere el 50% de anticipo. El 50% restante se liquida al enviarte fotos del pedido listo.',
  },
];

export function Footer() {
  return (
    <footer
      id="condiciones"
      className="border-t border-charcoal/[0.08] bg-bone pt-16 pb-12"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 border-b border-charcoal/[0.08] pb-10 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-sage">
              Términos y Condiciones
            </span>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
              Hagamos tu celebración aún más especial
            </h2>
          </div>

          <div className="flex flex-col gap-3 self-start sm:flex-row">
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-charcoal/15 bg-cream px-5 py-3 text-sm font-semibold text-charcoal transition-colors hover:border-gold hover:bg-gold/10"
            >
              <MessageCircle className="h-4 w-4 text-gold" />
              <span>WhatsApp directo: {WHATSAPP_DISPLAY}</span>
            </a>
            <a
              href="https://www.instagram.com/craftingbonitomx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-charcoal/15 bg-cream px-5 py-3 text-sm font-semibold text-charcoal transition-colors hover:border-gold hover:bg-gold/10"
            >
              <Instagram className="h-4 w-4 text-gold" />
              <span>@craftingbonitomx</span>
            </a>
          </div>
        </div>

        {/* Terms Grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TERMS.map((term) => {
            const Icon = term.icon;
            return (
              <div
                key={term.title}
                className="rounded-2xl border border-charcoal/[0.07] bg-cream/60 p-5"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-charcoal/10 bg-bone text-gold">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-charcoal">{term.title}</h3>
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-charcoal/70">{term.body}</p>
              </div>
            );
          })}
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-charcoal/[0.08] pt-6 text-xs text-charcoal/55 sm:flex-row">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
            <img
              src={`${import.meta.env.BASE_URL}images/brand/logo-cb.png`}
              alt="Logo Crafting Bonito"
              className="h-14 w-14 shrink-0 rounded-full border border-charcoal/15 object-cover shadow-sm"
            />
            <div>
              <p className="font-serif text-base text-charcoal/80">
                Crafting Bonito · Momentos de Luz &amp; Blanca Navidad
              </p>
              <p className="mt-0.5 font-serif text-sm italic text-gold">
                ¡Hacemos puras cosas bonitas!
              </p>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-charcoal/55">
                Eventos Sociales &amp; Regalos Corporativos · CDMX
              </p>
            </div>
          </div>
          <p className="font-mono text-[11px]">
            100% Cera de Soya Natural · Hecho a mano en México
          </p>
        </div>
      </div>
    </footer>
  );
}
