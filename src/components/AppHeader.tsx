import React from "react";
import { useNavigate } from "react-router-dom";
import { FollowMochiModal } from "./FollowMochiModal";
import { ShareButtons } from "./ShareButtons";
import { HamburgerMenu } from "./HamburgerMenu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useActiveRoute } from "@/hooks/useActiveRoute";
import { DiscoverPopover } from "./nav/DiscoverPopover";
import { LanguageToggle } from "./LanguageToggle";
import { MochiBrandMark } from "@/components/icons/MochiIcons";
import "@/styles/mochi-tokens.css";

/**
 * AppHeader · v2 (editorial)
 * ─────────────────────────────────────────────────────────
 * Same public API ({ onTabSelect } optional prop), same auth /
 * admin / active-route / language integrations, same drop-in
 * sub-components (FollowMochiModal, ShareButtons, HamburgerMenu,
 * DiscoverPopover, LanguageToggle).
 *
 * Visual changes:
 *   - Clean Mochi character (mochi-clean-200.webp, no halo)
 *   - Fraunces brand mark with italic 'de los Huertos'
 *   - Glass surface with backdrop-blur instead of opaque card
 *   - Honey accent under active route
 *   - Tighter, more elegant spacing
 *   - 'A Buzztastical Bee' tagline -> 'The garden bee'
 */

interface AppHeaderProps {
  onTabSelect?: (tab: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onTabSelect }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isAdmin = useIsAdmin();
  const { isActive, ariaCurrent } = useActiveRoute();

  const handleBeeClick = () => navigate("/");
  const isHome = isActive("/", { exact: true });

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-header-mobile md:h-header-tablet lg:h-header-desktop"
      style={{
        background:
          "linear-gradient(180deg, hsl(45 60% 96% / .92) 0%, hsl(45 60% 96% / .82) 70%, hsl(45 60% 96% / .65) 100%)",
        backdropFilter: "blur(18px) saturate(1.1)",
        WebkitBackdropFilter: "blur(18px) saturate(1.1)",
        borderBottom: "1px solid hsl(40 92% 56% / .14)",
        fontFamily: "var(--mochi-font-sans, 'Saira', sans-serif)",
        color: "hsl(30 25% 12%)",
      }}
    >
      <div
        className="h-full max-w-7xl mx-auto px-mobile-lg md:px-mobile-xl lg:px-mobile-2xl"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        {/* ── Left: Mochi mark + brand wordmark ───────────────── */}
        <button
          onClick={handleBeeClick}
          aria-label="Go to home page"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: 0,
            background: "transparent",
            padding: "4px 6px",
            borderRadius: 12,
            cursor: "pointer",
            transition: "transform .25s cubic-bezier(.34,1.56,.64,1)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget.querySelector("img") as HTMLImageElement)
              ?.style.setProperty("transform", "rotate(-6deg) scale(1.06)");
          }}
          onMouseLeave={(e) => {
            (e.currentTarget.querySelector("img") as HTMLImageElement)
              ?.style.setProperty("transform", "");
          }}
        >
          <img
            src="/lovable-uploads/mochi-clean-200.webp"
            alt="Mochi the garden bee"
            width={44}
            height={44}
            style={{
              width: 44,
              height: 44,
              objectFit: "contain",
              filter: "drop-shadow(0 4px 8px hsl(30 25% 12% / .18))",
              transition: "transform .35s cubic-bezier(.34,1.56,.64,1)",
            }}
          />
          <div style={{ textAlign: "left", lineHeight: 1.05 }}>
            <h1
              style={{
                margin: 0,
                fontFamily: "var(--mochi-font-display, Fraunces, serif)",
                fontWeight: 600,
                fontSize: "clamp(18px, 2.6vw, 22px)",
                color: "hsl(30 25% 12%)",
                letterSpacing: "-.015em",
              }}
            >
              <span className="sm:hidden">Mochi</span>
              <span className="hidden sm:inline">
                Mochi{" "}
                <em style={{ fontStyle: "italic", fontWeight: 400, color: "hsl(35 78% 38%)" }}>
                  de los Huertos
                </em>
              </span>
            </h1>
            <p
              className="hidden xs:block"
              style={{
                margin: 0,
                marginTop: 1,
                fontFamily: "var(--mochi-font-script, Caveat, cursive)",
                fontSize: 15,
                fontWeight: 600,
                color: "hsl(35 78% 38%)",
              }}
            >
              the garden bee
            </p>
          </div>
        </button>

        {/* ── Right: Nav + Actions ─────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex" style={{ alignItems: "center", gap: 4 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              aria-current={ariaCurrent("/", { exact: true })}
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: isHome ? "hsl(35 78% 38%)" : "hsl(28 35% 28%)",
                position: "relative",
              }}
            >
              <span style={{ marginRight: 6 }}>🐝</span> Beeducation
              {isHome && (
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: 12,
                    right: 12,
                    bottom: 4,
                    height: 2,
                    borderRadius: 2,
                    background: "hsl(40 92% 56%)",
                  }}
                />
              )}
            </Button>
            <DiscoverPopover />
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: isActive("/dashboard") ? "hsl(35 78% 38%)" : "hsl(28 35% 28%)",
                }}
              >
                <span style={{ marginRight: 6 }}>🌱</span> Dashboard
              </Button>
            )}
          </nav>

          {/* Desktop-only Follow CTA */}
          <div className="hidden sm:block">
            <FollowMochiModal>
              <Button
                variant="default"
                size="sm"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  background:
                    "linear-gradient(180deg, hsl(40 92% 56%) 0%, hsl(32 88% 44%) 100%)",
                  color: "hsl(30 25% 12%)",
                  border: 0,
                  borderRadius: 999,
                  padding: "7px 14px",
                  boxShadow:
                    "0 8px 22px -8px hsl(32 88% 44% / .55), 0 0 0 1px hsl(40 92% 56% / .15) inset",
                }}
              >
                <span style={{ marginRight: 6 }}>♡</span>
                <span className="hidden xs:inline">{t("follow")}</span> {t("mochiName")}
              </Button>
            </FollowMochiModal>
          </div>

          <div className="hidden sm:block">
            <ShareButtons />
          </div>

          {/* Language toggle (EN → ES → FR cycle) */}
          <LanguageToggle />

          {/* Auth — desktop */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 8 }}>
            {user ? (
              <>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/admin")}
                    title="Admin"
                    aria-label="Admin"
                    style={{ fontSize: 12, color: "hsl(28 35% 28%)" }}
                  >
                    🛡
                  </Button>
                )}
                <span
                  className="hidden lg:inline"
                  style={{ fontSize: 12, color: "hsl(28 35% 28%)", opacity: 0.7 }}
                >
                  {user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  style={{
                    fontSize: 12,
                    borderRadius: 999,
                    borderColor: "hsl(30 25% 12% / .2)",
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/auth")}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 999,
                  borderColor: "hsl(30 25% 12% / .35)",
                  color: "hsl(30 25% 12%)",
                }}
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <HamburgerMenu onTabSelect={onTabSelect} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
