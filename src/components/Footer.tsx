import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  InstagramFlower,
  ButterflyLink,
  NatureLeaf,
  SunflowerStar,
} from "@/components/icons";
import { MochiBrandMark } from "@/components/icons/MochiIcons";
import { DISCOVER_SECTIONS } from "./nav/navConfig";
import "@/styles/mochi-tokens.css";

/**
 * Footer · v2 (editorial)
 * ─────────────────────────────────────────────────────────
 * Same public API: Footer: React.FC, no props.
 * Same useLanguage() integration.
 * Same DISCOVER_SECTIONS navConfig dependency.
 * Same social links and ecosystem URLs.
 *
 * Visual changes:
 *   - Forest-deep background instead of card+border
 *   - Brand statement + Mochi mark up top
 *   - Fraunces column headers, Saira body
 *   - Honey-coloured hover for links
 *   - "Mochi de los Huertos · LA PIPA IS LA PIPA" wordmark in copyright
 *   - Tighter spacing on mobile
 */

const SOCIAL = [
  { name: "Instagram", url: "https://www.instagram.com/thelawtonschool/", Icon: InstagramFlower },
  { name: "Facebook",  url: "https://www.facebook.com/TheLawtonSchool/",   Icon: ButterflyLink },
  { name: "LinkedIn",  url: "https://www.linkedin.com/company/the-lawton-school/", Icon: NatureLeaf },
  { name: "YouTube",   url: "https://www.youtube.com/@thelawtonschool",     Icon: SunflowerStar },
];

const ECOSYSTEM = [
  { url: "https://lapipa.io",            label: "lapipa.io" },
  { url: "https://idiomas.io",           label: "idiomas.io" },
  { url: "https://lawtonx.com",          label: "lawtonx.com" },
  { url: "https://simientesinfinitas.com", label: "simientesinfinitas.com" },
  { url: "https://www.alexlawton.io",    label: "alexlawton.io" },
];

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const isEs = language === "es";

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, hsl(140 38% 26%) 0%, hsl(30 25% 12%) 100%)",
        color: "hsl(40 65% 96%)",
        fontFamily: "var(--mochi-font-sans, 'Saira', sans-serif)",
        marginTop: "auto",
      }}
    >
      {/* Top: brand statement + tagline + social */}
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "clamp(40px, 6vw, 64px) clamp(20px, 4vw, 56px) 24px",
          display: "grid",
          gap: 28,
          gridTemplateColumns: "1fr",
          borderBottom: "1px solid hsl(40 65% 96% / .12)",
        }}
      >
        <style>{`
          @media (min-width: 760px) {
            footer .footer-top { grid-template-columns: 1.4fr 1fr; align-items: end; }
          }
          footer .footer-link {
            color: hsl(40 65% 96% / .68);
            text-decoration: none;
            transition: color .2s, transform .2s;
          }
          footer .footer-link:hover {
            color: hsl(40 92% 56%);
          }
          footer .footer-eco-link {
            font-family: var(--mochi-font-display, Fraunces, serif);
            font-size: 16px;
            font-weight: 500;
          }
        `}</style>
        <div className="footer-top" style={{ display: "grid", gap: 28 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <MochiBrandMark size={40} />
              <span
                style={{
                  fontFamily: "var(--mochi-font-display, Fraunces, serif)",
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: "-.01em",
                  color: "hsl(40 65% 96%)",
                }}
              >
                Mochi <em style={{ fontStyle: "italic", fontWeight: 400, color: "hsl(40 92% 56%)" }}>de los Huertos</em>
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--mochi-font-display, Fraunces, serif)",
                fontWeight: 500,
                fontSize: "clamp(20px, 2.6vw, 28px)",
                lineHeight: 1.2,
                letterSpacing: "-.015em",
                color: "hsl(40 65% 96%)",
                maxWidth: "22ch",
                margin: 0,
              }}
            >
              {isEs ? (
                <>La abeja del huerto, la <em style={{ fontStyle: "italic", color: "hsl(40 92% 56%)" }}>revolución silenciosa</em>.</>
              ) : (
                <>The garden bee, the <em style={{ fontStyle: "italic", color: "hsl(40 92% 56%)" }}>quiet revolution</em>.</>
              )}
            </p>
            <p
              style={{
                marginTop: 14,
                maxWidth: "44ch",
                fontSize: 14.5,
                lineHeight: 1.65,
                color: "hsl(40 65% 96% / .65)",
              }}
            >
              {isEs
                ? "Aprende sobre abejas, jardines y naturaleza. Parte de LA PIPA IS LA PIPA — una red regenerativa que celebra la biodiversidad, la soberanía alimentaria y el arte lento de prestar atención."
                : "Learn about bees, gardens & nature. Part of LA PIPA IS LA PIPA — a regenerative ecosystem celebrating biodiversity, food sovereignty, and the slow art of paying attention."}
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            {SOCIAL.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                title={s.name}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  color: "hsl(40 65% 96%)",
                  background: "hsl(40 65% 96% / .08)",
                  border: "1px solid hsl(40 65% 96% / .14)",
                  transition: "all .2s cubic-bezier(.34,1.56,.64,1)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "hsl(40 92% 56%)";
                  e.currentTarget.style.color = "hsl(30 25% 12%)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "hsl(40 65% 96% / .08)";
                  e.currentTarget.style.color = "hsl(40 65% 96%)";
                  e.currentTarget.style.transform = "";
                }}
              >
                <s.Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main 4-column grid */}
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "40px clamp(20px, 4vw, 56px) 32px",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 32,
            gridTemplateColumns: "repeat(2, 1fr)",
          }}
        >
          <style>{`
            @media (min-width: 760px) {
              footer .footer-grid { grid-template-columns: repeat(4, 1fr) !important; }
            }
            footer .footer-col h3 {
              font-family: var(--mochi-font-sans);
              font-size: 11px;
              font-weight: 700;
              letter-spacing: .14em;
              text-transform: uppercase;
              color: hsl(48 100% 65%);
              margin: 0 0 16px;
            }
            footer .footer-col ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
            footer .footer-col a { font-size: 14.5px; }
          `}</style>

          <div
            className="footer-grid"
            style={{
              display: "grid",
              gap: 32,
              gridTemplateColumns: "repeat(2, 1fr)",
              gridColumn: "1 / -1",
            }}
          >
            {/* Column 1: Explore Mochi */}
            <div className="footer-col">
              <h3>{isEs ? "Explorar Mochi" : "Explore Mochi"}</h3>
              <ul>
                <li>
                  <Link to="/" className="footer-link">
                    {isEs ? "Beeducación" : "Beeducation"}
                  </Link>
                </li>
                <li>
                  <Link to="/learning/garden-basics" className="footer-link">
                    {isEs ? "Básicos de Jardín" : "Garden Basics"}
                  </Link>
                </li>
                <li>
                  <Link to="/learning/bee-basics" className="footer-link">
                    {isEs ? "Básicos de Abejas" : "Bee Basics"}
                  </Link>
                </li>
                <li>
                  <Link to="/brand" className="footer-link">
                    {isEs ? "Libro de marca" : "Brand book"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: For Kids — driven by navConfig */}
            <div className="footer-col">
              <h3>
                {isEs ? DISCOVER_SECTIONS[0].titleEs : DISCOVER_SECTIONS[0].titleEn}
              </h3>
              <ul>
                {DISCOVER_SECTIONS[0].items.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="footer-link">
                      {isEs ? item.labelEs : item.labelEn}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Learn More — driven by navConfig */}
            <div className="footer-col">
              <h3>
                {isEs ? DISCOVER_SECTIONS[1].titleEs : DISCOVER_SECTIONS[1].titleEn}
              </h3>
              <ul>
                {DISCOVER_SECTIONS[1].items.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="footer-link">
                      {isEs ? item.labelEs : item.labelEn}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Ecosystem */}
            <div className="footer-col">
              <h3>{isEs ? "El ecosistema" : "The ecosystem"}</h3>
              <ul>
                {ECOSYSTEM.map((item) => (
                  <li key={item.url}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link footer-eco-link"
                    >
                      {item.label}{" "}
                      <span style={{ opacity: 0.4, fontSize: 12, marginLeft: 2 }}>↗</span>
                    </a>
                  </li>
                ))}
                <li style={{ marginTop: 8 }}>
                  <a href="mailto:hello@lawtonschool.com" className="footer-link">
                    hello@lawtonschool.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: "1px solid hsl(40 65% 96% / .12)",
          padding: "20px clamp(20px, 4vw, 56px) 28px",
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            alignItems: "center",
            fontSize: 12.5,
            color: "hsl(40 65% 96% / .55)",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link to="/privacy" className="footer-link">
              {isEs ? "Privacidad" : "Privacy"}
            </Link>
            <span aria-hidden style={{ opacity: 0.5 }}>·</span>
            <Link to="/terms" className="footer-link">
              {isEs ? "Términos" : "Terms"}
            </Link>
            <span aria-hidden style={{ opacity: 0.5 }}>·</span>
            <Link to="/cookies" className="footer-link">
              Cookies
            </Link>
            <span aria-hidden style={{ opacity: 0.5 }}>·</span>
            <Link to="/sitemap" className="footer-link">
              {isEs ? "Mapa del sitio" : "Sitemap"}
            </Link>
            <span aria-hidden style={{ opacity: 0.5 }}>·</span>
            <Link to="/brand" className="footer-link">
              {isEs ? "Marca" : "Brand"}
            </Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", alignItems: "center" }}>
            <span>
              © {new Date().getFullYear()} Mochi de los Huertos
              <span style={{ margin: "0 6px", opacity: 0.5 }}>·</span>
              <span style={{ color: "hsl(40 92% 56%)" }}>LA PIPA IS LA PIPA</span>
            </span>
            <span aria-hidden style={{ opacity: 0.5 }}>·</span>
            <span>
              {isEs ? "Hecho con miel en Asturias" : "Made with honey in Asturias"}
            </span>
            <span aria-hidden style={{ opacity: 0.5 }}>·</span>
            <span>
              {isEs ? "Diseño:" : "Design:"}{" "}
              <a
                href="https://www.alexlawton.io"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                style={{ fontWeight: 600 }}
              >
                Alex Lawton
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
