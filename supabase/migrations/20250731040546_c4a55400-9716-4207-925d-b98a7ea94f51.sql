-- Populate the bee_facts table with comprehensive educational content
INSERT INTO bee_facts (title, content, category, difficulty_level, fun_fact, image_url) VALUES
-- Bee Basics
('Bees Have Five Eyes', 'Honeybees have five eyes total - two large compound eyes that can see flowers and three smaller simple eyes on top of their head that detect light and movement. These eyes help them navigate and find the best flowers!', 'bee_basics', 1, true, null),
('Wings Beat 230 Times Per Second', 'A bee''s wings beat so fast (about 230 times per second) that they create the buzzing sound we hear. Their four wings work together to help them fly in all directions!', 'bee_basics', 1, true, null),
('Bees Talk Through Dancing', 'When a bee finds good flowers, she comes back to the hive and does a special wiggle dance to tell other bees exactly where to find the food. The dance shows both direction and distance!', 'bee_basics', 2, true, null),
('One Bee Makes 1/12 Teaspoon of Honey', 'A single worker bee will only make about 1/12 of a teaspoon of honey in her entire lifetime. It takes thousands of bees working together to fill one jar of honey!', 'bee_basics', 2, true, null),
('Bees See in Ultraviolet Colors', 'Bees can see ultraviolet colors that humans cannot see. Flowers have special UV patterns that act like landing strips to guide bees to their nectar!', 'bee_basics', 3, false, null),

-- Garden Basics  
('Plants Breathe Through Their Leaves', 'Plants have tiny holes called stomata on their leaves that open and close to let air in and out, just like how we breathe through our nose and mouth!', 'garden_basics', 1, false, null),
('Seeds Can Sleep for Years', 'Some seeds have a built-in alarm clock! They can wait in the soil for months or even years until conditions are just right - the perfect temperature, moisture, and season to start growing.', 'garden_basics', 1, true, null),
('Plants Make Their Own Food', 'Through photosynthesis, plants are like little factories that use sunlight, water from their roots, and carbon dioxide from the air to make their own sugar food!', 'garden_basics', 2, false, null),
('Earthworms Are Garden Helpers', 'Earthworms are like underground gardeners! They eat organic matter and create nutrient-rich castings that make soil super healthy for plants to grow.', 'garden_basics', 2, false, null),
('Plants Can Warn Each Other', 'When some plants are attacked by insects, they release chemicals into the air that warn nearby plants to start making their own natural pest defenses!', 'garden_basics', 3, true, null),

-- Pollination
('One in Three Bites Depends on Bees', 'About one-third of all the food we eat depends on bee pollination - including apples, almonds, blueberries, and many vegetables. Bees are essential for our food system!', 'pollination', 2, true, null),
('Pollen Sticks to Fuzzy Bee Bodies', 'Bees have thousands of tiny branched hairs all over their bodies that act like tiny hooks to collect pollen as they visit flowers. They''re like flying fuzzy pollen magnets!', 'pollination', 2, false, null),
('Cross-Pollination Creates Diversity', 'When bees carry pollen from one flower to another, they help create genetic diversity in plants, making them stronger and more resistant to diseases and climate changes.', 'pollination', 3, false, null),

-- Bee Conservation
('Native Bees Don''t Live in Hives', 'Most native bees are solitary - they don''t live in big hives like honeybees. Instead, they make small nests in the ground, hollow stems, or wood tunnels.', 'bee_conservation', 2, false, null),
('Pesticides Harm Bee Navigation', 'Some pesticides can confuse bees and make it hard for them to remember how to get back to their nests, like causing them to forget their home address!', 'bee_conservation', 3, false, null),

-- Ecosystem
('Bees and Flowers Evolved Together', 'Bees and flowers have been best friends for over 100 million years! They evolved together - flowers developed colors and scents to attract bees, while bees developed the perfect tools to collect nectar and pollen.', 'ecosystem', 3, true, null),
('Biodiversity Supports Stronger Ecosystems', 'Gardens and natural areas with many different types of plants support more species of bees and other beneficial insects, creating a healthy web of life.', 'ecosystem', 4, false, null);

-- Add learning activities and quizzes content (stored as JSONB for flexibility)
INSERT INTO bee_facts (title, content, category, difficulty_level, fun_fact, image_url) VALUES
('Learning Activity: Build a Bee Hotel', 'Create homes for native solitary bees using bamboo tubes, wooden blocks with holes, or hollow plant stems. Place in a sunny, sheltered spot 3-6 feet off the ground.', 'activities', 2, false, null),
('Learning Activity: Plant a Pollinator Garden', 'Choose native flowers that bloom at different times throughout the growing season. Include purple, blue, and yellow flowers which bees love most!', 'activities', 3, false, null),
('Experiment: Observe Bee Behavior', 'Spend 10 minutes quietly watching bees visit flowers. Notice which flowers they prefer, how they move, and how much time they spend on each flower.', 'experiments', 2, false, null),
('Quiz Question: Bee Wings', 'How many wings does a honeybee have? Answer: Four wings (two pairs) that hook together to work as one large wing surface during flight.', 'quiz', 1, false, null);