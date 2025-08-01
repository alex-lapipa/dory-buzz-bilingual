import React from 'react';
import { PageLayout } from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import beeAnatomyImage from '@/assets/bee-anatomy.jpg';

const BeeBasics: React.FC = () => {
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
            Back to Beeducation
          </Button>
        </div>

        {/* Title */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <span className="text-5xl animate-bee-bounce">🐝</span>
            Bee Basics
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover the amazing world of bees and their incredible abilities!
          </p>
        </div>

        {/* Hero Image */}
        <div className="flex justify-center">
          <img 
            src={beeAnatomyImage} 
            alt="Detailed bee anatomy diagram"
            className="rounded-lg shadow-lg max-w-full h-auto"
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <h2>🌟 Amazing Bee Facts</h2>
          
          <h3>🔍 Bee Anatomy</h3>
          <p>
            Bees are incredible creatures with specialized body parts that help them survive and thrive. A bee's body has three main parts: the head, thorax, and abdomen. Their head contains five eyes - two large compound eyes that can see ultraviolet light and three simple eyes on top that detect light and dark.
          </p>

          <h3>✈️ How Bees Fly</h3>
          <p>
            Bees beat their wings about 230 times per second! This incredibly fast wing movement creates the characteristic buzzing sound we hear. Despite their small wings relative to their body size, bees are excellent fliers who can carry pollen loads up to half their body weight.
          </p>

          <h3>🏠 Life in the Hive</h3>
          <p>
            A bee colony is like a bustling city with thousands of residents. There are three types of bees: the queen (who lays all the eggs), worker bees (who do most of the work), and drones (male bees whose job is to mate with the queen). Worker bees have different jobs depending on their age - from cleaning the hive to foraging for nectar.
          </p>

          <h3>💃 The Waggle Dance</h3>
          <p>
            One of the most amazing things about bees is how they communicate! When a worker bee finds a good source of nectar, she returns to the hive and performs a "waggle dance." This special dance tells other bees exactly where to find the flowers - the direction she moves shows which way to go, and how long she waggles tells them how far to fly.
          </p>

          <h3>🌸 Pollination Heroes</h3>
          <p>
            Bees are essential for growing the food we eat. As they visit flowers to collect nectar and pollen, they accidentally transfer pollen from one flower to another. This process, called pollination, helps plants reproduce and produce fruits and vegetables. Without bees, we wouldn't have apples, almonds, blueberries, and many other foods!
          </p>

          <h3>🍯 Making Honey</h3>
          <p>
            Honey is made from flower nectar that bees collect and store in their special "honey stomach." Back at the hive, they pass the nectar to house bees who add enzymes and reduce the water content. The nectar is stored in hexagonal wax cells and fanned with their wings until it becomes the thick, sweet honey we know and love.
          </p>

          <h3>🌡️ Temperature Control</h3>
          <p>
            Bees are amazing at keeping their hive at just the right temperature - about 95°F (35°C). In summer, they fan their wings to cool the hive down. In winter, they cluster together and vibrate their flight muscles to generate heat, just like shivering!
          </p>

          <h3>🎯 Super Senses</h3>
          <p>
            Bees can see ultraviolet patterns on flowers that are invisible to human eyes. These patterns act like landing strips, guiding bees to the nectar. They also have an excellent sense of smell and can remember the scent of profitable flowers.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default BeeBasics;