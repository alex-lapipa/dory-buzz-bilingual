import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";

// Mock supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockResolvedValue({ error: null }),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
  },
}));

// Mock useToast
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

// Mock language context
vi.mock("@/contexts/LanguageContext", () => ({
  useLanguage: () => ({ language: "en", setLanguage: vi.fn() }),
}));

import { BeeAnatomyExplorer } from "../BeeAnatomyExplorer";
import { PollinationQuest } from "../PollinationQuest";
import { HiveBuilder } from "../HiveBuilder";
import { FlowerMemoryGame } from "../FlowerMemoryGame";
import { BeeDanceDecoder } from "../BeeDanceDecoder";
import { LifecycleLab } from "../LifecycleLab";
import { GardenPlanner } from "../GardenPlanner";
import { SpeciesSpotter } from "../SpeciesSpotter";
import { MicroscopicBeeWorld } from "../MicroscopicBeeWorld";
import { BeeTrivia } from "../BeeTrivia";

describe("All 10 Interactive Learning Games", () => {
  let onGameComplete: ReturnType<typeof vi.fn>;
  let onClose: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onGameComplete = vi.fn();
    onClose = vi.fn();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // === 1. BEE ANATOMY EXPLORER ===
  describe("BeeAnatomyExplorer", () => {
    it("renders start screen with title and start button", () => {
      render(<BeeAnatomyExplorer onGameComplete={onGameComplete} onClose={onClose} />);
      expect(screen.getByText("Bee Anatomy Explorer")).toBeInTheDocument();
      expect(screen.getByText(/Start Exploring/)).toBeInTheDocument();
    });

    it("starts game and shows first question", () => {
      render(<BeeAnatomyExplorer onGameComplete={onGameComplete} onClose={onClose} />);
      fireEvent.click(screen.getByText(/Start Exploring/));
      expect(screen.getByText(/Part 1\/10/)).toBeInTheDocument();
      expect(screen.getByText(/What is this body part called/)).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", () => {
      render(<BeeAnatomyExplorer onGameComplete={onGameComplete} onClose={onClose} />);
      const closeButtons = screen.getAllByRole("button");
      const closeBtn = closeButtons.find(b => b.querySelector('svg'));
      if (closeBtn) fireEvent.click(closeBtn);
      expect(onClose).toHaveBeenCalled();
    });
  });

  // === 2. POLLINATION QUEST ===
  describe("PollinationQuest", () => {
    it("renders start screen", () => {
      render(<PollinationQuest onGameComplete={onGameComplete} onClose={onClose} />);
      expect(screen.getByText("Pollination Quest")).toBeInTheDocument();
      expect(screen.getByText(/Start Quest/)).toBeInTheDocument();
    });

    it("starts game and shows grid with bee", () => {
      render(<PollinationQuest onGameComplete={onGameComplete} onClose={onClose} />);
      fireEvent.click(screen.getByText(/Start Quest/));
      expect(screen.getByText("🐝")).toBeInTheDocument();
      expect(screen.getByText("🏠")).toBeInTheDocument();
      expect(screen.getByText(/Moves:/)).toBeInTheDocument();
    });
  });

  // === 3. HIVE BUILDER ===
  describe("HiveBuilder", () => {
    it("renders start screen", () => {
      render(<HiveBuilder onGameComplete={onGameComplete} onClose={onClose} />);
      expect(screen.getByText("Hive Builder Challenge")).toBeInTheDocument();
      expect(screen.getByText(/Start Building/)).toBeInTheDocument();
    });

    it("starts game and shows cell palette", () => {
      render(<HiveBuilder onGameComplete={onGameComplete} onClose={onClose} />);
      fireEvent.click(screen.getByText(/Start Building/));
      expect(screen.getByText(/Honey/)).toBeInTheDocument();
      expect(screen.getByText(/Brood/)).toBeInTheDocument();
      expect(screen.getByText(/Pollen/)).toBeInTheDocument();
      expect(screen.getByText(/Check Pattern/)).toBeInTheDocument();
    });
  });

  // === 4. FLOWER MEMORY GAME ===
  describe("FlowerMemoryGame", () => {
    it("renders start screen", () => {
      render(<FlowerMemoryGame onGameComplete={onGameComplete} onClose={onClose} />);
      expect(screen.getByText("Flower Memory Match")).toBeInTheDocument();
      expect(screen.getByText(/Start Game/)).toBeInTheDocument();
    });

    it("starts game and shows card grid", () => {
      render(<FlowerMemoryGame onGameComplete={onGameComplete} onClose={onClose} />);
      fireEvent.click(screen.getByText(/Start Game/));
      // 16 cards (8 pairs)
      const cards = screen.getAllByText("🌸");
      expect(cards.length).toBe(16); // all face-down showing 🌸
    });
  });

  // === 5. BEE DANCE DECODER ===
  describe("BeeDanceDecoder", () => {
    it("renders start screen", () => {
      render(<BeeDanceDecoder onGameComplete={onGameComplete} onClose={onClose} />);
      expect(screen.getByText(/Bee Dance Decoder/)).toBeInTheDocument();
      expect(screen.getByText(/Start Decoding/)).toBeInTheDocument();
    });

    it("starts game and shows compass and options", () => {
      render(<BeeDanceDecoder onGameComplete={onGameComplete} onClose={onClose} />);
      fireEvent.click(screen.getByText(/Start Decoding/));
      expect(screen.getByText(/Round 1\/8/)).toBeInTheDocument();
      expect(screen.getByText(/Which direction are the flowers/)).toBeInTheDocument();
      expect(screen.getByText("N")).toBeInTheDocument();
      expect(screen.getByText("S")).toBeInTheDocument();
    });
  });

  // === 6. LIFECYCLE LAB ===
  describe("LifecycleLab", () => {
    it("renders start screen", () => {
      render(<LifecycleLab onGameComplete={onGameComplete} onClose={onClose} />);
      expect(screen.getByText("Bee Lifecycle Lab")).toBeInTheDocument();
      expect(screen.getByText(/Start Lab/)).toBeInTheDocument();
    });

    it("starts game and shows stages to order", () => {
      render(<LifecycleLab onGameComplete={onGameComplete} onClose={onClose} />);
      fireEvent.click(screen.getByText(/Start Lab/));
      expect(screen.getByText(/Tap stages in the correct order/)).toBeInTheDocument();
      // Should show lifecycle stage names
      expect(screen.getByText(/Egg/)).toBeInTheDocument();
    });
  });

  // === 7. GARDEN PLANNER ===
  describe("GardenPlanner", () => {
    it("renders start screen", () => {
      render(<GardenPlanner onGameComplete={onGameComplete} onClose={onClose} />);
      expect(screen.getByText("Bee-Friendly Garden Planner")).toBeInTheDocument();
      expect(screen.getByText(/Start Planting/)).toBeInTheDocument();
    });

    it("starts game and shows plant palette and grid", () => {
      render(<GardenPlanner onGameComplete={onGameComplete} onClose={onClose} />);
      fireEvent.click(screen.getByText(/Start Planting/));
      expect(screen.getByText(/Lavender/)).toBeInTheDocument();
      expect(screen.getByText(/Sunflower/)).toBeInTheDocument();
      expect(screen.getByText(/Score My Garden/)).toBeInTheDocument();
    });
  });

  // === 8. SPECIES SPOTTER ===
  describe("SpeciesSpotter", () => {
    it("renders start screen", () => {
      render(<SpeciesSpotter onGameComplete={onGameComplete} onClose={onClose} />);
      expect(screen.getByText("Bee Species Spotter")).toBeInTheDocument();
      expect(screen.getByText(/Start Spotting/)).toBeInTheDocument();
    });

    it("starts game and shows species clues", () => {
      render(<SpeciesSpotter onGameComplete={onGameComplete} onClose={onClose} />);
      fireEvent.click(screen.getByText(/Start Spotting/));
      expect(screen.getByText(/Species 1\/6/)).toBeInTheDocument();
      expect(screen.getByText(/What species is this/)).toBeInTheDocument();
    });
  });

  // === 9. MICROSCOPIC BEE WORLD ===
  describe("MicroscopicBeeWorld", () => {
    it("renders start screen", () => {
      render(<MicroscopicBeeWorld onGameComplete={onGameComplete} onClose={onClose} />);
      expect(screen.getByText("Microscopic Bee World")).toBeInTheDocument();
      expect(screen.getByText(/Enter Bee Vision/)).toBeInTheDocument();
    });

    it("starts game and shows vision toggle", () => {
      render(<MicroscopicBeeWorld onGameComplete={onGameComplete} onClose={onClose} />);
      fireEvent.click(screen.getByText(/Enter Bee Vision/));
      expect(screen.getByText(/Human Vision/)).toBeInTheDocument();
      expect(screen.getByText(/Bee UV Vision/)).toBeInTheDocument();
      expect(screen.getByText(/Round 1\/7/)).toBeInTheDocument();
    });

    it("toggles between human and bee vision", () => {
      render(<MicroscopicBeeWorld onGameComplete={onGameComplete} onClose={onClose} />);
      fireEvent.click(screen.getByText(/Enter Bee Vision/));
      // Default is human vision
      expect(screen.getByText(/Color: Yellow/)).toBeInTheDocument();
      // Toggle to bee vision
      fireEvent.click(screen.getByText(/Bee UV Vision/));
      expect(screen.getByText(/Pattern: UV bullseye/)).toBeInTheDocument();
    });
  });

  // === 10. BEE TRIVIA ===
  describe("BeeTrivia", () => {
    it("renders start screen", () => {
      render(<BeeTrivia onGameComplete={onGameComplete} onClose={onClose} />);
      expect(screen.getByText("Buzzing Bee Trivia")).toBeInTheDocument();
      expect(screen.getByText(/Start Quiz/)).toBeInTheDocument();
    });

    it("starts quiz and shows first question", () => {
      render(<BeeTrivia onGameComplete={onGameComplete} onClose={onClose} />);
      fireEvent.click(screen.getByText(/Start Quiz/));
      expect(screen.getByText(/Question 1 of 10/)).toBeInTheDocument();
      expect(screen.getByText("How many eyes do bees have?")).toBeInTheDocument();
    });

    it("plays through a full game and reports score", async () => {
      render(<BeeTrivia onGameComplete={onGameComplete} onClose={onClose} />);
      fireEvent.click(screen.getByText(/Start Quiz/));

      // Answer all 10 questions (correct answers by index: 2,2,1,1,1,1,3,3,2,2)
      const correctAnswers = [
        "5", // Q1 correct=2 → "5"
        "Communication about food sources", // Q2 correct=2
        "4", // Q3 correct=1
        "About 35%", // Q4 correct=1
        "15 mph", // Q5 correct=1
        "Nutritious secretion for larvae", // Q6 correct=1
        "About 2 million", // Q7 correct=3
        "Hexagonal", // Q8 correct=3
        "4-6 weeks", // Q9 correct=2
        "They are expelled from the hive", // Q10 correct=2
      ];

      for (let i = 0; i < 10; i++) {
        const answerBtn = screen.getByText(correctAnswers[i]);
        fireEvent.click(answerBtn);
        // Click "Next Question" or "View Results"
        const nextBtn = await screen.findByText(i < 9 ? "Next Question" : "View Results");
        fireEvent.click(nextBtn);
      }

      // Should call onGameComplete with score 150 (perfect)
      expect(onGameComplete).toHaveBeenCalledWith(150);
    });
  });

  // === CROSS-CUTTING: onClose works for all ===
  describe("onClose callback", () => {
    const games = [
      { name: "BeeAnatomyExplorer", Component: BeeAnatomyExplorer },
      { name: "PollinationQuest", Component: PollinationQuest },
      { name: "HiveBuilder", Component: HiveBuilder },
      { name: "FlowerMemoryGame", Component: FlowerMemoryGame },
      { name: "BeeDanceDecoder", Component: BeeDanceDecoder },
      { name: "LifecycleLab", Component: LifecycleLab },
      { name: "GardenPlanner", Component: GardenPlanner },
      { name: "SpeciesSpotter", Component: SpeciesSpotter },
      { name: "MicroscopicBeeWorld", Component: MicroscopicBeeWorld },
      { name: "BeeTrivia", Component: BeeTrivia },
    ];

    games.forEach(({ name, Component }) => {
      it(`${name} renders without crashing`, () => {
        const { container } = render(
          <Component onGameComplete={onGameComplete} onClose={onClose} />
        );
        expect(container.firstChild).toBeTruthy();
      });
    });
  });
});
