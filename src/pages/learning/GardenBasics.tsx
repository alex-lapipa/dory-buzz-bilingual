import React from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import plantLifecycleImage from '@/assets/plant-lifecycle.jpg';

const GardenBasics: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/learning-hub')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Learning Hub
          </Button>
        </div>

        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <span className="text-5xl animate-pulse">🌱</span>
            Garden Basics
          </h1>
          <p className="text-lg text-muted-foreground">
            Learn how plants grow and discover the secrets of successful gardening!
          </p>
        </div>

        {/* Hero Image */}
        <div className="flex justify-center">
          <img 
            src={plantLifecycleImage} 
            alt="Plant growth lifecycle from seed to mature plant"
            className="rounded-lg shadow-lg max-w-full h-auto"
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <h2>🌿 Understanding Plant Growth</h2>
          
          <h3>🌰 Seeds: The Beginning of Life</h3>
          <p>
            Every plant starts as a tiny seed containing everything needed to grow into a full plant. Seeds are like nature's time capsules - they can wait for months or even years for the perfect conditions to begin growing. Inside each seed is a baby plant (called an embryo) and stored food to help it grow its first leaves and roots.
          </p>

          <h3>🌱 Germination: Waking Up</h3>
          <p>
            When a seed gets enough water, warmth, and oxygen, it "wakes up" and begins to germinate. The first thing to emerge is usually the root, which grows downward to anchor the plant and search for water and nutrients. Then comes the shoot, which grows upward toward the light to become the stem and leaves.
          </p>

          <h3>🌞 What Plants Need to Grow</h3>
          <p>
            Plants need six essential things to grow healthy and strong: sunlight (for energy), water (for drinking and chemical reactions), air (carbon dioxide for photosynthesis), nutrients (food from the soil), the right temperature (not too hot or cold), and space (room for roots and branches to spread).
          </p>

          <h3>🍃 Photosynthesis: Nature's Food Factory</h3>
          <p>
            Plants are amazing because they make their own food! Through a process called photosynthesis, plants use sunlight, water, and carbon dioxide from the air to create sugar (glucose) for energy. The green color in leaves comes from chlorophyll, which captures sunlight like tiny solar panels.
          </p>

          <h3>🌳 Plant Parts and Their Jobs</h3>
          <p>
            Each part of a plant has a special job. Roots anchor the plant and absorb water and nutrients from soil. The stem supports the plant and carries water and nutrients up from the roots to the leaves. Leaves capture sunlight and make food through photosynthesis. Flowers attract pollinators to help plants reproduce.
          </p>

          <h3>💧 The Water Cycle in Plants</h3>
          <p>
            Plants drink water through their roots and transport it up through their stems to their leaves. This process is called transpiration. Water evaporates from the leaves, which helps draw more water up from the roots - like a natural drinking straw system!
          </p>

          <h3>🌾 Starting Your Own Garden</h3>
          <p>
            Starting a garden is easy and fun! Begin with easy-to-grow plants like herbs (basil, mint), vegetables (lettuce, radishes), or flowers (marigolds, sunflowers). Choose a sunny spot, prepare the soil by adding compost, plant your seeds at the right depth, water gently, and be patient as nature works its magic.
          </p>

          <h3>🐛 Garden Friends and Helpers</h3>
          <p>
            Gardens are full of helpful creatures! Earthworms improve soil by eating organic matter and creating nutrient-rich castings. Ladybugs eat aphids that damage plants. Bees and butterflies pollinate flowers. Even some bacteria help plant roots absorb nutrients better.
          </p>

          <h3>🌡️ Seasons and Plant Growth</h3>
          <p>
            Plants respond to changing seasons. In spring, many plants begin growing new leaves and flowers. Summer provides long days of sunlight for growth. Fall signals plants to prepare for winter by dropping leaves or producing seeds. Winter is a rest period for most plants in cold climates.
          </p>

          <h3>🌱 Caring for Your Plants</h3>
          <p>
            Good plant care includes watering regularly (but not too much!), providing proper drainage so roots don't rot, feeding plants with compost or fertilizer, removing weeds that compete for nutrients, and watching for signs of pests or diseases. Remember: healthy soil grows healthy plants!
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default GardenBasics;