import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AdActionsPopover from "./AdActionsPopover";

vi.mock("@/hooks/useTranslations", () => ({
  useTranslations: () => (key: string) => ({
    "common.adActions.adOptions": "Opciones del anuncio",
    "common.adActions.whyThisAd": "¿Por qué este anuncio?",
    "common.adActions.stopSeeingThisAd": "Deja de ver este anuncio",
    "common.adActions.reportAd": "Reportar anuncio",
    "common.adActions.aboutThisAd": "Acerca de este anuncio",
    "common.adActions.aboutThisAdDescription": "Este anuncio se muestra según tu actividad de navegación y ubicación. Tu opinión nos ayuda a mostrar anuncios más relevantes.",
    "common.adActions.whatWasWrong": "¿Qué estaba mal?",
    "common.adActions.notRelevant": "No es relevante para mí",
    "common.adActions.coveredContent": "El anuncio cubrió el contenido",
    "common.adActions.seenMultiple": "He visto este anuncio varias veces",
    "common.adActions.inappropriate": "El anuncio fue inapropiado",
    "common.adActions.otherReason": "Otra razón...",
    "common.adActions.moreDetails": "Más detalles",
    "common.adActions.placeholder": "Describe brevemente el problema...",
    "common.adActions.submit": "Enviar",
    "common.adActions.submitting": "Enviando...",
    "common.adActions.thanks": "¡Gracias por tu opinión!",
    "common.adActions.thanksDescription": "Intentaremos no volver a mostrarte este anuncio.",
    "common.adActions.ad": "Anuncio",
    "adActions.adOptions": "Opciones del anuncio",
    "adActions.whyThisAd": "¿Por qué este anuncio?",
    "adActions.stopSeeingThisAd": "Deja de ver este anuncio",
    "adActions.reportAd": "Reportar anuncio",
    "adActions.aboutThisAd": "Acerca de este anuncio",
    "adActions.aboutThisAdDescription": "Este anuncio se muestra según tu actividad de navegación y ubicación. Tu opinión nos ayuda a mostrar anuncios más relevantes.",
    "adActions.whatWasWrong": "¿Qué estaba mal?",
    "adActions.notRelevant": "No es relevante para mí",
    "adActions.coveredContent": "El anuncio cubrió el contenido",
    "adActions.seenMultiple": "He visto este anuncio varias veces",
    "adActions.inappropriate": "El anuncio fue inapropiado",
    "adActions.otherReason": "Otra razón...",
    "adActions.moreDetails": "Más detalles",
    "adActions.placeholder": "Describe brevemente el problema...",
    "adActions.submit": "Enviar",
    "adActions.submitting": "Enviando...",
    "adActions.thanks": "¡Gracias por tu opinión!",
    "adActions.thanksDescription": "Intentaremos no volver a mostrarte este anuncio.",
  }[key] ?? key),
}));

describe("AdActionsPopover", () => {
  it("supports left-aligned placement and localized labels", () => {
    render(<AdActionsPopover onSubmit={vi.fn()} align="left" />);

    const trigger = screen.getByRole("button", { name: /opciones del anuncio/i });
    expect(trigger.closest("[data-align='left']")).not.toBeNull();

    fireEvent.click(trigger);

    expect(screen.getByText("¿Por qué este anuncio?")).toBeTruthy();
    expect(screen.getByText("Deja de ver este anuncio")).toBeTruthy();
  });
});
