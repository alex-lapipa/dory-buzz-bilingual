
INSERT INTO mochi_knowledge_base (title, content, category, domain, language, age_level, source, subcategory, tags, metadata)
SELECT v.title, v.content, v.category, v.domain, v.language, v.age_level, v.source, v.subcategory, v.tags, v.metadata
FROM (VALUES
('Segmenting Principle for Microlearning',
 'Present one micro-goal per clip. Fisch''s capacity model predicts educational content is learned best when integral to the narrative without overloading working memory. Segmenting reduces simultaneous demands and keeps "distance" between narrative and learning target low. Each video segment should teach 1-2 words OR 1 phrase OR 1 phonics pattern.',
 'microlearning_design', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'design_principles',
 ARRAY['segmenting','cognitive_load','microlearning','fisch_capacity_model'], '{"evidence_level":"theory+experimental"}'::jsonb),

('Signalling via Aligned Gaze and Pointing',
 'Use aligned cues where the character looks at and points to the referent while naming it. Toddlers learned equally well from video and live demonstrations when gaze and language cues were aligned (Lauricella, Barr & Calvert 2016). This functionally acts as both signalling and cognitive-load reduction in one move.',
 'microlearning_design', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'design_principles',
 ARRAY['signalling','gaze_cues','pointing','pedagogical_cues'], '{"study":"Lauricella_Barr_Calvert_2016"}'::jsonb),

('Repetition Strategy That Changes the Child Role',
 'Repetition improved comprehension in Blue''s Clues while maintaining attention; participatory behaviours increased across 5 viewings (Crawley & Anderson 1999, g≈0.60). Design repetition so the 2nd-4th exposure invites more independent responding. Within-clip: say target 3 times. Across clips: resurface after 1, 3, and 7 days in new bee-consistent contexts.',
 'microlearning_design', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'design_principles',
 ARRAY['repetition','spaced_practice','blues_clues','participation'], '{"study":"Crawley_Anderson_1999","effect_size":"g≈0.60"}'::jsonb),

('Social Contingency Cues in Asynchronous Video',
 'Toddlers learned verbs only in socially contingent conditions (gp²=0.50, Roseberry et al. 2014). For asynchronous microvideos, simulate contingency with: (a) direct address, (b) timed pauses inviting child response, (c) predictable feedback loops. Example: "Look! A flower. Say: flower." (pause) "Yes! Flower." (confirm + point).',
 'microlearning_design', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'design_principles',
 ARRAY['social_contingency','call_and_response','parasocial','interactive'], '{"study":"Roseberry_2014","effect_size":"gp²=0.50"}'::jsonb),

('Low Extraneous Cognitive Load in Video Design',
 'Keep visuals simple with minimal competing action and stable camera/scene. Fast-paced fantastical cartoons produced immediate executive-function costs in 4-year-olds (Lillard & Peterson 2011, partial η²≈0.15). Avoid rapid scene cuts and constant novelty. Keep fantastical elements predictable and low-switch-cost.',
 'microlearning_design', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'design_principles',
 ARRAY['cognitive_load','extraneous_load','pacing','visual_simplicity'], '{"study":"Lillard_Peterson_2011","effect_size":"η²≈0.15"}'::jsonb),

('Agency and Replay for Motivation',
 'Giving children choice and enabling repetition in a learning app (Lingokids Plus) aligned with stronger vocabulary gains (dz≈0.79) and higher perceived agency (g≈0.86) compared to no-choice pathway. In microvideo contexts, agency means "choose your next bee mission" and "replay to earn a badge" rather than autoplay streams.',
 'microlearning_design', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'design_principles',
 ARRAY['agency','autonomy','replay','motivation','lingokids'], '{"study":"UC_Davis_Lingokids","effect_size":"dz≈0.79"}'::jsonb),

('Optimal Clip Length 45-120 Seconds',
 'Evidence supports very short clips (45-120 seconds) when each clip has a single clear goal and includes rehearsal time. Include 3-5 seconds of pause time for child responding within each clip. Treat each clip as a segment inside a larger spaced curriculum.',
 'microlearning_design', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'production_specs',
 ARRAY['clip_length','duration','pacing','production'], '{"evidence_level":"inference_from_theory"}'::jsonb),

('Episode Script Template for Microlearning',
 'Build a consistent episode script: Greet → Goal → Teach 1-2 targets → "Your turn" pauses → Recap → Goodbye. Repeat across a series with small variations. The 3-beat storyboard: Setup → Teach → Use. This mirrors Blue''s Clues format where structure repetition increased participatory behaviours and comprehension.',
 'microlearning_design', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'production_specs',
 ARRAY['episode_structure','script_template','storyboard','production'], '{"evidence_level":"design_exemplar"}'::jsonb),

('Working Memory Limits in Young Children',
 'Working memory is limited in children ages 2-8; fast transient media can overflow the system. Multimedia learning theory frames this in terms of dual channels (phonological/visuospatial) and links overload to worse learning. Short videos help when they reduce transient information loss and create room for processing cycles (naming → mapping → rehearsal).',
 'child_development', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'cognitive_foundations',
 ARRAY['working_memory','cognitive_load','dual_channels','processing'], '{"evidence_level":"theory+experimental"}'::jsonb),

('Dual Coding and Modality Effects for Ages 2-8',
 'For ages 2-5, written captions are typically extraneous; favour spoken language + clear visuals. For ages 6-8, simple captions can become beneficial when supporting decoding/phonics without competing with essential visuals. Spoken narration outperforms on-screen text for younger learners who cannot read fluently.',
 'child_development', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'cognitive_foundations',
 ARRAY['dual_coding','modality','captions','spoken_language'], '{"evidence_level":"theory+experimental"}'::jsonb),

('Video Deficit and Transfer Deficit in Young Children',
 'Children under ~30 months typically learn less from video than from live interaction. DeLoache et al. (2010) found 12-18 month infants showed no word learning from baby DVDs despite 10+ hours exposure. However, matched pedagogical cues (aligned gaze + language) can reduce this deficit even in toddlers (Lauricella, Barr & Calvert 2016).',
 'child_development', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'cognitive_foundations',
 ARRAY['video_deficit','transfer_deficit','screen_learning','toddlers'], '{"study":"DeLoache_2010"}'::jsonb),

('Executive Function Effects of Fast Pacing',
 'Lillard & Peterson (2011): 9 minutes of a fast-paced fantastical cartoon produced immediate executive-function impairment in 4-year-olds (partial η²≈0.15 on composite EF). The fast-paced group performed worse than both educational cartoon and drawing conditions. This matters when microlearning precedes other tasks.',
 'child_development', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'cognitive_foundations',
 ARRAY['executive_function','pacing','self_regulation','EF_hangover'], '{"study":"Lillard_Peterson_2011","effect_size":"η²≈0.15"}'::jsonb),

('Age-Differentiated Learning Checks',
 'For ages 2-4: end clips with a "point to it" check (two-picture choice). For ages 5-8: add production tasks ("say the word", "complete the phrase") or phonics tasks. Match scaffold complexity to developmental stage and existing vocabulary level.',
 'child_development', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'assessment',
 ARRAY['assessment','age_differentiation','comprehension_check','scaffolding'], '{"evidence_level":"design_inference"}'::jsonb),

('Social Contingency Amplifies Language Learning',
 'Roseberry et al. (2014): toddlers (24-30 months) learned novel verbs only in socially contingent conditions (live and video chat) but not from noncontingent yoked video (gp²=0.50). Social contingency means responses that are immediate/reliable and content-appropriate. Eye gaze and face attention correlated with learning.',
 'language_learning', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'social_interaction',
 ARRAY['social_contingency','verb_learning','video_chat','contingent_interaction'], '{"study":"Roseberry_2014","effect_size":"gp²=0.50"}'::jsonb),

('Parasocial Cues and Direct Address',
 'Contingency can be approximated using: (a) direct address, (b) timed pauses inviting response, (c) feedback assuming participation ("Yes! You said bee!"). Children learn more when actively responding to prompts. Bandura''s social learning framework emphasises attention, retention, reproduction, and motivation.',
 'language_learning', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'social_interaction',
 ARRAY['parasocial','direct_address','interactive_prompts','social_learning'], '{"evidence_level":"theory+experimental"}'::jsonb),

('Joint Reference Structure for Word Learning',
 'Krcmar, Grela & Lin (2007): what predicts word learning is not "screen vs not" but whether the presentation creates joint-reference structure—labelling when the child is oriented to the referent. Children highly attentive to the video adult learned better. For microlearning: use slow, explicit, referent-locked labelling.',
 'language_learning', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'word_learning',
 ARRAY['joint_reference','fast_mapping','referent_locked','attention'], '{"study":"Krcmar_Grela_Lin_2007"}'::jsonb),

('Fast-Mapping from Video Depends on Age and Vocabulary',
 'Krcmar et al. (2007): age × condition interaction (η²=0.11)—benefits from programme conditions appeared mainly after ~22 months. Younger toddlers showed limited learning from programme-style video. Low-vocabulary children struggled in programme conditions but benefited from joint reference. Prior knowledge moderates video learning.',
 'language_learning', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'word_learning',
 ARRAY['fast_mapping','age_effects','vocabulary_size','prior_knowledge'], '{"study":"Krcmar_Grela_Lin_2007","effect_size":"η²≈0.11"}'::jsonb),

('Bilingual Audio Design for Language Videos',
 'For ages 2-5, rely on spoken words rather than print. For ages 6-8, add optional captions in large simple font only when supporting phonics/sight words. Beelinguapp exemplifies dual input streams (L1+L2) with audible modelling adaptable into short animated mini-stories with optional L1 scaffolding.',
 'language_learning', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'bilingual_design',
 ARRAY['bilingual','audio_design','captions','dual_input','beelinguapp'], '{"evidence_level":"design_exemplar"}'::jsonb),

('Character Design and Trust Building',
 'Keep one main bee character (same voice, same face) plus a small rotating cast. Lauricella, Gola & Calvert (2011): toddlers learned better from a socially meaningful character (η²=0.17-0.30) than unfamiliar ones. A familiar character requires less working memory to process, leaving more capacity for learning.',
 'video_production', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'character_design',
 ARRAY['character_design','mascot','familiarity','trust','social_meaning'], '{"study":"Lauricella_Gola_Calvert_2011","effect_size":"η²=0.17-0.30"}'::jsonb),

('Call-and-Response Loop Design',
 'Incorporate call-and-response loops: Model target → "Your turn" pause (3-5 sec) → Confirm ("Yes! Flower!") → Repeat with variation. This mirrors contingency logic from Roseberry 2014 and the interactive prompt style of Blue''s Clues.',
 'video_production', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'interaction_design',
 ARRAY['call_and_response','prompts','pauses','feedback_loops'], '{"evidence_level":"design_inference"}'::jsonb),

('Pacing and Scene Cut Guidelines',
 'Keep cuts infrequent and referent on screen during naming. Avoid rapid fantastical scene shifts. If using fantasy elements, make them repetitive and predictable (e.g., the bee always does a cute loop before landing). Fast pacing consumes executive resources needed for learning.',
 'video_production', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'pacing',
 ARRAY['pacing','scene_cuts','visual_continuity','predictability'], '{"evidence_level":"experimental+design"}'::jsonb),

('Age-Differentiated Scaffolds in Video',
 'Ages 2-4: audio-only language with clear visuals; end with picture-selection check. Ages 5-8: add optional captions/print for phonics goals; end with production tasks. Match scaffold complexity to developmental stage and vocabulary level.',
 'video_production', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'scaffolding',
 ARRAY['scaffolding','age_differentiation','developmental_stages','accessibility'], '{"evidence_level":"design_inference"}'::jsonb),

('Measuring Learning from Microvideos',
 'End each clip with a 1-item check: picture selection (ages 2-4) or say-it-back (ages 5-8). Track replay rate, drop-off points, and accuracy via analytics. High replay + low accuracy = too hard; low replay + high accuracy = too easy. Iterate using data.',
 'video_production', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'analytics',
 ARRAY['assessment','analytics','learning_measurement','iteration'], '{"evidence_level":"design_inference"}'::jsonb),

('Blues Clues Repetition Study Summary',
 'Crawley & Anderson et al. (1999): 108 children aged 3-5 watched Blue''s Clues 1×, 5× over consecutive days, or comparison programme. Looking time stayed high. Verbal/nonverbal interactions increased. Comprehension improved (5× vs 1×: g≈0.60; 5× vs comparison: g≈1.59). Repetition does not reduce attention when content invites participation.',
 'research_evidence', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'study_summary',
 ARRAY['blues_clues','repetition','attention','comprehension'], '{"doi":"10.1037/0022-0663.91.4.630","sample_size":108}'::jsonb),

('Lillard Peterson Fast Pacing EF Study Summary',
 'Lillard & Peterson (2011): 60 four-year-olds in fast-paced cartoon, educational cartoon, or drawing for 9 min then EF tasks. Fast-paced group performed worse (composite EF: η²≈0.15; delay: η²≈0.12). Short + fast + fantastical creates temporary EF hangover by consuming executive resources.',
 'research_evidence', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'study_summary',
 ARRAY['fast_pacing','executive_function','Lillard_Peterson_2011'], '{"doi":"10.1542/peds.2010-1919","sample_size":60}'::jsonb),

('Roseberry Social Contingency Verb Learning Study',
 'Roseberry, Hirsh-Pasek & Golinkoff (2014): 36 toddlers (24-30 months) in live, video chat, or yoked video. Strong main effect (gp²=0.50). Children learned only in contingent conditions. Video chat performed as well as live. Contingency is what makes screen interaction effective for language learning.',
 'research_evidence', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'study_summary',
 ARRAY['social_contingency','verb_learning','video_chat','Roseberry_2014'], '{"doi":"10.1111/cdev.12166","sample_size":36}'::jsonb),

('DeLoache Baby Media DVD Experiment Summary',
 'DeLoache et al. (2010): 72 infants (12-18 months) in 4 conditions over 4 weeks. Only parent teaching worked above chance despite 10+ hours of video exposure. Parents overestimated learning from DVDs. Passive video exposure is deeply inefficient at youngest ages.',
 'research_evidence', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'study_summary',
 ARRAY['baby_media','video_deficit','parent_teaching','DeLoache_2010'], '{"doi":"10.1111/j.1467-9280.2010.02402.x","sample_size":72}'::jsonb),

('Duolingo ABC and Lingokids Efficacy Evidence',
 'Duolingo ABC (EDC report): 105 children aged 4-5.5, pre/post over 9 weeks. Literacy improved (d≈0.49). Lingokids (UC Davis): 31 preschoolers, Plus vs Basic over 8 weeks. Plus: vocabulary dz≈0.79, agency g≈0.86. Agency + repetition + choice drive engagement and learning.',
 'research_evidence', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'study_summary',
 ARRAY['duolingo_abc','lingokids','agency','literacy','app_based_learning'], '{"evidence_level":"formative_evaluation"}'::jsonb),

('Bee Mascot as Learning Infrastructure',
 'Lauricella, Gola & Calvert (2011): socially meaningful characters improve learning (η²=0.17-0.30). A bee mascot becomes that meaningful character via consistent exposure, positive engagement, and trustworthy pedagogy. Familiarity reduces processing overhead, leaving more working memory for learning.',
 'bee_pedagogy', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'character_design',
 ARRAY['bee_mascot','social_meaning','learning_infrastructure','familiarity'], '{"study":"Lauricella_Gola_Calvert_2011"}'::jsonb),

('Bee-World Joint Attention Anchors',
 'The bee-world offers ready-made joint-attention anchors: concrete nouns (flower, hive, honey, pollen), action verbs (fly, land, collect, share, buzz), and narrative goals (help the hive). These reduce distance between story and learning target per Fisch''s capacity model.',
 'bee_pedagogy', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'curriculum_design',
 ARRAY['bee_world','joint_attention','vocabulary_anchors','narrative_distance'], '{"evidence_level":"theory+design"}'::jsonb),

('Bee-Themed Design Implications for Microlearning',
 'Bees should be more than decoration: use as a consistent socially meaningful character that boosts engagement and reduces processing overhead. Avoid random vocabulary unrelated to the bee story. Keep fantastical bee elements predictable. Build curriculum around bee lifecycle and garden ecology for natural vocabulary progression.',
 'bee_pedagogy', 'pedagogy', 'en', 'all', 'deep-research-report-2026', 'design_implications',
 ARRAY['bee_themed','design_implications','curriculum_integration','vocabulary_progression'], '{"evidence_level":"synthesis"}'::jsonb)

) AS v(title, content, category, domain, language, age_level, source, subcategory, tags, metadata)
WHERE NOT EXISTS (
  SELECT 1 FROM mochi_knowledge_base mkb
  WHERE mkb.title = v.title AND mkb.source = v.source
);
